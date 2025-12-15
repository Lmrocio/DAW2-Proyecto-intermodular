package dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO para crear una nueva FAQ
 */
public class CreateFAQRequest {

    @NotBlank(message = "La pregunta es requerida")
    @Size(max = 500, message = "La pregunta no puede exceder 500 caracteres")
    private String question;

    @NotBlank(message = "La respuesta es requerida")
    private String answer;

    @NotBlank(message = "El tema es requerido")
    @Size(max = 100, message = "El tema no puede exceder 100 caracteres")
    private String topic;

    // Getters y Setters
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
}

