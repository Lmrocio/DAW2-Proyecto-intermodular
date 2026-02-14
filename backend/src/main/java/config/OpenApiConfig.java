package config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Configuracion de OpenAPI/Swagger para documentacion de la API
 */
@Configuration
public class OpenApiConfig {

    @Value("${server.port:8080}")
    private String serverPort;

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
            // Informacion de la API
            .info(new Info()
                .title("Plataforma Educativa - API REST")
                .version("1.0.0")
                .description("""
                    API REST para la Plataforma Educativa de Adultos Mayores.
                    
                    ## Autenticacion
                    
                    La mayoria de endpoints requieren autenticacion JWT. Para autenticarte:
                    
                    1. Usa el endpoint `/api/auth/login` con tus credenciales
                    2. Copia el token de la respuesta
                    3. Haz clic en el boton "Authorize" arriba
                    4. Ingresa el token en formato: `Bearer tu_token_aqui`
                    
                    ## Endpoints Publicos
                    
                    - `POST /api/auth/login` - Iniciar sesion
                    - `POST /api/auth/register` - Registrar usuario
                    - `GET /api/auth/validate` - Validar token
                    """)
                .contact(new Contact()
                    .name("Equipo de Desarrollo")
                    .email("soporte@plataforma-educativa.com")
                    .url("https://github.com/tu-usuario/plataforma-educativa"))
                .license(new License()
                    .name("MIT License")
                    .url("https://opensource.org/licenses/MIT")))

            // Servidores
            .servers(List.of(
                new Server()
                    .url("http://localhost:" + serverPort)
                    .description("Servidor de Desarrollo Local")
            ))

            // Configuracion de seguridad JWT
            .addSecurityItem(new SecurityRequirement()
                .addList(securitySchemeName))
            .components(new Components()
                .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                    .name(securitySchemeName)
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")
                    .description("Ingresa tu token JWT. Ejemplo: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")));
    }
}
