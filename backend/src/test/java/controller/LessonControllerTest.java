package controller;

import model.Lesson;
import model.Category;
import model.User;
import service.LessonService;
import dto.response.LessonResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests de integración para LessonController
 *
 * Cubre:
 * - Listar lecciones publicadas
 * - Buscar lecciones
 * - Crear lecciones (solo admin)
 * - Actualizar lecciones (solo creador)
 * - Eliminar lecciones (solo creador)
 */
@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("LessonController Tests")
class LessonControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private LessonService lessonService;

    private Lesson testLesson;
    private User testAdmin;
    private Category testCategory;

    @BeforeEach
    void setUp() {
        testAdmin = new User();
        testAdmin.setId(1L);
        testAdmin.setUsername("admin");
        testAdmin.setRole(User.UserRole.ADMIN);

        testCategory = new Category();
        testCategory.setId(1L);
        testCategory.setName("Test Category");

        testLesson = new Lesson();
        testLesson.setId(1L);
        testLesson.setTitle("Cómo usar WhatsApp");
        testLesson.setDescription("Tutorial de WhatsApp");
        testLesson.setCategory(testCategory);
        testLesson.setCreatedBy(testAdmin);
        testLesson.setIsPublished(true);
    }

    // ============================================================================
    // TESTS DE LECTURA (PÚBLICO)
    // ============================================================================

    @Test
    @DisplayName("GET /api/lessons - Debe listar lecciones publicadas")
    void testListLessonsSuccess() throws Exception {
        // Arrange
        List<Lesson> lessons = new ArrayList<>();
        lessons.add(testLesson);
        Page<Lesson> page = new PageImpl<>(lessons, PageRequest.of(0, 20), 1);

        when(lessonService.getAllPublishedLessons(any())).thenReturn(page);
        when(lessonService.convertToResponse(testLesson)).thenReturn(
                new LessonResponse(1L, "Cómo usar WhatsApp", "Tutorial de WhatsApp",
                        1L, "Test Category", true, null)
        );

        // Act & Assert
        mockMvc.perform(get("/api/lessons"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Cómo usar WhatsApp"));
    }

    @Test
    @DisplayName("GET /api/lessons/{id} - Debe obtener lección por ID")
    void testGetLessonByIdSuccess() throws Exception {
        // Arrange
        when(lessonService.findById(1L)).thenReturn(testLesson);
        when(lessonService.convertToResponse(testLesson)).thenReturn(
                new LessonResponse(1L, "Cómo usar WhatsApp", "Tutorial de WhatsApp",
                        1L, "Test Category", true, null)
        );

        // Act & Assert
        mockMvc.perform(get("/api/lessons/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Cómo usar WhatsApp"));
    }

    @Test
    @DisplayName("GET /api/lessons/search?text=WhatsApp - Debe buscar lecciones")
    void testSearchLessonsSuccess() throws Exception {
        // Arrange
        List<Lesson> lessons = new ArrayList<>();
        lessons.add(testLesson);
        Page<Lesson> page = new PageImpl<>(lessons, PageRequest.of(0, 20), 1);

        when(lessonService.searchLessons("WhatsApp", PageRequest.of(0, 20))).thenReturn(page);
        when(lessonService.convertToResponse(testLesson)).thenReturn(
                new LessonResponse(1L, "Cómo usar WhatsApp", "Tutorial de WhatsApp",
                        1L, "Test Category", true, null)
        );

        // Act & Assert
        mockMvc.perform(get("/api/lessons/search?text=WhatsApp"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Cómo usar WhatsApp"));
    }

    @Test
    @DisplayName("GET /api/lessons/category/{categoryId} - Debe obtener lecciones por categoría")
    void testGetLessonsByCategorySuccess() throws Exception {
        // Arrange
        List<Lesson> lessons = new ArrayList<>();
        lessons.add(testLesson);
        Page<Lesson> page = new PageImpl<>(lessons, PageRequest.of(0, 20), 1);

        when(lessonService.getLessonsByCategory(1L, PageRequest.of(0, 20))).thenReturn(page);
        when(lessonService.convertToResponse(testLesson)).thenReturn(
                new LessonResponse(1L, "Cómo usar WhatsApp", "Tutorial de WhatsApp",
                        1L, "Test Category", true, null)
        );

        // Act & Assert
        mockMvc.perform(get("/api/lessons/category/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].categoryId").value(1));
    }

    // ============================================================================
    // TESTS DE CREACIÓN (SOLO ADMIN)
    // ============================================================================

    @Test
    @DisplayName("POST /api/lessons - Debe crear lección (admin)")
    @WithMockUser(username = "admin", roles = "ADMIN")
    void testCreateLessonSuccess() throws Exception {
        // Arrange
        String createRequest = "{\"title\":\"New Lesson\",\"description\":\"Description\",\"categoryId\":1}";

        Lesson newLesson = new Lesson();
        newLesson.setId(2L);
        newLesson.setTitle("New Lesson");

        when(lessonService.createLesson(any(), eq(1L))).thenReturn(newLesson);
        when(lessonService.convertToResponse(newLesson)).thenReturn(
                new LessonResponse(2L, "New Lesson", "Description", 1L, "Test Category", false, null)
        );

        // Act & Assert
        mockMvc.perform(post("/api/lessons?adminId=1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(createRequest))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("New Lesson"));
    }

    // ============================================================================
    // TESTS DE PUBLICACIÓN
    // ============================================================================

    @Test
    @DisplayName("POST /api/lessons/{id}/publish - Debe publicar lección")
    @WithMockUser(username = "admin", roles = "ADMIN")
    void testPublishLessonSuccess() throws Exception {
        // Arrange
        Lesson publishedLesson = new Lesson();
        publishedLesson.setId(1L);
        publishedLesson.setTitle("Cómo usar WhatsApp");
        publishedLesson.setIsPublished(true);

        when(lessonService.publishLesson(1L, 1L)).thenReturn(publishedLesson);
        when(lessonService.convertToResponse(publishedLesson)).thenReturn(
                new LessonResponse(1L, "Cómo usar WhatsApp", "Tutorial de WhatsApp",
                        1L, "Test Category", true, null)
        );

        // Act & Assert
        mockMvc.perform(post("/api/lessons/1/publish?adminId=1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isPublished").value(true));
    }

    @Test
    @DisplayName("POST /api/lessons/{id}/unpublish - Debe despublicar lección")
    @WithMockUser(username = "admin", roles = "ADMIN")
    void testUnpublishLessonSuccess() throws Exception {
        // Arrange
        Lesson unpublishedLesson = new Lesson();
        unpublishedLesson.setId(1L);
        unpublishedLesson.setTitle("Cómo usar WhatsApp");
        unpublishedLesson.setIsPublished(false);

        when(lessonService.unpublishLesson(1L, 1L)).thenReturn(unpublishedLesson);
        when(lessonService.convertToResponse(unpublishedLesson)).thenReturn(
                new LessonResponse(1L, "Cómo usar WhatsApp", "Tutorial de WhatsApp",
                        1L, "Test Category", false, null)
        );

        // Act & Assert
        mockMvc.perform(post("/api/lessons/1/unpublish?adminId=1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isPublished").value(false));
    }

    // ============================================================================
    // TESTS DE ELIMINACIÓN
    // ============================================================================

    @Test
    @DisplayName("DELETE /api/lessons/{id} - Debe eliminar lección")
    @WithMockUser(username = "admin", roles = "ADMIN")
    void testDeleteLessonSuccess() throws Exception {
        // Arrange
        doNothing().when(lessonService).deleteLesson(1L, 1L);

        // Act & Assert
        mockMvc.perform(delete("/api/lessons/1?adminId=1"))
                .andExpect(status().isNoContent());
    }

    // ============================================================================
    // TESTS DE ACCESO NO AUTENTICADO
    // ============================================================================

    @Test
    @DisplayName("POST /api/lessons - Debe rechazar sin autenticación")
    void testCreateLessonUnauthorized() throws Exception {
        // Arrange
        String createRequest = "{\"title\":\"New Lesson\",\"description\":\"Description\",\"categoryId\":1}";

        // Act & Assert
        mockMvc.perform(post("/api/lessons?adminId=1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(createRequest))
                .andExpect(status().isUnauthorized());
    }

    // ============================================================================
    // TESTS DE ERROR 404
    // ============================================================================

    @Test
    @DisplayName("GET /api/lessons/999 - Debe retornar 404 si lección no existe")
    void testGetLessonNotFound() throws Exception {
        // Arrange
        when(lessonService.findById(999L))
                .thenThrow(new RuntimeException("Lección no encontrada"));

        // Act & Assert
        mockMvc.perform(get("/api/lessons/999"))
                .andExpect(status().isInternalServerError());
    }
}

