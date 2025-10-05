import argon from "argon2";

// Hash password
export const hashPassword = async (password) => {  
  try {
    const hash = await argon.hash(password);
    return hash;
  } catch (error) {
    throw new Error("Password hashing failed");
  }
};

// Verify password
export const verifyPassword = async (password, hashedPassword) => {
  try{
    return await argon.verify(hashedPassword, password);
  }catch(errorInVerifyPassword){
    return res.status(401).json({ message: "Invalid token" });
  }
}
