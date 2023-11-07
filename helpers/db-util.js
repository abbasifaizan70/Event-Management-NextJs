import { MongoClient } from "mongodb";

export const connectDatabase = async () => {
  const client = await MongoClient.connect(
    "mongodb://faizanshoukat:106318fa@ac-jz0paoq-shard-00-00.taehrsw.mongodb.net:27017,ac-jz0paoq-shard-00-01.taehrsw.mongodb.net:27017,ac-jz0paoq-shard-00-02.taehrsw.mongodb.net:27017/events?replicaSet=atlas-8weljt-shard-0&ssl=true&authSource=admin"
  );
  return client;
};

export const insertDocument = async (client, collection, document) => {
  const db = client.db();
  const result = await db.collection(collection).insertOne(document);
  return result;
};

export const getDocument = async (client, collection) => {
  const db = client.db();
  const result = await db
    .collection(collection)
    .find()
    .sort({ _id: -1 })
    .toArray();

  return result;
};
