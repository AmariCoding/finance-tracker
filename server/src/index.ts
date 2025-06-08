import express, { Express } from "express";
import mongoose from "mongoose";
import financialRecordsRouter from "./routes/financial-records";
import cors from "cors";

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(cors());

app.use(express.json());

// MongoDB connection
const mongoUri: string =
  "mongodb+srv://jdev:personaltrackerpassword@personalfinancetracker.eoftck4.mongodb.net/;";

mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/financial-records", financialRecordsRouter);

app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});
