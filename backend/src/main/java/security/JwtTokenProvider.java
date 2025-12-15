package security;

import model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Servicio de Tokens JWT
 *
 * Responsable de generar, validar y extraer información de tokens JWT.
 * Utiliza algoritmo HS256 (HMAC-SHA256) para firmar los tokens con jjwt.
 */
@Service
public class JwtTokenProvider {

    @Value("${jwt.secret:secret-key-for-jwt-token-generation-secure-key-12345678-extra-long-key}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}") // 24 horas por defecto
    private long jwtExpiration;

    /**
     * Generar token JWT para un usuario
     *
     * @param user Usuario para el que generar el token
     * @return Token JWT firmado
     */
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("email", user.getEmail());
        claims.put("roles", new String[]{"ROLE_" + user.getRole().toString()});
        claims.put("jti", UUID.randomUUID().toString()); // JWT ID único

        return createToken(claims, user.getUsername());
    }

    /**
     * Crear token JWT con claims personalizados
     *
     * @param claims Mapa de claims a incluir en el token
     * @param subject Asunto del token (username)
     * @return Token JWT firmado
     */
    private String createToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Extraer el username del token
     *
     * @param token Token JWT
     * @return Username contenido en el token (sub claim)
     */
    public String getUsernameFromToken(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extraer el JTI (JWT ID) del token
     *
     * @param token Token JWT
     * @return JTI único del token
     */
    public String getJtiFromToken(String token) {
        return extractClaim(token, claims -> claims.get("jti", String.class));
    }

    /**
     * Extraer la fecha de expiración del token
     *
     * @param token Token JWT
     * @return Fecha de expiración en milisegundos
     */
    public long getExpirationFromToken(String token) {
        Date expiration = extractClaim(token, Claims::getExpiration);
        return expiration != null ? expiration.getTime() : 0;
    }

    /**
     * Validar si un token es válido
     *
     * @param token Token JWT
     * @return true si el token es válido, false en caso contrario
     */
    public Boolean validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            return false;
        } catch (UnsupportedJwtException e) {
            return false;
        } catch (MalformedJwtException e) {
            return false;
        } catch (SignatureException e) {
            return false;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Extraer un claim arbitrario del token
     *
     * @param token Token JWT
     * @param claimsResolver Función para resolver el claim
     * @return Valor del claim o null
     */
    private <T> T extractClaim(String token, java.util.function.Function<Claims, T> claimsResolver) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return claimsResolver.apply(claims);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Obtener el ID de usuario del token
     *
     * @param token Token JWT
     * @return ID del usuario
     */
    public Long getUserIdFromToken(String token) {
        return extractClaim(token, claims -> claims.get("userId", Long.class));
    }

    /**
     * Obtener el email del usuario del token
     *
     * @param token Token JWT
     * @return Email del usuario
     */
    public String getEmailFromToken(String token) {
        return extractClaim(token, claims -> claims.get("email", String.class));
    }
}