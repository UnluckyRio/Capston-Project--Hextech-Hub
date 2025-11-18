package valeriodifelice.HextechHub.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

/** DTO per esposizione articoli */
@Data
@Builder
public class ArticleDto {
    private Long id;
    private String title;
    private String content;
    private String excerpt;
    private java.util.List<String> categories;
    private boolean published;
    private String authorEmail;
    private Instant createdAt;
    private Instant updatedAt;
}