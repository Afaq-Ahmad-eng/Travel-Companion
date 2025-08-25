/*    (rating add krny se pehly)
import React from 'react';
import "./Trip.css";

function Tripdata(props) {
  return (
    <div className='t-card'>  
      <div className='t-image'>  
        <img src={props.image} alt='Trip' />
      </div>
      <h4>{props.heading}</h4>
      <p>{props.text}</p>
    </div>
  );
}

export default Tripdata; */




import React from 'react';
import "./Trip.css";
import { FaStar, FaRegStar } from "react-icons/fa"; // For star icons

function Tripdata(props) {
  // Create an array of 5 stars, fill based on rating
  const stars = Array.from({ length: 5 }, (_, index) =>
    index < props.rating ? (
      <FaStar key={index} color="#FFD700" />
    ) : (
      <FaRegStar key={index} color="#ccc" />
    )
  );

  return (
    <div className='t-card'>
      <div className='t-image'>
        <img src={props.image} alt='Trip' />
      </div>
      <h4>{props.heading}</h4>
      <p>{props.text}</p>
      <div className="t-rating">{stars}</div> {/* Rating Stars */}
    </div>
  );
}

export default Tripdata;
