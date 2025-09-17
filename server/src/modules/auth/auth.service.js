// // auth.service.js
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

// // Simulated database (replace with real DB)
// const users = [];

// // Register user
// export const registerUser = async ({ username, email, password }) => {
//   const hashedPassword = await bcrypt.hash(password, 10);

//   const newUser = { id: users.length + 1, username, email, password: hashedPassword };
//   users.push(newUser);

//   return { id: newUser.id, username: newUser.username, email: newUser.email };
// };

// // Login user
// export const loginUser = async ({ email, password }) => {
//   const user = users.find((u) => u.email === email);
//   if (!user) throw new Error("User not found");

//   const isValid = await bcrypt.compare(password, user.password);
//   if (!isValid) throw new Error("Invalid credentials");

//   const token = jwt.sign({ id: user.id, email: user.email }, "secretKey", { expiresIn: "1h" });
//   return token;
// };
