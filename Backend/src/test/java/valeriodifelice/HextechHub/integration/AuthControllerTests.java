package valeriodifelice.HextechHub.integration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

/** Test integrazione per signup/login */
@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void signupAndLogin_shouldReturnToken() throws Exception {
        String signup = "{\n" +
                "  \"email\": \"user@example.com\",\n" +
                "  \"password\": \"Password123!\",\n" +
                "  \"fullName\": \"User Test\"\n" +
                "}";

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(signup))
                .andExpect(status().isOk());

        String login = "{\n" +
                "  \"email\": \"user@example.com\",\n" +
                "  \"password\": \"Password123!\"\n" +
                "}";

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(login))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());
    }
}