package controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import model.Category;
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
import service.CategoryService;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests para CategoryController
 *
 * Cubre:
 * - Listar categorías (público)
 * - Obtener categoría por ID (público)
 * - Crear categoría (ADMIN)
 * - Actualizar categoría (ADMIN)
 * - Eliminar categoría (ADMIN)
 * - Códigos HTTP esperados
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@DisplayName("CategoryController Tests")
public class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CategoryService categoryService;

    private Category testCategory;

    @BeforeEach
    public void setUp() {
        testCategory = new Category();
        testCategory.setName("Test Category");
        testCategory.setDescription("Categoría de prueba");
        testCategory = categoryService.createCategory(testCategory);
    }

    // ============================================
    // TESTS: GET /api/categories (Público)
    // ============================================

    @Test
    @DisplayName("GET /api/categories - Listar categorías (200 OK)")
    public void testGetAllCategories() throws Exception {
        mockMvc.perform(get("/api/categories")
                .param("page", "0")
                .param("size", "20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(0))))
                .andExpect(jsonPath("$.totalElements", isA(Number.class)));
    }

    @Test
    @DisplayName("GET /api/categories/{id} - Obtener categoría por ID (200 OK)")
    public void testGetCategoryById() throws Exception {
        mockMvc.perform(get("/api/categories/{id}", testCategory.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(testCategory.getId().intValue())))
                .andExpect(jsonPath("$.name", is(testCategory.getName())));
    }

    @Test
    @DisplayName("GET /api/categories/{id} - Categoría no existe (404 Not Found)")
    public void testGetCategoryNotFound() throws Exception {
        mockMvc.perform(get("/api/categories/{id}", 999L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code", is("RESOURCE_NOT_FOUND")));
    }

    // ============================================
    // TESTS: POST /api/categories (ADMIN)
    // ============================================

    @Test
    @DisplayName("POST /api/categories - Sin autenticación (401 Unauthorized)")
    public void testCreateCategoryUnauthorized() throws Exception {
        Category request = new Category();
        request.setName("Nueva Categoría");
        request.setDescription("Descripción");

        mockMvc.perform(post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/categories - Usuario sin rol ADMIN (403 Forbidden)")
    @WithMockUser(roles = "USER")
    public void testCreateCategoryForbidden() throws Exception {
        Category request = new Category();
        request.setName("Nueva Categoría");
        request.setDescription("Descripción");

        mockMvc.perform(post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("POST /api/categories - Crear categoría exitosamente (201 Created)")
    @WithMockUser(roles = "ADMIN")
    public void testCreateCategorySuccess() throws Exception {
        Category request = new Category();
        request.setName("Nueva Categoría Única");
        request.setDescription("Descripción nueva");

        mockMvc.perform(post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.name", is("Nueva Categoría Única")));
    }

    @Test
    @DisplayName("POST /api/categories - Nombre duplicado (409 Conflict)")
    @WithMockUser(roles = "ADMIN")
    public void testCreateCategoryDuplicate() throws Exception {
        Category request = new Category();
        request.setName(testCategory.getName());
        request.setDescription("Descripción diferente");

        mockMvc.perform(post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code", is("DUPLICATE_RESOURCE")));
    }

    @Test
    @DisplayName("POST /api/categories - Validación fallida (400 Bad Request)")
    @WithMockUser(roles = "ADMIN")
    public void testCreateCategoryValidationFailed() throws Exception {
        Category request = new Category();
        request.setName(""); // Vacío

        mockMvc.perform(post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code", is("VALIDATION_ERROR")));
    }

    // ============================================
    // TESTS: PUT /api/categories/{id} (ADMIN)
    // ============================================

    @Test
    @DisplayName("PUT /api/categories/{id} - Sin autenticación (401 Unauthorized)")
    public void testUpdateCategoryUnauthorized() throws Exception {
        Category request = new Category();
        request.setName("Actualizado");
        request.setDescription("Descripción actualizada");

        mockMvc.perform(put("/api/categories/{id}", testCategory.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("PUT /api/categories/{id} - Actualizar exitosamente (200 OK)")
    @WithMockUser(roles = "ADMIN")
    public void testUpdateCategorySuccess() throws Exception {
        Category request = new Category();
        request.setName("Categoría Actualizada");
        request.setDescription("Nueva descripción");

        mockMvc.perform(put("/api/categories/{id}", testCategory.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Categoría Actualizada")))
                .andExpect(jsonPath("$.description", is("Nueva descripción")));
    }

    @Test
    @DisplayName("PUT /api/categories/{id} - Categoría no existe (404 Not Found)")
    @WithMockUser(roles = "ADMIN")
    public void testUpdateCategoryNotFound() throws Exception {
        Category request = new Category();
        request.setName("Actualizado");
        request.setDescription("Descripción");

        mockMvc.perform(put("/api/categories/{id}", 999L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code", is("RESOURCE_NOT_FOUND")));
    }

    // ============================================
    // TESTS: DELETE /api/categories/{id} (ADMIN)
    // ============================================

    @Test
    @DisplayName("DELETE /api/categories/{id} - Sin autenticación (401 Unauthorized)")
    public void testDeleteCategoryUnauthorized() throws Exception {
        mockMvc.perform(delete("/api/categories/{id}", testCategory.getId()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("DELETE /api/categories/{id} - Eliminar exitosamente (204 No Content)")
    @WithMockUser(roles = "ADMIN")
    public void testDeleteCategorySuccess() throws Exception {
        mockMvc.perform(delete("/api/categories/{id}", testCategory.getId()))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("DELETE /api/categories/{id} - Categoría no existe (404 Not Found)")
    @WithMockUser(roles = "ADMIN")
    public void testDeleteCategoryNotFound() throws Exception {
        mockMvc.perform(delete("/api/categories/{id}", 999L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code", is("RESOURCE_NOT_FOUND")));
    }
}

