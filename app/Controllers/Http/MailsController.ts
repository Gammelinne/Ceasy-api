import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { DateTime } from 'luxon'
import Ws from 'App/Services/Ws'

export default class MailsController {
  /* Verify Email */
  public async verifyEmail({ params, request, response }: HttpContextContract) {
    //return '<h1>It's work</h1>'
    if (request.hasValidSignature()) {
      User.findByOrFail('email', params.email).then(async (user) => {
        if (user.emailVerifiedAt) {
          response.badRequest({ message: 'Email already verified' })
        } else {
          user.emailVerifiedAt = DateTime.now()
          await user.save().then(() => {
            Ws.io.to(user.username).emit('emailVerified')
          })
        }
      })
    }
  }
  /* Resend a verification email */
  public async resendVerificationEmail({ request, response }: HttpContextContract) {
    const { email } = request.only(['email'])
    await User.findByOrFail('email', email)
      .then(async (user) => {
        if (user.emailVerifiedAt) {
          response.badRequest({ message: 'Email already verified' })
        } else {
          user.verifyEmail()
          response.ok({ message: 'Verification email sent successfully' })
        }
      })
      .catch(() => response.notFound({ message: 'Verification email failed' }))
  }

  /* Send Email to reset user password */
  public async resetPasswordEmail({ request, response }: HttpContextContract) {
    const { email } = request.only(['email'])
    await User.findBy('email', email).then(async (user) => {
      if (user) {
        user.resetPassword()
      }
    })
    response.ok({ message: 'Password reset email sent successfully' })
  }
}
