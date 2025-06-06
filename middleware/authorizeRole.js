function authorizeRole(...allowedRoles) {
	return (req, res, next) => {
	  const user = req.user; 
	  if (!user || !allowedRoles.includes(user.role)) {
		return res.status(403).json({ message: 'Du har ingen behörighet att utföra denna åtgärd' });
	  }
	  next();
	};
  }
  
  export default authorizeRole;