const jwt = require('jsonwebtoken')
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwtToken
    console.log(token)
    if (!token) {
        console.log('no token')
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log('verify failed')
        
        return res.status(401).json({ error: "Invalid token" });
      }
      console.log(decoded)
     
      req.user = decoded;
      next();
    });
  };
  module.exports = {requireAuth}