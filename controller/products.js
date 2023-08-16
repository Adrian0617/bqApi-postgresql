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

    const productJson = {
      name: req.body.name,
      price: req.body.price,
    }

    try {
      await getDb()
        .insertInto("products")
        .values(productJson)
        .executeTakeFirst();
      resp.status(200).json(productJson);
    } catch (error) {
      resp.send(error);
    }

  },
};
