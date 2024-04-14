import express from "express";
const router = express.Router();
import { checkUserIsAuthenticated, isUserAdmin } from "../middleware/auth";
import {
  addGroceryItem,
  bookGroceyItems,
  getAllGroceyItems,
  getAvailableGroceyItems,
  removeGroceryItem,
  updateGroceryItem
} from "../controllers/grocery";

// admin routes
router.post("/add", checkUserIsAuthenticated, isUserAdmin, addGroceryItem);
router.get("/all", checkUserIsAuthenticated, isUserAdmin, getAllGroceyItems);
router.patch("/update/:groceryId", checkUserIsAuthenticated, isUserAdmin, updateGroceryItem);
router.delete("/remove/:groceryId", checkUserIsAuthenticated, isUserAdmin, removeGroceryItem);

// user routes
router.get("/available", checkUserIsAuthenticated, getAvailableGroceyItems);
router.post("/book", checkUserIsAuthenticated, bookGroceyItems);

export { router as groceryRouter };
