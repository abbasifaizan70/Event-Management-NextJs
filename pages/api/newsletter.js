import { MongoClient } from "mongodb";
import { connectDatabase, insertDocument } from "../../helpers/db-util";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const userEmail = req.body.email;

    if (!userEmail || !userEmail.includes("@")) {
      res.status(422).json({ message: "Invalid user email" });
      return;
    }

    let client;
    try {
      client = await connectDatabase();
    } catch (error) {
      res.status(500).json({ message: "connection to db failed" });
      return;
    }

    try {
      await insertDocument(client, "newsletter", { email: userEmail });
    } catch (error) {
      res.status(500).json({ message: "insertion failed!" });
      return;
    }

    client.close();

    res.status(201).json({ message: "successfill" });
  }
};

export default handler;
