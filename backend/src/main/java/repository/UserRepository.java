package repository;

import model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio JPA para la entidad User
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Buscar usuario por nombre de usuario
     * @param username nombre de usuario único
     * @return Optional con el usuario si existe
     */
    Optional<User> findByUsername(String username);

    /**
     * Buscar usuario por email
     * @param email correo electrónico único
     * @return Optional con el usuario si existe
     */
    Optional<User> findByEmail(String email);

    /**
     * Verificar si existe usuario con ese nombre de usuario
     * @param username nombre de usuario
     * @return true si existe, false en caso contrario
     */
    boolean existsByUsername(String username);

    /**
     * Verificar si existe usuario con ese email
     * @param email correo electrónico
     * @return true si existe, false en caso contrario
     */
    boolean existsByEmail(String email);

    /**
     * Buscar usuario activo por nombre de usuario
     * @param username nombre de usuario
     * @return Optional con el usuario si existe y está activo
     */
    Optional<User> findByUsernameAndIsActiveTrue(String username);

    /**
     * Contar usuarios activos
     * @return número de usuarios activos
     */
    long countByIsActiveTrue();

    /**
     * Obtener lista de usuarios activos ordenados por fecha de creación (para panel admin)
     * @param pageable paginación
     * @return página de usuarios activos ordenados por más recientes primero
     */
    @Query("SELECT u FROM User u WHERE u.isActive = true ORDER BY u.createdAt DESC")
    Page<User> findActiveUsersOrderByCreatedAt(Pageable pageable);

    /**
     * Buscar usuarios activos por nombre de usuario (búsqueda parcial)
     * @param search texto a buscar en el nombre de usuario
     * @param pageable paginación
     * @return página de usuarios que coincidan
     */
    @Query("SELECT u FROM User u WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) AND u.isActive = true ORDER BY u.username ASC")
    Page<User> searchActiveUsersByUsername(@org.springframework.data.repository.query.Param("search") String search, Pageable pageable);
}

