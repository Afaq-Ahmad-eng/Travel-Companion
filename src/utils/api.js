import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

// Function to send data to the backend server
export const sendDataToServer = async (endpoint, payload) => {  
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
    
    }

    // const res = 
    try{
    const res = await axios.post(endpoint, dataToSend);
    return res.data;
    }catch(error){
      throw error?.response?.data
    }
  } catch (error) {
    throw error;
  }
};


// Function to fetch data from the backend server
export const fetchDataFromServer = async (endpoint) => {
  try {
    
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const putDataToServer = async (endpoint, payload) => {
  try {
    let dataToSend = payload;    

    // Detect if payload contains a File / Blob
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
      const formData = new FormData();

      for (const key in payload) {
        const val = payload[key];

        if (val === undefined || val === null) continue;

        if (Array.isArray(val)) {
          val.forEach((item) => {
            // append files/blobs or primitives directly
            formData.append(key, item);
          });
        } else if (val instanceof File || val instanceof Blob) {
          formData.append(key, val);
        } else if (typeof val === "object") {
          // non-file objects -> stringify
          formData.append(key, JSON.stringify(val));
        } else {
          formData.append(key, val);
        }
      }

      // Remove JSON header so Axios sets multipart boundary automatically
      delete axios.defaults.headers.common["Content-Type"];

      dataToSend = formData;
    } else {
      dataToSend = payload;
    }

    const res = await axios.put(endpoint, dataToSend);
    return res.data;
  } catch (error) {
    throw error;
  }
};
