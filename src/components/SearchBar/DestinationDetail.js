// src/components/DestinationDetail/DestinationDetail.js
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DestinationDetail.css";
import destinations from "./kpdestination.json"; // update path if needed
import TripPlan from "../TripPlan/TripPlan.js";


// Weather Widget import
import WeatherWidget from "../weatherWidget/WeatherWidget.js";

// Leaflet + clustering imports
import "leaflet/dist/leaflet.css";
import "../..//leafletConfig"; // ensure leafletConfig runs before react-leaflet (adjust path based on location)
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";


export default function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const destination = destinations.find((dest) => dest.id === parseInt(id, 10));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showTripPlan, setShowTripPlan] = useState(false);

  if (!destination) {
    return (
      <div className="destination-not-found">
        <h2>Destination Not Found</h2>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  // If destination has relatedSpots (array of other spots with coordinates), use them for clustering.
  // Otherwise show just this destination marker.
  const spotsForMap = (destination.relatedSpots && destination.relatedSpots.length)
    ? destination.relatedSpots
    : [
        {
          id: destination.id,
          name: destination.name,
          region: destination.region,
          coordinates: destination.coordinates,
        },
      ];

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === (destination.images?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? (destination.images?.length || 1) - 1 : prev - 1
    );
  };

  const mapCenter = [
    destination.coordinates.lat,
    destination.coordinates.lng,
  ];

  return (
    <div className="destination-detail">
      {!showTripPlan ? (
        <>
      {/* Header Section */}
      <header className="destination-header">
        <h1>{destination.name}</h1>
        <p className="destination-subtitle">{destination.region}, {destination.district}</p>
      </header>

      {/* Main Content */}
      <div className="destination-content">
        {/* Left Side - Image Gallery */}
        <div className="image-section">
          <div className="image-gallery">
            <div className="main-image-container">
              <img 
                src={destination.images && destination.images[currentImageIndex]} 
                alt={destination.name}
                className="main-image"
              />
              <button className="nav-button prev" onClick={prevImage} aria-label="Previous image">
                ‹
              </button>
              <button className="nav-button next" onClick={nextImage} aria-label="Next image">
                ›
              </button>
              <div className="image-counter">
                {currentImageIndex + 1} / {destination.images ? destination.images.length : 1}
              </div>
            </div>
            
            <div className="thumbnail-container">
              {(destination.images || []).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${destination.name} ${index + 1}`}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Map */}
        <div className="map-section">
          <div className="map-container">
            <h3>Location Map</h3>

            <MapContainer
              center={mapCenter}
              zoom={10}
              scrollWheelZoom={false}
              style={{ height: "320px", width: "100%", borderRadius: 12 }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {/* Cluster group (works even if there is only one marker) */}
              <MarkerClusterGroup>
                {spotsForMap.map((s) => (
                  <Marker
                    key={s.id ?? `${s.coordinates.lat}-${s.coordinates.lng}`}
                    position={[s.coordinates.lat, s.coordinates.lng]}
                  >
                    <Popup>
                      <strong>{s.name}</strong><br />
                      {s.region}
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            </MapContainer>

            <div className="map-actions" style={{ marginTop: 10 }}>
              <a
                href={`https://www.google.com/maps?q=${destination.coordinates.lat},${destination.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="map-button"
              >
                Open in Google Maps
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${destination.coordinates.lat},${destination.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="map-button"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>



{/* Destination Information */}
<div className="destination-info">
  <div className="info-grid">
    {/* WEATHER WIDGET - ADDED HERE */}
    <div className="info-card full-width">
      <WeatherWidget 
        coordinates={destination.coordinates}
        destinationName={destination.name}
      />
    </div>

    <div className="info-card">
      <h3>📍 Description</h3>
      <p>{destination.description}</p>
    </div>

    <div className="info-card">
      <h3>📅 Best Time to Visit</h3>
      <p>{destination.bestTimeToVisit}</p>
    </div>

    <div className="info-card">
      <h3>🚗 Distance & Travel</h3>
      <p>From Peshawar: {destination.distanceFromPeshawar}</p>
      <p>Travel Time: {destination.travelTime}</p>
    </div>

    <div className="info-card">
      <h3>🚌 Bus Stations from Peshawar</h3>
      <ul className="bus-stations-list">
        {destination.busStationsFromPeshawar && destination.busStationsFromPeshawar.map((station, index) => (
          <li key={index}><i className="fas fa-bus" /> {station}</li>
        ))}
      </ul>
      {!destination.busStationsFromPeshawar && <p>Bus station information not available</p>}
    </div>

    <div className="info-card">
      <h3>🚙 Best Vehicle To Travel</h3>
      <div className="tags-container">
        {destination.bestVehicleTo && destination.bestVehicleTo.map((vehicle, index) => (
          <span key={index} className="vehicle-tag">{vehicle}</span>
        ))}
      </div>
      {!destination.bestVehicleTo && <p>Vehicle information not available</p>}
    </div>

    <div className="info-card">
      <h3>📄 Required Documents</h3>
      <ul className="documents-list">
        {destination.requiredDocuments && destination.requiredDocuments.map((doc, index) => (
          <li key={index}><i className="fas fa-file-alt" /> {doc}</li>
        ))}
      </ul>
      {!destination.requiredDocuments && <p>Document information not available</p>}
    </div>

    <div className="info-card">
      <h3>🎯 Popular Activities</h3>
      <div className="tags-container">
        {destination.popularActivities && destination.popularActivities.map((activity, index) => (
          <span key={index} className="activity-tag">{activity}</span>
        ))}
      </div>
    </div>

    <div className="info-card">
      <h3>🏨 Nearby Hotels</h3>
      <ul className="hotels-list">
        {destination.hotelsNearby && destination.hotelsNearby.map((hotel, index) => (
          <li key={index}>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel + ", " + destination.name)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {hotel}
            </a>
          </li>
        ))}
      </ul>
    </div>

    {/* 🏔️ Nearby Attractions */}
    <div className="info-card">
      <h3>🏔️ Nearby Attractions</h3>
      <div className="tags-container">
        {destination.nearbyAttractions && destination.nearbyAttractions.map((attraction, index) => (
          <span key={index} className="attraction-tag">{attraction}</span>
        ))}
      </div>
      {!destination.nearbyAttractions && <p>Nearby attractions information not available</p>}
    </div>

    {/* 🍽️ Food & Dining */}
    <div className="info-card">
      <h3>🍽️ Local Cuisine</h3>
      <div className="tags-container">
        {destination.localCuisine && destination.localCuisine.map((food, index) => (
          <span key={index} className="cuisine-tag">{food}</span>
        ))}
      </div>
      {!destination.localCuisine && <p>Local cuisine information not available</p>}
    </div>

    <div className="info-card">
      <h3>🍴 Nearby Restaurants</h3>
      <ul className="restaurants-list">
        {destination.restaurantsNearby && destination.restaurantsNearby.map((restaurant, index) => (
          <li key={index}>
            <i className="fas fa-utensils" /> {restaurant}
          </li>
        ))}
      </ul>
      {!destination.restaurantsNearby && <p>Restaurant information not available</p>}
    </div>

    {/* ✈️ Travel Infrastructure */}
    <div className="info-card">
      <h3>✈️ Nearest Airport</h3>
      {destination.nearestAirport && (
        <div className="airport-info">
          <p><strong>Name:</strong> {destination.nearestAirport.name}</p>
          {destination.nearestAirport.iata && (
            <p><strong>IATA Code:</strong> {destination.nearestAirport.iata}</p>
          )}
          {destination.nearestAirport.distance_km && (
            <p><strong>Distance:</strong> {destination.nearestAirport.distance_km} km</p>
          )}
          {destination.nearestAirport.elevation_m && (
            <p><strong>Elevation:</strong> {destination.nearestAirport.elevation_m} m</p>
          )}
        </div>
      )}
      {!destination.nearestAirport && <p>Airport information not available</p>}
    </div>

    <div className="info-card">
      <h3>📱 Mobile Networks</h3>
      <div className="tags-container">
        {destination.mobileNetworks && destination.mobileNetworks.map((network, index) => (
          <span key={index} className="network-tag">{network}</span>
        ))}
      </div>
      {!destination.mobileNetworks && <p>Mobile network information not available</p>}
    </div>

    <div className="info-card">
      <h3>🛣️ Road Conditions</h3>
      <p>{destination.roadCondition || "Road condition information not available"}</p>
    </div>

    <div className="info-card">
      <h3>🧭 Guides Availability</h3>
      <p>{destination.guidesAvailable ? "✅ Local guides available" : "❌ No guides available"}</p>
    </div>

    {/* Emergency & Safety */}
    <div className="info-card">
      <h3>🆘 Emergency Contacts</h3>
      {destination.emergencyContacts && (
        <div className="emergency-contacts">
          {destination.emergencyContacts.hospital && (
            <p><strong>🏥 Hospital:</strong> {destination.emergencyContacts.hospital}</p>
          )}
          {destination.emergencyContacts.police && (
            <p><strong>👮 Police:</strong> {destination.emergencyContacts.police}</p>
          )}
          {destination.emergencyContacts.touristPolice && (
            <p><strong>🚔 Tourist Police:</strong> {destination.emergencyContacts.touristPolice}</p>
          )}
          {destination.emergencyContacts.rescue1122 && (
            <p><strong>🚑 Rescue 1122:</strong> {destination.emergencyContacts.rescue1122}</p>
          )}
        </div>
      )}
      {!destination.emergencyContacts && <p>Emergency contact information not available</p>}
    </div>

    <div className="info-card">
      <h3>⚠️ Safety Notes</h3>
      <p>{destination.safetyNotes || "No specific safety notes available"}</p>
    </div>

    <div className="info-card">
      <h3>🎫 Entry Fees & Permits</h3>
      <p>{destination.entryFeePermits || "No entry fees or special permits required"}</p>
    </div>
  </div>
</div>



      <div className="back-button-container">
        {/* <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button> */}
      </div>
      <div className="back-button-container">
        <button className="plan-button" onClick={() => setShowTripPlan(true)}>
          Plan a Trip to {destination.name}
        </button>
      </div>
      </>
    ) : (
      <TripPlan onClose={() => setShowTripPlan(false)} initialDestination={destination.name} />
    )}
    </div>
  );
}