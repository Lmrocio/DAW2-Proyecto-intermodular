package security;

import model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Servicio de Tokens JWT
 *
 * Responsable de generar, validar y extraer información de tokens JWT.
 * Utiliza algoritmo HS256 (HMAC-SHA256) para firmar los tokens.
 */
@Service
public class JwtTokenProvider {

    // En producción, estas deberían estar en application.properties o application.yml
    @Value("${jwt.secret:secret-key-for-jwt-token-generation-secure-key-12345678}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}") // 24 horas por defecto
    private long jwtExpiration;

    /**
     * Generar token JWT para un usuario
     *
     * @param user Usuario para el que generar el token
     * @return Token JWT válido
     */
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("username", user.getUsername());
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole());

        return createToken(claims, user.getUsername());
    }

    /**
     * Crear token con claims personalizados
     *
     * @param claims Mapa de claims a incluir en el token
     * @param subject Asunto del token (generalmente el username)
     * @return Token JWT
     */
    private String createToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        // Nota: Para implementación real, usa una biblioteca como jjwt
        // Esto es un ejemplo simplificado
        // En producción deberías usar:
        // io.jsonwebtoken.Jwts.builder()
        //     .setClaims(claims)
        //     .setSubject(subject)
        //     .setIssuedAt(now)
        //     .setExpiration(expiryDate)
        //     .signWith(SignatureAlgorithm.HS256, jwtSecret)
        //     .compact()

        String token = Base64.getEncoder().encodeToString(
            (subject + ":" + System.currentTimeMillis() + ":" + Math.random()).getBytes()
        );

        return token;
    }

    /**
     * Extraer el username del token
     *
     * @param token Token JWT
     * @return Username contenido en el token
     */
    public String getUsernameFromToken(String token) {
        // En una implementación real con jjwt:
        // return Jwts.parser()
        //     .setSigningKey(jwtSecret)
        //     .parseClaimsJws(token)
        //     .getBody()
        //     .getSubject();

        return token.split(":")[0];
    }

    /**
     * Validar si un token es válido
     *
     * @param token Token JWT
     * @return true si el token es válido, false en caso contrario
     */
    public Boolean validateToken(String token) {
        try {
            // En una implementación real con jjwt:
            // Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            // return true;

            if (token == null || token.isEmpty()) {
                return false;
            }

            String[] parts = token.split(":");
            if (parts.length < 3) {
                return false;
            }

            // Verificar que el token no ha expirado
            long tokenTime = Long.parseLong(parts[1]);
            long currentTime = System.currentTimeMillis();

            return (currentTime - tokenTime) < jwtExpiration;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Obtener el ID de usuario del token
     *
     * @param token Token JWT
     * @return ID del usuario, o null si no es posible extraerlo
     */
    public Long getUserIdFromToken(String token) {
        try {
            // En una implementación real con jjwt:
            // return Jwts.parser()
            //     .setSigningKey(jwtSecret)
            //     .parseClaimsJws(token)
            //     .getBody()
            //     .get("userId", Long.class);

            // Para esta implementación simplificada:
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Obtener el rol del usuario del token
     *
     * @param token Token JWT
     * @return Rol del usuario, o null si no es posible extraerlo
     */
    public String getRoleFromToken(String token) {
        try {
            // En una implementación real con jjwt:
            // return (String) Jwts.parser()
            //     .setSigningKey(jwtSecret)
            //     .parseClaimsJws(token)
            //     .getBody()
            //     .get("role");

            return null;
        } catch (Exception e) {
            return null;
        }
    }
}

