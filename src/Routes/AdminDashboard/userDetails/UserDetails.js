import React from 'react';
import styles from './UserDetails.module.css';
import { decryptData } from '../../../utils/secure';

const UserDetails = ({ user, onClose, onEdit }) => {
  if (!user) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={styles.overlay}
      onClick={onClose}
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>User Details - {user.user_name || "Unknown User"}</h2>
          <button 
            onClick={onClose} 
            aria-label="Close" 
            className={styles.closeButton}
          >
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <label className={styles.label}>User ID</label>
              <div className={styles.value}>{user.id || user.user_id || "—"}</div>
            </div>

            <div className={styles.detailItem}>
              <label className={styles.label}>Name</label>
              <div className={styles.value}>{user.user_name || "—"}</div>
            </div>

            <div className={styles.detailItem}>
              <label className={styles.label}>Email</label>
              <div className={styles.value}>{user.user_email || "—"}</div>
            </div>

            <div className={styles.detailItem}>
              <label className={styles.label}>Phone Number</label>
              <div className={styles.value}>{decryptData(user.user_phoneno) || "—"}</div>
            </div>

            <div className={styles.detailItem}>
              <label className={styles.label}>Location</label>
              <div className={styles.value}>{user.user_location || "—"}</div>
            </div>

            <div className={styles.detailItem}>
              <label className={styles.label}>Role</label>
              <div className={styles.value}>
                <span className={`${styles.badge} ${styles[user.user_role]}`}>
                  {user.user_role || "—"}
                </span>
              </div>
            </div>

            <div className={styles.detailItem}>
              <label className={styles.label}>Status</label>
              <div className={styles.value}>
                <span className={`${styles.badge} ${styles[user.user_status]}`}>
                  {user.user_status || "—"}
                </span>
              </div>
            </div>

            <div className={styles.detailItem}>
              <label className={styles.label}>Joined Date</label>
              <div className={styles.value}>
                {user.user_joined ? new Date(user.user_joined).toLocaleDateString() : "—"}
              </div>
            </div>

            <div className={styles.detailItem}>
              <label className={styles.label}>Last Login</label>
              <div className={styles.value}>
                {user.last_login ? new Date(user.last_login).toLocaleString() : "Never"}
              </div>
            </div>

            {user.user_bio && (
              <div className={styles.fullWidth}>
                <label className={styles.label}>Bio</label>
                <div className={styles.bioValue}>{user.user_bio}</div>
              </div>
            )}

            {user.preferences && (
              <div className={styles.fullWidth}>
                <label className={styles.label}>Preferences</label>
                <div className={styles.value}>
                  {JSON.stringify(user.preferences, null, 2)}
                </div>
              </div>
            )}
          </div>

          <div className={styles.buttonGroup}>
            <button 
              type="button" 
              onClick={() => onEdit(user)}
              className={styles.editButton}
            >
              ✎ Edit User
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className={styles.cancelButton}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;