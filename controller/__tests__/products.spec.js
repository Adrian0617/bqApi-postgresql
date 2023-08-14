const { newDb } = require('pg-mem');
const { tearUp, addUser, tearDown, addProducts } = require('../../models/Schemas');

describe('Database Tests', () => {
  let db;

  beforeEach(async () => {
    db = newDb();
    // loadExtensions(db);
    await tearUp(db);
  });

  afterEach(async () => {
    await tearDown(db);
  });

  it('should add a user', async () => {
    const userId = await addUser(db);
    expect(userId).to.be.a('number');
  });

  it('should add a product', async () => {
    const productId = await addProducts(db);
    expect(productId).to.be.a('number');
  });
});