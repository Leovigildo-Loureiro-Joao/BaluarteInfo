package com.igreja.api.utils;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public final class SecurityRoles {
    private SecurityRoles() {
    }

    public static boolean hasRole(UserDetails user, String role) {
        if (user == null || role == null || role.isBlank()) {
            return false;
        }
        String normalized = role.trim().toUpperCase();
        for (GrantedAuthority authority : user.getAuthorities()) {
            if (authority == null) continue;
            String value = authority.getAuthority();
            if (value == null) continue;
            if (value.equals(normalized) || value.equals("ROLE_" + normalized)) {
                return true;
            }
        }
        return false;
    }

    public static boolean isAdmin(UserDetails user) {
        return hasRole(user, "ADMIN");
    }

    /**
     * A "common user" is authenticated with USER role and NOT ADMIN.
     */
    public static boolean isCommonUser(UserDetails user) {
        return hasRole(user, "USER") && !isAdmin(user);
    }
}

