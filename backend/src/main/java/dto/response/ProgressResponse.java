package dto.response;

import java.time.LocalDateTime;

/**
 * DTO para respuesta de progreso del usuario
 */
public class ProgressResponse {

    private Long id;
    private Long userId;
    private Long lessonId;
    private String lessonTitle;
    private Boolean isCompleted;
    private Boolean isFavorite;
    private LocalDateTime completedAt;
    private Integer accessCount;

    // Constructores
    public ProgressResponse() {}

    public ProgressResponse(Long id, Long userId, Long lessonId, String lessonTitle,
                           Boolean isCompleted, Boolean isFavorite, Integer accessCount) {
        this.id = id;
        this.userId = userId;
        this.lessonId = lessonId;
        this.lessonTitle = lessonTitle;
        this.isCompleted = isCompleted;
        this.isFavorite = isFavorite;
        this.accessCount = accessCount;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getLessonId() {
        return lessonId;
    }

    public void setLessonId(Long lessonId) {
        this.lessonId = lessonId;
    }

    public String getLessonTitle() {
        return lessonTitle;
    }

    public void setLessonTitle(String lessonTitle) {
        this.lessonTitle = lessonTitle;
    }

    public Boolean getIsCompleted() {
        return isCompleted;
    }

    public void setIsCompleted(Boolean isCompleted) {
        this.isCompleted = isCompleted;
    }

    public Boolean getIsFavorite() {
        return isFavorite;
    }

    public void setIsFavorite(Boolean isFavorite) {
        this.isFavorite = isFavorite;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public Integer getAccessCount() {
        return accessCount;
    }

    public void setAccessCount(Integer accessCount) {
        this.accessCount = accessCount;
    }
}

