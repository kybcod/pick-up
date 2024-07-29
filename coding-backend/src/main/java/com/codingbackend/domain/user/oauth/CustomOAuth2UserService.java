package com.codingbackend.domain.user.oauth;

import com.codingbackend.domain.user.User;
import com.codingbackend.domain.user.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.Map;

public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    private final UserService userService;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${spring.security.oauth2.client.registration.naver.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.naver.client-secret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.registration.naver.redirect-uri}")
    private String redirectURI;

    @Value("${spring.security.oauth2.client.provider.naver.token-uri}")
    private String tokenUri;

    @Value("${spring.security.oauth2.client.provider.naver.user-info-uri}")
    private String userInfoUri;

    public CustomOAuth2UserService(UserService userService) {
        this.userService = userService;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // UserInfo URI에서 사용자 정보를 가져옵니다.
        OAuth2User oAuth2User = fetchOAuth2User(userRequest.toString());

        // 사용자 정보에서 필요한 데이터를 추출합니다.
        Map<String, Object> attributes = oAuth2User.getAttributes();
        NaverUserInfo naverUserInfo = new NaverUserInfo(attributes);

        // 사용자 조회 또는 생성
        User user = userService.findOrCreateUser(naverUserInfo);

        // CustomOauth2UserDetails 객체 생성
        return new CustomOauth2UserDetails(user, attributes);
    }

    private OAuth2User fetchOAuth2User(String accessToken) {
        // 네이버 사용자 정보 API 호출
        String uri = userInfoUri + "?access_token=" + accessToken;
        Map<String, Object> response = restTemplate.getForObject(uri, Map.class);

        // 네이버 사용자 정보는 응답의 'response' 필드 안에 위치
        if (response == null || response.get("response") == null) {
            throw new OAuth2AuthenticationException("Failed to retrieve user information");
        }

        Map<String, Object> attributes = (Map<String, Object>) response.get("response");

        // OAuth2User 객체를 생성하여 반환
        return new DefaultOAuth2User(Collections.singleton(() -> "USER"),
                attributes, "id");
    }
}
