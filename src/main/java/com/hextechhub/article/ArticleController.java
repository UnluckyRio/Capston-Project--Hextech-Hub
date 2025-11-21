package com.hextechhub.article;

import com.hextechhub.article.dto.ArticleRequest;
import com.hextechhub.article.dto.ArticleUpdateRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Controller REST per gestione articoli
@RestController
@RequestMapping("/api/articles")
public class ArticleController {
    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) { this.articleService = articleService; }

    @GetMapping
    public ResponseEntity<List<Article>> list() { return ResponseEntity.ok(articleService.listAll()); }

    @GetMapping("/{id}")
    public ResponseEntity<Article> get(@PathVariable Long id) { return ResponseEntity.ok(articleService.getById(id)); }

    @PostMapping
    public ResponseEntity<Article> create(Authentication auth, @Valid @RequestBody ArticleRequest request) {
        return ResponseEntity.ok(articleService.create(auth, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Article> update(Authentication auth, @PathVariable Long id, @Valid @RequestBody ArticleUpdateRequest request) {
        return ResponseEntity.ok(articleService.update(auth, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Authentication auth, @PathVariable Long id) {
        articleService.delete(auth, id);
        return ResponseEntity.noContent().build();
    }
}