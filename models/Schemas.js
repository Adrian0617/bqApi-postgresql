const { db } = require("../connect")

async function createTables() {
    try {
      await db.schema
      .createTable('products')
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('price', 'varchar', (col) => col.notNull())
      .addColumn('name', 'varchar', (col) => col.notNull())
      .execute()  
    } catch (error) {
      // console.log("products error",error);
    }
    try {
      await db.schema
      .createTable('users')
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('name', 'varchar', (col) => col.notNull())
      .addColumn('age', 'varchar', (col) => col.notNull())
      .execute()  
    } catch (error) {
      // console.log('users errors');
    } 
    try {
      await db.schema
      .createTable('admins')
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('name', 'varchar', (col) => col.notNull())
      .addColumn('age', 'varchar', (col) => col.notNull())
      .execute()  
    } catch (error) {
      // console.log('admins errors');
    }  
  }

  module.exports = {
    createTables
  }