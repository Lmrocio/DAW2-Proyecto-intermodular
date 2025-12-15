package model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.vladmihalcea.hibernate.type.json.JsonType;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_log", indexes = {
    @Index(name = "idx_timestamp", columnList = "timestamp"),
    @Index(name = "idx_user_action", columnList = "user_id, action")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditAction action;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditEntityType entityType;

    @Column(nullable = false)
    private Long entityId;

    @Type(JsonType.class)
    @Column(columnDefinition = "json")
    private Object previousValue;

    @Type(JsonType.class)
    @Column(columnDefinition = "json")
    private Object newValue;

    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    @Column(length = 50)
    private String ipAddress;

    // Relaciones
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Enums
    public enum AuditAction {
        CREATE,
        UPDATE,
        DELETE,
        DISABLE_ACCOUNT
    }

    public enum AuditEntityType {
        USER,
        LESSON,
        STEP,
        SIMULATOR,
        FAQ,
        CATEGORY,
        USER_LESSON_PROGRESS,
        USER_SIMULATOR_INTERACTION
    }
}

