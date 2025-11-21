package com.hextechhub.article.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// DTO per creazione articolo
public class ArticleRequest {
    @NotBlank
    @Size(max = 255)
    private String title;

    @NotBlank
    private String content;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}