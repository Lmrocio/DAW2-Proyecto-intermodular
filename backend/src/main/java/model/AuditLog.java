package model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_log", indexes = {
        @Index(name = "idx_timestamp", columnList = "timestamp"),
        @Index(name = "idx_user_action", columnList = "user_id, action")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"user"})
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
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

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Obtiene el nombre de la entidad basado en el tipo y el ID.
     * @return nombre de la entidad en formato "EntityType:EntityId"
     */
    public String getEntityName() {
        return entityType + ":" + entityId;
    }
}