import * as yup from "yup";
import { isEnglishWords, RegExpForValidation } from "../ShareYourExperience/ExperienceFormValidator";

const TripPlanValidator = yup.object({
  trip_title: yup
      .string()
      .required("You must provide a Title!")
      .matches(RegExpForValidation, "Enter A Valid Title")
      // .test(
      //   "title",
      //   "Title must use valid English words (e.g., 'Trip with Friends').",
      // (val) => {
      //       return isEnglishWords(val);
      //     }
      // )
      ,
  destination: yup
        .string()
        .required("Destination is required")
        .matches(RegExpForValidation, "Enter A Valid Destination")
        ,// .test(
        //   "destination",
        //   "Destination must use valid English words (e.g., 'Kalam Valley or Swat').",
        // (val) => {
        //       return isEnglishWords(val);
        //     }
        // ),
  interest_areas: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one interest area"),

  start_date: yup
    .date()
    .required("Start date is required")
    .typeError("Start date is required"),

  end_date: yup
    .date()
    .required("End date is required")
    .typeError("End date is required")
    .min(yup.ref("start_date"), "End date must be after start date"),
});

export default TripPlanValidator;
