'use strict'

/*
 * adonis-auth
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const auth = require('basic-auth')
const BaseScheme = require('./Base')
const CE = require('../Exceptions')

/**
 * Authenticates a given HTTP request using [Basic Auth](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication) headers.
 *
 * @class BasicAuthScheme
 * @extends BaseScheme
 */
class BasicAuthScheme extends BaseScheme {
  /**
   * Check whether a user is logged in or
   * not.
   *
   * Consider user as successfully authenticated, if this
   * method doesn't throws an exception.
   *
   * @method check
   * @async
   *
   * @return {Boolean}
   *
   * @throws {InvalidBasicAuthException} If credentails are missing
   * @throws {UserNotFoundException}     If unable to find user with uid
   * @throws {PasswordMisMatchException} If password mismatches
   *
   * @example
   * ```js
   * try {
   *  await auth.check()
   * } catch (error) {
   *   // Missing or invalid credentials
   * }
   * ```
   */
  async check () {
    if (this.user) {
      return true
    }

    const credentials = auth(this._ctx.request.request)
    if (!credentials) {
      throw CE.InvalidBasicAuthException.invoke()
    }

    this.user = await this.validate(credentials.name, credentials.pass, true)
    return !!this.user
  }

  /**
   * Login as a user by setting basic auth header
   * before the request reaches the server.
   *
   * Adonis testing engine uses this method.
   *
   * @param  {Function}    headerFn     - Method to set the header
   * @param  {Function}    sessionFn    - Method to set the session
   * @param  {String}      username
   * @param  {String}      password
   *
   * @method clientLogin
   * @async
   *
   * @return {void}
   */
  async clientLogin (headerFn, sessionFn, username, password) {
    headerFn('authorization', `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`)
  }
}

module.exports = BasicAuthScheme
