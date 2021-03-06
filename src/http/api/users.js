const { Route, EndpointUtils } = require('../../')
const { Router } = require('express')

module.exports = class Users extends Route {
  constructor (client) {
    super(client)
    this.name = 'users'
  }

  register (app) {
    const router = Router()

    // Balance
    router.get('/:userId/money', EndpointUtils.authenticate(this), EndpointUtils.handleUser(this), async (req, res) => {
      const id = req.userId
      try {
        const money = await this.client.modules.economy.balance(id)
        res.status(200).json({ id, money })
      } catch (e) {
        res.status(500).json({ error: 'Internal server error!' })
      }
    })

    // Profile
    router.get('/:userId/profile', EndpointUtils.authenticate(this), EndpointUtils.handleUser(this), async (req, res) => {
      const id = req.userId
      try {
        const { money, rep, personalText, favColor } = await this.client.modules.social.retrieveProfile(id)
        res.status(200).json({ id, money, rep, personalText, favColor })
      } catch (e) {
        res.status(500).json({ error: 'Internal server error!' })
      }
    })

    router.patch('/:userId/profile',
      EndpointUtils.authenticate(this),
      EndpointUtils.handleUser(this),
      async (req, res) => {
        const id = req.userId
        try {
          await this.client.modules.social.updateProfile(id, req.body)
          res.status(200).json({ id })
        } catch (e) {
          if (e.isJoi) return res.status(400).json({ error: e.name })
          res.status(500).json({ error: 'Internal server error!' })
        }
      })

    app.use(this.path, router)
  }
}
