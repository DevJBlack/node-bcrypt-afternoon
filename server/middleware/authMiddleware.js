
module.exports = {
  usersOnly: (req, res, next) => {
    if(!req.session.user){
      return res.status(401).send('Please log in')
    }
    next()

  },

  adminsOnly: (req,res,next) => {
    if(!req.session.isAdmin){
      return res.status(403).send('Your are not the admin')
    }
    next()
  }
}