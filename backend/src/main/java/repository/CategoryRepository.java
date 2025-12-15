package repository;

import model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio JPA para la entidad Category
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    /**
     * Buscar categoría por nombre
     * @param name nombre de la categoría
     * @return Optional con la categoría si existe
     */
    Optional<Category> findByName(String name);

    /**
     * Verificar si existe categoría con ese nombre
     * @param name nombre de la categoría
     * @return true si existe, false en caso contrario
     */
    boolean existsByName(String name);

    /**
     * Obtener todas las categorías con paginación
     * @param pageable información de paginación
     * @return página de categorías
     */
    Page<Category> findAll(Pageable pageable);
}

