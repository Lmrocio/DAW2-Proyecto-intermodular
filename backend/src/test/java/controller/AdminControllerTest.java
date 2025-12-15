package controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests para AdminController
 *
 * Cubre:
 * - Listar usuarios (ADMIN)
 * - Obtener usuario (ADMIN)
 * - Ver logs de auditoría (ADMIN)
 * - Filtrar logs (ADMIN)
 * - Códigos HTTP esperados
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@DisplayName("AdminController Tests")
public class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    // ============================================
    // TESTS: GET /api/admin/users (ADMIN)
    // ============================================

    @Test
    @DisplayName("GET /api/admin/users - Sin autenticación (401 Unauthorized)")
    public void testGetUsersUnauthorized() throws Exception {
        mockMvc.perform(get("/api/admin/users")
                .param("page", "0")
                .param("size", "20"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/admin/users - Usuario sin rol ADMIN (403 Forbidden)")
    @WithMockUser(roles = "USER")
    public void testGetUsersForbidden() throws Exception {
        mockMvc.perform(get("/api/admin/users")
                .param("page", "0")
                .param("size", "20"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code", is("FORBIDDEN")));
    }

    @Test
    @DisplayName("GET /api/admin/users - Listar usuarios (200 OK)")
    @WithMockUser(roles = "ADMIN")
    public void testGetUsersSuccess() throws Exception {
        mockMvc.perform(get("/api/admin/users")
                .param("page", "0")
                .param("size", "20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(0))))
                .andExpect(jsonPath("$.totalElements", isA(Number.class)))
                .andExpect(jsonPath("$.totalPages", isA(Number.class)));
    }

    // ============================================
    // TESTS: GET /api/admin/users/{id} (ADMIN)
    // ============================================

    @Test
    @DisplayName("GET /api/admin/users/{id} - Sin autenticación (401 Unauthorized)")
    public void testGetUserUnauthorized() throws Exception {
        mockMvc.perform(get("/api/admin/users/{id}", 1L))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/admin/users/{id} - Usuario sin rol ADMIN (403 Forbidden)")
    @WithMockUser(roles = "USER")
    public void testGetUserForbidden() throws Exception {
        mockMvc.perform(get("/api/admin/users/{id}", 1L))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("GET /api/admin/users/{id} - Usuario no existe (404 Not Found)")
    @WithMockUser(roles = "ADMIN")
    public void testGetUserNotFound() throws Exception {
        mockMvc.perform(get("/api/admin/users/{id}", 999L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code", is("RESOURCE_NOT_FOUND")));
    }

    @Test
    @DisplayName("GET /api/admin/users/{id} - Obtener usuario (200 OK)")
    @WithMockUser(roles = "ADMIN")
    public void testGetUserSuccess() throws Exception {
        mockMvc.perform(get("/api/admin/users/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.username", notNullValue()))
                .andExpect(jsonPath("$.email", notNullValue())
        );
    }

    // ============================================
    // TESTS: GET /api/admin/audit-logs (ADMIN)
    // ============================================

    @Test
    @DisplayName("GET /api/admin/audit-logs - Sin autenticación (401 Unauthorized)")
    public void testGetAuditLogsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/admin/audit-logs")
                .param("page", "0")
                .param("size", "20"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/admin/audit-logs - Usuario sin rol ADMIN (403 Forbidden)")
    @WithMockUser(roles = "USER")
    public void testGetAuditLogsForbidden() throws Exception {
        mockMvc.perform(get("/api/admin/audit-logs")
                .param("page", "0")
                .param("size", "20"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("GET /api/admin/audit-logs - Obtener logs (200 OK)")
    @WithMockUser(roles = "ADMIN")
    public void testGetAuditLogsSuccess() throws Exception {
        mockMvc.perform(get("/api/admin/audit-logs")
                .param("page", "0")
                .param("size", "20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", isA(Object.class)))
                .andExpect(jsonPath("$.totalElements", isA(Number.class)));
    }

    // ============================================
    // TESTS: GET /api/admin/audit-logs/entity/{entityType} (ADMIN)
    // ============================================

    @Test
    @DisplayName("GET /api/admin/audit-logs/entity/{entityType} - Sin autenticación (401 Unauthorized)")
    public void testGetAuditLogsByEntityUnauthorized() throws Exception {
        mockMvc.perform(get("/api/admin/audit-logs/entity/{entityType}", "LESSON")
                .param("page", "0")
                .param("size", "20"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/admin/audit-logs/entity/{entityType} - Usuario sin rol ADMIN (403 Forbidden)")
    @WithMockUser(roles = "USER")
    public void testGetAuditLogsByEntityForbidden() throws Exception {
        mockMvc.perform(get("/api/admin/audit-logs/entity/{entityType}", "LESSON")
                .param("page", "0")
                .param("size", "20"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("GET /api/admin/audit-logs/entity/{entityType} - Obtener logs filtrados (200 OK)")
    @WithMockUser(roles = "ADMIN")
    public void testGetAuditLogsByEntitySuccess() throws Exception {
        mockMvc.perform(get("/api/admin/audit-logs/entity/{entityType}", "LESSON")
                .param("page", "0")
                .param("size", "20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", isA(Object.class)));
    }

    // ============================================
    // TESTS: GET /api/admin/audit-logs/user/{userId} (ADMIN)
    // ============================================

    @Test
    @DisplayName("GET /api/admin/audit-logs/user/{userId} - Sin autenticación (401 Unauthorized)")
    public void testGetAuditLogsByUserUnauthorized() throws Exception {
        mockMvc.perform(get("/api/admin/audit-logs/user/{userId}", 1L)
                .param("page", "0")
                .param("size", "20"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/admin/audit-logs/user/{userId} - Usuario sin rol ADMIN (403 Forbidden)")
    @WithMockUser(roles = "USER")
    public void testGetAuditLogsByUserForbidden() throws Exception {
        mockMvc.perform(get("/api/admin/audit-logs/user/{userId}", 1L)
                .param("page", "0")
                .param("size", "20"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("GET /api/admin/audit-logs/user/{userId} - Usuario no existe (404 Not Found)")
    @WithMockUser(roles = "ADMIN")
    public void testGetAuditLogsByUserNotFound() throws Exception {
        mockMvc.perform(get("/api/admin/audit-logs/user/{userId}", 999L)
                .param("page", "0")
                .param("size", "20"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/admin/audit-logs/user/{userId} - Obtener logs de usuario (200 OK)")
    @WithMockUser(roles = "ADMIN")
    public void testGetAuditLogsByUserSuccess() throws Exception {
        mockMvc.perform(get("/api/admin/audit-logs/user/{userId}", 1L)
                .param("page", "0")
                .param("size", "20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", isA(Object.class)));
    }

    // ============================================
    // TESTS: GET /api/admin/audit-logs/action/{action} (ADMIN)
    // ============================================

    @Test
    @DisplayName("GET /api/admin/audit-logs/action/{action} - Sin autenticación (401 Unauthorized)")
    public void testGetAuditLogsByActionUnauthorized() throws Exception {
        mockMvc.perform(get("/api/admin/audit-logs/action/{action}", "CREATE")
                .param("page", "0")
                .param("size", "20"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/admin/audit-logs/action/{action} - Usuario sin rol ADMIN (403 Forbidden)")
    @WithMockUser(roles = "USER")
    public void testGetAuditLogsByActionForbidden() throws Exception {
        mockMvc.perform(get("/api/admin/audit-logs/action/{action}", "CREATE")
                .param("page", "0")
                .param("size", "20"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("GET /api/admin/audit-logs/action/{action} - Obtener logs por acción (200 OK)")
    @WithMockUser(roles = "ADMIN")
    public void testGetAuditLogsByActionSuccess() throws Exception {
        mockMvc.perform(get("/api/admin/audit-logs/action/{action}", "CREATE")
                .param("page", "0")
                .param("size", "20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", isA(Object.class)));
    }
}

