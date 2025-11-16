import "./Footer.css"
import { Link, useNavigate, useLocation } from "react-router-dom";


export default function Footer() {

     const navigate = useNavigate();
     const location = useLocation();

     const handleScrollLink = (sectionId, tab = "this-month") => {
    if (location.pathname === "/") {
      // Already on Home — scroll directly
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        // Also update tab via event or state (we’ll handle that in RMVPINKPK)
        window.dispatchEvent(new CustomEvent("changeTab", { detail: tab }));
      }
    } else {
      // On another page — navigate to home with scroll info
      navigate(`/?scroll=${sectionId}&tab=${tab}`);
    }
  };

  // Navigate to contact page for report
  const handleIssueClick = () => {
    navigate("/contact");
  };

   return (
    <div className="footer">
        <div className="top">
            <div >
                <h1>Travel Companion</h1>
                <p>choose your favrite destination with us</p>
            </div>

            <div>
                <a href="https://www.facebook.com/profile.php?id=61562064670105" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-facebook-square"></i>
                </a>

                <a href="/">
                <i className="fa-brands fa-instagram-square"></i>
                </a>

                <a href="/">
                <i className="fa-brands fa-behance-square"></i>
                </a>

                <a href="/">
                <i className="fa-brands fa-twitter-square"></i>
                </a>
            </div>

        </div>

        <div className="bottom">
            <div id="first-part">
                <h4>Explore KPK</h4>
                <button onClick={() => handleScrollLink("rmvpk-section", "this-month")} className="MostedVisitedArea">This Month Trending Places</button>
                <button onClick={() => handleScrollLink("rmvpk-section" , "last-3-months")} className="MostedVisitedArea">Last 3 Months Sustained Popularity Places</button>
                <button onClick={() => handleScrollLink("rmvpk-section" , "seasonal")} className="MostedVisitedArea">Seasonal best this season</button>
            </div>

            <div id="second-part">
                <h4>Community</h4>
                <a href="https://github.com/Afaq-Ahmad-eng" className="footer-link-btn" target="_blank" rel="noopener noreferrer">Github</a>
                <button onClick={handleIssueClick} className="footer-link-btn">Report and Issue</button>
                {/* <a href="/">Project</a> */}
                {/* <a href="/">Twitter</a> */}
            </div>
            
            <div>
                <h4>Other</h4>
                <a href="/">Term of service</a>
                <a href="/">license</a>
                <a href="/">privacy policy</a>
                
            </div>
            
            
        </div>
      
      
    </div>
  )
}
