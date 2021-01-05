import express, { Request, Response } from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { User } from "./entity/User";

(async function initializeConnection() {
  const app = express();
  app.use(express.json());

  app.get("/users", async function readUsers(_req: Request, res: Response) {
    try {
      const users = await User.find();
      return res.status(200).json(users);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong." });
    }
  });

  app.post("/users", async function createUser(req: Request, res: Response) {
    const { name, email, role } = req.body;

    try {
      const user = User.create({ name, email, role });
      await user.save();
      return res.status(201).json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong." });
    }
  });

  app.put(
    "/users/:uuid",
    async function updateUser(req: Request, res: Response) {
      const { uuid } = req.params;
      const { name, email, role } = req.body;
      try {
        const user = await User.findOneOrFail({ uuid });
        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;
        await user.save();
        return res.status(200).json(user);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong." });
      }
    },
  );

  app.delete(
    "/users/:uuid",
    async function deleteUser(req: Request, res: Response) {
      const { uuid } = req.params;
      try {
        let user;
        try {
          user = await User.findOneOrFail({ uuid });
        } catch (error) {
          console.log(error);
          return res.status(404).json({ error: "User not found." });
        }
        await user.remove();
        return res.status(200).json({ message: "User deleted successfully." });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong." });
      }
    },
  );

  app.get("/users/:uuid", async function findUser(req: Request, res: Response) {
    const { uuid } = req.params;
    try {
      const user = await User.findOneOrFail({ uuid });
      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(404).json({ error: "User not found." });
    }
  });

  try {
    const connection = await createConnection();
    app.listen(5000, function bootApp() {
      console.log("Server listening on http://localhost:5000");
    });
  } catch (error) {
    console.log(error);
  }
})();
