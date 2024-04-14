import { Request, Response } from "express-serve-static-core";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import jwt, { GetPublicKeyOrSecret, Secret } from "jsonwebtoken";

const JWT_SECRET: Secret | GetPublicKeyOrSecret = process.env.JWT_SECRET || "";

export const register = async (req: Request, res: Response) => {
  try {
    const { password, name, email } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send({ message: "Missing required fields", error: true });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists
    const existingUser = await User.findOneBy({ email: email });
    if (existingUser) {
      return res.status(400).send({ message: "User already exists", error: true });
    }
    const newUser = User.create({ email, name, password: hashedPassword });
    await newUser.save();

    res.status(201).send({ message: "User created Successfull", error: false });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error: true });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOneBy({ email: email });
  if (!user) {
    return res.status(400).send({ message: "User not found", error: true });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    const token = jwt.sign({ email }, JWT_SECRET);
    res.status(200).send({ message: "Login successfull", token, error: false });
  } else {
    res.status(401).send({ message: "Invalid credentials", error: true });
  }
};
