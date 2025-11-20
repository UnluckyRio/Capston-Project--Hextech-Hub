package valeriodifelice.HextechHub.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.CommandLineRunner;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

import valeriodifelice.HextechHub.model.Champions;
import valeriodifelice.HextechHub.repository.ChampionRepository;

/**
 * Bean di utilità condivisi
 */
@Configuration
@EnableCaching
@EnableAsync
public class BeansConfig {

    // Property inject con default sicuro per ambienti locali
    @Value("${cors.allowed-origins:http://localhost:5173}")
    private String corsAllowedOrigins;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Legge gli origin consentiti da property; se mancante usa un elenco di default
        String originsProp = corsAllowedOrigins;
        List<String> origins = Arrays.stream(originsProp.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
        config.setAllowedOrigins(origins);

        // Metodi e header comuni
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public CommandLineRunner seedChampions(ChampionRepository repo) {
        return args -> {
            // Seed iniziale: inserisce alcuni campioni se il database è vuoto
            if (repo.count() == 0) {
                Champions a = new Champions();
                a.setName("Ahri");
                a.setRole("Mid");
                a.setPickrate(0.12);
                a.setWinrate(0.52);
                a.setBanrate(0.18);
                a.setMatches(10234);

                Champions s = new Champions();
                s.setName("Sett");
                s.setRole("Top");
                s.setPickrate(0.10);
                s.setWinrate(0.51);
                s.setBanrate(0.22);
                s.setMatches(9345);

                Champions j = new Champions();
                j.setName("Jarvan IV");
                j.setRole("Jungle");
                j.setPickrate(0.08);
                j.setWinrate(0.49);
                j.setBanrate(0.05);
                j.setMatches(8123);

                Champions l = new Champions();
                l.setName("Leona");
                l.setRole("Support");
                l.setPickrate(0.07);
                l.setWinrate(0.53);
                l.setBanrate(0.12);
                l.setMatches(7560);

                repo.saveAll(List.of(a, s, j, l));
            }
        };
    }
}