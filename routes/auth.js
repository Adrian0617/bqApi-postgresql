const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const { getDb } = require('../connect');

const { secret } = config;

/** @module auth */
module.exports = (app, nextMain) => {
  /**
   * @name /auth
   * @description Crea token de autenticación.
   * @path {POST} /auth
   * @body {String} email Correo
   * @body {String} password Contraseña
   * @response {Object} resp
   * @response {String} resp.token Token a usar para los requests sucesivos
   * @code {200} si la autenticación es correcta
   * @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * @auth No requiere autenticación
   */
  app.post('/auth', async (req, resp, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400);
    }

    try {
      const person = await getDb()
        .selectFrom('users')
        .select(['id', 'email', 'password', 'role'])
        .where('email', '=', config.adminEmail)
        .execute();

      if (!person.length) {
        return resp.status(404).json({ error: 'User does not exist' }); // TODO: Manejar errores de autenticación
      }
      if (!password === person.password) {
        return resp.status(404).json({ error: 'Wrong password' });
      }
      const token = jwt.sign(
        { id: person[0].id, email: person[0].email, role: person[0].role },
        secret,
        { expiresIn: '1h' },
      );

      return resp.status(200).json({ token });
    } catch (error) {
      console.error(error);
    }
    // TODO: autenticar a la usuarix
    // Hay que confirmar si el email y password
    // coinciden con un user en la base de datos
    // Si coinciden, manda un access token creado con jwt

    next();
  });

  return nextMain();
};
