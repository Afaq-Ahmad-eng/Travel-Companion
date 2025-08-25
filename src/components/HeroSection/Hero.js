import React from "react";
import "./Hero.css";
import { FaCalculator, FaShareAlt, FaLanguage } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Hero(props) {
  const navigate = useNavigate();

  const handleBudgetClick = () => {
    navigate("/budget");
  };

  const handleExperienceClick = () => {
    navigate("/share-experience");
  };

  const handleTranslationClick = () => {
    navigate("/pushto-urdu-translation");
  };

  return (
    <div className={props.cName}>
      <img alt="heroimage" src={props.heroImage} />
      <div className="herotext">
        <h1>{props.title}</h1>
        <p>{props.text}</p>

        {props.cName.includes("service-hero") ? (
          <div className="service-button-group">
            <a href={props.url} className={props.btnclass}>
              {props.buttontext}
            </a>

            <div className="additional-buttons">
              <button
                className="manage-budget-button"
                onClick={handleBudgetClick}
              >
                <i>
                  <FaCalculator />
                </i>
                <span>Manage Your Budget</span>
              </button>

              <button
                className="share-experience-button"
                onClick={handleExperienceClick}
              >
                <i>
                  <FaShareAlt />
                </i>
                <span>Share Your Experience</span>
              </button>

              <button
                className="translation-button"
                onClick={() => navigate("/translate")}
              >
                <i>
                  <FaLanguage />
                </i>
                <span>English to Urdu/pushto Translation</span>
              </button>
            </div>
          </div>
        ) : (
          <a href={props.url} className={props.btnclass}>
            {props.buttontext}
          </a>
        )}
      </div>
    </div>
  );
}
