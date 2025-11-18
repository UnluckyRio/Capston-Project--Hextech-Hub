package valeriodifelice.HextechHub.service;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

/** Servizio per generazione e validazione JWT */
@Service
public class JwtService {

    @Value("${security.jwt.secret}")
    private String secret;

    @Value("${security.jwt.expiration:3600000}")
    private long expirationMs;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        final Claims claims = parseToken(token);
        return resolver.apply(claims);
    }

    public String generateToken(String username, Map<String, Object> extraClaims) {
        final Date now = new Date();
        final Date expiry = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, String username) {
        final String subject = extractUsername(token);
        return subject.equals(username) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    private Claims parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignKey() {
        String s = secret;
        if (s == null) s = "dev-default-secret-please-change-12345678901234567890";
        if (s.length() < 32) s = (s + "00000000000000000000000000000000").substring(0, 32);
        return Keys.hmacShaKeyFor(s.getBytes());
    }
}