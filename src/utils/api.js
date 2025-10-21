import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

// Function to send data to the backend server
export const sendDataToServer = async (endpoint, payload) => {  
  console.log("we are at send data to server function and we get the data from the budget manager ",payload);
  
  try {
    let dataToSend = payload;

    //Detect if payload contains a File / Blob
    const hasFile =
      payload &&
      Object.values(payload).some(
        (val) =>
          val instanceof File ||
          val instanceof Blob ||
          (Array.isArray(val) &&
            val.some((f) => f instanceof File || f instanceof Blob))
      );

    if (hasFile) {
      //Convert payload to FormData
      const formData = new FormData();
      for (const key in payload) {
        if (Array.isArray(payload[key])) {
          payload[key].forEach((item) => {
           formData.append(key, item)
          });
        } else {          
          formData.append(key, payload[key]);
        }
      }

      // Remove JSON header so Axios sets multipart boundary automatically
      delete axios.defaults.headers.common["Content-Type"];

      dataToSend = formData;
      
      // Don't set headers → axios auto sets correct multipart boundary
    } else {
      // Send JSON
      dataToSend = payload;
      console.log("we are in the send data to server function at frontend and we in the else part and we get data from teh budget manager ", dataToSend);
      
    }

    // const res = 
    const res = await axios.post(endpoint, dataToSend);
    return res.data;

  } catch (error) {
    throw error;
  }
};


// Function to fetch data from the backend server
export const fetchDataFromServer = async (endpoint) => {
      console.log("We safely Reached to the fetch data from server function");

  try {
    
    const response = await axios.get(endpoint);
    console.log("We Reached at fetch data from server function ",response);
    return response.data;
  } catch (error) {
    throw error;
  }
};
