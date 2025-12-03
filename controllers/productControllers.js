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

const getProductById = async (req,res) => {
  const{productId} = req.params;

  if(!mongoose.Types.ObjectId.isValid(productId)){
    return res.status(400).json({message:"Invalid product ID"})
  }

  try{
    const product = await Product.findById(productId);
    if(product){
      res.status(200).json(product);
    } else {
      res.status(404).json({message:"Product not found"})
    }
  }catch(error){
    res.status(500).json({message:"Failed to retrieve product"})
  }
};

const deleteProduct = async (req,res) => {
  const {productId} = req.params;

  if(!mongoose.Types.ObjectId.isValid(productId)){
    return res.status(400).json({message:"Invalid product ID"})
  }

  try{
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if(deletedProduct){
      res.status(204).send();
    }else {
      res.status(404).json({message:"Product not found"})
    }
  }catch(error){
    res.status(500).json({message:"Failed to delete product"}); 
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  getProductById,
  deleteProduct
}