const { db } = require("../connect");

module.exports = {
  getProducts: async (req, resp, next) => {
    try {
      // TODO: Implementa la función necesaria para traer la colección `products`
      const products = await db.selectFrom("products").selectAll().execute();
      resp.send(products);
    } catch (error) {
        // console.log(error);
    }
  },

  createProduct: async (req, resp, next) => {
    try {
      await db
        .insertInto("products")
        .values({
          name: req.body.name,
          price: req.body.price,
        })
        .executeTakeFirst();
      resp.send("created");
    } catch (error) {
    //   console.log(error);
    }
  },
};
