package valeriodifelice.HextechHub.service;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import valeriodifelice.HextechHub.dto.ArticleDto;
import valeriodifelice.HextechHub.dto.ArticleRequest;
import valeriodifelice.HextechHub.model.Article;
import valeriodifelice.HextechHub.model.User;
import valeriodifelice.HextechHub.repository.ArticleRepository;
import valeriodifelice.HextechHub.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

/** Servizio applicativo per articoli */
@Service
@Transactional
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    public ArticleService(ArticleRepository articleRepository, UserRepository userRepository) {
        this.articleRepository = articleRepository;
        this.userRepository = userRepository;
    }

    public ArticleDto create(ArticleRequest request, String authorEmail) {
        User author = userRepository.findByEmail(authorEmail).orElseThrow();
        String excerpt = request.getExcerpt();
        if (excerpt == null || excerpt.isBlank()) {
            String c = request.getContent();
            excerpt = c == null ? null : c.substring(0, Math.min(240, c.length()));
        }
        String categoriesCsv = request.getCategories() == null ? null : String.join(",", request.getCategories());
        Article article = Article.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .excerpt(excerpt)
                .categories(categoriesCsv)
                .published(request.isPublished())
                .author(author)
                .build();
        Article saved = articleRepository.save(article);
        return toDto(saved);
    }

    public List<ArticleDto> getPublicArticles() {
        return articleRepository.findByPublishedTrue().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ArticleDto> getMyArticles(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return articleRepository.findByAuthor_Id(user.getId()).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ArticleDto getById(Long id, String requesterEmail, boolean isAdmin) {
        Article article = articleRepository.findById(id).orElseThrow();
        if (!article.isPublished()) {
            String authorEmail = article.getAuthor().getEmail();
            if (!(isAdmin || authorEmail.equals(requesterEmail))) {
                throw new AccessDeniedException("Accesso negato");
            }
        }
        return toDto(article);
    }

    public ArticleDto update(Long id, ArticleRequest request, String requesterEmail, boolean isAdmin) {
        Article article = articleRepository.findById(id).orElseThrow();
        String authorEmail = article.getAuthor().getEmail();
        if (!(isAdmin || authorEmail.equals(requesterEmail))) {
            throw new AccessDeniedException("Accesso negato");
        }
        article.setTitle(request.getTitle());
        article.setContent(request.getContent());
        String excerpt = request.getExcerpt();
        if (excerpt == null || excerpt.isBlank()) {
            String c = request.getContent();
            excerpt = c == null ? null : c.substring(0, Math.min(240, c.length()));
        }
        article.setExcerpt(excerpt);
        String categoriesCsv = request.getCategories() == null ? null : String.join(",", request.getCategories());
        article.setCategories(categoriesCsv);
        article.setPublished(request.isPublished());
        return toDto(articleRepository.save(article));
    }

    public void delete(Long id, String requesterEmail, boolean isAdmin) {
        Article article = articleRepository.findById(id).orElseThrow();
        String authorEmail = article.getAuthor().getEmail();
        if (!(isAdmin || authorEmail.equals(requesterEmail))) {
            throw new AccessDeniedException("Accesso negato");
        }
        articleRepository.delete(article);
    }

    private ArticleDto toDto(Article article) {
        java.util.List<String> categories = null;
        if (article.getCategories() != null && !article.getCategories().isBlank()) {
            categories = java.util.Arrays.stream(article.getCategories().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();
        }
        return ArticleDto.builder()
                .id(article.getId())
                .title(article.getTitle())
                .content(article.getContent())
                .excerpt(article.getExcerpt())
                .categories(categories)
                .published(article.isPublished())
                .authorEmail(article.getAuthor().getEmail())
                .createdAt(article.getCreatedAt())
                .updatedAt(article.getUpdatedAt())
                .build();
    }
}