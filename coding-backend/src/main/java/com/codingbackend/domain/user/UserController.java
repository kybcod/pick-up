package com.codingbackend.domain.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {

    final UserService service;

    @PostMapping("signup")
    public ResponseEntity signup(@RequestBody User user) {
        if (service.validate(user)) {
            service.add(user);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping(value = "check", params = "email")
    public ResponseEntity checkEmail(@RequestParam("email") String email) {
        User user = service.getEmail(email);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(email);
    }

    @GetMapping(value = "check", params = "nickName")
    public ResponseEntity checkNickName(@RequestParam("nickName") String nickName) {
        User user = service.getNickName(nickName);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(nickName);
    }

    @PostMapping("login")
    public ResponseEntity login(@RequestBody User user) {
        Map<String, Object> map = service.getToken(user);

        if (map == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(map);
    }

    @GetMapping("{userId}")
//    @PreAuthorize("isAuthenticated()")
    public ResponseEntity getUserById(@PathVariable Integer userId, Authentication authentication) {
        /* if (!service.hasAccess(id, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } */

        User user = service.getById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(user);
        }

    }

    @PutMapping("edit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity edit(@RequestBody User user, Authentication authentication) {
        if (service.hasAccess(user, authentication)) {
            Map<String, Object> result = service.edit(user, authentication);
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @DeleteMapping("delete")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity deleteUser(@RequestBody User user, Authentication authentication) {
        if (service.hasAccess(user, authentication)) {
            service.delete(user.getId());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("list")
    @PreAuthorize("hasAuthority('SCOPE_admin')")
    public Map<String, Object> list(@RequestParam(defaultValue = "1") Integer page) {
       return service.userList(page);
    }

    @DeleteMapping("admin/delete")
    @PreAuthorize("hasAuthority('SCOPE_admin')")
    public ResponseEntity deleteUserByAdmin(@RequestBody User user, Authentication authentication) {
        try {
            service.deleteUser(user);
            return new ResponseEntity<>("User successfully deleted", HttpStatus.OK);
        } catch (Exception e) {
            // Log the exception (e.g., using a logger)
            return new ResponseEntity<>("Failed to delete user", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
