import {
  connectDatabase,
  insertDocument,
  getDocument,
} from "../../../helpers/db-util";

const handler = async (req, res) => {
  const eventId = req.query.eventId;
  let client;
  try {
    client = await connectDatabase();
  } catch (error) {
    res.status(500).json({ message: "connection to db failed" });
    return;
  }
  if (req.method === "POST") {
    const { email, name, text } = req.body;

    if (
      !email ||
      !name ||
      !text ||
      !email.includes("@") ||
      name.trim() === "" ||
      text.trim() === ""
    ) {
      res.status(422).json({ message: "Invalid inputs" });
      client.close();
      return;
    }

    const newComment = {
      email,
      name,
      text,
      eventId,
    };

    try {
      const result = await insertDocument(client, "comments", newComment);
      newComment._id = result.insertedId;
      res.status(201).json({ message: "Added", comment: newComment });
    } catch (error) {
      res.status(500).json({ message: "insertion failed!" });
    }
  }

  if (req.method === "GET") {
    try {
      const result = await getDocument(client, "comments");
      res.status(201).json({ comments: result });
    } catch (error) {
      res.status(500).json({ message: "failed to fetch data!" });
    }
  }

  client.close();
};

export default handler;
