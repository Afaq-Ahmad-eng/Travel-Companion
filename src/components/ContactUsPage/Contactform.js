import { Formik, Form, Field, ErrorMessage } from "formik";
import "./contactform.css";
import { contactValidationSchema } from "./validationSchema";
import { sendDataToServer, fetchDataFromServer } from "../../utils/api";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect , useState} from "react";

export default function ContactForm() {
  const location = useLocation();
  const userData = location?.state?.userData || {};
  const navigate = useNavigate();
  const [userDataForReport, setUserDataForReport] = useState({});

  console.log("We are at contact Form component ", userData);
    useEffect(() => {
    const handleUserDataForReport = async () => {
      try {
        const responseFromDbForReport = await fetchDataFromServer(
          "http://localhost:3001/user/data-for-Report"
        );
        setUserDataForReport({
          userId: responseFromDbForReport?.UserData?.user_id,
          userName: responseFromDbForReport?.UserData?.user_name,
          userEmail: responseFromDbForReport?.UserData?.user_email
        })

        console.log("✅ We got response from the DB:", responseFromDbForReport);
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
      }
    };

    handleUserDataForReport();
  }, []);


  const initialValues = {
    name: userDataForReport?.userName || "",
    email: userDataForReport?.userEmail || "",
    subject: "",
    category: "",
    message: "",
    attachment: null,
  };

  const contactEndPoint = "http://localhost:3001/contact/info";
  const handleSubmit = async (values, { resetForm }) => {
    console.log("Submitted Data:", values);

    const prepareDataForComplaint = {
      userId: userDataForReport?.userId || null,
      subject: values.subject,
      description: values.message,
      category: values.category,
      attachment: values.attachment,
    };

    try {
      // You can send form data to backend using axios/fetch here
      const respo = await sendDataToServer(
        contactEndPoint,
        prepareDataForComplaint
      );
      // Success alert
      Swal.fire({
        icon: "success",
        title: "Issue Reported!",
        text: "Thank you for reporting your issue! We’ve received it and will contact you shortly through email.",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        resetForm();
        navigate("/");
      });
    } catch (contactError) {
      // Error alert
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Something went wrong while submitting your issue. Please check your details and try again.",
        confirmButtonText: "Click to correct and continue",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="form-container">
      <h1>Report an Issue</h1>

      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={contactValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, handleChange, setFieldTouched, values, isSubmitting }) => (
          <Form>
            {/* Name */}
            <Field name="name" placeholder="Name" readOnly />
            {/* <ErrorMessage name="name" component="div" className="error" /> */}

            {/* Email */}
            <Field name="email" placeholder="Email" readOnly />
            {/* <ErrorMessage name="email" component="div" className="error" /> */}

            {/* Subject */}
            <Field
              name="subject"
              placeholder="Subject"
              onChange={(value) => {
                handleChange(value);
                setFieldTouched("subject", true, false);
              }}
            />
            <ErrorMessage name="subject" component="div" className="error" />

            {/* Category */}
            <Field as="select" name="category">
              <option value="">Select Issue Type</option>
              <option value="account">Account Issue</option>
              <option value="payment">Payment or Billing</option>
              <option value="bug">Bug or Error</option>
              <option value="wrong_info">Wrong Information</option>
              <option value="complaint">Complaint about Service</option>
              <option value="other">Other</option>
            </Field>
            <ErrorMessage name="category" component="div" className="error" />

            {/* Message */}
            <Field
              as="textarea"
              name="message"
              placeholder="Describe your issue..."
              rows={7}
              onChange={(value) => {
                handleChange(value);
                setFieldTouched("message", true, false);
              }}
            />
            <ErrorMessage name="message" component="div" className="error" />

            {/* Attachment */}
            <input
              type="file"
              name="attachment"
              onChange={(event) => {
                setFieldValue("attachment", event.currentTarget.files[0]);
              }}
            />
            <ErrorMessage name="attachment" component="div" className="error" />

            {/* Submit */}
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting && <span className="button-spinner"></span>}
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
