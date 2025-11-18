import { useEffect, useMemo, useReducer, useState } from "react";
import Card from "react-bootstrap/Card";
import { NavLink } from "react-router-dom";
import "../styles/Article.scss";
import { ARTICLES } from "../data/articles";
import type { ArticleCategory } from "../data/articles";

export type ArticleDto = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
};

type ArticleState = {
  items: ArticleDto[];
  loading: boolean;
  error?: string;
  submitting: boolean;
  submitError?: string;
  filter: ArticleCategory | "All";
};

type ArticleAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: ArticleDto[] }
  | { type: "FETCH_ERROR"; error: string }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS"; payload: ArticleDto }
  | { type: "SUBMIT_ERROR"; error: string }
  | { type: "SET_FILTER"; payload: ArticleState["filter"] };

export const initialArticleState: ArticleState = {
  items: [],
  loading: false,
  submitting: false,
  filter: "All",
};

export function articleReducer(
  state: ArticleState,
  action: ArticleAction
): ArticleState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: undefined };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, items: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.error };
    case "SUBMIT_START":
      return { ...state, submitting: true, submitError: undefined };
    case "SUBMIT_SUCCESS":
      return {
        ...state,
        submitting: false,
        items: [action.payload, ...state.items],
      };
    case "SUBMIT_ERROR":
      return { ...state, submitting: false, submitError: action.error };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    default:
      return state;
  }
}

function validateArticleInput(
  input: Pick<ArticleDto, "title" | "category" | "excerpt">
) {
  const errors: Partial<Record<keyof typeof input, string>> = {};
  if (!input.title?.trim()) errors.title = "Title is required";
  if (input.title && input.title.length > 255)
    errors.title = "Title too long (max 255)";
  if (!input.category?.trim()) errors.category = "Category is required";
  if (input.category && input.category.length > 255)
    errors.category = "Category too long (max 255)";
  if (!input.excerpt?.trim()) errors.excerpt = "Excerpt is required";
  return errors;
}

async function postArticle(
  input: Pick<ArticleDto, "title" | "category" | "excerpt">
): Promise<ArticleDto> {
  const res = await fetch("http://localhost:8080/api/articles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Submit failed (${res.status}): ${text || res.statusText}`);
  }

  const data = (await res.json()) as ArticleDto;
  return data;
}

