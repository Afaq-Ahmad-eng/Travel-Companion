
import { Formik, Field, Form, ErrorMessage } from 'formik';
import styles from './EditUserModal.module.css';
import { decryptData } from '../../../utils/secure';

const EditUserModal = ({
  selectedUser,
  closeEditor,
  handleSave,
  saving,
  error,
  editSchema
}) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className={styles.authOverlay}
      onClick={closeEditor}
    >
      <div
        className={styles.authModal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Edit User</h3>
          <button 
            onClick={closeEditor} 
            aria-label="Close" 
            className={styles.closeButton}
          >
            ×
          </button>
        </div>

        <Formik
          enableReinitialize
          initialValues={{
            user_name: selectedUser.user_name || "",
            user_email: selectedUser.user_email || "",
            user_role: selectedUser.user_role || "user",
            user_status: selectedUser.user_status || "active",
            user_phoneno: decryptData(selectedUser.user_phoneno) || "",
          }}
          validationSchema={editSchema}
          onSubmit={async (values) => {
            await handleSave(values);
          }}
        >
          {({ isSubmitting }) => (
            <Form className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.label}>
                    Name
                    <Field 
                      name="user_name" 
                      className={styles.authInput} 
                    />
                    <ErrorMessage 
                      name="user_name" 
                      component="div" 
                      className={styles.error} 
                    />
                  </label>
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>
                    Email
                    <Field 
                      name="user_email" 
                      type="email" 
                      className={styles.authInput} 
                    />
                    <ErrorMessage 
                      name="user_email" 
                      component="div" 
                      className={styles.error} 
                    />
                  </label>
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>
                    Phone
                    <Field 
                      name="user_phoneno" 
                      className={styles.authInput} 
                    />
                    <ErrorMessage 
                      name="user_phoneno" 
                      component="div" 
                      className={styles.error} 
                    />
                  </label>
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>
                    Role
                    <Field 
                      name="user_role" 
                      as="select" 
                      className={styles.authInput}
                    >
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </Field>
                    <ErrorMessage 
                      name="user_role" 
                      component="div" 
                      className={styles.error} 
                    />
                  </label>
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>
                    Status
                    <Field 
                      name="user_status" 
                      as="select" 
                      className={styles.authInput}
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="pending">Pending</option>
                    </Field>
                    <ErrorMessage 
                      name="user_status" 
                      component="div" 
                      className={styles.error} 
                    />
                  </label>
                </div>

                {error && <div className={styles.formError}>{error}</div>}

                <div className={styles.buttonGroup}>
                  <button 
                    type="submit" 
                    className={styles.authBtn} 
                    disabled={saving || isSubmitting}
                  >
                    {saving || isSubmitting ? "Saving..." : "Save changes"}
                  </button>
                  <button 
                    type="button" 
                    onClick={closeEditor} 
                    className={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditUserModal;