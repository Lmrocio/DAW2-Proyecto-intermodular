package service;

import model.FAQ;
import model.User;
import repository.FAQRepository;
import repository.UserRepository;
import dto.request.CreateFAQRequest;
import dto.response.FAQResponse;
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

/**
 * Servicio de Preguntas Frecuentes (FAQ)
 *
 * Gestiona todas las operaciones relacionadas con FAQs:
 * - Crear, actualizar, eliminar FAQs
 * - Búsqueda por tema
 * - Validaciones de permisos
 * - Gestión de activación/desactivación
 */
@Service
@Transactional
public class FAQService {

    private static final Logger logger = LoggerFactory.getLogger(FAQService.class);

    @Autowired
    private FAQRepository faqRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    /**
     * Crear nueva FAQ
     * @param createFAQRequest datos de la FAQ
     * @param adminId id del admin que crea
     * @return FAQ creada
     * @throws ResourceNotFoundException si el admin no existe
     */
    public FAQ createFAQ(CreateFAQRequest createFAQRequest, Long adminId) {
        logger.info("Creando nueva FAQ: {}", createFAQRequest.getQuestion());

        // Validar que el admin existe
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", adminId));

        FAQ faq = new FAQ();
        faq.setQuestion(createFAQRequest.getQuestion());
        faq.setAnswer(createFAQRequest.getAnswer());
        faq.setTopic(createFAQRequest.getTopic());
        faq.setCreatedBy(admin);
        faq.setUpdatedBy(admin);
        faq.setIsActive(true);

        FAQ saved = faqRepository.save(faq);
        logger.info("FAQ creada: {}", saved.getId());
        return saved;
    }

    /**
     * Obtener FAQ por ID
     * @param faqId id de la FAQ
     * @return FAQ si existe
     * @throws ResourceNotFoundException si no existe
     */
    public FAQ findById(Long faqId) {
        return faqRepository.findById(faqId)
            .orElseThrow(() -> new ResourceNotFoundException("FAQ", "id", faqId));
    }

    /**
     * Obtener FAQ activa por pregunta
     * @param question pregunta
     * @return Optional con la FAQ si existe y está activa
     */
    public Optional<FAQ> findActiveByQuestion(String question) {
        return faqRepository.findByQuestion(question)
            .filter(FAQ::getIsActive);
    }

    /**
     * Listar todas las FAQs activas
     * @param pageable paginación
     * @return página de FAQs activas ordenadas por fecha
     */
    public Page<FAQ> listActiveFAQs(Pageable pageable) {
        return faqRepository.findByIsActiveTrueOrderByCreatedAtDesc(pageable);
    }

    /**
     * Obtener FAQs activas por tema
     * @param topic tema/categoría
     * @param pageable paginación
     * @return página de FAQs activas del tema
     */
    public Page<FAQ> getFAQsByTopic(String topic, Pageable pageable) {
        return faqRepository.findByTopicAndIsActiveTrueOrderByCreatedAtDesc(topic, pageable);
    }

    /**
     * Obtener todos los temas disponibles
     * @return lista de temas únicos
     */
    public List<String> getAllTopics() {
        return faqRepository.findDistinctTopicOrderByTopic();
    }

    /**
     * Obtener FAQs creadas por un admin
     * @param adminId id del admin
     * @return lista de FAQs creadas por el admin
     */
    public List<FAQ> getFAQsByCreator(Long adminId) {
        return faqRepository.findByCreatedById(adminId);
    }

    /**
     * Obtener FAQs creadas o editadas por un admin
     * @param adminId id del admin
     * @param pageable paginación
     * @return página de FAQs
     */
    public Page<FAQ> getFAQsByAdminManagement(Long adminId, Pageable pageable) {
        return faqRepository.findByCreatedByIdOrUpdatedByIdOrderByCreatedAtDesc(adminId, adminId, pageable);
    }

