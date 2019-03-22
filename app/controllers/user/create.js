// Dependencies
const mongoose = require('mongoose')
const Schema = require('../../models/users.js')
const validator = require('node-validator')

// Core
const check = validator.isObject()
  .withRequired('name', validator.isString())
  .withOptional('age', validator.isNumber())
  .withOptional('gender', validator.isString({ regex: /^male|femal$/ }))

module.exports = class Create {
  constructor (app) {
    this.app = app

    this.run()
  }

  /**
   * Data base connect
   */
  getModel (res, payload) {
    mongoose.connect('mongodb://localhost:27017/react')

    this.db = mongoose.connection
    this.db.on('error', () => {
      res.status(500).json({
        'code': 500,
        'message': 'Internal Server Error'
      })

      console.error(`[ERROR] user/create getModel() -> Connetion fail`)
    })

    const User = mongoose.model('User', Schema)
    const model = new User

    model.name = payload.name
    model.age = payload.age
    model.gender = payload.gender

    return model
  }

  /**
   * Middleware
   */
  middleware () {
    this.app.post('/user/create', validator.express(check), (req, res) => {
      try {

        // Save
        this.getModel(res, req.body).save((err, result) => {
          if (err) {
            res.status(500).json({
              'code': 500,
              'message': 'Internal Server Error'
            })

            this.db.close()
            console.error(`[ERROR] user/create middleware() -> ${err}`)
          }

          res.status(200).json(result)
        })
      } catch (e) {
        console.error(`[ERROR] user/create -> ${e}`)
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
