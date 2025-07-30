const cds = require('@sap/cds')
const axios = require('axios')
const fs = require('fs')

let settings = { username: '', password: '' }
try {
  settings = JSON.parse(fs.readFileSync('./settings.json'))
} catch (err) {
  console.warn('settings.json not found or invalid, proceeding without credentials')
}

module.exports = cds.service.impl(function () {
  this.before('CREATE', 'ODataServices', async (req) => {
    const { base_url, service_name } = req.data
    const metadataUrl = `${base_url}/${service_name}/$metadata`

    try {
      const response = await axios.get(metadataUrl, {
        auth: {
          username: settings.username,
          password: settings.password
        }
      })
      req.data.metadata_raw = response.data
    } catch (err) {
      console.error(`Failed to fetch metadata from ${metadataUrl}`, err.message)
      throw new Error('Metadata fetch failed. Check credentials or service availability.')
    }
  })
})
