import express from "express";
import serverless from "serverless-http";
import routes from "./routes/index";

const app = express();

app.use(express.json());

app.use("/", routes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err: any, _req: express.Request, res: express.Response) => {
  res.status(err.status || 500).json({ error: err.message });
});

export const handler = serverless(app);
