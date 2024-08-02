package com.codingbackend.domain.user;

import com.codingbackend.domain.user.oauth.NaverUserInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class UserService {

    final UserMapper mapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;

    public boolean validate(User user) {

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            return false;
        }
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            return false;
        }
        if (user.getPhoneNum() == null || user.getPhoneNum().isBlank()) {
            return false;
        }
        if (user.getNickName() == null || user.getNickName().isBlank()) {
            return false;
        }
        String emailPattern = "[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*";
        if (!user.getEmail().matches(emailPattern)) {
            return false;
        }
        String phoneNumPattern = "^010-\\d{4}-\\d{4}$";
        if (!user.getPhoneNum().matches(phoneNumPattern)) {
            return false;
        }

        else {
            return true;
        }
    }

    public void add(User user) {
        user.setEmail(user.getEmail().trim());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setNickName(user.getNickName().trim());
        user.setPhoneNum(user.getPhoneNum().trim());
        mapper.inserted(user);

        Integer userId = user.getId();
        for (Authority authority : user.getAuthorities()) {
            authority.setUserId(userId);
            mapper.insertedAuthority(authority);
        }
    }

    public User getEmail(String email) {
        return mapper.selectByEmail(email.trim());
    }

    public User getNickName(String nickName) {
        return mapper.selectByNickName(nickName.trim());
    }

    public Map<String, Object> getToken(User user) {
        Map<String, Object> result = null;
        User db = mapper.selectByEmail(user.getEmail());
        
        if (db != null) {
            if (passwordEncoder.matches(user.getPassword(), db.getPassword())) {
                result = new HashMap<>();
                Instant now = Instant.now();

                List<String> authority = mapper.selectAuthorityByUserId(db.getId());

                String authorityString = authority.stream()
                        .collect(Collectors.joining(" "));


                // https://github.com/spring-projects/spring-security-samples/blob/main/servlet/spring-boot/java/jwt/login/src/main/java/example/web/TokenController.java
                JwtClaimsSet claims = JwtClaimsSet.builder()
                        .issuer("pickup")
                        .issuedAt(now)
                        .expiresAt(now.plusSeconds(60 * 60 * 24 * 7))
                        .subject(db.getId().toString())
                        .claim("scope", authorityString)  //권한
                        .claim("nickName", db.getNickName())
                        .build();

                String token = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

                result.put("token", token);
            }
        }
        return result;
    }

    public Map<String, Object> getTokenFromOAuth2(Authentication authentication) {
        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
            OAuth2User oauth2User = oauthToken.getPrincipal();

            String email = oauth2User.getAttribute("email");
            User user = mapper.selectByEmail(email);

            if (user == null) {
                // If user does not exist, create a new user based on OAuth2 user info
                user = new User();
                user.setEmail(email);
                user.setNickName(oauth2User.getAttribute("name"));
                mapper.inserted(user);
            }

            Instant now = Instant.now();
            List<String> authority = mapper.selectAuthorityByUserId(user.getId());
            String authorityString = authority.stream().collect(Collectors.joining(" "));

            JwtClaimsSet claims = JwtClaimsSet.builder()
                    .issuer("pickup")
                    .issuedAt(now)
                    .expiresAt(now.plusSeconds(60 * 60 * 24 * 7))
                    .subject(user.getId().toString())
                    .claim("scope", authorityString)
                    .claim("nickName", user.getNickName())
                    .build();

            String token = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
            return Map.of("token", token);
        }
        return Map.of("error", "Invalid OAuth2 authentication");
    }

    public User getById(Integer id) {
        return mapper.selectById(id);
    }

    public boolean hasAccess(User user, Authentication authentication) {
        if (!authentication.getName().equals(user.getId().toString())) {
            return false;
        }

        User dbUser = mapper.selectById(user.getId());
        if (dbUser == null) {
            return false;
        }

        if (!passwordEncoder.matches(user.getPrevPassword(), dbUser.getPassword())) {
            return false;
        }

        return true;
    }

    public Map<String, Object> edit(User user, Authentication authentication) {
        User dbUser = mapper.selectById(user.getId());

        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        else {
            user.setPassword(dbUser.getPassword());
        }

        if (user.getPassword() == null || user.getPassword().isBlank()) {
            user.setPassword(dbUser.getPassword());
        }
        mapper.update(user);

        Jwt jwt = (Jwt) authentication.getPrincipal();
        Map<String, Object> claims = jwt.getClaims();
        JwtClaimsSet.Builder jwtClaimsSetBuilder = JwtClaimsSet.builder();
        claims.forEach(jwtClaimsSetBuilder::claim);
        jwtClaimsSetBuilder.claim("nickName", user.getNickName());

        JwtClaimsSet jwtClaimsSet = jwtClaimsSetBuilder.build();

        String token = jwtEncoder.encode(JwtEncoderParameters.from(jwtClaimsSet)).getTokenValue();
        return Map.of("token", token);
    }

    public void delete(Integer id) {
        mapper.deleteAuthorityById(id);
        mapper.deleteById(id);
    }

    public Map<String, Object> getTokenFromOAuth2(User user) {
        Instant now = Instant.now();
        List<String> authority = mapper.selectAuthorityByUserId(user.getId());
        String authorityString = authority.stream().collect(Collectors.joining(" "));

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("pickup")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(60 * 60 * 24 * 7))
                .subject(user.getId().toString())
                .claim("scope", authorityString)
                .claim("nickName", user.getNickName())
                .build();

        String token = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
        return Map.of("token", token);
    }

    public User findOrCreateUser(NaverUserInfo naverUserInfo) {
        User user = mapper.selectByEmail(naverUserInfo.getEmail());

        if (user == null) {
            // 이메일이 존재하지 않으면 사용자 정보를 반환
            return null;
        }

        return user;
    }

    private User createUser(NaverUserInfo naverUserInfo) {
        User newUser = new User();
        newUser.setEmail(naverUserInfo.getEmail());
        newUser.setNickName(naverUserInfo.getNickName());
        newUser.setPhoneNum(naverUserInfo.getPhoneNumber());
        mapper.inserted(newUser); // Save new user
        return newUser;
    }

    public boolean emailExists(String email) {
        User user = mapper.selectByEmail(email.trim());
        return user != null;
    }

    public List<User> userList() {
        return mapper.getUserList();
    }
}
