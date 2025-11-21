package com.hextechhub.article;

import com.hextechhub.article.dto.ArticleRequest;
import com.hextechhub.article.dto.ArticleUpdateRequest;
import com.hextechhub.user.Role;
import com.hextechhub.user.User;
import com.hextechhub.user.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// Servizio per la gestione CRUD degli articoli con controllo permessi
@Service
public class ArticleService {
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    public ArticleService(ArticleRepository articleRepository, UserRepository userRepository) {
        this.articleRepository = articleRepository;
        this.userRepository = userRepository;
    }

    public List<Article> listAll() { return articleRepository.findAll(); }

    public Article getById(Long id) { return articleRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Articolo non trovato")); }

    @Transactional
    public Article create(Authentication auth, ArticleRequest request) {
        User author = userRepository.findByEmail(auth.getName()).orElseThrow(() -> new IllegalArgumentException("Autore non trovato"));
        Article article = new Article(request.getTitle(), request.getContent(), author);
        return articleRepository.save(article);
    }

    @Transactional
    public Article update(Authentication auth, Long id, ArticleUpdateRequest request) {
        Article article = getById(id);
        User actor = userRepository.findByEmail(auth.getName()).orElseThrow();
        // Consentito solo all'autore o agli admin
        if (!article.getAuthor().getEmail().equals(actor.getEmail()) && actor.getRole() != Role.ADMIN) {
            throw new SecurityException("Non autorizzato ad aggiornare l'articolo");
        }
        article.setTitle(request.getTitle());
        article.setContent(request.getContent());
        return articleRepository.save(article);
    }

    @Transactional
    public void delete(Authentication auth, Long id) {
        Article article = getById(id);
        User actor = userRepository.findByEmail(auth.getName()).orElseThrow();
        if (!article.getAuthor().getEmail().equals(actor.getEmail()) && actor.getRole() != Role.ADMIN) {
            throw new SecurityException("Non autorizzato ad eliminare l'articolo");
        }
        articleRepository.delete(article);
    }
}