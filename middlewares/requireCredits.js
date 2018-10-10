module.exports = (req, res, next) => {
  if (req.user.credits < 1) {
    //we can determine here what status code we want to send the user. You should be specific and USE THE PROPER HTTP SPECS TO SEND THEM THE RIGHT ONE
    return res.status(403).send({ error: "Not enough credits" });
  }
  next();
};