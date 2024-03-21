const {
  createItem,
  updateItem,
  getItem,
  getAllItem,
  deleteItem,
} = require("../controller/item");
const { upload } = require("../middleware/uploadFile");
const { authenticate, authorization } = require("../middleware/verifyAccess");

const router = require("express").Router();

router
  .post(
    "/create/item/v1",
    authenticate,
    authorization,
    upload.array("item_image"),
    createItem
  )
  .put("/update/item/v1/:id", authenticate, authorization, updateItem)
  .get("/item/v1/:id", getItem)
  .get("/item/v1", getAllItem)
  .delete("/delete/item/v1/:id", authenticate, authorization, deleteItem);

module.exports = router;
