// Core
const Schema = require('../../models/users')

module.exports = class Show {
  constructor (app, connect) {
    this.app = app
    this.User = connect.model('User', Schema)

    this.run()
  }

  /**
   * Middleware
   */
  middleware () {
    this.app.get('/user/show/:id', (req, res) => {
      try {
        if (!req.params || !req.params.id.length) {
          res.status(404).json({
            code: 404,
            message: 'Not Found'
          })
        }

        this.User.findById(req.params.id, (err, user) => {
          if(!user) {
            res.status(500).json({
              code: 500,
              message: 'Internal Server Error'
            })

            return
          }

          res.status(200).json(user)

          return
        })
      } catch (e) {
        console.error(`[ERROR] user/show/:id -> ${e}`)
        res.status(400).json({
          'code': 400,
          'message': 'Bad request'
        })
      }
    })
  }

  /**
   * Run
   */
  run () {
    this.middleware()
  }
}
