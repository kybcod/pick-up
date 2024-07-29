package com.codingbackend.domain.user.oauth;

import com.codingbackend.domain.user.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

public class CustomOauth2UserDetails implements OAuth2User {
    @Getter
    private final User user;
    private final Map<String, Object> attributes;

    public CustomOauth2UserDetails(User user, Map<String, Object> attributes) {
        this.user = user;
        this.attributes = attributes;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Convert user roles to GrantedAuthority if necessary
        return Collections.singleton(new SimpleGrantedAuthority(user.getAuthorities().toString()));
    }

    @Override
    public String getName() {
        return user.getId().toString();
    }

}
