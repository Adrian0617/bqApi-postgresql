const { db } = require("../connect");
const { sql } = require("kysely");

async function tearUp() {
  try {
    await db.schema
      .createTable("products")
      .addColumn("id", "serial", (col) => col.primaryKey())
      .addColumn("price", "varchar", (col) => col.notNull())
      .addColumn("name", "varchar", (col) => col.notNull())
      .addColumn("createdAt", sql`timestamp with time zone`, (cb) =>
        cb.defaultTo(sql`current_timestamp`)
      )
      .execute();
    addProducts(db)
  } catch (error) {
    // console.log("products error",error);
  }
  try {
    await db.schema
      .createTable("users")
      .addColumn("id", "serial", (col) => col.primaryKey())
      .addColumn("name", "varchar", (col) => col.notNull())
      .addColumn("role", "varchar", (col) => col.notNull())
      .addColumn("createdAt", sql`timestamp with time zone`, (cb) =>
        cb.defaultTo(sql`current_timestamp`)
      )
      .execute();
    addUser(db);
  } catch (error) {
    // console.log('users errors');
  }
}

async function tearDown(db) {
  await db.schema.dropTable("users").ifExists().execute();
  await db.schema.dropTable("products").ifExists().execute();
}

async function addUser(db) {
  const user = await db
    .insertInto("users")
    .values([
      {
        name: "adrian",
        role: "admin",
      },
    ])
    .returning(["name", "role"])
    .execute();
  return user[0].id;
}

async function addProducts(db) {
  const product = await db
    .insertInto("products")
    .values([
      {
        name: "snadwich",
        price: 2330,
      },
    ])
    .returning(["id", "name"])
    .execute();
  return product[0].id;
}

module.exports = {
  tearUp,
  addUser,
  tearDown,
  addProducts
};
