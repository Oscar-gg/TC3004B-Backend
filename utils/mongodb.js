import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};

export const listDatabases = async () => {
  try {
    const admin = mongoose.connection.db.admin();
    const result = await admin.listDatabases();
    console.log("Databases:", result.databases);
  } catch (error) {
    console.error("Error listing databases", error);
  }
};
