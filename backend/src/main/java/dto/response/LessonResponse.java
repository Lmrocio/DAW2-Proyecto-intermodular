package dto.response;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO para respuesta de lección
 */
public class LessonResponse {

    private Long id;
    private String title;
    private String description;
    private Long categoryId;
    private String categoryName;
    private Integer lessonOrder;
    private Boolean isPublished;
    private Long relatedSimulatorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserResponse createdBy;
    private UserResponse updatedBy;
    private List<StepResponse> steps;

    // Constructores
    public LessonResponse() {}

    public LessonResponse(Long id, String title, String description, Long categoryId,
                        String categoryName, Integer lessonOrder, Boolean isPublished) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.lessonOrder = lessonOrder;
        this.isPublished = isPublished;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Integer getLessonOrder() {
        return lessonOrder;
    }

    public void setLessonOrder(Integer lessonOrder) {
        this.lessonOrder = lessonOrder;
    }

    public Boolean getIsPublished() {
        return isPublished;
    }

    public void setIsPublished(Boolean isPublished) {
        this.isPublished = isPublished;
    }

    public Long getRelatedSimulatorId() {
        return relatedSimulatorId;
    }

    public void setRelatedSimulatorId(Long relatedSimulatorId) {
        this.relatedSimulatorId = relatedSimulatorId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public UserResponse getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UserResponse createdBy) {
        this.createdBy = createdBy;
    }

    public UserResponse getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(UserResponse updatedBy) {
        this.updatedBy = updatedBy;
    }

    public List<StepResponse> getSteps() {
        return steps;
    }

    public void setSteps(List<StepResponse> steps) {
        this.steps = steps;
    }
}

