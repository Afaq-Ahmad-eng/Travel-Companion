import axios from "axios";

// Function to send data to the backend server
export const sendDataToServer = async (endpoint, payload) => {
  try {
    // Send POST request to the server
    await axios.post(endpoint, payload);

  } catch (error) {
    alert("Error sending data:", error.response?.data || error.message);
    throw error; 
  }
};

// Function to fetch data from the backend server
export const fetchDataFromServer = async (endpoint) => {
  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    alert("Error fetching data:", error.response?.data || error.message);
    throw error;
  }
};
