package com.re.ecommerce.modules.auth.entity;

import com.re.ecommerce.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
// Hạ quyền xuống chỉ cho Hibernate sử dụng thôi, tránh mấy tầng khác sử dụng gây ra dữ liệu rác
@NoArgsConstructor(access = AccessLevel.PROTECTED)
// Không sử dụng @AllArgsConstructor vì sẽ sinh ra các trường không cần thiết 
public class User extends BaseEntity {

    @Column(nullable = false, unique = true, length = 100)
    private String username;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(nullable = false, length = 50)
    private String role;

    @Column(nullable = false)
    private boolean active = true;

    public User(String username, String email, String passwordHash, String role) {
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.active = true;
    }
    
    public void deactivate() {
        this.active = false;
    }
}
