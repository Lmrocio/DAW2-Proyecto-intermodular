package com.example.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Aplicación mínima para la práctica de despliegue y generación de documentación.
 *
 */
@SpringBootApplication
@RestController
@RequestMapping("/api")
public class AplicacionSaludo {

    public static void main(String[] args) {
        SpringApplication.run(AplicacionSaludo.class, args);
    }

    /**
     * Método principal que construye un saludo simple.
     *
     * @param nombre nombre de la persona; si es nulo o vacío se usa "Edu"
     * @return saludo en texto plano
     */
    public String saludar(String nombre) {
        if (nombre == null || nombre.isBlank()) {
            nombre = "Edu";
        }
        return "¡Hola, " + nombre + "!";
    }

    /**
     * Saluda a la persona indicada por parámetro 'nombre' (query param).
     *
     * @param nombre nombre (opcional)
     * @return saludo
     */
    @GetMapping("/saludar")
    public String endpointSaludar(@RequestParam(name = "nombre", required = false) String nombre) {
        return saludar(nombre);
    }

    /**
     * Saluda formalmente usando título y nombre.
     *
     * @param titulo título (opcional)
     * @param nombre nombre (opcional)
     * @return saludo formal
     */
    @GetMapping("/saludar/formal")
    public String saludarFormal(@RequestParam(name = "titulo", required = false) String titulo,
                                @RequestParam(name = "nombre", required = false) String nombre) {
        String persona = (nombre == null || nombre.isBlank()) ? "Mundo" : nombre;
        String prefijo = (titulo == null || titulo.isBlank()) ? "" : (titulo + " ");
        return "Saludos cordiales, " + prefijo + persona + ".";
    }

    /**
     * Saluda indicando la hora aproximada del día.
     *
     * @param nombre nombre (opcional)
     * @return saludo con referencia a mañana/tarde/noche
     */
    @GetMapping("/saludar/hora")
    public String saludarPorHora(@RequestParam(name = "nombre", required = false) String nombre) {
        java.time.LocalTime ahora = java.time.LocalTime.now();
        String momento;
        int hour = ahora.getHour();
        if (hour < 12) momento = "buenos días";
        else if (hour < 20) momento = "buenas tardes";
        else momento = "buenas noches";
        return String.format("¡%s, %s!", momento, (nombre == null || nombre.isBlank()) ? "Edu" : nombre);
    }
}