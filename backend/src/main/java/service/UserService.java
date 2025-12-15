package service;

import model.User;
import model.AuditLog;
import model.AuditAction;
import model.AuditEntityType;
import repository.UserRepository;
import repository.AuditLogRepository;
import dto.request.RegisterRequest;
import dto.response.UserResponse;
import exception.DuplicateResourceException;
import exception.ResourceNotFoundException;
import exception.ForbiddenException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Registrar nuevo usuario
     * @param registerRequest datos del usuario a registrar
     * @return usuario registrado
     * @throws DuplicateResourceException si el usuario o email ya existe
     */
    public User registerUser(RegisterRequest registerRequest) {
        logger.info("Registrando nuevo usuario: {}", registerRequest.getUsername());

        // Validar que no exista usuario
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            logger.warn("Intento de registro con username duplicado: {}", registerRequest.getUsername());
            throw new DuplicateResourceException("User", "username", registerRequest.getUsername());
        }

        // Validar que no exista email
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            logger.warn("Intento de registro con email duplicado: {}", registerRequest.getEmail());
            throw new DuplicateResourceException("User", "email", registerRequest.getEmail());
        }

        // Validar que las contraseñas coincidan
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            logger.warn("Las contraseñas no coinciden para usuario: {}", registerRequest.getUsername());
            throw new IllegalArgumentException("Las contraseñas no coinciden");
        }

        // Crear nuevo usuario
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(User.UserRole.USER);
        user.setIsActive(true);

        User savedUser = userRepository.save(user);
        logger.info("Usuario registrado exitosamente: {}", savedUser.getId());

        // Registrar en auditoría
        recordAudit(AuditLog.AuditAction.CREATE, AuditLog.AuditEntityType.USER, savedUser.getId(), null, savedUser);

        return savedUser;
    }

    /**
     * Buscar usuario por username
     * @param username nombre de usuario
     * @return Optional con el usuario si existe
     */
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * Buscar usuario por email
     * @param email correo electrónico
     * @return Optional con el usuario si existe
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Buscar usuario por ID
     * @param userId id del usuario
     * @return usuario si existe
     * @throws ResourceNotFoundException si no existe
     */
    public User findById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }

    /**
     * Buscar usuario activo por username (para login)
     * @param username nombre de usuario
     * @return Optional con el usuario si existe y está activo
     */
    public Optional<User> findActiveByUsername(String username) {
        return userRepository.findByUsernameAndIsActiveTrue(username);
    }

    /**
     * Listar usuarios activos (para panel admin)
     * @param pageable paginación
     * @return página de usuarios activos
     */
    public Page<User> listActiveUsers(Pageable pageable) {
        return userRepository.findActiveUsersOrderByCreatedAt(pageable);
    }

    /**
     * Listar todos los usuarios (activos e inactivos)
     * @param pageable paginación
     * @return página de todos los usuarios
     */
    public Page<User> listAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    /**
     * Buscar usuarios activos por nombre de usuario
     * @param search texto a buscar
     * @param pageable paginación
     * @return página de usuarios que coincidan
     */
    public Page<User> searchActiveUsers(String search, Pageable pageable) {
        return userRepository.searchActiveUsersByUsername(search, pageable);
    }

    /**
     * Buscar todos los usuarios por nombre o email
     * @param search texto a buscar
     * @param pageable paginación
     * @return página de usuarios que coincidan
     */
    public Page<User> searchAllUsers(String search, Pageable pageable) {
        return userRepository.searchActiveUsersByUsername(search, pageable);
    }

    /**
     * Contar usuarios activos
     * @return número de usuarios activos
     */
    public long countActiveUsers() {
        return userRepository.countByIsActiveTrue();
    }

    /**
     * Contar todos los usuarios (activos e inactivos)
     * @return número total de usuarios
     */
    public long countTotalUsers() {
        return userRepository.count();
    }

    /**
     * Contar usuarios por rol
     * @param role nombre del rol (ADMIN o USER)
     * @return número de usuarios con ese rol
     */
    public long countUsersByRole(String role) {
        long count = 0;
        for (User user : userRepository.findAll()) {
            if (user.getRole().toString().equalsIgnoreCase(role)) {
                count++;
            }
        }
        return count;
    }

    /**
     * Verificar si un usuario puede editar otro usuario
     * Solo admin puede editar, y solo a sí mismo
     * @param currentUserId id del usuario autenticado
     * @param targetUserId id del usuario a editar
     * @param userRole rol del usuario autenticado
     * @return true si puede editar
     */
    public boolean canEditUser(Long currentUserId, Long targetUserId, User.UserRole userRole) {
        // Un usuario regular solo puede editarse a sí mismo
        if (userRole == User.UserRole.USER) {
            return currentUserId.equals(targetUserId);
        }
        // Un admin solo puede editarse a sí mismo (no otros admins)
        return currentUserId.equals(targetUserId);
    }

    /**
     * Actualizar perfil de usuario
     * @param userId id del usuario
     * @param email nuevo email
     * @param newPassword nueva contraseña (opcional, null para no cambiar)
     * @return usuario actualizado
     * @throws ResourceNotFoundException si el usuario no existe
     * @throws DuplicateResourceException si el email ya está registrado
     */
    public User updateUserProfile(Long userId, String email, String newPassword) {
        User user = findById(userId);  // Lanza ResourceNotFoundException si no existe

        Object oldValue = user.getEmail();

        // Validar email único
        if (!user.getEmail().equals(email) && userRepository.existsByEmail(email)) {
            logger.warn("Intento de actualizar a email duplicado: {}", email);
            throw new DuplicateResourceException("User", "email", email);
        }

        user.setEmail(email);

        if (newPassword != null && !newPassword.isEmpty()) {
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        User updatedUser = userRepository.save(user);
        logger.info("Perfil de usuario actualizado: {}", userId);

        // Registrar en auditoría
        recordAudit(AuditLog.AuditAction.UPDATE, AuditLog.AuditEntityType.USER, userId, oldValue, email);

        return updatedUser;
    }

    /**
     * Desactivar cuenta de usuario (soft delete)
     * @param userId id del usuario
     * @return usuario desactivado
     * @throws ResourceNotFoundException si el usuario no existe
     */
    public User deactivateUser(Long userId) {
        User user = findById(userId);  // Lanza ResourceNotFoundException si no existe

        user.setIsActive(false);
        User deactivatedUser = userRepository.save(user);
        logger.info("Cuenta de usuario desactivada: {}", userId);

        // Registrar en auditoría
        recordAudit(AuditLog.AuditAction.DISABLE_ACCOUNT, AuditLog.AuditEntityType.USER, userId, true, false);

        return deactivatedUser;
    }

    /**
     * Reactivar cuenta de usuario (solo admin)
     * @param userId id del usuario
     * @return usuario reactivado
     * @throws ResourceNotFoundException si el usuario no existe
     */
    public User reactivateUser(Long userId) {
        User user = findById(userId);  // Lanza ResourceNotFoundException si no existe
        user.setIsActive(true);
        User reactivated = userRepository.save(user);
        logger.info("Cuenta de usuario reactivada: {}", userId);
        return reactivated;
    }

    /**
     * Convertir entidad User a DTO UserResponse
     * @param user entidad User
     * @return DTO UserResponse
     */
    public UserResponse convertToResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRole().toString(),
            user.getIsActive(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }

    /**
     * Registrar cambio en auditoría
     * @param action acción realizada
     * @param entityType tipo de entidad
     * @param entityId id de la entidad
     * @param previousValue valor anterior
     * @param newValue valor nuevo
     */
    private void recordAudit(AuditAction action, AuditEntityType entityType,
                            Long entityId, Object previousValue, Object newValue) {
        try {
            User currentUser = findById(entityId);
            auditLogService.logAction(currentUser, action, entityType, entityId,
                                     currentUser.getUsername(),
                                     previousValue != null ? previousValue.toString() : null,
                                     newValue != null ? newValue.toString() : null);
        } catch (Exception e) {
            logger.error("Error registrando auditoría: {}", e.getMessage());
            // No lanzar excepción para no interrumpir la operación principal
        }
    }
}

