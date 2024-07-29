package com.codingbackend.domain.user.oauth;

public interface OAuth2UserInfo {
    String getEmail();

    String getProvider();

    String getProviderId();

    String getNickName();

    String getPhoneNumber();
}
