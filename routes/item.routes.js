const { createItem, updateItem, getItem, getAllItem, deleteItem } = require("../controller/item");
const { upload } = require("../middleware/uploadFile");

const router = require("express").Router();

router
  .post("/create/item/v1", upload.single('item_image'), createItem)
  .put("/update/item/v1/:id", updateItem)
  .get("/item/v1/:id", getItem)
  .get("/item/v1", getAllItem)
  .delete("/delete/item/v1/:id", deleteItem)


module.exports = router;