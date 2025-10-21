// // import { decryptData } from "../../../utils/secure";
// import styles from "./PicturesGallery.module.css";

// const PicturesGallery = ({ experiences, onBack }) => {
//   return (
//     <div className={styles.fullScreen}>
//       <div className={styles.header}>
//         <button className={styles.backBtn} onClick={onBack}>
//           ← Back
//         </button>
//         <h2>Countries Visited Gallery</h2>
//       </div>

//       {experiences && experiences.length > 0 ? (
//         <div className={styles.galleryWrapper}>
//           {experiences.map((exp, index) => (
//             <div key={index} className={styles.tripSection}>
//               <h3 className={styles.tripTitle}>
//                 {exp.title || "Untitled Trip"} - {"  "}
//                 {new Date(exp.created_at).toLocaleDateString()}
//               </h3>
//               <div className={styles.gallery}>
//                 {exp.experience_images && exp.experience_images.length > 0 ? (
//                   exp.experience_images.map((img, i) => (
//                     <div key={i} className={styles.imageCard}>
//                       <img
//                         src={img.image_url}
//                         //when we write the images as image then this will give ius warning
//                         alt={`Trip ${index + 1} images ${i + 1}`}
//                         className={styles.image}
//                       />
//                     </div>
//                   ))
//                 ) : (
//                   <p className={styles.noImages}>No images for this trip.</p>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className={styles.noData}>No trips found.</p>
//       )}
//     </div>
//   );
// };

// export default PicturesGallery;


import { useState } from "react";
import styles from "./PicturesGallery.module.css";

const PicturesGallery = ({ experiences, onBack }) => {
  console.log("We get the experience data ",experiences);
  
  const [selectedImage, setSelectedImage] = useState(null); // For full-screen view

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  return (
    <div className={styles.fullScreen}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          ← Back
        </button>
        <h2>Countries Visited Gallery</h2>
      </div>

      {experiences && experiences.length > 0 ? (
        <div className={styles.galleryWrapper}>
          {experiences.map((exp, index) => (
            <div key={index} className={styles.tripSection}>
              <h3 className={styles.tripTitle}>
                {exp.title || "Untitled Trip"} -{" "}
                {new Date(exp.created_at).toLocaleDateString()}
              </h3>

              <div className={styles.gallery}>
                {exp.experience_images && exp.experience_images.length > 0 ? (
                  exp.experience_images.map((img, i) => (
                    <div key={i} className={styles.imageCard}>
                      <img
                        src={img.image_url}
                        alt={`Trip ${index + 1} images ${i + 1}`}
                        className={styles.image}
                        onClick={() => handleImageClick(img.image_url)} // open full view
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
        <p className={styles.noData}>No trips found.</p>
      )}

      {/* Full-screen Image View */}
      {selectedImage && (
        <div className={styles.overlay} onClick={handleClose}>
          <img src={selectedImage} alt="Full view" className={styles.fullImage} />
          <button className={styles.closeBtn} onClick={handleClose}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default PicturesGallery;
