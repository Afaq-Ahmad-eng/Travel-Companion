// Register a new user

export const registerUser = (req, res) => {
  // Registration logic here
  try {
    const { username, email, password } = req.body;
    
    res.send("User registered");
  } catch (error) {
    res.status(500).send("Error registering user");
  }
};