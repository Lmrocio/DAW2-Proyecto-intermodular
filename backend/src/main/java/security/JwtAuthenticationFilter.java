package security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import model.User;
import service.UserService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Filtro JWT: Valida el token en cada request y construye el Authentication
 * Se ejecuta una vez por request (OncePerRequestFilter)
 */
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserService userService;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            // Extraer token del header Authorization: "Bearer <token>"
            String token = extractTokenFromRequest(request);

            if (token != null && jwtTokenProvider.validateToken(token)) {

                // Verificar que el token no esté en blacklist
                String jti = jwtTokenProvider.getJtiFromToken(token);
                if (tokenBlacklistService.isBlacklisted(jti)) {
                    // Token inválido, no hacer nada
                    filterChain.doFilter(request, response);
                    return;
                }

                // Extraer username del token
                String username = jwtTokenProvider.getUsernameFromToken(token);
                User user = userService.findByUsername(username).orElse(null);

                if (user != null && user.getIsActive()) {
                    // Construir GrantedAuthority a partir del rol del usuario
                    List<GrantedAuthority> authorities = new ArrayList<>();
                    authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().toString()));

                    // Crear Authentication
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(username, null, authorities);

                    // Guardar en SecurityContext
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            logger.error("No se pudo establecer el authentication del usuario: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Extrae el token del header Authorization
     */
    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}