package com.hextechhub.article;

import com.hextechhub.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;

// Entità JPA per l'articolo
@Entity
@Table(name = "articles")
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 255)
    @Column(nullable = false)
    private String title;

    @Lob
    @NotBlank
    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    @Column
    private Instant updatedAt;

    // Autore dell'articolo
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    public Article() {}

    public Article(String title, String content, User author) {
        this.title = title;
        this.content = content;
        this.author = author;
    }

    @PreUpdate
    public void onUpdate() { this.updatedAt = Instant.now(); }

    // Getters/Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }
}