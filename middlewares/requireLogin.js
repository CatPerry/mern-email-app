module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({error: "You must be lgoged in to create surveys"});  
  }

  next();
};