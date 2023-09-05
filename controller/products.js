const { getDb } = require("../connect");

module.exports = {
  getProducts: async (req, resp, next) => {
    try {
      // TODO: Implementa la función necesaria para traer la colección `products`
      const products = await getDb().selectFrom("products").selectAll().execute();
      resp.send(products);
    } catch (error) {
      resp.json({ error })
    }
  },

  createProduct: async (req, resp, next) => {

    const productJson = req.body

    getDb()
    .insertInto("products")
    .values(productJson)
    .returning(['id', 'name', 'price'])
    .executeTakeFirstOrThrow()
    .then((product) => {
      resp.status(200).json(product);
    })
    .catch((error) => {
      resp.send(error);
    });



  },
};
