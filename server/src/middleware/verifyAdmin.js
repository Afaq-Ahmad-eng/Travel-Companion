export const verifyAdmin = (req, res, next) => {

 console.log("we check the admin ", req);
 
  const user = req.user; // decoded from token
  if (user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  next();
};