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
@Table(name = "user_lesson_progress", indexes = {
    @Index(name = "idx_user_completed", columnList = "user_id, is_completed"),
    @Index(name = "idx_lesson_completed", columnList = "lesson_id, is_completed")
}, uniqueConstraints = {
    @UniqueConstraint(name = "uk_user_lesson", columnNames = {"user_id", "lesson_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"user", "lesson"})
public class UserLessonProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false)
    private Boolean isCompleted = false;

    @Column(nullable = false)
    private Boolean isFavorite = false;

    @Column
    private LocalDateTime completedAt;

    @Column(nullable = false)
    private Integer accessCount = 0;

    // Relaciones
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    // Método helper para acceder a userId sin exponerlo como FK
    @Transient
    public Long getUserId() {
        return user != null ? user.getId() : null;
    }

    @Transient
    public Long getLessonId() {
        return lesson != null ? lesson.getId() : null;
    }
}

