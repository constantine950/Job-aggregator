// config/env MUST be the first import — it loads .env as a side
// effect, before anything else (including PORT below) reads
// process.env. See config/env.ts for why import order matters here.
import { PORT } from "./config/env.js";

import express from "express";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());
app.use("/api", routes);

// Error handler must be registered last, after all routes.
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[api] listening on http://localhost:${PORT}`);
});
