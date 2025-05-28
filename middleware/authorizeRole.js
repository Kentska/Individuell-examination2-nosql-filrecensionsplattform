function authorizeRole(...allowedRoles) {
	return (req, res, next) => {
	  const user = req.user; // req.user bör sättas av din auth-middleware (t.ex. efter JWT-verifiering)
	  if (!user || !allowedRoles.includes(user.role)) {
		return res.status(403).json({ message: 'Otillräckliga rättigheter' });
	  }
	  next();
	};
  }
  
  module.exports = authorizeRole;