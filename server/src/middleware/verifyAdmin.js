export const verifyAdmin = (req, res, next) => {

 console.log("we check the admin ", req.admin);
 
  const admin = req.admin; // decoded from token
  if (admin.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  next();
};