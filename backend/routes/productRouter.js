const express = require("express")
const {
  getAllProducts,
  createProduct,
  getProductById,
  deleteProduct,
  updateProduct,
} = require("../controllers/productControllers")

const router = express.Router();
const requireAuth = require("../middleware/requireAuth")

router.get("/",getAllProducts)

router.get("/:productId",getProductById)
router.use(requireAuth)
router.post("/",createProduct)
router.delete("/:productId",deleteProduct)
router.put("/:productId",updateProduct)


module.exports = router