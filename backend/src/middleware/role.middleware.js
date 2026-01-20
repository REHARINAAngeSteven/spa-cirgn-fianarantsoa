// middleware/role.middleware.js
module.exports = (...roles) => {
  return (req, res, next) => {
    //console.log('REQ.USER in role middleware:', req.user);
    //console.log('Allowed roles:', roles);
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Accès refusé : pas de rôle' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès refusé : rôle non autorisé' });
    }

    next();
  };
};
