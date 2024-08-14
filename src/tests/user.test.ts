import request from "supertest";
import app from "../app";
import connection from "../database/connection";

let authToken: string;

const deleteUserByEmail = async (email: string) => {
  const [rows] = await connection.execute(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );
  const users = rows as { id: number }[];

  if (users.length > 0) {
    const userId = users[0].id;
    await connection.execute("DELETE FROM users WHERE id = ?", [userId]);
  }
};

beforeAll(async () => {
  const response = await request(app).post("/api/login").send({
    username: "jobs2",
  });

  authToken = response.body.token;
});

beforeEach(async () => {
  await deleteUserByEmail("john.doe@example.com");
});

describe("User Controller Tests", () => {
  let createdUserId: number;
  it("should get all users", async () => {
    const response = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${authToken}`)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  it("should create a new user", async () => {
    const response = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "John Doe",
        email: "john.doe@example.com",
      })
      .expect("Content-Type", /json/)
      .expect(201);

    createdUserId = response.body.id;
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("John Doe");
    expect(response.body.email).toBe("john.doe@example.com");
  });

  it("should update an existing user", async () => {
    const response = await request(app)
      .put(`/api/users/${createdUserId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "John Doe Updated",
        email: "john.doe.updated@example.com",
      })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body.message).toBe("User updated");
  });

  it("should delete an existing user", async () => {
    const response = await request(app)
      .delete(`/api/users/${createdUserId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body.message).toBe("User deleted");
  });
});
