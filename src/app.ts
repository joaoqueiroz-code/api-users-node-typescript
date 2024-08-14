import express from "express";
import userRoutes from "./routes/userRoutes";
import authRouter from './routes/authRoutes';

const app = express();

app.use(express.json());
app.use('/api', authRouter);
app.use("/api", userRoutes);

export default app;
