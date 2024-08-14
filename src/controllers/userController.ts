import { Request, Response } from "express";
import * as userService from "../services/userService";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const users = await userService.getAllUsers();
  res.json(users);
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email } = req.body;

  try {
    const newUser = await userService.createUser(name, email);

    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name, email } = req.body;
  await userService.updateUser(Number(id), name, email);
  res.json({ message: "User updated" });
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  await userService.deleteUser(Number(id));
  res.json({ message: "User deleted" });
};
