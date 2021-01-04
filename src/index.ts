import express, { Request, Response } from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { User } from "./entity/User";

(async function initializeConnection() {
  const app = express();
  app.use(express.json());

  app.post("/users", async function createUser(req: Request, res: Response) {
    const { name, email, role } = req.body;

    try {
      const user = User.create({ name, email, role });
      await user.save();
      return res.status(201).json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
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
