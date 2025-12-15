package model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 100)
    private String username;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.USER;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Relaciones
    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.REFRESH, fetch = FetchType.LAZY)
    private Set<Lesson> lessonsCreated = new HashSet<>();

    @OneToMany(mappedBy = "updatedBy", cascade = CascadeType.REFRESH, fetch = FetchType.LAZY)
    private Set<Lesson> lessonsUpdated = new HashSet<>();

    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.REFRESH, fetch = FetchType.LAZY)
    private Set<Simulator> simulatorsCreated = new HashSet<>();

    @OneToMany(mappedBy = "updatedBy", cascade = CascadeType.REFRESH, fetch = FetchType.LAZY)
    private Set<Simulator> simulatorsUpdated = new HashSet<>();

    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.REFRESH, fetch = FetchType.LAZY)
    private Set<FAQ> faqs = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<UserLessonProgress> lessonProgress = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<UserSimulatorInteraction> simulatorInteractions = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<AuditLog> auditLogs = new HashSet<>();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Enum para roles
    public enum UserRole {
        USER,
        ADMIN
    }
}

