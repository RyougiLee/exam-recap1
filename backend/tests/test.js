const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Product = require("../models/productModel");
const User = require("../models/userModel");

const products = [
  {
    "title": "Wireless Noise-Cancelling Headphones",
    "category": "Electronics",
    "description": "Premium over-ear headphones with 30-hour battery life and active noise cancellation.",
    "price": 299.99,
    "stockQuantity": 45,
    "supplier": {
      "name": "AudioTech Solutions",
      "contactEmail": "support@audiotech.com",
      "contactPhone": "+1-555-010-1234",
      "rating": 4.8
    }
  },
  {
    "title": "Mid-Century Modern Sofa",
    "category": "Furniture",
    "description": "Three-seater velvet sofa with tapered wooden legs and tufted backrest.",
    "price": 850.00,
    "stockQuantity": 12,
    "supplier": {
      "name": "CozyHome Furnishings",
      "contactEmail": "sales@cozyhome.com",
      "contactPhone": "+1-555-012-5678",
      "rating": 4.5
    }
  }
]

let token = null
let sellerToken = null
let buyerToken = null

beforeAll(async () => {
  await User.deleteMany({})
  const result = await api.post("/api/users/signup").send({
    "name": "Admin Smith",
    "email": "admin.smith@corp.com",
    "password": "$hashedPasswordAdmin123",
    "role": "Admin",
    "address": "123 Corporate Tower, Suite 500, Cityville, CA 90210",
    "lastLogin": "2025-12-03T09:30:00.000Z"
  })
  token = result.body.token

  const buyer = await api.post("/api/users/signup").send({
    "name": "Jane Buyer",
    "email": "jane.buyer@mail.net",
    "password": "$hashedPasswordBuyer456",
    "role": "Buyer",
    "address": "45 Residential Way, Apt 2B, Suburbia, NY 10015",
    "lastLogin": "2025-12-03T11:45:22.000Z"
  })
  buyerToken = buyer.body.token

  const seller = await api.post("/api/users/signup").send({
    "name": "Sam Seller",
    "email": "sam.seller@shop.co",
    "password": "$hashedPasswordSeller789",
    "role": "Seller",
    "address": "789 E-commerce Hub, Warehouse 1A, Metro City, TX 77001",
    "lastLogin": "2025-11-28T15:00:00.000Z"
  })
  sellerToken = seller.body.token
})

describe('Protected Products Routes ', () => {
  beforeEach(async () => {
    await Product.deleteMany({})
    await Promise.all([
      api.post("/api/products").set("Authorization", "Bearer " + token).send(products[0]),
      api.post("/api/products").set("Authorization", "Bearer " + token).send(products[1]),
    ])
  })

  // ---------------- GET ----------------
  it("should return all products", async () => {
    const response = await api
        .get("/api/products")
        .set("Authorization", "Bearer " + token)
        .expect(200)
        .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(products.length);
  })

  // ---------------- GET by ID ----------------
  it("should return one product by ID", async () => {
    const product = await Product.findOne();
    const response = await api
        .get(`/api/products/${product._id}`)
        .set("Authorization", "Bearer " + token)
        .expect(200)
        .expect("Content-Type", /application\/json/);

    expect(response.body.title).toBe(product.title);
  });

  // ---------------- PUT ----------------
  it("should update one product by ID", async () => {
    const product = await Product.findOne();
    const updatedProduct = { category: "Updated product category.", price: 2000 };

    const response = await api
        .put(`/api/products/${product._id}`)
        .set("Authorization", "Bearer " + token)
        .send(updatedProduct)
        .expect(200)
        .expect("Content-Type", /application\/json/);

    expect(response.body.category).toBe(updatedProduct.category);

    const updatedTourCheck = await Product.findById(product._id);
    expect(updatedTourCheck.price).toBe(updatedProduct.price);
  });

  it("should return 401 if no token is provided", async () => {

  });

  // ---------------- DELETE ----------------
  it("should delete one product by ID", async () => {
    const product = await Product.findOne();
    await api
        .delete(`/api/products/${product._id}`)
        .set("Authorization", "Bearer " + token)
        .expect(204);

    const tourCheck = await Product.findById(product._id);
    expect(tourCheck).toBeNull();
  });

  // ---------------- Post ----------------
  it("should create one product", async () => {
    const newProduct = {
      "title": "Vintage Denim Jacket",
      "category": "Clothing",
      "description": "Classic stone-wash denim jacket with copper buttons.",
      "price": 60.00,
      "stockQuantity": 30,
      "supplier": {
        "name": "RetroFit Apparel",
        "contactEmail": "contact@retrofitapparel.com",
        "contactPhone": "+1-555-016-6655",
        "rating": 4.7
      }
    };
    const response = await api
        .post("/api/products")
        .set("Authorization", "Bearer " + token)
        .send(newProduct)
        .expect(201);

    expect(response.body.title).toBe(newProduct.title);
  });

  it("should return 401 when token is invalid ", async () => {
    const newProduct = {
      "title": "Vintage Denim Jacket",
      "category": "Clothing",
      "description": "Classic stone-wash denim jacket with copper buttons.",
      "price": 60.00,
      "stockQuantity": 30,
      "supplier": {
        "name": "RetroFit Apparel",
        "contactEmail": "contact@retrofitapparel.com",
        "contactPhone": "+1-555-016-6655",
        "rating": 4.7
      }
    };
    const response = await api
        .post("/api/products")
        .set("Authorization", "Bearer " + "faketoken")
        .send(newProduct)
        .expect(401);
  });

});

describe('CRUD operations with different user roles ', () => {
  beforeEach(async () => {
    await Product.deleteMany({})
    await Promise.all([
      api.post("/api/products").set("Authorization", "Bearer " + token).send(products[0]),
      api.post("/api/products").set("Authorization", "Bearer " + token).send(products[1]),
    ])
  })

  it("should return 401 if user role is buyer while creating a new product ", async () => {
    const newProduct = {
      "title": "Vintage Denim Jacket",
      "category": "Clothing",
      "description": "Classic stone-wash denim jacket with copper buttons.",
      "price": 60.00,
      "stockQuantity": 30,
      "supplier": {
        "name": "RetroFit Apparel",
        "contactEmail": "contact@retrofitapparel.com",
        "contactPhone": "+1-555-016-6655",
        "rating": 4.7
      }
    };
    const response = await api
        .post("/api/products")
        .set("Authorization", "Bearer " + buyerToken)
        .send(newProduct)
        .expect(401);
  });

  it("should return 201 if user role is seller while creating a new product ", async () => {
    const newProduct = {
      "title": "Vintage Denim Jacket",
      "category": "Clothing",
      "description": "Classic stone-wash denim jacket with copper buttons.",
      "price": 60.00,
      "stockQuantity": 30,
      "supplier": {
        "name": "RetroFit Apparel",
        "contactEmail": "contact@retrofitapparel.com",
        "contactPhone": "+1-555-016-6655",
        "rating": 4.7
      }
    };
    const response = await api
        .post("/api/products")
        .set("Authorization", "Bearer " + sellerToken)
        .send(newProduct)
        .expect(201);
  });
})

