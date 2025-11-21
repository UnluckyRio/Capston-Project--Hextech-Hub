package com.hextechhub.article;

import org.springframework.data.jpa.repository.JpaRepository;

// Repository JPA per l'entità Article
public interface ArticleRepository extends JpaRepository<Article, Long> {
}