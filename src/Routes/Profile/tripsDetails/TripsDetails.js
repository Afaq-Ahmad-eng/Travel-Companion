import styles from "./TripsDetails.module.css";

const TripsTable = ({ trips, onBack }) => {
  return (
    <div className={styles.fullScreen}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          ← Back
        </button>
        <h2>Completed Trips</h2>
      </div>

      {trips && trips.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Blog</th>
              <th>Rating</th>
              <th>T.Completed Date</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip, index) => (
              <tr key={index}>
                <td data-label="Title">{trip.title}</td>
                <td data-label="Description">{trip.description}</td>
                <td data-label="Blog">{trip.blog}</td>
                <td data-label="Rating">{trip.rating}</td>
                <td data-label="Trip-Completed-dates">{new Date(trip.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.noData}>No trips found.</p>
      )}
    </div>
  );
};

export default TripsTable;
