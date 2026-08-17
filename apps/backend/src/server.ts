import { createApp } from "./app";
import { config } from "./config/env";

const app = createApp();

app.listen(config.port, config.host, () => {
  console.log(`=========================================`);
  console.log(`🚀 e-clean Backend Server running!`);
  console.log(`📡 Local:   http://localhost:${config.port}`);
  console.log(`🌐 Network: http://${config.host}:${config.port}`);
  console.log(`🔐 Better Auth: /api/auth`);
  console.log(`=========================================`);
});
