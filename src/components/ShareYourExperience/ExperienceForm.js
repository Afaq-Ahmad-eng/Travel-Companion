import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaStar, FaRegStar } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { validSchema } from "./ExperienceFormValidator";
import "./ExperienceForm.css";

const ExperienceForm = () => {
  const navigate = useNavigate();

  const initialValues = {
    title: "",
    description: "",
    blog: "",
    rating: 0,
    images: [],
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log("Submitting form with values:", values); // Only logs on submit

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate API
      alert("Experience submitted successfully!");
      resetForm();
      navigate("/services");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit experience. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="experience-bg-wrapper"
      style={{
        backgroundImage: 'url("/budget2-bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="experience-form-container">
        <Formik
          initialValues={initialValues}
          validationSchema={validSchema}
          onSubmit={handleSubmit}
          validateOnMount={true}
        >
          {({
            values,
            setFieldValue,
            isSubmitting,
            errors,
            touched,
            setTouched,
          }) => {
            console.log(`Formik Errors `, errors);

            console.log(
              `Title ${values.title} Description ${values.description} and isSubmitting ${isSubmitting}`
            );

            return (
              <Form className="experience-form">
                <h2>Share Your Trip Experience</h2>

                {/* Title Field*/}
                <div className="form-group">
                  <label htmlFor="title">
                    {" "}
                    Trip Title <span className="required-field">*</span>
                  </label>
                  <Field
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Enter trip title (Trip to Kalam)..."
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="error"
                  />
                </div>

                {/* Description Filed */}
                <div className="form-group">
                  <label htmlFor="description">
                    Description <span className="required-field">*</span>
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    rows="3"
                    placeholder="Short description of the trip"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="error"
                  />
                </div>

                {/* Blog Field*/}
                <div className="form-group">
                  <label htmlFor="blog">Trip Blog (10–20 lines)</label>
                  <Field
                    as="textarea"
                    id="blog"
                    name="blog"
                    rows="15"
                    placeholder="Share your full trip story..."
                  />
                  <ErrorMessage name="blog" component="div" className="error" />
                </div>

                {/* Images Field */}
                <div className="form-group">
                  <label htmlFor="images">
                    Upload Photos (10–20){" "}
                    <span className="required-field">*</span>
                  </label>
                  <input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      if (files.length > 20) {
                        alert("Please upload no more than 20 images.");
                        return;
                      }
                      setFieldValue("images", files);
                    }}
                  />
                  <small>{values.images.length} images selected</small>
                  <ErrorMessage
                    name="images"
                    component="div"
                    className="error"
                  />
                </div>

                {/* Rating Filed */}
                <div className="form-group">
                  <label>
                    Rate Your Experience{" "}
                    <span className="required-field">*</span>
                  </label>
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={star <= values.rating ? "filled" : ""}
                        onClick={() => setFieldValue("rating", star)}
                      >
                        {star <= values.rating ? <FaStar /> : <FaRegStar />}
                      </span>
                    ))}
                  </div>
                  <ErrorMessage
                    name="rating"
                    component="div"
                    className="error"
                  />
                </div>

                {/* Submit */}
                <div className="form-actions">
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting}
                    onClick={() =>
                      setTouched({
                        title: true,
                        description: true,
                        images: true,
                        rating: true,
                      })
                    }
                  >
                    {isSubmitting ? "Submitting..." : "Submit Experience"}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>

        <div className="back-container">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/services")}
          >
            <FaArrowLeft /> Back to Services
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceForm;
