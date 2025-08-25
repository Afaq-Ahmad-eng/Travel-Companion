import React, { useState } from "react";
import "./RMVPINKPK.css";
import {
  FaUsers,
  FaUserFriends,
  FaHeart,
  FaUser,
  FaHiking,
  FaSuitcaseRolling,
  FaCamera,
  FaBriefcase,
  FaMonument,
  FaWheelchair,
  FaLandmark,
  FaCalendarWeek,
  FaChartLine,
  FaSun,
  FaFire,
  FaStar,
} from "react-icons/fa";

const RMVPINKPK = () => {
  const [currentTimeframe, setCurrentTimeframe] = useState("this-month");

  //  data with traveler type info
  const placesData = {
    "this-month": [
      {
        id: 1,
        name: "Swat Valley",
        image:
          "https://www.exploria.pk/wp-content/uploads/2024/08/swat-tour-3-edited.jpg",
        description:
          "Known as the 'Switzerland of the East,' Swat Valley is famous for its stunning landscapes, lush green valleys, and historical Buddhist sites.",
        rating: 4.5,
        visits: "12K",
        increase: "+32%",
        trending: true,
        travelerTypes: ["family", "couples", "solo", "friends"],
      },
      {
        id: 2,
        name: "Naran Kaghan",
        image:
          "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/de/45/a9/naran-is-a-small-town.jpg?w=600&h=600&s=1",
        description:
          "A breathtaking valley with majestic mountains, crystal clear lakes, and lush meadows. A paradise for nature lovers and photographers.",
        rating: 4.8,
        visits: "9.5K",
        increase: "+28%",
        trending: false,
        travelerTypes: ["friends", "couples", "adventure"],
      },
      {
        id: 3,
        name: "Kumrat Valley",
        image:
          "https://republicpolicy.com/wp-content/uploads/2022/11/Kumrat-ZUFTA-2.jpg",
        description:
          "Famous for its towering mountains, lush green forests, and the stunning Panjkora River. A perfect destination for hiking and camping.",
        rating: 4.2,
        visits: "8K",
        increase: "+45%",
        trending: true,
        travelerTypes: ["adventure", "friends", "backpackers"],
      },
    ],
    "last-3-months": [
      {
        id: 4,
        name: "Malam Jabba",
        image:
          "https://pakistantravelplaces.com/wp-content/uploads/2018/11/malam-jabba-800x600.jpg",
        description:
          "The only ski resort in Pakistan with stunning views of the Hindu Kush mountain range. Offers both winter and summer activities.",
        rating: 4.3,
        visits: "7.2K",
        increase: "+22%",
        trending: false,
        travelerTypes: ["family", "friends", "adventure"],
      },
      {
        id: 5,
        name: "Lake Saiful Muluk",
        image:
          "https://res.cloudinary.com/dc60xb6rg/images/f_auto,q_auto/v1697215829/saif-ul-malook-lake_354657845/saif-ul-malook-lake_354657845.jpg?_i=AA",
        description:
          "One of the highest alpine lakes in Pakistan, known for its crystal clear water and breathtaking beauty surrounded by snow-capped peaks.",
        rating: 4.7,
        visits: "10K",
        increase: "+18%",
        trending: true,
        travelerTypes: ["couples", "friends", "photography"],
      },
      {
        id: 6,
        name: "Abbottabad",
        image:
          "https://historypak.com/wp-content/uploads/2013/07/5186fafbdbad59f501b06f61342d62f8.jpg",
        description:
          "A beautiful city surrounded by green hills, known for its pleasant climate, parks, and proximity to several tourist attractions.",
        rating: 4.0,
        visits: "6.5K",
        increase: "+15%",
        trending: false,
        travelerTypes: ["family", "solo", "business"],
      },
      {
        id: 7,
        name: "Shogran",
        image:
          "https://cdn-ilcdbib.nitrocdn.com/hCCKGofJDoZLpTNQiJzuZmgRNmeNzcsW/assets/images/optimized/rev-8c16a02/pyaraskardu.com/wp-content/uploads/2023/10/shogran-valley-900x636.jpg",
        description:
          "A beautiful plateau surrounded by dense forests and offering spectacular views of the Makra Peak and Malika Parbat.",
        rating: 4.4,
        visits: "5.8K",
        increase: "+38%",
        trending: true,
        travelerTypes: ["family", "friends", "couples"],
      },
      {
        id: 8,
        name: "Ayubia",
        image:
          "https://wwfasia.awsassets.panda.org/img/dessan_valley_693935.jpg",
        description:
          "A popular hill station and summer resort with lush green hills, hiking trails, and a national park with diverse wildlife.",
        rating: 4.1,
        visits: "5.2K",
        increase: "+25%",
        trending: false,
        travelerTypes: ["family", "solo", "elderly"],
      },
    ],
    seasonal: [
      {
        id: 9,
        name: "Chitral",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa4BRuO7eeD0_N0CuHAh3aXrDmsAdtSiaeCg&s",
        description:
          "Known for its unique culture, stunning landscapes, and the Kalash Valley with its ancient pagan traditions.",
        rating: 4.6,
        visits: "7.5K",
        increase: "+30%",
        trending: true,
        travelerTypes: ["cultural", "adventure", "photography"],
      },
      {
        id: 10,
        name: "Kalam",
        image:
          "https://www.imusafir.pk/blog/wp-content/uploads/2024/04/Mahodand-lake-kalam.jpg",
        description:
          "A stunning valley with gushing rivers, lush green hills, and traditional wooden architecture. A perfect summer getaway.",
        rating: 4.5,
        visits: "8.2K",
        increase: "+27%",
        trending: false,
        travelerTypes: ["family", "friends", "honeymoon"],
      },
      {
        id: 11,
        name: "Dir",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuwsIlvDFbYH_ClFIETcZWo4LLON_YxagMNw&s",
        description:
          "A region of breathtaking beauty with high mountains, deep valleys, and diverse cultural heritage.",
        rating: 4.3,
        visits: "6.8K",
        increase: "+20%",
        trending: false,
        travelerTypes: ["adventure", "cultural", "friends"],
      },
      {
        id: 12,
        name: "Bisham",
        image:
          "https://wpassets.graana.com/blog/wp-content/uploads/2023/09/besham-city-image.jpeg",
        description:
          "A scenic town along the Karakoram Highway, known for its beautiful landscapes and proximity to ancient archaeological sites.",
        rating: 4.0,
        visits: "5.5K",
        increase: "+18%",
        trending: false,
        travelerTypes: ["family", "solo", "historical"],
      },
    ],
  };

  const travelerTypeIcons = {
    family: <FaUsers />,
    friends: <FaUserFriends />,
    couples: <FaHeart />,
    solo: <FaUser />,
    adventure: <FaHiking />,
    backpackers: <FaSuitcaseRolling />,
    photography: <FaCamera />,
    business: <FaBriefcase />,
    cultural: <FaMonument />,
    elderly: <FaWheelchair />,
    honeymoon: <FaHeart />,
    historical: <FaLandmark />,
  };

  const travelerTypeLabels = {
    family: "Family",
    friends: "Friends",
    couples: "Couples",
    solo: "Solo",
    adventure: "Adventure",
    backpackers: "Backpackers",
    photography: "Photography",
    business: "Business",
    cultural: "Cultural",
    elderly: "Elderly Friendly",
    honeymoon: "Honeymoon",
    historical: "Historical",
  };

  const explanations = {
    "this-month":
      "See which places are trending right now with the highest number of visits in the current month.",
    "last-3-months":
      "Discover destinations with sustained popularity over the last quarter.",
    seasonal:
      "Find the best places to visit during this season based on current travel patterns.",
  };

  const renderTravelerTypes = (types) =>
    types.map((type) => (
      <span key={type} className="traveler-type">
        {travelerTypeIcons[type]}
        {travelerTypeLabels[type]}
      </span>
    ));

  const renderPlaces = (timeframe, limit = 3) => {
    const list = placesData[timeframe].slice(0, limit);
    return list.map((place) => (
      <div key={place.id} className="place-card">
        <div className="card-image">
          <img src={place.image} alt={place.name} />
          <div className="visit-count">
            <FaUsers /> <span>{place.visits} visits</span>
          </div>
        </div>
        {place.trending && (
          <div className="trending-badge">
            <FaFire /> Trending
          </div>
        )}
        <div className="card-content">
          <h3>{place.name}</h3>
          
          <div className="traveler-types">
            {renderTravelerTypes(place.travelerTypes)}
          </div>

          <p>{place.description}</p>
          <div className="card-meta">
            <div className="rating">
              <FaStar /> <span>{place.rating}</span>
            </div>
            <div>{place.increase} this month</div>
          </div>
        </div>
      </div>
    ));
  };

  const getTimeframeName = (tf) => {
    switch (tf) {
      case "this-month":
        return "This Month";
      case "last-3-months":
        return "Last 3 Months";
      case "seasonal":
        return "Seasonal";
      default:
        return "";
    }
  };

  return (
    <div className="rmvpin-kpk-container">
      <div className="container">
        <div className="section-header">
          <div className="header-content">
            <h2>Recently Most Visited Places in KPK</h2>
            <p>
              Discover the trending destinations that travelers are exploring
              right now
            </p>
          </div>
        </div>

        <div className="timeframe-explanation">
          <p id="explanation-text">
            <strong>Viewing: {getTimeframeName(currentTimeframe)}</strong> —{" "}
            {explanations[currentTimeframe]}
          </p>
        </div>

        <div className="tabs">
          <button
            className={`tab-btn ${
              currentTimeframe === "this-month" ? "active" : ""
            }`}
            onClick={() => setCurrentTimeframe("this-month")}
          >
            <FaCalendarWeek />
            <span>This Month</span>
            <small>Trending now</small>
          </button>
          <button
            className={`tab-btn ${
              currentTimeframe === "last-3-months" ? "active" : ""
            }`}
            onClick={() => setCurrentTimeframe("last-3-months")}
          >
            <FaChartLine />
            <span>Last 3 Months</span>
            <small>Sustained popularity</small>
          </button>
          <button
            className={`tab-btn ${
              currentTimeframe === "seasonal" ? "active" : ""
            }`}
            onClick={() => setCurrentTimeframe("seasonal")}
          >
            <FaSun />
            <span>Seasonal</span>
            <small>Best this season</small>
          </button>
        </div>

        <div className="places-grid">{renderPlaces(currentTimeframe)}</div>
      </div>
    </div>
  );
};

export default RMVPINKPK;
