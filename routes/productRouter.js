const express = require("express")
const {
  getAllProducts,
  createProduct,
  getProductById,
  deleteProduct,
  updateProduct,
} = require("../controllers/productControllers")

const router = express.Router();

router.get("/",getAllProducts)
router.post("/",createProduct)
router.get("/:productId",getProductById)
router.delete("/:productId",deleteProduct)
router.put("/:productId",updateProduct)


module.exports = router