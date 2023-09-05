
const { authenticate } = require('../controller/auth');

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
  app.post('/auth', authenticate )

    // // TODO: autenticar a la usuarix
    // // Hay que confirmar si el email y password
    // // coinciden con un user en la base de datos
    // // Si coinciden, manda un access token creado con jwt

  return nextMain();
};
