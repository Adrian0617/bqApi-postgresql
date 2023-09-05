const  config  = require('../config');
const { getDb } = require("../connect");
const jwt = require('jsonwebtoken');

const { secret } = config;

module.exports = {

    authenticate: async(req, resp, next)=>{
        const { email, password } = req.body;

    if (!email || !password) {
      return next(400);
    }

    try {
      const user = await getDb()
        .selectFrom('users')
        .select(['id', 'email', 'password', 'role'])
        .where('email', '=', config.adminEmail)
        .execute();

      if (!user.length) {
        return resp.status(404).json({ error: 'User does not exist' }); // TODO: Manejar errores de autenticación
      }
      if (!password === user.password) {
        return resp.status(404).json({ error: 'Wrong password' });
      }
      const token = jwt.sign(
        { id: user[0].id, email: user[0].email, role: user[0].role },
        secret,
        { expiresIn: '1h' },
      );

      return resp.status(200).json({ token });
    } catch (error) {
      throw error
    }
    // TODO: autenticar a la usuarix
    // Hay que confirmar si el email y password
    // coinciden con un user en la base de datos
    // Si coinciden, manda un access token creado con jwt
    }
}