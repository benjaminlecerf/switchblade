const { APIWrapper } = require('../')
const snekfetch = require('snekfetch')

const API_URL = 'https://api.darksky.net'

module.exports = class DarkSkyAPI extends APIWrapper {
  constructor () {
    super()
    this.name = 'darksky'
    this.envVars = ['DARKSKY_KEY']
  }

  // Get
  /**
   * Get a forecast informaitons
   * @param {number} lat The latitude of the location (in decimal degrees)
   * @param {number} lng The longitude of the location (in decimal degrees)
   * @param {Object} [options] The request options
   * @param {string} [options.lang='en'] The language for the summary, does not apply to units
   * @param {string} [options.units='auto'] The units to the weather conditions, see more in https://darksky.net/dev/docs#forecast-request
   * @returns {Promise<Object>} Promise with object with weather forecast info, see more in https://darksky.net/dev/docs#response-format
   */
  getForecast (lat, lng, options = {}) {
    options = Object.assign({ lang: 'en', units: 'auto' }, options)
    return this.request('/forecast', lat, lng, options)
  }

  // Default
  request (endpoint, lat, lng, queryParams = {}) {
    return snekfetch.get(`${API_URL}${endpoint}/${process.env.DARKSKY_KEY}/${lat},${lng}`).query(queryParams).then(r => r.body)
  }
}
