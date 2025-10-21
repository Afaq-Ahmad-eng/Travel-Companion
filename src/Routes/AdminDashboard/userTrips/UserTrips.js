import { useState, useEffect } from 'react';
import styles from './UserTrips.module.css';
import { fetchDataFromServer } from '../../../utils/api';

const UserTrips = ({ user, onClose }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, upcoming, active, completed, cancelled

  useEffect(() => {
    const fetchUserTrips = async () => {
      if (!user?.user_id) return;

      setLoading(true);
      setError(null);
      try {
        const res = await fetchDataFromServer(
          `http://localhost:3001/admin/users/${user.user_id}/trips`
        );
        console.log("Response from /admin/users/:id/trips → ", res.data);

        setTrips(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to fetch user trips', err);
        setError('Failed to load user trips');
      } finally {
        setLoading(false);
      }
    };

    fetchUserTrips();
  }, [user]);

  
  //  FILTER LOGIC HELPERS
  const today = new Date();

  const isUpcoming = (trip) => {
    if (!trip.start_date) return false;
    const start = new Date(trip.start_date);
    return start > today && trip.status?.toLowerCase() !== 'cancelled';
  };

  const isActive = (trip) => {
    if (!trip.start_date || !trip.end_date) return false;
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    return start <= today && today <= end && trip.status?.toLowerCase() !== 'cancelled';
  };

  const isCompleted = (trip) => {
    if (!trip.end_date) return false;
    const end = new Date(trip.end_date);
    return end < today || trip.status?.toLowerCase() === 'completed';
  };

  const isCancelled = (trip) => {
    return trip.status?.toLowerCase() === 'cancelled' || !!trip.cancelled_at;
  };

 
  //  MAIN FILTER FUNCTION
 
  const getFilteredTrips = () => {
    switch (filter) {
      case 'upcoming':
        return trips.filter(isUpcoming);
      case 'active':
        return trips.filter(isActive);
      case 'completed':
        return trips.filter(isCompleted);
      case 'cancelled':
        return trips.filter(isCancelled);
      default:
        return trips;
    }
  };

  const filteredTrips = getFilteredTrips();

  
  //  HELPERS FOR DISPLAY
  
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return styles.statusCompleted;
      case 'upcoming':
        return styles.statusUpcoming;
      case 'cancelled':
        return styles.statusCancelled;
      case 'active':
        return styles.statusActive;
      default:
        return styles.statusUnknown;
    }
  };

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString() : '—';

  const formatCurrency = (amount, currency = 'PKR') =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency,
    }).format(amount || 0);

  if (!user) return null;


  //  UI RENDER
  return (
    <div role="dialog" aria-modal="true" className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h2 className={styles.title}>Trips - {user.user_name || 'Unknown User'}</h2>
            <p className={styles.subtitle}>Viewing all trips for {user.user_email}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className={styles.closeButton}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          {/* FILTER CONTROLS */}
          <div className={styles.controls}>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Filter by status:</span>
              <div className={styles.filterButtons}>
                {['all', 'upcoming', 'active', 'completed', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`${styles.filterBtn} ${
                      filter === status ? styles.filterBtnActive : ''
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.stats}>
              <span className={styles.totalTrips}>Total: {trips.length} trips</span>
              {filter !== 'all' && (
                <span className={styles.filteredCount}>
                  (Showing: {filteredTrips.length})
                </span>
              )}
            </div>
          </div>

          {/* LOADING STATE */}
          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              Loading trips...
            </div>
          )}

          {/* ERROR STATE */}
          {error && !loading && <div className={styles.error}>{error}</div>}

          {/* TABLE */}
          {!loading && !error && (
            <div className={styles.tableContainer}>
              <table className={styles.tripsTable}>
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Trip Id</th>
                    <th>Trip Title</th>
                    <th>Destination</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Travelers</th>
                    <th>Total Cost</th>
                    <th>Status</th>
                    <th>Booked On</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrips.map((trip) => (
                    <tr key={trip.id} className={styles.tableRow}>
                      <td>{trip.user?.user_name || '—'}</td>
                      <td>{trip.trip_id}</td>
                      <td>{trip.trip_title || 'No Title'}</td>
                      <td>
                        <div className={styles.destination}>
                          <div className={styles.destinationName}>
                            {trip.destination || 'Unknown'}
                          </div>
                          {trip.destination_country && (
                            <div className={styles.destinationCountry}>
                              {trip.destination_country}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>{formatDate(trip.start_date)}</td>
                      <td>{formatDate(trip.end_date)}</td>
                      <td>{trip.travelers_count || trip.number_of_travelers || 1}</td>
                      <td>
                        {formatCurrency(trip?.budgets?.total_amount, trip.currency)}
                      </td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${getStatusBadgeClass(trip.status)}`}
                        >
                          {trip.status || 'Unknown'}
                        </span>
                      </td>
                      <td>{formatDate(trip.created_at || trip.booked_date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredTrips.length === 0 && !loading && (
                <div className={styles.noTrips}>
                  {filter === 'all'
                    ? 'No trips found for this user.'
                    : `No ${filter} trips found.`}
                </div>
              )}
            </div>
          )}

          {/* CLOSE BUTTON */}
          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose} className={styles.closeBtn}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTrips;
