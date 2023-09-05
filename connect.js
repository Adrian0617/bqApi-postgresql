const config = require('./config');
const { createKysely } = require('@vercel/postgres-kysely');
const Database = require('better-sqlite3')
require('dotenv').config()

// conexion entre vercel postgres y kysely
let db;
function getDb() {
  
  if (db) return db;

  if (process.env.NODE_ENV === 'test') {

    const { SqliteDialect, Kysely } = require('kysely')

    const dialect = new SqliteDialect({
      database: new Database('db.sqlite')
    })

    db = new Kysely({
      dialect,
    })
    return db;

  } else {
    db = createKysely({
      connectionString: process.env.POSTGRES_URL,
    });
    return db
  }
}

// eslint-disable-next-line no-unused-vars

module.exports = { getDb };
