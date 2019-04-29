const { User, Appointment } = require('../models')
const moment = require('moment')
const { Op } = require('sequelize')

class AppointmentController {
  async index(req, res) {
    const date = moment()

    const dailyAppointments = await Appointment.findAll({
      where: {
        provider_id: req.session.user.id,
        date: {
          [Op.between]: [
            date.startOf('day').format(),
            date.endOf('day').format()
          ]
        }
      },
      include: [User]
    })

    const appointments = dailyAppointments.map(ap => {
      ap.formatedDate = moment(ap.date).format('HH:mm')

      return ap
    })

    return res.render('appointments/index', { appointments })
  }

  async create(req, res) {
    const provider = await User.findByPk(req.params.provider)

    return res.render('appointments/create', { provider })
  }

  async store(req, res) {
    const { id } = req.session.user
    const { provider } = req.params
    const { date } = req.body

    await Appointment.create({
      user_id: id,
      provider_id: provider,
      date
    })

    return res.redirect('/app/dashboard')
  }
}

module.exports = new AppointmentController()
