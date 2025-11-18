package valeriodifelice.HextechHub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import valeriodifelice.HextechHub.model.Article;

import java.util.List;

/** Repository JPA per Article */
@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> findByPublishedTrue();
    List<Article> findByAuthor_Id(Long authorId);
}