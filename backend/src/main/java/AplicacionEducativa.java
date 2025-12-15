package com.example.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Aplicación Principal - Plataforma Educativa para Adultos Mayores
 *
 * Aplicación Spring Boot que proporciona una API REST completa para
 * gestionar lecciones, simuladores, usuarios y progreso de aprendizaje.
 *
 * Características:
 * - API REST con manejo de excepciones global
 * - Autenticación y autorización con roles
 * - Lecciones estructuradas con pasos
 * - Simuladores interactivos
 * - Rastreo de progreso de usuario
 * - Auditoría de cambios
 *
 * @author Rocío Luque
 * @version 1.0
 */
@SpringBootApplication(scanBasePackages = {
        "com.example.backend",
        "config",
        "controller",
        "service",
        "repository",
        "exception",
        "security"
})
@EnableJpaRepositories(basePackages = {"repository"})
public class AplicacionEducativa {

    public static void main(String[] args) {
        SpringApplication.run(AplicacionEducativa.class, args);
    }
}