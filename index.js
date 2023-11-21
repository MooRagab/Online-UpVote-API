import express from "express";
import dotenv from "dotenv";
import connectDB from "./DB/connection.js";
import * as indexRouter from "./src/modules/index.router.js";

dotenv.config({ path: "./config/.env" });

const baseUrl = process.env.BASEURL;
connectDB();

const app = express();

const port = parseInt(process.env.PORT);

app.use(express.json());

app.use(`${baseUrl}/user`, indexRouter.userRouter);
app.use(`${baseUrl}/auth`, indexRouter.authRouter);
app.use(`${baseUrl}/post`, indexRouter.postRouter);

app.use("*", (req, res) => {
  res.status(404).json({ message: "404 Page Not Found" }); 
});

app.listen(port, () => console.log(`Server Is Running On this Port ${port}!`));
