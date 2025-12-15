package service;

import model.Category;
import repository.CategoryRepository;
import repository.LessonRepository;
import dto.request.CreateCategoryRequest;
import exception.DuplicateResourceException;
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
 * Tests unitarios para CategoryService
 *
 * Cubre:
 * - Crear categorías
 * - Buscar categorías
 * - Actualizar categorías
 * - Eliminar categorías
 * - Validaciones
 */
@DisplayName("CategoryService Tests")
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private LessonRepository lessonRepository;

    @InjectMocks
    private CategoryService categoryService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // ============================================================================
    // TESTS DE CREACIÓN
    // ============================================================================

    @Test
    @DisplayName("Debe crear una categoría válida")
    void testCreateCategorySuccess() {
        // Arrange
        CreateCategoryRequest request = new CreateCategoryRequest();
        request.setName("Redes Sociales");
        request.setDescription("Lecciones sobre redes sociales");

        Category expectedCategory = new Category();
        expectedCategory.setId(1L);
        expectedCategory.setName("Redes Sociales");
        expectedCategory.setDescription("Lecciones sobre redes sociales");

        when(categoryRepository.existsByName("Redes Sociales")).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenReturn(expectedCategory);

        // Act
        Category result = categoryService.createCategory(request);

        // Assert
        assertNotNull(result);
        assertEquals("Redes Sociales", result.getName());
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    @DisplayName("No debe crear categoría si el nombre ya existe")
    void testCreateCategoryWithDuplicateName() {
        // Arrange
        CreateCategoryRequest request = new CreateCategoryRequest();
        request.setName("Existing");
        request.setDescription("Description");

        when(categoryRepository.existsByName("Existing")).thenReturn(true);

        // Act & Assert
        assertThrows(DuplicateResourceException.class, () -> categoryService.createCategory(request));
        verify(categoryRepository, never()).save(any(Category.class));
    }

    // ============================================================================
    // TESTS DE BÚSQUEDA
    // ============================================================================

    @Test
    @DisplayName("Debe encontrar categoría por ID")
    void testFindByIdSuccess() {
        // Arrange
        Category category = new Category();
        category.setId(1L);
        category.setName("Test");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

        // Act
        Category result = categoryService.findById(1L);

        // Assert
        assertNotNull(result);
        assertEquals("Test", result.getName());
    }

    @Test
    @DisplayName("Debe lanzar excepción si categoría no encontrada")
    void testFindByIdNotFound() {
        // Arrange
        when(categoryRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> categoryService.findById(999L));
    }

    @Test
    @DisplayName("Debe encontrar categoría por nombre")
    void testFindByNameSuccess() {
        // Arrange
        Category category = new Category();
        category.setName("Redes Sociales");

        when(categoryRepository.findByName("Redes Sociales")).thenReturn(Optional.of(category));

        // Act
        Optional<Category> result = categoryService.findByName("Redes Sociales");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("Redes Sociales", result.get().getName());
    }

    @Test
    @DisplayName("Debe listar categorías con paginación")
    void testListAllCategoriesSuccess() {
        // Arrange
        Category category1 = new Category();
        category1.setId(1L);
        category1.setName("Category 1");

        Category category2 = new Category();
        category2.setId(2L);
        category2.setName("Category 2");

        List<Category> categories = new ArrayList<>();
        categories.add(category1);
        categories.add(category2);

        Page<Category> page = new PageImpl<>(categories, PageRequest.of(0, 10), 2);

        when(categoryRepository.findAll(any(Pageable.class))).thenReturn(page);

        // Act
        Page<Category> result = categoryService.listAllCategories(PageRequest.of(0, 10));

        // Assert
        assertEquals(2, result.getTotalElements());
        assertEquals(1, result.getTotalPages());
    }

    // ============================================================================
    // TESTS DE ACTUALIZACIÓN
    // ============================================================================

    @Test
    @DisplayName("Debe actualizar categoría correctamente")
    void testUpdateCategorySuccess() {
        // Arrange
        Category existingCategory = new Category();
        existingCategory.setId(1L);
        existingCategory.setName("Old Name");
        existingCategory.setDescription("Old Description");

        Category updatedCategory = new Category();
        updatedCategory.setId(1L);
        updatedCategory.setName("New Name");
        updatedCategory.setDescription("New Description");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(existingCategory));
        when(categoryRepository.existsByName("New Name")).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenReturn(updatedCategory);

        // Act
        Category result = categoryService.updateCategory(1L, "New Name", "New Description");

        // Assert
        assertEquals("New Name", result.getName());
        assertEquals("New Description", result.getDescription());
    }

    @Test
    @DisplayName("No debe actualizar categoría a nombre duplicado")
    void testUpdateCategoryWithDuplicateName() {
        // Arrange
        Category existingCategory = new Category();
        existingCategory.setId(1L);
        existingCategory.setName("Old Name");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(existingCategory));
        when(categoryRepository.existsByName("Existing Name")).thenReturn(true);

        // Act & Assert
        assertThrows(DuplicateResourceException.class,
                () -> categoryService.updateCategory(1L, "Existing Name", "Description"));
    }

    // ============================================================================
    // TESTS DE ELIMINACIÓN
    // ============================================================================

    @Test
    @DisplayName("Debe eliminar categoría sin lecciones")
    void testDeleteCategorySuccess() {
        // Arrange
        Category category = new Category();
        category.setId(1L);
        category.setLessons(new ArrayList<>());

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

        // Act
        categoryService.deleteCategory(1L);

        // Assert
        verify(categoryRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("No debe eliminar categoría si tiene lecciones")
    void testDeleteCategoryWithLessons() {
        // Arrange
        Category category = new Category();
        category.setId(1L);
        category.setLessons(new ArrayList<>());
        category.getLessons().add(new Object()); // Simular que tiene lecciones

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

        // Act & Assert
        assertThrows(ForbiddenException.class, () -> categoryService.deleteCategory(1L));
        verify(categoryRepository, never()).deleteById(1L);
    }

    // ============================================================================
    // TESTS DE CONTEO
    // ============================================================================

    @Test
    @DisplayName("Debe contar lecciones en categoría")
    void testCountLessonsInCategory() {
        // Arrange
        when(lessonRepository.countByCategory_Id(1L)).thenReturn(5L);

        // Act
        long result = categoryService.countLessonsInCategory(1L);

        // Assert
        assertEquals(5L, result);
    }

    @Test
    @DisplayName("Debe contar lecciones publicadas en categoría")
    void testCountPublishedLessonsInCategory() {
        // Arrange
        when(lessonRepository.countByCategory_IdAndIsPublishedTrue(1L)).thenReturn(3L);

        // Act
        long result = categoryService.countPublishedLessonsInCategory(1L);

        // Assert
        assertEquals(3L, result);
    }
}

