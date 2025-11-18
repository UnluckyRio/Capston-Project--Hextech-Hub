export default function Footer() {
  return (
    <>
      <footer className="footer mt-auto py-2 bg-dark">
        <div className="container d-flex align-items-center text-light">
          <span className="small me-auto">
            Copyright © 2025 - {new Date().getFullYear()}. Valerio Di Felice
          </span>

          <span className="mx-auto text-center handcrafted-text">
            "Handcrafted with ❤️ by a Gamer, for Gamers."
          </span>

          <div className="d-flex gap-3 ms-auto">
            <a
              className="text-light"
              href="https://github.com/UnluckyRio/HexTech-Hub"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-github"></i>
            </a>
            <a
              className="text-light"
              href="https://x.com/HexTech_Hub"
              aria-label="X"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-twitter-x"></i>
            </a>
            <a
              className="text-light"
              href="https://www.youtube.com/@HexTech-Hub"
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-youtube"></i>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
