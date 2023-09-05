const { adminPassword, adminEmail } = require("../config");
const { getDb } = require("../connect");
const { sql } = require("kysely");

const db = getDb()

async function setup() {

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

  await createTableProduct()
  await addAdmin()
}

async function createTableProduct() {

  await db.schema
    .createTable("products").ifNotExists()
    .addColumn('id', 'serial', (cb) => cb.primaryKey())
    .addColumn("price", "integer", (col) => col.notNull())
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("createdAt", sql`timestamp with time zone`, (cb) =>
      cb.defaultTo(sql`current_timestamp`)
    )
    .execute();

}

async function tearDown() {
  await db.schema.dropTable("users").ifExists().execute();
  await db.schema.dropTable("products").ifExists().execute();
}


async function addAdmin() {
  const getAdmin = await getDb().selectFrom('users')
  .select('email')
  .where('email', '=', adminEmail)
  .execute();
  console.log(getAdmin, "hola");
  if (getAdmin.length) return
  const user = await db
    .insertInto("users")
    .values([
      {
        "email": adminEmail,
        "password": adminPassword,
        "role": "admin",
      },
    ])
    .returning(["email", "password", "id", "role"])
    .execute();
  return user[0];
}


module.exports = {
  setup,
  addAdmin,
  tearDown,
  createTableProduct
};
