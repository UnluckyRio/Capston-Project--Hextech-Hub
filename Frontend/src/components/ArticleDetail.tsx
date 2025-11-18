import Card from "react-bootstrap/Card";
import { NavLink, useParams } from "react-router-dom";
import { ARTICLES } from "../data/articles";

export default function ArticleDetail() {
  const { id } = useParams();
  const article = ARTICLES.find((a) => a.id === id);

  if (!article) {
    return (
      <section className="home-section article-section">
        <div className="home-intro">
          <h2 className="home-title">Article Not Found</h2>
          <p>L'articolo richiesto non esiste o è stato rimosso.</p>
          <NavLink to="/Article" className="home-link">
            ← Torna agli Articles
          </NavLink>
        </div>
      </section>
    );
  }

  return (
    <section className="home-section article-section">
      <div className="home-intro">
        <h2 className="home-title">Article Detail</h2>
        <p>
          <NavLink to="/Article" className="home-link">
            Articles
          </NavLink>
          <span className="breadcrumb-sep" aria-hidden="true">
            {" "}
            ›{" "}
          </span>
          <span className="breadcrumb-current">{article.title}</span>
        </p>
      </div>

      <div className="home-cards fade-in">
        <div className="home-card-item">
          <Card className="home-card h-100">
            <Card.Header style={{ backgroundColor: "transparent" }}>
              {article.category}
            </Card.Header>
            <Card.Body>
              <div className="article-item">
                <div className="article-texts">
                  <Card.Title>{article.title}</Card.Title>
                  <Card.Text>
                    <span>{article.excerpt}</span>
                  </Card.Text>
                  <div className="article-meta" aria-label="Data pubblicazione">
                    <small>{new Date(article.date).toLocaleDateString()}</small>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </section>
  );
}
