package com.example.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AplicacionSaludo.class)
class AplicacionSaludoTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void saludarConNombreDevuelveHolaNombre() throws Exception {
        mockMvc.perform(get("/api/saludar").param("nombre", "Ana"))
                .andExpect(status().isOk())
                .andExpect(content().string("¡Hola, Ana!"));
    }

    @Test
    void saludarSinNombreDevuelveMundo() throws Exception {
        mockMvc.perform(get("/api/saludar"))
                .andExpect(status().isOk())
                .andExpect(content().string("¡Hola, Edu!"));
    }

    @Test
    void saludarFormalConTitulo() throws Exception {
        mockMvc.perform(get("/api/saludar/formal").param("titulo", "Dra.").param("nombre", "Gómez"))
                .andExpect(status().isOk())
                .andExpect(content().string("Saludos cordiales, Dra. Gómez."));
    }
}