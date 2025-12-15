package model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_simulator_interaction", indexes = {
    @Index(name = "idx_user_simulator", columnList = "user_id, simulator_id"),
    @Index(name = "idx_accessed_at", columnList = "accessed_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"user", "simulator"})
public class UserSimulatorInteraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false)
    private LocalDateTime accessedAt = LocalDateTime.now();

    @Column(nullable = false)
    private Integer accessCount = 0;

    // Relaciones
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "simulator_id", nullable = false)
    private Simulator simulator;

    // Métodos helper
    @Transient
    public Long getUserId() {
        return user != null ? user.getId() : null;
    }

    @Transient
    public Long getSimulatorId() {
        return simulator != null ? simulator.getId() : null;
    }
}

