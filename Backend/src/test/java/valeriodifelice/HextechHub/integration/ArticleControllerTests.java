package valeriodifelice.HextechHub.integration;

import static org.hamcrest.Matchers.hasSize;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Test integrazione CRUD articoli */
@SpringBootTest
@AutoConfigureMockMvc
public class ArticleControllerTests {

    @Autowired
    private MockMvc mockMvc;

    private String signupAndLogin(String email) throws Exception {
        String signup = "{\n" +
                "  \"email\": \"" + email + "\",\n" +
                "  \"password\": \"Password123!\",\n" +
                "  \"fullName\": \"User Test\"\n" +
                "}";
        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(signup))
                .andExpect(status().isOk());

        String login = "{\n" +
                "  \"email\": \"" + email + "\",\n" +
                "  \"password\": \"Password123!\"\n" +
                "}";
        String token = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(login))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        // Estrarre token semplice
        String jwt = token.replace("{\"token\":\"", "").replace("\"}", "");
        return jwt;
    }

    @Test
    void createUpdateDeleteArticle_withOwnerPermissions() throws Exception {
        String token = signupAndLogin("author@example.com");

        String body = "{\n" +
                "  \"title\": \"Titolo\",\n" +
                "  \"content\": \"Contenuto\",\n" +
                "  \"published\": false\n" +
                "}";

        String created = mockMvc.perform(post("/api/articles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(body))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // recupera id via JSON
        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
        java.util.Map<?,?> createdJson = mapper.readValue(created, java.util.Map.class);
        Long id = ((Number) createdJson.get("id")).longValue();

        String update = "{\n" +
                "  \"title\": \"Nuovo Titolo\",\n" +
                "  \"content\": \"Nuovo Contenuto\",\n" +
                "  \"published\": true\n" +
                "}";
        mockMvc.perform(put("/api/articles/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(update))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.published").value(true));

        mockMvc.perform(get("/api/articles/public"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));

        mockMvc.perform(delete("/api/articles/" + id)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());
    }
}