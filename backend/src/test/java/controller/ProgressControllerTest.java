package controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import dto.request.CreateLessonRequest;
import model.Category;
import model.Lesson;
import model.Step;
import model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import service.*;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests para ProgressController
 *
 * Cubre:
 * - Obtener progreso (autenticado)
 * - Marcar lección como completada (autenticado)
 * - Guardar como favorita (autenticado)
 * - Obtener progreso por categoría (autenticado)
 * - Códigos HTTP esperados
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@DisplayName("ProgressController Tests")
public class ProgressControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserService userService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private LessonService lessonService;

    @Autowired
    private StepService stepService;

    private User testUser;
    private Category testCategory;
    private Lesson publishedLesson;

    @BeforeEach
    public void setUp() {
        // Crear usuario de prueba
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername("proguser");
        registerRequest.setEmail("prog@test.com");
        registerRequest.setPassword("password123");
        registerRequest.setConfirmPassword("password123");
        testUser = userService.registerUser(registerRequest);

        // Crear categoría
        testCategory = new Category();
        testCategory.setName("Progress Test Category");
        testCategory = categoryService.createCategory(testCategory);

        // Crear lección
        CreateLessonRequest lessonRequest = new CreateLessonRequest();
        lessonRequest.setTitle("Progress Test Lesson");
        lessonRequest.setDescription("Lección para test de progreso");
        lessonRequest.setCategoryId(testCategory.getId());
        publishedLesson = lessonService.createLesson(lessonRequest, testUser.getId());

        // Crear paso
        Step step = new Step();
        step.setLesson(publishedLesson);
        step.setStepOrder(1);
        step.setTitle("Step 1");
        step.setContent("Content");
        stepService.createStep(publishedLesson.getId(), step, testUser.getId());

        // Publicar lección
        publishedLesson = lessonService.publishLesson(publishedLesson.getId(), testUser.getId());
    }

    // ============================================
    // TESTS: GET /api/progress (Autenticado)
    // ============================================

    @Test
    @DisplayName("GET /api/progress - Sin autenticación (401 Unauthorized)")
    public void testGetProgressUnauthorized() throws Exception {
        mockMvc.perform(get("/api/progress"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/progress - Obtener progreso (200 OK)")
    @WithMockUser(username = "proguser")
    public void testGetProgressSuccess() throws Exception {
        mockMvc.perform(get("/api/progress"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId", notNullValue()))
                .andExpect(jsonPath("$.completedLessons", isA(Number.class)))
                .andExpect(jsonPath("$.globalProgress", notNullValue()));
    }

    // ============================================
    // TESTS: POST /api/progress/{lessonId}/mark-complete
    // ============================================

    @Test
    @DisplayName("POST /api/progress/{lessonId}/mark-complete - Sin autenticación (401 Unauthorized)")
    public void testMarkCompleteUnauthorized() throws Exception {
        mockMvc.perform(post("/api/progress/{lessonId}/mark-complete", publishedLesson.getId()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/progress/{lessonId}/mark-complete - Lección no existe (404 Not Found)")
    @WithMockUser(username = "proguser")
    public void testMarkCompleteNotFound() throws Exception {
        mockMvc.perform(post("/api/progress/{lessonId}/mark-complete", 999L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code", is("RESOURCE_NOT_FOUND")));
    }

    @Test
    @DisplayName("POST /api/progress/{lessonId}/mark-complete - Marcar como completada (200 OK)")
    @WithMockUser(username = "proguser")
    public void testMarkCompleteSuccess() throws Exception {
        mockMvc.perform(post("/api/progress/{lessonId}/mark-complete", publishedLesson.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isCompleted", is(true)))
                .andExpect(jsonPath("$.completedAt", notNullValue()));
    }

    // ============================================
    // TESTS: POST /api/progress/{lessonId}/favorite
    // ============================================

    @Test
    @DisplayName("POST /api/progress/{lessonId}/favorite - Sin autenticación (401 Unauthorized)")
    public void testAddFavoriteUnauthorized() throws Exception {
        mockMvc.perform(post("/api/progress/{lessonId}/favorite", publishedLesson.getId()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/progress/{lessonId}/favorite - Lección no existe (404 Not Found)")
    @WithMockUser(username = "proguser")
    public void testAddFavoriteNotFound() throws Exception {
        mockMvc.perform(post("/api/progress/{lessonId}/favorite", 999L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code", is("RESOURCE_NOT_FOUND")));
    }

    @Test
    @DisplayName("POST /api/progress/{lessonId}/favorite - Guardar como favorita (200 OK)")
    @WithMockUser(username = "proguser")
    public void testAddFavoriteSuccess() throws Exception {
        mockMvc.perform(post("/api/progress/{lessonId}/favorite", publishedLesson.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isFavorite", is(true)));
    }

    // ============================================
    // TESTS: DELETE /api/progress/{lessonId}/favorite
    // ============================================

    @Test
    @DisplayName("DELETE /api/progress/{lessonId}/favorite - Sin autenticación (401 Unauthorized)")
    public void testRemoveFavoriteUnauthorized() throws Exception {
        mockMvc.perform(delete("/api/progress/{lessonId}/favorite", publishedLesson.getId()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("DELETE /api/progress/{lessonId}/favorite - Lección no existe (404 Not Found)")
    @WithMockUser(username = "proguser")
    public void testRemoveFavoriteNotFound() throws Exception {
        mockMvc.perform(delete("/api/progress/{lessonId}/favorite", 999L))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/progress/{lessonId}/favorite - Eliminar de favoritos (204 No Content)")
    @WithMockUser(username = "proguser")
    public void testRemoveFavoriteSuccess() throws Exception {
        // Primero agregar a favoritos
        mockMvc.perform(post("/api/progress/{lessonId}/favorite", publishedLesson.getId()))
                .andExpect(status().isOk());

        // Luego eliminar de favoritos
        mockMvc.perform(delete("/api/progress/{lessonId}/favorite", publishedLesson.getId()))
                .andExpect(status().isNoContent());
    }

    // ============================================
    // TESTS: GET /api/progress/category/{categoryId}
    // ============================================

    @Test
    @DisplayName("GET /api/progress/category/{categoryId} - Sin autenticación (401 Unauthorized)")
    public void testGetProgressByCategoryUnauthorized() throws Exception {
        mockMvc.perform(get("/api/progress/category/{categoryId}", testCategory.getId()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/progress/category/{categoryId} - Categoría no existe (404 Not Found)")
    @WithMockUser(username = "proguser")
    public void testGetProgressByCategoryNotFound() throws Exception {
        mockMvc.perform(get("/api/progress/category/{categoryId}", 999L))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/progress/category/{categoryId} - Obtener progreso por categoría (200 OK)")
    @WithMockUser(username = "proguser")
    public void testGetProgressByCategorySuccess() throws Exception {
        mockMvc.perform(get("/api/progress/category/{categoryId}", testCategory.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.categoryId", is(testCategory.getId().intValue())))
                .andExpect(jsonPath("$.categoryName", notNullValue()))
                .andExpect(jsonPath("$.completedLessons", isA(Number.class)))
                .andExpect(jsonPath("$.totalLessons", isA(Number.class)))
                .andExpect(jsonPath("$.progressPercentage", notNullValue()));
    }

    // ============================================
    // TESTS: GET /api/progress/simulator-interactions
    // ============================================

    @Test
    @DisplayName("GET /api/progress/simulator-interactions - Sin autenticación (401 Unauthorized)")
    public void testGetSimulatorInteractionsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/progress/simulator-interactions"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/progress/simulator-interactions - Obtener historial (200 OK)")
    @WithMockUser(username = "proguser")
    public void testGetSimulatorInteractionsSuccess() throws Exception {
        mockMvc.perform(get("/api/progress/simulator-interactions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", isA(Object.class)));
    }
}

