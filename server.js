const cds = require('@sap/cds')
const fs = require('fs')

let dbConfig = {}
try {
  dbConfig = JSON.parse(fs.readFileSync('./pg-db-config.json'))
  cds.env.requires.db = {
    // cds-pg expects kind "postgres"
    kind: 'postgres',
    credentials: dbConfig
  }
} catch (err) {
  console.warn('pg-db-config.json not found or invalid, falling back to default db configuration')
}

module.exports = cds.server
