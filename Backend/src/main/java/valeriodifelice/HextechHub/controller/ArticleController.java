package valeriodifelice.HextechHub.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.http.CacheControl;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import valeriodifelice.HextechHub.dto.ArticleDto;
import valeriodifelice.HextechHub.dto.ArticleRequest;
import valeriodifelice.HextechHub.service.ArticleService;

import java.util.List;

/** Endpoint CRUD per articoli con controllo ruoli */
@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @GetMapping("/public")
    public ResponseEntity<List<ArticleDto>> listPublic() {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noCache())
                .body(articleService.getPublicArticles());
    }

    @GetMapping("/mine")
    public ResponseEntity<List<ArticleDto>> listMine(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(articleService.getMyArticles(user.getUsername()));
    }

    @PostMapping
    public ResponseEntity<ArticleDto> create(@Valid @RequestBody ArticleRequest request,
                                             @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(articleService.create(request, user.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArticleDto> get(@PathVariable Long id, Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream().map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_ADMIN"));
        String email = auth.getName();
        return ResponseEntity.ok(articleService.getById(id, email, isAdmin));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArticleDto> update(@PathVariable Long id,
                                             @Valid @RequestBody ArticleRequest request,
                                             Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream().map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_ADMIN"));
        String email = auth.getName();
        return ResponseEntity.ok(articleService.update(id, request, email, isAdmin));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream().map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_ADMIN"));
        String email = auth.getName();
        articleService.delete(id, email, isAdmin);
        return ResponseEntity.noContent().build();
    }
}