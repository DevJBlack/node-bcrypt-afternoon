const bcrypt = require('bcryptjs')


module.exports = {
  register: async (req, res) => {
    try {
      const db = req.app.get('db')
      const { username, password, isAdmin } = req.body

      let result = await db.get_user(username)
      let existingUser = result[0]

      if (existingUser) {
        return res.status(409).send('Username Taken')
      }

      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(password, salt)

      let registeredUser = await db.register_user(isAdmin, username, hash)
      let user = registeredUser[0]

      req.session.user = user
      res.status(201).send(req.session.user)


    } catch (error) {
      console.log('Problem',error)
      res.status(500).send(error)
    }
  },

  login: async (req, res) => {
    try {
      const db = req.app.get('db')
      const { username, password } = req.body

      let foundUser = await db.get_user(username)
      let user = foundUser[0]

      if (!user) {
        return res.status(401).send('User not found. Please register as a new user before logging in')
      }

      const isAuthenticated = bcrypt.compareSync(password, user.hash)

      if(!isAuthenticated) {
        return res.status(403).send('Incorrect password')
      }

      req.session.user = user
      res.send(req.session.user)


    } catch(error) {
      console.log('Problem',error)
      res.status(500).send(error)
    }
  },

  logout: async (req, res) => {
    try {
      req.session.destroy()
      res.sendStatus(200)
      
    } catch(error) {
      console.log('Problem',error)
      res.status(500).send(error)
    }
  }
}