package org.example.backendi.model;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Menu_session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "phone_no", nullable = false)
    private String phoneNo;

    private String message;
    private Integer price;
    @Column(name = "order_limit")
    private Integer limit;
    private String time;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "current_status", nullable = false)
    private String current_status;

    @Column(name="user_status",nullable = false)
    private String user_status;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.expiresAt = createdAt.plusSeconds(7 * 60); // 7 minutes
        this.user_status = "ACTIVE";
    }

}
