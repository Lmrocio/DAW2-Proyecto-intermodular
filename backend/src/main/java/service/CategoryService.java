package service;

import model.Category;
import model.Lesson;
import repository.CategoryRepository;
import repository.LessonRepository;
import dto.request.CreateCategoryRequest;
import dto.response.CategoryResponse;
import exception.DuplicateResourceException;
import exception.ResourceNotFoundException;
import exception.ForbiddenException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Servicio de Categorías
 *
 * Gestiona todas las operaciones relacionadas con categorías:
 * - Crear, actualizar, eliminar categorías
 * - Listar categorías con lecciones
 * - Búsqueda de categorías
 * - Validaciones de unicidad
 */
@Service
@Transactional
public class CategoryService {

    private static final Logger logger = LoggerFactory.getLogger(CategoryService.class);

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private LessonRepository lessonRepository;

    /**
     * Crear nueva categoría
     * @param createCategoryRequest datos de la categoría
     * @return categoría creada
     * @throws DuplicateResourceException si el nombre ya existe
     */
    public Category createCategory(CreateCategoryRequest createCategoryRequest) {
        logger.info("Creando nueva categoría: {}", createCategoryRequest.getName());

        // Validar que el nombre sea único
        if (categoryRepository.existsByName(createCategoryRequest.getName())) {
            logger.warn("Intento de crear categoría duplicada: {}", createCategoryRequest.getName());
            throw new DuplicateResourceException("Category", "name", createCategoryRequest.getName());
        }

        Category category = new Category();
        category.setName(createCategoryRequest.getName());
        category.setDescription(createCategoryRequest.getDescription());

        Category saved = categoryRepository.save(category);
        logger.info("Categoría creada exitosamente: {}", saved.getId());
        return saved;
    }

    /**
     * Obtener categoría por ID
     * @param categoryId id de la categoría
     * @return categoría si existe
     * @throws ResourceNotFoundException si no existe
     */
    public Category findById(Long categoryId) {
        return categoryRepository.findById(categoryId)
            .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));
    }

    /**
     * Obtener categoría por nombre
     * @param name nombre de la categoría
     * @return Optional con la categoría si existe
     */
    public Optional<Category> findByName(String name) {
        return categoryRepository.findByName(name);
    }

    /**
     * Listar todas las categorías con paginación
     * @param pageable paginación
     * @return página de categorías
     */
    public Page<Category> listAllCategories(Pageable pageable) {
        return categoryRepository.findAll(pageable);
    }

    /**
     * Obtener todas las categorías (sin paginación)
     * @return lista de todas las categorías
     */
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    /**
     * Obtener categorías que tienen lecciones publicadas
     * @return lista de categorías con lecciones
     */
    public List<Category> getCategoriesWithLessons() {
        return categoryRepository.findAll()
            .stream()
            .filter(c -> c.getLessons() != null && !c.getLessons().isEmpty())
            .collect(Collectors.toList());
    }

    /**
     * Actualizar categoría
     * @param categoryId id de la categoría
     * @param name nuevo nombre
     * @param description nueva descripción
     * @return categoría actualizada
     * @throws ResourceNotFoundException si no existe
     * @throws DuplicateResourceException si el nombre ya existe
     */
    public Category updateCategory(Long categoryId, String name, String description) {
        Category category = findById(categoryId);  // Lanza ResourceNotFoundException si no existe

        // Validar que el nuevo nombre sea único (si cambió)
        if (!category.getName().equals(name) && categoryRepository.existsByName(name)) {
            logger.warn("Intento de cambiar a nombre duplicado: {}", name);
            throw new DuplicateResourceException("Category", "name", name);
        }

        category.setName(name);
        category.setDescription(description);

        Category updated = categoryRepository.save(category);
        logger.info("Categoría actualizada: {}", categoryId);
        return updated;
    }

    /**
     * Eliminar categoría
     * Solo se puede eliminar si no tiene lecciones asociadas
     * @param categoryId id de la categoría
     * @throws ResourceNotFoundException si la categoría no existe
     * @throws ForbiddenException si la categoría tiene lecciones
     */
    public void deleteCategory(Long categoryId) {
        Category category = findById(categoryId);  // Lanza ResourceNotFoundException si no existe

        // Validar que no tenga lecciones
        if (category.getLessons() != null && !category.getLessons().isEmpty()) {
            logger.warn("Intento de eliminar categoría con lecciones: {}", categoryId);
            throw new ForbiddenException("eliminar categoría", "tiene lecciones asociadas");
        }

        categoryRepository.deleteById(categoryId);
        logger.info("Categoría eliminada: {}", categoryId);
    }

    /**
     * Contar lecciones en una categoría
     * @param categoryId id de la categoría
     * @return número de lecciones en la categoría
     */
    public long countLessonsInCategory(Long categoryId) {
        return lessonRepository.countByCategory_Id(categoryId);
    }

    /**
     * Contar lecciones publicadas en una categoría
     * @param categoryId id de la categoría
     * @return número de lecciones publicadas
     */
    public long countPublishedLessonsInCategory(Long categoryId) {
        return lessonRepository.countByCategory_IdAndIsPublishedTrue(categoryId);
    }

    /**
     * Convertir entidad Category a DTO CategoryResponse
     * @param category entidad Category
     * @return DTO CategoryResponse
     */
    public CategoryResponse convertToResponse(Category category) {
        CategoryResponse response = new CategoryResponse(
            category.getId(),
            category.getName(),
            category.getDescription(),
            category.getCreatedAt()
        );

        // Contar lecciones publicadas
        long lessonCount = countPublishedLessonsInCategory(category.getId());
        response.setLessonCount((int) lessonCount);

        return response;
    }

    /**
     * Verificar si una categoría existe
     * @param categoryId id de la categoría
     * @return true si existe
     */
    public boolean categoryExists(Long categoryId) {
        return categoryRepository.existsById(categoryId);
    }
}

