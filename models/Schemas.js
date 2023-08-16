const { adminPassword, adminEmail } = require("../config");
const { getDb } = require("../connect");
const { sql } = require("kysely");

const db = getDb()

async function tearUp() {

  try {
    await db.schema
      .createTable("users").ifNotExists()
      .addColumn("id", "serial", (col) => col.primaryKey())
      .addColumn("email", "varchar", (col) => col.notNull().unique())
      .addColumn("password", "varchar", (col) => col.notNull())
      .addColumn("role", "varchar", (col) => col.notNull())
      .addColumn("createdAt", sql`timestamp with time zone`, (cb) =>
        cb.defaultTo(sql`current_timestamp`)
      )
      .execute();
    addUser()
  } catch (error) {
    // console.log('users errors');
  }
}

async function createTableProduct() {
  try {
    await db.schema
      .createTable("products").ifNotExists()
      .addColumn("id", "serial", (col) => col.primaryKey())
      .addColumn("price", "integer", (col) => col.notNull())
      .addColumn("name", "varchar", (col) => col.notNull())
      .addColumn("createdAt", sql`timestamp with time zone`, (cb) =>
        cb.defaultTo(sql`current_timestamp`)
      )
      .execute();
  } catch (error) {
    // console.log("products error",error);
  }
}

async function tearDown() {
  await db.schema.dropTable("users").ifExists().execute();
  await db.schema.dropTable("products").ifExists().execute();
}

async function addUser() {
  const user = await db
    .insertInto("users")
    .values([
      {
        "id": 1,
        "email": adminEmail,
        "password": adminPassword,
        "role": "admin",
      },
    ])
    .returning(["email", "password", "id", "role"])
    .execute();
  return user[0];
}

// async function addProducts() {
//   const product = await db
//     .insertInto("products")
//     .values([
//       {
//         id: "1",
//         name: "snadwich",
//         price: 2330,
//       },
//     ])
//     .returning(["id", "name"])
//     .execute();
//   return product[0].id;
// }

module.exports = {
  tearUp,
  addUser,
  tearDown,
  createTableProduct
};
