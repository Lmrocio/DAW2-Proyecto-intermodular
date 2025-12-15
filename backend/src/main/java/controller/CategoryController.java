package controller;

import model.Category;
import service.CategoryService;
import dto.request.CreateCategoryRequest;
import dto.response.CategoryResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Controlador de Categorías
 *
 * Maneja CRUD de categorías de lecciones.
 * Público: GET
 * Admin: POST, PUT, DELETE
 */
@RestController
@RequestMapping("/api/v1/categories")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    /**
     * GET /api/v1/categories
     * Listar todas las categorías
     *
     * @param page número de página
     * @param size tamaño de página
     * @return Página de categorías (200 OK)
     */
    @GetMapping
    public ResponseEntity<Page<CategoryResponse>> listCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Category> categories = categoryService.listAllCategories(pageable);
        Page<CategoryResponse> response = categories.map(categoryService::convertToResponse);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/categories/{id}
     * Obtener categoría por ID
     *
     * @param id id de la categoría
     * @return Categoría (200 OK) o error (404)
     */
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable Long id) {
        Category category = categoryService.findById(id);
        return ResponseEntity.ok(categoryService.convertToResponse(category));
    }

    /**
     * GET /api/v1/categories/with-lessons
     * Listar categorías que tienen lecciones publicadas
     *
     * @return Lista de categorías con lecciones
     */
    @GetMapping("/with-lessons")
    public ResponseEntity<List<CategoryResponse>> getCategoriesWithLessons() {
        List<Category> categories = categoryService.getCategoriesWithLessons();
        List<CategoryResponse> response = categories.stream()
            .map(categoryService::convertToResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/v1/categories
     * Crear nueva categoría (solo admin)
     *
     * @param createRequest datos de la categoría
     * @return Categoría creada (201 Created) o error (409)
     */
    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            @Valid @RequestBody CreateCategoryRequest createRequest) {
        Category category = categoryService.createCategory(createRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(categoryService.convertToResponse(category));
    }

    /**
     * PUT /api/v1/categories/{id}
     * Actualizar categoría (solo admin)
     *
     * @param id id de la categoría
     * @param updateRequest datos a actualizar
     * @return Categoría actualizada (200 OK) o error (404, 409)
     */
    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CreateCategoryRequest updateRequest) {
        Category updated = categoryService.updateCategory(id, updateRequest.getName(), updateRequest.getDescription());
        return ResponseEntity.ok(categoryService.convertToResponse(updated));
    }

    /**
     * DELETE /api/v1/categories/{id}
     * Eliminar categoría (solo admin)
     * Solo si no tiene lecciones asociadas
     *
     * @param id id de la categoría
     * @return 204 No Content o error (403 si tiene lecciones)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}

