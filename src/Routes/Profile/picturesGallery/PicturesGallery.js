import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PicturesGallery.module.css";
import { decryptData } from "../../../utils/secure";

const PicturesGallery = ({ experiences }) => {
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null); // For full-screen view

  useEffect(() => {});

  const handleImageClick = (imageUrl) => {
    setSelectedImage(decryptData(imageUrl));
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  return (
    <div className={styles.fullScreen}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/profile')}>
          ← Back
        </button>
        <h2 className={styles.picturesGalleryHeading}>Picture Gallery</h2>
      </div>

      {experiences && experiences.length > 0 ? (
  <div className={styles.galleryWrapper}>
    {experiences
      .filter(exp => exp.share_experiences) //only include trips that have shared experiences
      .map((exp, index) => (
        <div key={index} className={styles.tripSection}>
          <h3 className={styles.tripTitle}>
            {exp.share_experiences?.title || "Untitled Trip"} —{" "}
            {new Date(
              exp.share_experiences?.created_at || exp.created_at
            ).toLocaleDateString()}
          </h3>

          <div className={styles.gallery}>
            {exp.share_experiences?.experience_images?.length > 0 ? (
              exp.share_experiences.experience_images.map((img, i) => (
                <div key={i} className={styles.imageCard}>
                  <img
                    src={decryptData(img.image_url)}
                    alt={`Trip ${index + 1} images ${i + 1}`}
                    className={styles.image}
                    onClick={() => handleImageClick(img.image_url)}
                  />
                </div>
              ))
            ) : (
              <p className={styles.noImages}>No images for this trip.</p>
            )}
          </div>
        </div>
      ))}
  </div>
      ) : (
        <p className={styles.noTrips}>No trips found.</p>
      )}

      {/* Full-screen Image View */}
      {selectedImage && (
        <div className={styles.overlay} onClick={handleClose}>
          <img
            src={selectedImage}
            alt="Full view"
            className={styles.fullImage}
          />
          <button className={styles.closeBtn} onClick={handleClose}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default PicturesGallery;
