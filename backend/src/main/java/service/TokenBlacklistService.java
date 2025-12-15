package security;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

/**
 * Servicio de blacklist de tokens en memoria
 * Mantiene un registro de tokens revocados (logout, refresh, etc.)
 * Limpieza automática cuando expiran (opcional)
 */
@Service
public class TokenBlacklistService {

    // Mapa de JTI -> timestamp de expiración
    private final Map<String, Long> blacklist = new HashMap<>();

    /**
     * Añadir un token a la blacklist
     * @param jti JWT ID único del token
     * @param expirationTime timestamp de expiración del token
     */
    public void addToBlacklist(String jti, long expirationTime) {
        blacklist.put(jti, expirationTime);
        cleanExpiredTokens();
    }

    /**
     * Verificar si un token está en la blacklist
     * @param jti JWT ID a verificar
     * @return true si está en la blacklist, false si no
     */
    public boolean isBlacklisted(String jti) {
        if (!blacklist.containsKey(jti)) {
            return false;
        }

        // Verificar si ya ha expirado
        Long expirationTime = blacklist.get(jti);
        if (System.currentTimeMillis() > expirationTime) {
            blacklist.remove(jti);
            return false;
        }

        return true;
    }

    /**
     * Limpiar tokens expirados de la blacklist
     */
    private void cleanExpiredTokens() {
        long currentTime = System.currentTimeMillis();
        blacklist.entrySet().removeIf(entry -> currentTime > entry.getValue());
    }

    /**
     * Obtener el tamaño actual de la blacklist
     */
    public int getSize() {
        cleanExpiredTokens();
        return blacklist.size();
    }

    /**
     * Limpiar toda la blacklist (solo para testing)
     */
    public void clear() {
        blacklist.clear();
    }
}


