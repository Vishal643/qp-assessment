import { Request, Response } from "express-serve-static-core";
import { GroceryItem } from "../entity/GroceryItem";
import { EntityManager, In, MoreThan } from "typeorm";
import { AvailableGrocery, BookGrocery, UnavailableGrocery } from "../types/Grocery";
import { AppDataSource } from "../index";

export const addGroceryItem = async (req: Request, res: Response) => {
  try {
    const { name, price, quantity } = req.body;

    if (!name || !price || !quantity) {
      return res.status(400).send({ message: "Missing required fields", error: true });
    }

    const newGrocery = GroceryItem.create({ name, price, quantity });
    await newGrocery.save();

    res.status(201).send({ message: "Grocery added Successfull", grocery: newGrocery, error: false });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error: true });
  }
};

export const getAllGroceyItems = async (req: Request, res: Response) => {
  try {
    const groceries = await GroceryItem.find();
    console.log("groceries", groceries);
    return res.status(200).send({ message: "Grorceries fetched successfully", groceries, error: false });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error: true });
  }
};

export const updateGroceryItem = async (req: Request, res: Response) => {
  try {
    const { name, price, quantity } = req.body;
    const { groceryId } = req.params;

    const grocery = await GroceryItem.findOneBy({ id: groceryId });

    if (!grocery) {
      return res.status(404).send({ message: "Grocery not found", error: true });
    }

    if (name) grocery.name = name;
    if (price) grocery.price = price;
    if (quantity) grocery.quantity = quantity;

    await grocery.save();

    res.status(200).send({ message: "Grocery updated Successfull", grocery, error: false });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error: true });
  }
};

export const removeGroceryItem = async (req: Request, res: Response) => {
  try {
    const { groceryId } = req.params;

    await GroceryItem.delete({ id: groceryId });

    res.status(200).send({ message: "Grocery deleted Successfull", error: false });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error: true });
  }
};

export const getAvailableGroceyItems = async (req: Request, res: Response) => {
  try {
    const groceries = await GroceryItem.find({ where: { quantity: MoreThan(0) } });
    if (!groceries || groceries.length === 0) {
      return res.status(404).send({ message: "No groceries found", error: true });
    }
    res.status(200).send({ message: "Grorceries fetched successfully", groceries, error: false });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error: true });
  }
};

export const bookGroceyItems = async (req: Request, res: Response) => {
  try {
    const groceryItems = req.body;
    const groceries: BookGrocery[] = groceryItems.groceries;
    const groceryIds = groceries.map(grocery => grocery.groceryId);

    // check available groceries
    const availableGroceries = await GroceryItem.find({ where: { id: In(groceryIds) } });

    if (!availableGroceries || availableGroceries.length === 0) {
      return res.status(200).send({ message: "Requested griceries are not avaialble", error: true });
    }

    // check if requested quantity is available
    const unavailableGroceries: UnavailableGrocery[] = [];
    const availableGroceryItems: AvailableGrocery[] = [];
    availableGroceries.forEach(grocery => {
      const requestedGrocery = groceries.find(item => item.groceryId === grocery.id);
      if (!requestedGrocery || grocery.quantity < requestedGrocery.quantity) {
        unavailableGroceries.push({
          groceryId: grocery.id,
          availableQuantity: grocery.quantity,
          requestedQuantity: requestedGrocery ? requestedGrocery.quantity : 0,
          name: grocery.name
        });
      }
      if (requestedGrocery && grocery.quantity >= requestedGrocery.quantity) {
        availableGroceryItems.push({
          groceryId: grocery.id,
          quantity: grocery.quantity - requestedGrocery.quantity,
          availableQuantity: grocery.quantity,
          requestedQuantity: requestedGrocery.quantity,
          name: grocery.name
        });
      }
    });

    if (availableGroceryItems && availableGroceryItems.length === 0) {
      return res
        .status(200)
        .send({ message: "Requested griceries are out of stock", error: true, unavailableGroceries });
    }

    // book groceries and descrement quantity
    // transaction to book groceries and update quantity
    await AppDataSource.transaction(async (entityManager: EntityManager) => {
      try {
        for (const { groceryId, quantity } of availableGroceryItems as AvailableGrocery[]) {
          await entityManager
            .createQueryBuilder()
            .update(GroceryItem)
            .set({ quantity })
            .where("id = :id", { id: groceryId })
            .execute();
        }
      } catch (error) {
        throw new Error("Transaction failed: " + error);
      }
    });

    const bookedGroceries = availableGroceryItems.map(grocery => {
      return {
        groceryId: grocery.groceryId,
        bookedQuantity: grocery.requestedQuantity,
        name: grocery.name,
        availableGroceries: grocery.availableQuantity
      };
    });

    res.status(200).send({
      message: "Grorceries booked successfully",
      bookedGroceries,
      error: false,
      unavailableGroceries: unavailableGroceries
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ message: "Something went wrong while booking grocery", error: true });
  }
};
