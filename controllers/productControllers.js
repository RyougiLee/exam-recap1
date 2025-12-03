const Product = require("../models/productModel")
const mongoose = require("mongoose")

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({createdAt: -1})
    res.status(200).json(products)
  } catch (error) {
    res.json(500).json({message: "Failed to retrieve Products"})
  }
}

const createProduct = async (req, res) => {
  try{
    const newProduct = await Product.create({...req.body})
    res.status(201).json(newProduct)
  } catch (error) {
    res
        .status(400)
        .json({message :"Failed to create product", error: error.message})
  }
}

module.exports = {
  getAllProducts,
  createProduct
}