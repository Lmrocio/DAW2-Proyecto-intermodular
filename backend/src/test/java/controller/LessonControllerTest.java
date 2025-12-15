package controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import dto.request.CreateLessonRequest;
import dto.request.RegisterRequest;
import dto.response.LessonResponse;
import model.Category;
import model.Lesson;
import model.User;
import model.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;
import service.CategoryService;
import service.LessonService;
import service.UserService;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests para LessonController
 *
 * Cubre:
 * - Endpoints públicos (GET)
 * - Endpoints autenticados (POST, PUT, DELETE)
 * - Validación de autorización (@PreAuthorize)
 * - Códigos HTTP esperados
 * - Formato de respuestas
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@DisplayName("LessonController Tests")
public class LessonControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private LessonService lessonService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private UserService userService;

    private User adminUser;
    private Category testCategory;
    private Lesson testLesson;

    @BeforeEach
    public void setUp() {
        // Crear usuario ADMIN para tests
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername("admin_test");
        registerRequest.setEmail("admin@test.com");
        registerRequest.setPassword("password123");
        registerRequest.setConfirmPassword("password123");
        adminUser = userService.registerUser(registerRequest);

        // Crear categoría de prueba
        testCategory = new Category();
        testCategory.setName("Test Category");
        testCategory.setDescription("Categoría de prueba");
        testCategory = categoryService.createCategory(testCategory);

        // Crear lección de prueba
        CreateLessonRequest lessonRequest = new CreateLessonRequest();
        lessonRequest.setTitle("Test Lesson");
        lessonRequest.setDescription("Lección de prueba");
        lessonRequest.setCategoryId(testCategory.getId());

        testLesson = lessonService.createLesson(lessonRequest, adminUser.getId());
    }

    // ============================================
    // TESTS: GET /api/lessons (Público)
    // ============================================

    @Test
    @DisplayName("GET /api/lessons - Listar lecciones (200 OK)")
    public void testGetAllLessons() throws Exception {
        mockMvc.perform(get("/api/lessons")
                .param("page", "0")
                .param("size", "20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(0))))
                .andExpect(jsonPath("$.totalElements", isA(Number.class)))
                .andExpect(jsonPath("$.totalPages", isA(Number.class)));
    }

    @Test
    @DisplayName("GET /api/lessons - Validar paginación")
    public void testGetAllLessonsWithPagination() throws Exception {
        mockMvc.perform(get("/api/lessons")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pageSize", is(10)));
    }

    @Test
    @DisplayName("GET /api/lessons/{id} - Obtener lección por ID (200 OK)")
    public void testGetLessonById() throws Exception {
        mockMvc.perform(get("/api/lessons/{id}", testLesson.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(testLesson.getId().intValue())))
                .andExpect(jsonPath("$.title", is(testLesson.getTitle())));
    }

    @Test
    @DisplayName("GET /api/lessons/{id} - Lección no existe (404 Not Found)")
    public void testGetLessonNotFound() throws Exception {
        mockMvc.perform(get("/api/lessons/{id}", 999L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code", is("RESOURCE_NOT_FOUND")));
    }

    @Test
    @DisplayName("GET /api/lessons/search - Buscar por texto (200 OK)")
    public void testSearchLessons() throws Exception {
        mockMvc.perform(get("/api/lessons/search")
                .param("text", "Test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", isA(Object.class)));
    }

    @Test
    @DisplayName("GET /api/lessons/category/{id} - Lecciones por categoría (200 OK)")
    public void testGetLessonsByCategory() throws Exception {
        mockMvc.perform(get("/api/lessons/category/{id}", testCategory.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", isA(Object.class)));
    }

    // ============================================
    // TESTS: POST /api/lessons (ADMIN)
    // ============================================

    @Test
    @DisplayName("POST /api/lessons - Sin autenticación (401 Unauthorized)")
    public void testCreateLessonUnauthorized() throws Exception {
        CreateLessonRequest request = new CreateLessonRequest();
        request.setTitle("Nueva Lección");
        request.setDescription("Descripción");
        request.setCategoryId(testCategory.getId());

        mockMvc.perform(post("/api/lessons")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code", is("UNAUTHORIZED")));
    }

    @Test
    @DisplayName("POST /api/lessons - Usuario sin rol ADMIN (403 Forbidden)")
    @WithMockUser(roles = "USER")
    public void testCreateLessonForbidden() throws Exception {
        CreateLessonRequest request = new CreateLessonRequest();
        request.setTitle("Nueva Lección");
        request.setDescription("Descripción");
        request.setCategoryId(testCategory.getId());

        mockMvc.perform(post("/api/lessons")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code", is("FORBIDDEN")));
    }

    @Test
    @DisplayName("POST /api/lessons - Validación fallida (400 Bad Request)")
    @WithMockUser(roles = "ADMIN")
    public void testCreateLessonValidationFailed() throws Exception {
        CreateLessonRequest request = new CreateLessonRequest();
        request.setTitle(""); // Vacío - fallará validación
        request.setDescription("Descripción");
        request.setCategoryId(testCategory.getId());

        mockMvc.perform(post("/api/lessons")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code", is("VALIDATION_ERROR")))
                .andExpect(jsonPath("$.validationErrors", notNullValue()));
    }

    @Test
    @DisplayName("POST /api/lessons - Crear lección exitosamente (201 Created)")
    @WithMockUser(roles = "ADMIN", username = "admin_test")
    public void testCreateLessonSuccess() throws Exception {
        CreateLessonRequest request = new CreateLessonRequest();
        request.setTitle("Nueva Lección Exitosa");
        request.setDescription("Descripción de la nueva lección");
        request.setCategoryId(testCategory.getId());

        mockMvc.perform(post("/api/lessons")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.title", is(request.getTitle())))
                .andExpect(jsonPath("$.isPublished", is(false)));
    }

    // ============================================
    // TESTS: PUT /api/lessons/{id} (ADMIN)
    // ============================================

    @Test
    @DisplayName("PUT /api/lessons/{id} - Usuario no autenticado (401 Unauthorized)")
    public void testUpdateLessonUnauthorized() throws Exception {
        CreateLessonRequest request = new CreateLessonRequest();
        request.setTitle("Actualizado");
        request.setDescription("Descripción actualizada");
        request.setCategoryId(testCategory.getId());

        mockMvc.perform(put("/api/lessons/{id}", testLesson.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("PUT /api/lessons/{id} - No es el autor (403 Forbidden)")
    @WithMockUser(roles = "ADMIN", username = "otro_admin")
    public void testUpdateLessonNotAuthor() throws Exception {
        CreateLessonRequest request = new CreateLessonRequest();
        request.setTitle("Actualizado");
        request.setDescription("Descripción actualizada");
        request.setCategoryId(testCategory.getId());

        mockMvc.perform(put("/api/lessons/{id}", testLesson.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code", is("FORBIDDEN")));
    }

    @Test
    @DisplayName("PUT /api/lessons/{id} - Lección no existe (404 Not Found)")
    @WithMockUser(roles = "ADMIN", username = "admin_test")
    public void testUpdateLessonNotFound() throws Exception {
        CreateLessonRequest request = new CreateLessonRequest();
        request.setTitle("Actualizado");
        request.setDescription("Descripción");
        request.setCategoryId(testCategory.getId());

        mockMvc.perform(put("/api/lessons/{id}", 999L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code", is("RESOURCE_NOT_FOUND")));
    }

    @Test
    @DisplayName("PUT /api/lessons/{id} - Actualizar exitosamente (200 OK)")
    @WithMockUser(roles = "ADMIN", username = "admin_test")
    public void testUpdateLessonSuccess() throws Exception {
        CreateLessonRequest request = new CreateLessonRequest();
        request.setTitle("Lección Actualizada");
        request.setDescription("Nueva descripción");
        request.setCategoryId(testCategory.getId());

        mockMvc.perform(put("/api/lessons/{id}", testLesson.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is(request.getTitle())))
                .andExpect(jsonPath("$.description", is(request.getDescription())));
    }

    // ============================================
    // TESTS: DELETE /api/lessons/{id} (ADMIN)
    // ============================================

    @Test
    @DisplayName("DELETE /api/lessons/{id} - Sin autenticación (401 Unauthorized)")
    public void testDeleteLessonUnauthorized() throws Exception {
        mockMvc.perform(delete("/api/lessons/{id}", testLesson.getId())
                .param("adminId", adminUser.getId().toString()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("DELETE /api/lessons/{id} - Eliminar exitosamente (204 No Content)")
    @WithMockUser(roles = "ADMIN", username = "admin_test")
    public void testDeleteLessonSuccess() throws Exception {
        mockMvc.perform(delete("/api/lessons/{id}", testLesson.getId())
                .param("adminId", adminUser.getId().toString()))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("DELETE /api/lessons/{id} - Lección no existe (404 Not Found)")
    @WithMockUser(roles = "ADMIN", username = "admin_test")
    public void testDeleteLessonNotFound() throws Exception {
        mockMvc.perform(delete("/api/lessons/{id}", 999L)
                .param("adminId", adminUser.getId().toString()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code", is("RESOURCE_NOT_FOUND")));
    }

    // ============================================
    // TESTS: POST /api/lessons/{id}/publish
    // ============================================

    @Test
    @DisplayName("POST /api/lessons/{id}/publish - Sin pasos (422 Unprocessable Entity)")
    @WithMockUser(roles = "ADMIN", username = "admin_test")
    public void testPublishLessonWithoutSteps() throws Exception {
        mockMvc.perform(post("/api/lessons/{id}/publish", testLesson.getId())
                .param("adminId", adminUser.getId().toString()))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.code", is("NO_STEPS_IN_LESSON")))
                .andExpect(jsonPath("$.httpStatus", is(422)));
    }
}

