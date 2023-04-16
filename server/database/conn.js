import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function connect() {
  mongoose.set("strictQuery", true);
  const db = await mongoose.connect(
    "mongodb+srv://vinhwin1810:vinh2003@cluster0.lf9rwss.mongodb.net/test"
  );
  console.log("Database Connected");
  return db;
}

export default connect;
