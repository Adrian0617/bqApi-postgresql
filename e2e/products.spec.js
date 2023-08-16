const { app } = require("..");
const { getDb } = require("../connect");
const {  tearDown, tearUp, createTableProduct } = require("../models/Schemas");

const {
  fetch,
  fetchAsTestUser,
  fetchAsAdmin,
} = process;

beforeAll(async () => {
  await tearUp()
  await createTableProduct()
});

afterAll(async () => {
  try {
    await tearDown()
    await getDb.close()
  } catch (error) {
    console.log(error, "*************");
  }
});

describe('POST /products', () => {
  it('should fail with 401 when no auth', () => (
    fetch('/products', { method: 'POST' })
      .then((resp) => expect(resp.status).toBe(401))
  ));

  it('should fail with 403 when not admin', () => (
    fetchAsTestUser('/products', { method: 'POST' })
      .then((resp) => expect(resp.status).toBe(403))
  ));

  it('should fail with 400 when bad props', () => (
    fetchAsAdmin('/products', { method: 'POST' })
      .then((resp) => expect(resp.status).toBe(400))
  ));

  it('should create product as admin', async () => {
    const requestBody = { name: 'Test', price: 5 };
  
    try {
      const response = await fetchAsAdmin('/products', {
        method: 'POST',
        body: requestBody,
      });
  
      const responseBody = await response.json();
  
      expect(response.status).toBe(200);
      expect(typeof responseBody.id).toBe('number');
      expect(typeof responseBody.name).toBe('string');
      expect(typeof responseBody.price).toBe('number');
    } catch (error) {
      console.error(error);
    }
  });  
});

describe('GET /products',  () => {
  it('should get products with Auth', async() => {
    fetchAsTestUser('/products')
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => {
        expect(Array.isArray(json)).toBe(true);
        json.forEach((product) => {
          expect(typeof product.id).toBe('number');
          expect(typeof product.name).toBe('string');
          expect(typeof product.price).toBe('number');
        });
      })
  });
});

describe('GET /products/:productid', () => {
  it('should fail with 404 when not found', () => (
    fetchAsTestUser('/products/notarealproduct')
      .then((resp) => expect(resp.status).toBe(404))
  ));

  it('should get product with Auth', () => (
    fetchAsTestUser('/products')
      .then((resp) => {
        expect(resp.status).toBe(200);
        console.log(resp.status, "desde json");
        return resp.json();
      })
      .then((json) => {
        expect(Array.isArray(json)).toBe(true);
        expect(json.length > 0).toBe(true);
        json.forEach((product) => {
          expect(typeof product.id).toBe('number');
          expect(typeof product.name).toBe('string');
          expect(typeof product.price).toBe('number');
        });
        return fetchAsTestUser(`/products/${json[0]._id}`)
          .then((resp) => ({ resp, product: json[0] }));
      })
      .then(({ resp, product }) => {
        expect(resp.status).toBe(200);
        return resp.json().then((json) => ({ json, product }));
      })
      .then(({ json, product }) => {
        expect(json).toEqual(product);
      })
  ));
});

describe('PUT /products/:productid', () => {
  it('should fail with 401 when no auth', () => (
    fetch('/products/xxx', { method: 'PUT' })
      .then((resp) => expect(resp.status).toBe(401))
  ));

  it('should fail with 403 when not admin', () => (
    fetchAsAdmin('/products', {
      method: 'POST',
      body: { name: 'Test', price: 10 },
    })
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => fetchAsTestUser(`/products/${json._id}`, {
        method: 'PUT',
        body: { price: 20 },
      }))
      .then((resp) => expect(resp.status).toBe(403))
  ));

  it('should fail with 404 when admin and not found', () => (
    fetchAsAdmin('/products/12345678901234567890', {
      method: 'PUT',
      body: { price: 1 },
    })
      .then((resp) => expect(resp.status).toBe(404))
  ));

  it('should fail with 400 when bad props', () => (
    fetchAsAdmin('/products', {
      method: 'POST',
      body: { name: 'Test', price: 10 },
    })
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => fetchAsAdmin(`/products/${json._id}`, {
        method: 'PUT',
        body: { price: 'abc' },
      }))
      .then((resp) => expect(resp.status).toBe(400))
  ));

  it('should update product as admin', () => (
    fetchAsAdmin('/products', {
      method: 'POST',
      body: { name: 'Test', price: 10 },
    })
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => fetchAsAdmin(`/products/${json._id}`, {
        method: 'PUT',
        body: { price: 20 },
      }))
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => expect(json.price).toBe(20))
  ));
});

describe('DELETE /products/:productid', () => {
  it('should fail with 401 when no auth', () => (
    fetch('/products/xxx', { method: 'DELETE' })
      .then((resp) => expect(resp.status).toBe(401))
  ));

  it('should fail with 403 when not admin', () => (
    fetchAsAdmin('/products', {
      method: 'POST',
      body: { name: 'Test', price: 10 },
    })
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => fetchAsTestUser(`/products/${json._id}`, { method: 'DELETE' }))
      .then((resp) => expect(resp.status).toBe(403))
  ));

  it('should fail with 404 when admin and not found', () => (
    fetchAsAdmin('/products/12345678901234567890', { method: 'DELETE' })
      .then((resp) => expect(resp.status).toBe(404))
  ));

  it('should delete other product as admin', () => (
    fetchAsAdmin('/products', {
      method: 'POST',
      body: { name: 'Test', price: 10 },
    })
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then(
        ({ _id }) => fetchAsAdmin(`/products/${_id}`, { method: 'DELETE' })
          .then((resp) => ({ resp, _id })),
      )
      .then(({ resp, _id }) => {
        expect(resp.status).toBe(200);
        return fetchAsAdmin(`/products/${_id}`);
      })
      .then((resp) => expect(resp.status).toBe(404))
  ));
});
