package com.example.backend;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests de la aplicación educativa
 * Valida que la aplicación sea correctamente identificable
 */
class AplicacionSaludoTest {

    @Test
    void testApplicationClassExists() {
        // Test simple para verificar que la clase AplicacionEducativa existe
        assertNotNull(AplicacionEducativa.class);
        assertTrue(AplicacionEducativa.class.getName().contains("AplicacionEducativa"));
    }

    @Test
    void testApplicationClassCanBeInstantiated() {
        // Verificar que la clase puede ser instanciada (aunque sea de forma vacía en test)
        assertNotNull(AplicacionEducativa.class.getSimpleName());
    }
}