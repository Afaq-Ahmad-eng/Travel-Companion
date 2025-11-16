import { Formik, Field, Form, ErrorMessage } from 'formik';
import styles from './EditUserModal.module.css';
import { decryptData } from '../../../utils/secure';
import { editSchema } from './EditUserModalValidator';

const EditUserModal = ({
  selectedUser,
  closeEditor,
  handleSave,
  saving,
  error,
}) => {

  console.log("We are at frontend and in the edit user modal ",selectedUser);

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
            user_status: selectedUser.user_status || "active",
            user_location: selectedUser.user_location || "",
            user_password: selectedUser.user_password || "",
            user_phoneno: decryptData(selectedUser.user_phoneno) || "",
          }}
          validationSchema={editSchema}
          onSubmit={async (values) => {
            console.log("We are at frontend and in the edit user modal onSubmit ",values);
            values.user_id = selectedUser.user_id;
            await handleSave(values);
          }}
        >
          {({ 
            isSubmitting,
            handleChange,
            setFieldTouched
           }) => (
            <Form className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.label}>
                    Name
                    <Field 
                      name="user_name" 
                      className={styles.authInput} 
                      onChange={(e)=>{
                      handleChange(e);
                      setFieldTouched("user_name", true, false);
                      }}
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
                      onChange={(e)=>{
                      handleChange(e);
                      setFieldTouched("user_email", true, false);
                      }}
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
                      onChange={(e)=>{
                      handleChange(e);
                      setFieldTouched("user_phoneno", true, false);
                      }}
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
                    Location
                    <Field 
                      name="user_location" 
                      className={styles.authInput} 
                      onChange={(e)=>{
                      handleChange(e);
                      setFieldTouched("user_location", true, false);
                      }}
                    />
                    <ErrorMessage 
                      name="user_location" 
                      component="div" 
                      className={styles.error} 
                    />
                  </label>
                </div>
                   
                   <div className={styles.formField}>
                  <label className={styles.label}>
                    Password
                    <Field 
                      name="user_password" 
                      className={styles.authInput} 
                      onChange={(e)=>{
                      handleChange(e);
                      setFieldTouched("user_password", true, false);
                      }}
                    />
                    <ErrorMessage 
                      name="user_password" 
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
                      onChange={(e)=>{
                      handleChange(e);
                      setFieldTouched("user_status", true, false);
                      }}
                    >
                      <option value="active">Active</option>
                      <option value="admin">Admin</option>
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