async function fetchArticles(): Promise<ArticleDto[]> {
  const res = await fetch("http://localhost:8080/api/articles");
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Fetch failed (${res.status}): ${text || res.statusText}`);
  }
  const data = (await res.json()) as ArticleDto[];
  return data;
}

export default function Article() {
  const [state, dispatch] = useReducer(articleReducer, initialArticleState);

  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [excerpt, setExcerpt] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string;
    category?: string;
    excerpt?: string;
  }>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const items = await fetchArticles();
        if (!cancelled) dispatch({ type: "FETCH_SUCCESS", payload: items });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unknown error";

        const fallback = ARTICLES.map<ArticleDto>((a) => ({
          id: a.id,
          title: a.title,
          category: a.category,
          excerpt: a.excerpt,
          date: a.date,
        }));
        if (!cancelled) dispatch({ type: "FETCH_ERROR", error: msg });
        if (!cancelled) dispatch({ type: "FETCH_SUCCESS", payload: fallback });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function splitCategories(category: string): ArticleCategory[] {
    return category
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean) as ArticleCategory[];
  }

  const filtered = useMemo(() => {
    if (state.filter === "All") return state.items;
    return state.items.filter((a) =>
      splitCategories(a.category).includes(state.filter)
    );
  }, [state.items, state.filter]);

  const sorted = useMemo(() => {
    return [...filtered].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [filtered]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const categoryStr = categories.join(", ");
    const input = { title, category: categoryStr, excerpt };
    const errors = validateArticleInput(input);
    if (categories.length === 0) {
      errors.category = "Select at least one category";
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    dispatch({ type: "SUBMIT_START" });
    try {
      const created = await postArticle(input);
      dispatch({ type: "SUBMIT_SUCCESS", payload: created });

      setTitle("");
      setCategories([]);
      setExcerpt("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submit error";
      dispatch({ type: "SUBMIT_ERROR", error: msg });
    }
  }

  return (
    <section className="home-section article-section">
      <div className="home-card" style={{ padding: "0.75rem" }}>
        <h2 className="home-title">Create new article</h2>
        {state.submitError && (
          <div className="alert alert-danger" role="alert">
            {state.submitError}
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className={`form-control ${
                  fieldErrors.title ? "is-invalid" : ""
                }`}
                maxLength={255}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter the title"
              />
              {fieldErrors.title && (
                <div className="invalid-feedback">{fieldErrors.title}</div>
              )}
            </div>
            <div className="col-12 col-md-6">
              <label id="categoriesLabel" className="form-label">
                Category
              </label>
              <div
                className="category-group"
                role="radiogroup"
                aria-labelledby="categoriesLabel"
              >
                {(["News", "Meta Content", "Guides"] as ArticleCategory[]).map(
                  (cat) => {
                    const active = categories.includes(cat);
                    return (
                      <div
                        key={cat}
                        role="radio"
                        aria-checked={active}
                        tabIndex={0}
                        className={`category-pill ${active ? "active" : ""}`}
                        onClick={() => {
                          setCategories([cat]);
                          if (fieldErrors.category)
                            setFieldErrors({
                              ...fieldErrors,
                              category: undefined,
                            });
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setCategories([cat]);
                            if (fieldErrors.category)
                              setFieldErrors({
                                ...fieldErrors,
                                category: undefined,
                              });
                          }
                        }}
                      >
                        <span className="pill-text">{cat}</span>
                      </div>
                    );
                  }
                )}
              </div>
              {fieldErrors.category && (
                <div className="invalid-feedback">{fieldErrors.category}</div>
              )}
            </div>
            <div className="col-12">
              <label htmlFor="excerpt" className="form-label">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                className={`form-control ${
                  fieldErrors.excerpt ? "is-invalid" : ""
                }`}
                rows={4}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                required
                placeholder="Enter a summary..."
              />
              {fieldErrors.excerpt && (
                <div className="invalid-feedback">{fieldErrors.excerpt}</div>
              )}
            </div>
            <div className="col-12 d-flex justify-content-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={state.submitting}
              >
                {state.submitting ? "Submitting…" : "Publish"}
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="home-intro">
        <h2 className="home-title">Articles</h2>
        <p>Read News, Meta Content and Guides from the community.</p>
      </div>

      <div
        className="article-filter"
        role="group"
        aria-label="Filter articles by category"
      >
        {(["All", "News", "Meta Content", "Guides"] as const).map((cat) => {
          const active = state.filter === cat;
          return (
            <button
              key={cat}
              type="button"
              className={`filter-btn ${active ? "active" : ""}`}
              onClick={() => dispatch({ type: "SET_FILTER", payload: cat })}
              aria-pressed={active}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {state.loading && (
        <div className="loading-overlay">
          <div className="loading-surface">
            <span>Loading articles…</span>
          </div>
        </div>
      )}
      {state.error && (
        <div className="alert alert-warning" role="alert">
          {state.error} — showing local fallback data.
        </div>
      )}

      <div className="home-cards fade-in">
        {sorted.map((a) => (
          <div className="home-card-item" key={a.id}>
            <Card className="home-card h-100">
              <Card.Header style={{ backgroundColor: "transparent" }}>
                {a.category}
              </Card.Header>
              <Card.Body>
                <div className="article-item">
                  <div className="article-texts">
                    <Card.Title>
                      <NavLink to={`/Article/${a.id}`} className="home-link">
                        {a.title}
                      </NavLink>
                    </Card.Title>
                    <Card.Text>
                      <span>{a.excerpt}</span>
                    </Card.Text>
                    <div className="article-meta" aria-label="Publication date">
                      <small>{new Date(a.date).toLocaleDateString()}</small>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