    /**
     * Actualizar FAQ
     * Solo el admin que la creó puede editarla
     * @param faqId id de la FAQ
     * @param question nueva pregunta
     * @param answer nueva respuesta
     * @param topic nuevo tema
     * @param adminId id del admin que edita
     * @return FAQ actualizada
     * @throws ResourceNotFoundException si la FAQ no existe
     * @throws ForbiddenException si no es el creador
     */
    public FAQ updateFAQ(Long faqId, String question, String answer, String topic, Long adminId) {
        FAQ faq = findById(faqId);

        // Validar que el admin sea el creador
        if (!faq.getCreatedBy().getId().equals(adminId)) {
            logger.warn("Intento de editar FAQ ajena: usuario {}", adminId);
            throw new ForbiddenException("editar FAQ", "no eres el creador");
        }

        faq.setQuestion(question);
        faq.setAnswer(answer);
        faq.setTopic(topic);
        faq.setUpdatedBy(userRepository.findById(adminId).orElseThrow());

        FAQ updated = faqRepository.save(faq);
        logger.info("FAQ actualizada: {}", faqId);
        return updated;
    }

    /**
     * Activar FAQ
     * @param faqId id de la FAQ
     * @param adminId id del admin que activa
     * @return FAQ activada
     * @throws ResourceNotFoundException si la FAQ no existe
     * @throws ForbiddenException si no es el creador
     */
    public FAQ activateFAQ(Long faqId, Long adminId) {
        FAQ faq = findById(faqId);

        // Validar que el admin sea el creador
        if (!faq.getCreatedBy().getId().equals(adminId)) {
            throw new ForbiddenException("activar FAQ", "no eres el creador");
        }

        faq.setIsActive(true);
        FAQ activated = faqRepository.save(faq);
        logger.info("FAQ activada: {}", faqId);
        return activated;
    }

    /**
     * Desactivar FAQ
     * @param faqId id de la FAQ
     * @param adminId id del admin que desactiva
     * @return FAQ desactivada
     * @throws ResourceNotFoundException si la FAQ no existe
     * @throws ForbiddenException si no es el creador
     */
    public FAQ deactivateFAQ(Long faqId, Long adminId) {
        FAQ faq = findById(faqId);

        // Validar que el admin sea el creador
        if (!faq.getCreatedBy().getId().equals(adminId)) {
            throw new ForbiddenException("desactivar FAQ", "no eres el creador");
        }

        faq.setIsActive(false);
        FAQ deactivated = faqRepository.save(faq);
        logger.info("FAQ desactivada: {}", faqId);
        return deactivated;
    }

    /**
     * Eliminar FAQ
     * Solo el admin que la creó puede eliminarla
     * @param faqId id de la FAQ
     * @param adminId id del admin que elimina
     * @throws ResourceNotFoundException si la FAQ no existe
     * @throws ForbiddenException si no es el creador
     */
    public void deleteFAQ(Long faqId, Long adminId) {
        FAQ faq = findById(faqId);

        // Validar que el admin sea el creador
        if (!faq.getCreatedBy().getId().equals(adminId)) {
            logger.warn("Intento de eliminar FAQ ajena: usuario {}", adminId);
            throw new ForbiddenException("eliminar FAQ", "no eres el creador");
        }

        faqRepository.deleteById(faqId);
        logger.info("FAQ eliminada: {}", faqId);
    }

    /**
     * Contar FAQs activas por tema
     * @param topic tema
     * @return número de FAQs activas
     */
    public long countActiveFAQsByTopic(String topic) {
        return faqRepository.countByTopicAndIsActiveTrue(topic);
    }

    /**
     * Contar FAQs creadas por un admin
     * @param adminId id del admin
     * @return número de FAQs creadas
     */
    public long countFAQsByCreator(Long adminId) {
        return faqRepository.countByCreatedById(adminId);
    }

    /**
     * Convertir entidad FAQ a DTO FAQResponse
     * @param faq entidad FAQ
     * @return DTO FAQResponse
     */
    public FAQResponse convertToResponse(FAQ faq) {
        FAQResponse response = new FAQResponse(
            faq.getId(),
            faq.getQuestion(),
            faq.getAnswer(),
            faq.getTopic(),
            faq.getIsActive()
        );

        response.setCreatedAt(faq.getCreatedAt());
        response.setUpdatedAt(faq.getUpdatedAt());
        response.setCreatedBy(userService.convertToResponse(faq.getCreatedBy()));
        response.setUpdatedBy(userService.convertToResponse(faq.getUpdatedBy()));

        return response;
    }
}

