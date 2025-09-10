// External modules
import CryptoJS from "crypto-js";
// Register a new user

const SECRET_KEY= "642c4e496cfa2dd0112023f0cb9902a3cfc91e544b84718d6010bf65ef37d701"


//Decrypt password
const decryptPassword = (decncryptedData) => {
  const bytes = CryptoJS.AES.decrypt(decncryptedData, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const registerUser = (req, res) => {
  // Registration logic here
  try {
    const { username, email, password, phoneNumber } = req.body;
    // Assume user is registered successfully
    const decryptedUsername = decryptPassword(username);
    const decryptedEmail = decryptPassword(email);
    const decryptedPassword = decryptPassword(password);
    const decryptedPhoneNumber = decryptPassword(phoneNumber);

    console.log(`We are succesfully reach to the register endpoint User registered and
      name is ${decryptedUsername} and 
      email is ${decryptedEmail} and 
      password is ${decryptedPassword} and 
      phone number is ${decryptedPhoneNumber}`);
    // res.status(201).send("User registered successfully");
    } catch (error) {
      res.status(500).send("Error registering user");
    }
};

// Login an existing user

export const loginUser = (req, res) => {
  // Login logic here
  try {
    const { email, password } = req.body;
    const DecryptedPassword = decryptPassword(password);
    // Assume user is logged in successfully
    console.log(` We reach successfully at login endpoint User logged in and 
      email is ${email} and 
      password is ${DecryptedPassword}`);
  } catch (error) {
    res.status(500).send("Error logging in user");
  }
};
