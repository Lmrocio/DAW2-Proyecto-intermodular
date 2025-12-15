package dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para respuesta de estadísticas del usuario
 *
 * Contiene información sobre el progreso y actividad del usuario
 * en la plataforma educativa
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStatisticsResponse {

    private Long userId;
    private String username;
    private Integer totalLessonsCompleted;
    private Integer totalLessonsAvailable;
    private Double globalProgressPercentage;
    private Integer totalFavoriteLessons;
    private Integer totalSimulatorInteractions;
    private Integer categoriesProgressCount;
    private LocalDateTime lastActivityDate;
    private LocalDateTime registrationDate;
}


