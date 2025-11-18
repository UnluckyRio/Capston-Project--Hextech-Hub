package valeriodifelice.HextechHub.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/** DTO per creazione/aggiornamento articolo */
@Data
public class ArticleRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String content;

    private boolean published;

    // Opzionale: riassunto, se assente verrà generato dal server
    private String excerpt;

    // Opzionale: elenco categorie/tag
    private java.util.List<String> categories;
}