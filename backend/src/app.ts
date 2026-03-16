import express from "express";
import cors from "cors";
import researchRoutes from "./routes/researchCalls.routes";
import authRoutes from "./routes/auth.routes";
import debugRoutes from "./routes/debug.routes";
import brokerRoutes from "./routes/broker.routes";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", researchRoutes);
app.use("/api", debugRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/broker", brokerRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ status: "OK" });
});



export default app;
