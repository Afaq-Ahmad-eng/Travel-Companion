// NearPlacesAndSeasonRec.js
import React, { useState } from "react";
import "./NearPlacesAndSeasonRec.css";
import {
  FaMapMarkerAlt,
  FaChevronDown,
  FaChevronUp,
  FaCalendarAlt,
  FaSun,
  FaSnowflake,
  FaStar,
  FaRoad,
  FaCar,
  FaCheckCircle,
  FaHiking,
  FaIdCard,
} from "react-icons/fa";

const NearPlacesAndSeasonRec = () => {
  const [showMoreNear, setShowMoreNear] = useState(false);
  const [showMoreSummer, setShowMoreSummer] = useState(false);
  const [showMoreWinter, setShowMoreWinter] = useState(false);
  const [activeSeason, setActiveSeason] = useState("summer");

  return (
    <div className="npsw-container">
      {/* Home Section */}
      <div className="npsw-home-section">
        <h2 className="npsw-section-title">
          Explore Beautiful Destinations in KPK
        </h2>

        <div className="npsw-home-content">
          {/* Near Places Section */}
          <div className="npsw-near-places">
            <h3 className="npsw-sub-title">
              <FaMapMarkerAlt /> Near Places to Peshawar
            </h3>

            <div className="npsw-places-list">
              <PlaceItem
                img="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/18/e1/a7/80/bab-e-khyber.jpg?w=900&h=500&s=1"
                title="Khyber Pass"
                desc="Historic mountain pass connecting Pakistan and Afghanistan"
                rating="4.3"
                distance="25 km from Peshawar"
                carType="Any car type suitable"
                road="Road Condition: Good"
                roadClass="npsw-road-good"
              />

              <PlaceItem
                img="https://upload.wikimedia.org/wikipedia/commons/1/10/Islamia_College_University_Peshawar_01.jpg"
                title="Islamia College"
                desc="Historic educational institution with beautiful architecture"
                rating="4.5"
                distance="5 km from Peshawar"
                carType="Any car type suitable"
                road="Road Condition: Excellent"
                roadClass="npsw-road-good"
              />

              {showMoreNear && (
                <>
                  <PlaceItem
                    img="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/07/6d/86/05/shahi-bagh-gardens.jpg?w=1200&h=-1&s=1"
                    title="Shahi Bagh"
                    desc="Beautiful garden and historical site in Peshawar"
                    rating="4.0"
                    distance="3 km from Peshawar"
                    carType="Any car type suitable"
                    road="Road Condition: Excellent"
                    roadClass="npsw-road-good"
                  />
                  <PlaceItem
                    img="https://i.ytimg.com/vi/Gwk_ncj7atU/hqdefault.jpg"
                    title="Jamrud Fort"
                    desc="Historical fort at the entrance of the Khyber Pass"
                    rating="4.2"
                    distance="18 km from Peshawar"
                    carType="Sedan or SUV recommended"
                    road="Road Condition: Fair (some rough patches)"
                    roadClass="npsw-road-fair"
                  />
                </>
              )}
            </div>

            <button
              className="npsw-see-more-btn"
              onClick={() => setShowMoreNear(!showMoreNear)}
            >
              {showMoreNear ? <FaChevronUp /> : <FaChevronDown />}
              {showMoreNear ? "See Less Places" : "See More Places"}
            </button>
          </div>

          {/* Seasonal Places Section */}
          <div className="npsw-seasonal-places">
            <h3 className="npsw-sub-title">
              <FaCalendarAlt /> Best Places for Seasonal Trips
            </h3>

            <div className="npsw-seasonal-tabs">
              <button
                className={`npsw-season-tab ${
                  activeSeason === "summer" ? "npsw-active" : ""
                }`}
                onClick={() => setActiveSeason("summer")}
              >
                <FaSun /> Summer
              </button>
              <button
                className={`npsw-season-tab ${
                  activeSeason === "winter" ? "npsw-active" : ""
                }`}
                onClick={() => setActiveSeason("winter")}
              >
                <FaSnowflake /> Winter
              </button>
            </div>

            {/* Summer */}
            {activeSeason === "summer" && (
              <div className="npsw-season-content npsw-active">
                <div className="npsw-places-list">
                  <PlaceItem
                    img="https://republicpolicy.com/wp-content/uploads/2022/11/Kumrat-ZUFTA-2.jpg"
                    title="Kumrat Valley"
                    desc="Lush green valley with pleasant summer climate"
                    rating="4.7"
                    distance="Max: 20-25°C"
                    carType="4x4 SUV highly recommended"
                    road="Road Condition: Fair (mountain roads)"
                    roadClass="npsw-road-fair"
                  />
                  <PlaceItem
                    img="https://www.imusafir.pk/blog/wp-content/uploads/2025/01/48009106011_5701de2191_b.jpeg"
                    title="Naran Kaghan"
                    desc="Beautiful valley with lakes and meadows"
                    rating="4.8"
                    distance="Max: 16-22°C"
                    carType="SUV recommended, Sedan possible"
                    road="Road Condition: Good (main highway)"
                    roadClass="npsw-road-good"
                  />
                  {showMoreSummer && (
                    <PlaceItem
                      img="https://upload.wikimedia.org/wikipedia/commons/3/33/Lake-Saiful-Malook.jpg"
                      title="Lake Saiful Muluk"
                      desc="Crystal clear alpine lake surrounded by mountains"
                      rating="4.9"
                      distance="Max: 12-18°C"
                      carType="4x4 Jeep required for last segment"
                      road="Road Condition: Poor (rocky terrain)"
                      roadClass="npsw-road-poor"
                    />
                  )}
                </div>

                <button
                  className="npsw-see-more-btn"
                  onClick={() => setShowMoreSummer(!showMoreSummer)}
                >
                  {showMoreSummer ? <FaChevronUp /> : <FaChevronDown />}
                  {showMoreSummer
                    ? "See Less Summer Places"
                    : "See More Summer Places"}
                </button>
              </div>
            )}

            {/* Winter */}
            {activeSeason === "winter" && (
              <div className="npsw-season-content npsw-active">
                <div className="npsw-places-list">
                  <PlaceItem
                    img="https://www.jasminetours.com/wp-content/uploads/2023/08/ski-resort-malam-jabba-pakistan.webp"
                    title="Malam Jabba"
                    desc="Pakistan's only ski resort with stunning views"
                    rating="4.5"
                    distance="Min: -5°C"
                    carType="4x4 SUV with snow chains essential"
                    road="Road Condition: Challenging (snowy/icy)"
                    roadClass="npsw-road-poor"
                  />
                  <PlaceItem
                    img="https://burjalswat.com/wp-content/uploads/2022/04/Screenshot_6.jpg"
                    title="Kalam"
                    desc="Winter wonderland with snow-covered landscapes"
                    rating="4.6"
                    distance="Min: -3°C"
                    carType="4WD vehicle with winter tires"
                    road="Road Condition: Fair (snow clearance varies)"
                    roadClass="npsw-road-fair"
                  />
                  {showMoreWinter && (
                    <PlaceItem
                      img="https://peacetourism.org/wp-content/uploads/2019/05/Peace-Tourism.jpg"
                      title="Swat Valley"
                      desc="Beautiful snow-covered valley in winter"
                      rating="4.7"
                      distance="Min: -2°C"
                      carType="SUV recommended, Sedan possible with caution"
                      road="Road Condition: Good (main roads cleared)"
                      roadClass="npsw-road-good"
                    />
                  )}
                </div>

                <button
                  className="npsw-see-more-btn"
                  onClick={() => setShowMoreWinter(!showMoreWinter)}
                >
                  {showMoreWinter ? <FaChevronUp /> : <FaChevronDown />}
                  {showMoreWinter
                    ? "See Less Winter Places"
                    : "See More Winter Places"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Travel Tips */}
      <div className="npsw-travel-tips">
        <h2 className="npsw-section-title">Essential Travel Tips</h2>
        <div className="npsw-tips-grid">
          <TipCard
            icon={<FaCar />}
            title="Vehicle Preparation"
            text="Ensure your vehicle is serviced and equipped with necessary tools, especially for mountain travel."
          />
          <TipCard
            icon={<FaSnowflake />}
            title="Winter Travel"
            text="Always carry snow chains, extra warm clothing, and emergency supplies when traveling in winter."
          />
          <TipCard
            icon={<FaHiking />}
            title="Hiking Essentials"
            text="Carry water, snacks, first aid kit, and proper footwear when exploring trails and natural sites."
          />
          <TipCard
            icon={<FaIdCard />}
            title="Documentation"
            text="Keep your ID documents handy as some areas may require special permits or have security checkpoints."
          />
          <TipCard
            icon={<FaIdCard />}
            title="Emergency Contacts - Swat"
            text="🚓 Police: 091-9212222 | 🚑 Rescue 1122: 1122 | ☎️ District Helpline: 0946-9240340"
          />

          <TipCard
            icon={<FaIdCard />}
            title="Emergency Contacts - Naran (Kaghan Valley)"
            text="🚓 Police: 15 | 🚑 Rescue 1122: 1122 | ☎️ Tourist Facilitation Center: 0997-430150"
          />
        </div>
      </div>
    </div>
  );
};

/* ----------------- Sub Components ----------------- */
const PlaceItem = ({
  img,
  title,
  desc,
  rating,
  distance,
  carType,
  road,
  roadClass,
}) => (
  <div className="npsw-place-item">
    <div className="npsw-place-img">
      <img src={img} alt={title} />
    </div>
    <div className="npsw-place-info">
      <h3>{title}</h3>
      <p>{desc}</p>
      <div className="npsw-place-meta">
        <div className="npsw-rating">
          <FaStar />
          <span>{rating}</span>
        </div>
        <div className="npsw-distance">
          <FaRoad />
          <span>{distance}</span>
        </div>
      </div>
      <div className="npsw-car-info">
        <div className="npsw-car-info-header">
          <FaCar />
          <span>Car Information</span>
        </div>
        <div className="npsw-car-type">
          <FaCheckCircle />
          <span>{carType}</span>
        </div>
        <div className="npsw-road-condition">
          <FaRoad />
          <span className={roadClass}>{road}</span>
        </div>
      </div>
    </div>
  </div>
);

const TipCard = ({ icon, title, text }) => (
  <div className="npsw-tip-card">
    <div className="npsw-tip-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{text}</p>
  </div>
);

export default NearPlacesAndSeasonRec;
