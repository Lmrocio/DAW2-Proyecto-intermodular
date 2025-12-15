package dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO para crear una nueva lección
 */
public class CreateLessonRequest {

    @NotBlank(message = "El título es requerido")
    @Size(max = 255, message = "El título no puede exceder 255 caracteres")
    private String title;

    @NotBlank(message = "La descripción es requerida")
    private String description;

    @NotNull(message = "La categoría es requerida")
    private Long categoryId;

    @NotNull(message = "El orden es requerido")
    private Integer lessonOrder;

    private Long relatedSimulatorId;

    // Getters y Setters
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

    public Integer getLessonOrder() {
        return lessonOrder;
    }

    public void setLessonOrder(Integer lessonOrder) {
        this.lessonOrder = lessonOrder;
    }

    public Long getRelatedSimulatorId() {
        return relatedSimulatorId;
    }

    public void setRelatedSimulatorId(Long relatedSimulatorId) {
        this.relatedSimulatorId = relatedSimulatorId;
    }
}

