import { RowDataPacket, ResultSetHeader } from "mysql2";
import connection from "../database/connection";
import { User } from "../models/user";

export const getAllUsers = async (): Promise<User[]> => {
  const [rows] = await connection.execute<RowDataPacket[]>(
    "SELECT * FROM users"
  );

  return rows as User[];
};

export const createUser = async (
  name: string,
  email: string
): Promise<User> => {
  const [result] = await connection.execute<ResultSetHeader>(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email]
  );

  const { insertId } = result;

  const [rows] = await connection.execute<RowDataPacket[]>(
    "SELECT * FROM users WHERE id = ?",
    [insertId]
  );

  return rows[0] as User;
};

export const updateUser = async (
  id: number,
  name: string,
  email: string
): Promise<void> => {
  await connection.execute(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [name, email, id]
  );
};

export const deleteUser = async (id: number): Promise<void> => {
  await connection.execute("DELETE FROM users WHERE id = ?", [id]);
};
