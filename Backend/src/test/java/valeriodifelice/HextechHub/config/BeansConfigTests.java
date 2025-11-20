package valeriodifelice.HextechHub.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.mock.web.MockHttpServletRequest;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@TestPropertySource(properties = {
        "cors.allowed-origins=http://localhost:4173"
})
class BeansConfigTests {

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    @Test
    void corsConfigurationIncludesTestOrigin() {
        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/champions/stats");
        CorsConfiguration config = corsConfigurationSource.getCorsConfiguration(req);
        assertNotNull(config);
        assertTrue(config.getAllowedOrigins().contains("http://localhost:4173"));
    }
}