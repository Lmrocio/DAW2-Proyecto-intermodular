package service;

import model.Lesson;
import model.Category;
import model.User;
import repository.LessonRepository;
import repository.StepRepository;
import repository.UserRepository;
import dto.request.CreateLessonRequest;
import exception.ForbiddenException;
import exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Tests unitarios para LessonService
 *
 * Cubre:
 * - Crear lecciones
 * - Buscar lecciones
 * - Publicar/Despublicar lecciones
 * - Eliminar lecciones
 * - Validaciones
 */
@DisplayName("LessonService Tests")
class LessonServiceTest {

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private StepRepository stepRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private LessonService lessonService;

    private User testAdmin;
    private Category testCategory;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Setup usuario admin
        testAdmin = new User();
        testAdmin.setId(1L);
        testAdmin.setUsername("admin");
        testAdmin.setRole(User.UserRole.ADMIN);

        // Setup categoría
        testCategory = new Category();
        testCategory.setId(1L);
        testCategory.setName("Test Category");
    }

    // ============================================================================
    // TESTS DE CREACIÓN
    // ============================================================================

    @Test
    @DisplayName("Debe crear una lección válida")
    void testCreateLessonSuccess() {
        // Arrange
        CreateLessonRequest request = new CreateLessonRequest();
        request.setTitle("Cómo usar WhatsApp");
        request.setDescription("Tutorial completo de WhatsApp");
        request.setCategoryId(1L);

        Lesson expectedLesson = new Lesson();
        expectedLesson.setId(1L);
        expectedLesson.setTitle("Cómo usar WhatsApp");
        expectedLesson.setDescription("Tutorial completo de WhatsApp");
        expectedLesson.setCategory(testCategory);
        expectedLesson.setCreatedBy(testAdmin);
        expectedLesson.setIsPublished(false);

        when(userRepository.findById(1L)).thenReturn(Optional.of(testAdmin));
        when(lessonRepository.save(any(Lesson.class))).thenReturn(expectedLesson);

        // Act
        Lesson result = lessonService.createLesson(request, 1L);

        // Assert
        assertNotNull(result);
        assertEquals("Cómo usar WhatsApp", result.getTitle());
        assertFalse(result.getIsPublished());
        verify(lessonRepository, times(1)).save(any(Lesson.class));
    }

    @Test
    @DisplayName("No debe crear lección si admin no existe")
    void testCreateLessonAdminNotFound() {
        // Arrange
        CreateLessonRequest request = new CreateLessonRequest();
        request.setTitle("Test");
        request.setCategoryId(1L);

        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> lessonService.createLesson(request, 999L));
        verify(lessonRepository, never()).save(any(Lesson.class));
    }

    // ============================================================================
    // TESTS DE BÚSQUEDA
    // ============================================================================

    @Test
    @DisplayName("Debe encontrar lección por ID")
    void testFindByIdSuccess() {
        // Arrange
        Lesson lesson = new Lesson();
        lesson.setId(1L);
        lesson.setTitle("Test Lesson");

        when(lessonRepository.findById(1L)).thenReturn(Optional.of(lesson));

        // Act
        Lesson result = lessonService.findById(1L);

        // Assert
        assertNotNull(result);
        assertEquals("Test Lesson", result.getTitle());
    }

    @Test
    @DisplayName("Debe lanzar excepción si lección no encontrada")
    void testFindByIdNotFound() {
        // Arrange
        when(lessonRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> lessonService.findById(999L));
    }

    @Test
    @DisplayName("Debe obtener lecciones publicadas")
    void testGetAllPublishedLessons() {
        // Arrange
        Lesson lesson1 = new Lesson();
        lesson1.setId(1L);
        lesson1.setTitle("Lesson 1");
        lesson1.setIsPublished(true);

        List<Lesson> lessons = new ArrayList<>();
        lessons.add(lesson1);

        Page<Lesson> page = new PageImpl<>(lessons, PageRequest.of(0, 10), 1);

        when(lessonRepository.findByIsPublishedTrue(any(Pageable.class))).thenReturn(page);

        // Act
        Page<Lesson> result = lessonService.getAllPublishedLessons(PageRequest.of(0, 10));

        // Assert
        assertEquals(1, result.getTotalElements());
        assertTrue(result.getContent().get(0).getIsPublished());
    }

    @Test
    @DisplayName("Debe buscar lecciones por texto")
    void testSearchLessons() {
        // Arrange
        Lesson lesson = new Lesson();
        lesson.setId(1L);
        lesson.setTitle("WhatsApp");

        List<Lesson> lessons = new ArrayList<>();
        lessons.add(lesson);

        Page<Lesson> page = new PageImpl<>(lessons, PageRequest.of(0, 10), 1);

        when(lessonRepository.searchLessonsByText("WhatsApp", PageRequest.of(0, 10))).thenReturn(page);

        // Act
        Page<Lesson> result = lessonService.searchLessons("WhatsApp", PageRequest.of(0, 10));

        // Assert
        assertEquals(1, result.getTotalElements());
        assertEquals("WhatsApp", result.getContent().get(0).getTitle());
    }

    // ============================================================================
    // TESTS DE PUBLICACIÓN
    // ============================================================================

    @Test
    @DisplayName("Debe publicar lección con pasos")
    void testPublishLessonSuccess() {
        // Arrange
        Lesson lesson = new Lesson();
        lesson.setId(1L);
        lesson.setTitle("Test Lesson");
        lesson.setIsPublished(false);
        lesson.setCreatedBy(testAdmin);

        Lesson publishedLesson = new Lesson();
        publishedLesson.setId(1L);
        publishedLesson.setIsPublished(true);

        when(lessonRepository.findById(1L)).thenReturn(Optional.of(lesson));
        when(stepRepository.countByLesson_Id(1L)).thenReturn(3L); // Tiene 3 pasos
        when(userRepository.findById(1L)).thenReturn(Optional.of(testAdmin));
        when(lessonRepository.save(any(Lesson.class))).thenReturn(publishedLesson);

        // Act
        Lesson result = lessonService.publishLesson(1L, 1L);

        // Assert
        assertTrue(result.getIsPublished());
    }

    @Test
    @DisplayName("No debe publicar lección sin pasos")
    void testPublishLessonWithoutSteps() {
        // Arrange
        Lesson lesson = new Lesson();
        lesson.setId(1L);
        lesson.setCreatedBy(testAdmin);

        when(lessonRepository.findById(1L)).thenReturn(Optional.of(lesson));
        when(stepRepository.countByLesson_Id(1L)).thenReturn(0L); // Sin pasos

        // Act & Assert
        assertThrows(ForbiddenException.class, () -> lessonService.publishLesson(1L, 1L));
    }

    @Test
    @DisplayName("No debe publicar lección si no es el creador")
    void testPublishLessonNotCreator() {
        // Arrange
        Lesson lesson = new Lesson();
        lesson.setId(1L);

        User otherAdmin = new User();
        otherAdmin.setId(2L);
        lesson.setCreatedBy(otherAdmin);

        when(lessonRepository.findById(1L)).thenReturn(Optional.of(lesson));

        // Act & Assert
        assertThrows(ForbiddenException.class, () -> lessonService.publishLesson(1L, 1L));
    }

    // ============================================================================
    // TESTS DE ELIMINACIÓN
    // ============================================================================

    @Test
    @DisplayName("Debe eliminar lección si es el creador")
    void testDeleteLessonSuccess() {
        // Arrange
        Lesson lesson = new Lesson();
        lesson.setId(1L);
        lesson.setCreatedBy(testAdmin);

        when(lessonRepository.findById(1L)).thenReturn(Optional.of(lesson));

        // Act
        lessonService.deleteLesson(1L, 1L);

        // Assert
        verify(stepRepository, times(1)).deleteByLesson_Id(1L);
        verify(lessonRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("No debe eliminar lección si no es el creador")
    void testDeleteLessonNotCreator() {
        // Arrange
        Lesson lesson = new Lesson();
        lesson.setId(1L);

        User otherAdmin = new User();
        otherAdmin.setId(2L);
        lesson.setCreatedBy(otherAdmin);

        when(lessonRepository.findById(1L)).thenReturn(Optional.of(lesson));

        // Act & Assert
        assertThrows(ForbiddenException.class, () -> lessonService.deleteLesson(1L, 1L));
        verify(lessonRepository, never()).deleteById(1L);
    }

    // ============================================================================
    // TESTS DE ACTUALIZACIÓN
    // ============================================================================

    @Test
    @DisplayName("Debe actualizar lección si es el creador")
    void testUpdateLessonSuccess() {
        // Arrange
        Lesson existingLesson = new Lesson();
        existingLesson.setId(1L);
        existingLesson.setTitle("Old Title");
        existingLesson.setCreatedBy(testAdmin);

        Lesson updatedLesson = new Lesson();
        updatedLesson.setId(1L);
        updatedLesson.setTitle("New Title");

        when(lessonRepository.findById(1L)).thenReturn(Optional.of(existingLesson));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testAdmin));
        when(lessonRepository.save(any(Lesson.class))).thenReturn(updatedLesson);

        // Act
        Lesson result = lessonService.updateLesson(1L, "New Title", "New Description", 1L);

        // Assert
        assertEquals("New Title", result.getTitle());
    }

    @Test
    @DisplayName("No debe actualizar lección si no es el creador")
    void testUpdateLessonNotCreator() {
        // Arrange
        Lesson lesson = new Lesson();
        lesson.setId(1L);

        User otherAdmin = new User();
        otherAdmin.setId(2L);
        lesson.setCreatedBy(otherAdmin);

        when(lessonRepository.findById(1L)).thenReturn(Optional.of(lesson));

        // Act & Assert
        assertThrows(ForbiddenException.class,
                () -> lessonService.updateLesson(1L, "New Title", "New Description", 1L));
    }
}

