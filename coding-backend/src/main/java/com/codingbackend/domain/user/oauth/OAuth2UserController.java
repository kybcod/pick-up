package com.codingbackend.domain.user.oauth;

import com.codingbackend.domain.user.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/oauth/login")
public class OAuth2UserController {

    private final UserService userService;

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

    private final RestTemplate restTemplate = new RestTemplate();

    public OAuth2UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("callback")
    public  ResponseEntity<Map<String, Object>> loginSuccess(@RequestBody Map<String, String> body) {
        String code = body.get("code");
        String state = body.get("state");

        // 액세스 토큰 요청
        String accessToken = getAccessToken(code, state);

        if (accessToken != null) {
            // 사용자 정보 요청
            Map<String, Object> userInfoMap = getUserInfo(accessToken);

            if (userInfoMap != null) {
                NaverUserInfo naverUserInfo = new NaverUserInfo(userInfoMap);

                String email = naverUserInfo.getEmail();
                boolean emailExists = userService.emailExists(email);

                // 응답 생성
                return ResponseEntity.ok(Map.of(
                        "token", accessToken,
                        "emailExists", emailExists,
                        "userInfo", userInfoMap
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Failed to retrieve user information"));
            }
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to retrieve access token"));
        }
    }

    @PostMapping("failure")
    public String loginFailure(@RequestParam(required = false) String error) {
        return "Login Failure: " + (error != null ? error : "Unknown error");
    }

    private String getAccessToken(String code, String state) {
        String apiURL = String.format("%s?grant_type=authorization_code&client_id=%s&client_secret=%s&redirect_uri=%s&code=%s&state=%s",
                tokenUri, clientId, clientSecret, redirectURI, code, state);

        // 액세스 토큰 요청
        Map<String, Object> response = restTemplate.postForObject(apiURL, null, Map.class);

        if (response != null && response.containsKey("access_token")) {
            return (String) response.get("access_token");
        } else {
            return null;
        }
    }

    private Map<String, Object> getUserInfo(String accessToken) {
        String apiURL = String.format("%s?access_token=%s", userInfoUri, accessToken);

        // 사용자 정보 요청
        Map<String, Object> response = restTemplate.getForObject(apiURL, Map.class);

        if (response != null) {
            // Naver API의 경우 'response' 객체 내부에 사용자 정보가 포함되어 있음
            return (Map<String, Object>) response.get("response");
        } else {
            return null;
        }
    }
}
