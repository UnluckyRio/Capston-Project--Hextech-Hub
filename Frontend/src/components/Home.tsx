import Card from "react-bootstrap/Card";
import leagueImg1 from "../assets/img/about-league-img-1.jpg";
import leagueImg2 from "../assets/img/about-league-img-2.jpg";
import leagueImg3 from "../assets/img/about-league-img-3.jpg";
import leagueImg4 from "../assets/img/about-league-img-4.png";
import leagueImg5 from "../assets/img/about-league-img-5.png";
import leagueImg6 from "../assets/img/about-league-img-6.jpg";
import leagueImg7 from "../assets/img/about-league-img-7.png";
import leagueImg8 from "../assets/img/about-league-img-8.jpg";
import leagueImg9 from "../assets/img/about-league-img-9.jpg";
import leagueImg10 from "../assets/img/about-league-img-10.jpg";
import leagueImg11 from "../assets/img/about-league-img-11.png";
import leagueImg12 from "../assets/img/about-league-img-12.jpg";
import leagueImg13 from "../assets/img/about-league-img-13.png";
import leagueImg14 from "../assets/img/about-league-img-14.jpg";
import leagueImg15 from "../assets/img/about-league-img-15.jpg";

import "../styles/Home.scss";
import Footer from "./Footer";
import { NavLink } from "react-router-dom";
function Home() {
  return (
    <section className="home-section">
      <div className="home-intro">
        <h2 className="home-title">WHAT IS LEAGUE OF LEGENDS?</h2>
        <p>
          League of Legends is Riot's multiplayer online battle arena (M.O.B.A.)
          where two teams of five players wield powerful champions that have
          unique abilities to achieve victory.
        </p>
      </div>
      <div className="home-cards">
        <div className="home-card-item">
          <Card className="home-card h-100">
            <Card.Img
              variant="top"
              src={leagueImg1}
              alt="League of Legends - Select a Champion"
            />
            <Card.Body>
              <Card.Title>Select a Champion</Card.Title>
              <Card.Text>
                There are currently over 150 playable champions and new ones are
                added every few months. Find the best one for you!
              </Card.Text>
            </Card.Body>
          </Card>
        </div>

        <div className="home-card-item">
          <Card className="home-card h-100">
            <Card.Img
              variant="top"
              src={leagueImg2}
              alt="League of Legends - Choose your Role"
            />
            <Card.Body>
              <Card.Title>Choose your Role</Card.Title>
              <Card.Text>
                Each of the five players on a LoL team chooses a specific
                position on the map that offers its own experience and
                expectations.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>

        <div className="home-card-item">
          <Card className="home-card h-100">
            <Card.Img
              variant="top"
              src={leagueImg3}
              alt="League of Legends - Destroy the Base"
            />
            <Card.Body>
              <Card.Title>Destroy the Base</Card.Title>
              <Card.Text>
                Work together with your team to complete your ultimate goal —
                destroying the enemy Nexus, the heart of their base.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>

      <div className="home-intro">
        <h2 className="home-title">WIN MORE IN LEAGUE OF LEGENDS</h2>
        <p>
          HexTech Hub is the all-in-one gaming companion that helps players of
          all skill levels improve and climb.
        </p>
      </div>

      <div className="home-cards">
        <div className="home-card-item">
          <Card className="home-card h-100">
            <Card.Img
              variant="top"
              src={leagueImg6}
              alt="League of Legends - Champions with the Highest Win Rate"
            />
            <Card.Body>
              <Card.Title>Champions with the Highest Win Rate</Card.Title>
              <Card.Text>
                The champions with the highest win rate are those that have the
                most experience and are the most popular among players.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>

        <div className="home-card-item">
          <Card className="home-card h-100">
            <Card.Img
              variant="top"
              src={leagueImg4}
              alt="League of Legends - Best Build for your Champion"
            />
            <Card.Body>
              <Card.Title>Best Build for your Champion</Card.Title>
              <Card.Text>
                The best build for your champion is the one that maximizes your
                performance and gives you the best chances of winning.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>

        <div className="home-card-item">
          <Card className="home-card h-100">
            <Card.Img
              variant="top"
              src={leagueImg5}
              alt="League of Legends - Skill Upgrade Order and Runes"
            />
            <Card.Body>
              <Card.Title>Skill Upgrade Order and Runes</Card.Title>
              <Card.Text>
                The skill upgrade order and runes are the tools that help you
                optimize your champion's abilities and performance.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>
      <div>
        <a href="/Profile" className="home-link">
          Explore our Profile Section{" "}
          <i className="bi bi-arrow-right-short"></i>
        </a>
      </div>

      <div className="home-intro">
        <h2 className="home-title">WHAT'S DOMINATING THE META RIGHT NOW?</h2>
        <p>
          Every patch, our experts rank and recommend champions to help you
          optimize your climb in the current meta.
        </p>
      </div>
      <div className="home-cards">
        <div className="home-card-item">
          <Card className="home-card h-100">
            <Card.Img
              variant="top"
              src={leagueImg10}
              alt="League of Legends - Tier List"
            />
            <Card.Body>
              <Card.Title>Tier List</Card.Title>
              <Card.Text>
                The tier list shows the current meta and the champions that are
                currently dominating the game, based on win rate, pick/ban
                ratio, and other metrics.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>

        <div className="home-card-item">
          <Card className="home-card h-100">
            <Card.Img
              variant="top"
              src={leagueImg11}
              alt="League of Legends - Best pick for each role"
            />
            <Card.Body>
              <Card.Title>Best Pick for each Role</Card.Title>
              <Card.Text>
                The meta tier list shows the best pick for each role based on
                win rate, pick/ban ratio, and other metrics.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>

        <div className="home-card-item">
          <Card className="home-card h-100">
            <Card.Img
              variant="top"
              src={leagueImg12}
              alt="League of Legends - Analytics"
            />
            <Card.Body>
              <Card.Title>Analytics</Card.Title>
              <Card.Text>
                The meta tier list section provides detailed information on
                champion performance.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>
      <div>
        <a href="/TierList" className="home-link">
          Explore our Meta Tier List Section
          <i className="bi bi-arrow-right-short"></i>
        </a>
      </div>

      <div className="home-intro">
        <h2 className="home-title">FEATURED CHAMPIONS</h2>
        <p>
          Looking to try out a new champion? Here are some of our favorite
          recommendations!
        </p>
      </div>
      <div className="home-cards">
        <div className="home-card-item">
          <Card className="home-card h-100">
            <Card.Img
              variant="top"
              src={leagueImg15}
              alt="League of Legends - All Champions List"
            />
            <Card.Body>
              <Card.Title>All Champions List</Card.Title>
              <Card.Text>
                In the Champions section you can find a complete list of all the
                champions available in the game.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>

        <div className="home-card-item">
          <Card className="home-card h-100">
            <Card.Img
              variant="top"
              src={leagueImg13}
              alt="League of Legends - Free Rotation"
            />
            <Card.Body>
              <Card.Title>Free rotation</Card.Title>
              <Card.Text>
                The free rotation is a rotating pool of champions that are
                available for play. You can consult the free rotation to
                determine which champions are currently available for play.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>

        <div className="home-card-item">
          <Card className="home-card h-100">
            <Card.Img
              variant="top"
              src={leagueImg14}
              alt="League of Legends - Tips and Tricks"
            />
            <Card.Body>
              <Card.Title>Tips and Tricks</Card.Title>
              <Card.Text>
                In the Champions section you can find helpful "Tips and Tricks"
                for players of all levels.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>
      <div>
        <a href="/Champions" className="home-link">
          Explore all Champions
          <i className="bi bi-arrow-right-short"></i>
        </a>
      </div>

      <div className="home-intro">
        <h2 className="home-title">LEAGUE OF LEGENDS NEWS AND GUIDES</h2>
        <p>
          Stay up to date with the latest news, meta content, guides, and much
          more.
        </p>
      </div>
      <div className="home-cards">
        <div className="home-card-item">
          <Card className="home-card h-100">
            <Card.Img
              variant="top"
              src={leagueImg7}
              alt="League of Legends - News"
            />
            <Card.Body>
              <Card.Title>News</Card.Title>
              <Card.Text>
                Stay up to date with the latest news, including new patches,
                events, and more.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>

        <div className="home-card-item">
          <Card className="home-card h-100">
            <Card.Img
              variant="top"
              src={leagueImg8}
              alt="League of Legends - Meta Content"
            />
            <Card.Body>
              <Card.Title>Meta content</Card.Title>
              <Card.Text>
                Keep up to date with the latest meta content, including new
                champions, items, and more.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>

        <div className="home-card-item">
          <Card className="home-card h-100">
            <Card.Img
              variant="top"
              src={leagueImg9}
              alt="League of Legends - Guides"
            />
            <Card.Body>
              <Card.Title>Guides</Card.Title>
              <Card.Text>
                Whether you're a seasoned player or just starting out, our
                guides cover everything you need to know to get started.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>
      <div>
        <NavLink to="/Article" className="home-link">
          Explore More Articles at our Blog Section
          <i className="bi bi-arrow-right-short"></i>
        </NavLink>
      </div>

      <div className="footer-center-wrapper">
        <Footer />
      </div>
    </section>
  );
}
export default Home;
