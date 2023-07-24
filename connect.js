const config = require('./config');
const { createKysely } = require ('@vercel/postgres-kysely');
require('dotenv').config()

// conexion entre vercel postgres y kysely
const db = createKysely({
  connectionString: process.env.POSTGRES_URL,
});

// eslint-disable-next-line no-unused-vars
const { dbUrl } = config;

async function connect() {
  // TODO: Conexión a la Base de Datos
}

module.exports = { connect,db };
