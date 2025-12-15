package dto.response;

import java.time.LocalDateTime;

/**
 * DTO para respuesta de FAQ
 */
public class FAQResponse {

    private Long id;
    private String question;
    private String answer;
    private String topic;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserResponse createdBy;
    private UserResponse updatedBy;

    // Constructores
    public FAQResponse() {}

    public FAQResponse(Long id, String question, String answer, String topic, Boolean isActive) {
        this.id = id;
        this.question = question;
        this.answer = answer;
        this.topic = topic;
        this.isActive = isActive;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
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
}

