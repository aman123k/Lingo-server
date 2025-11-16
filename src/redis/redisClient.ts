import { createClient, RedisClientOptions } from "redis";
import { config } from "dotenv";
config();

// Create Redis client using environment variables
const client = createClient({
  password: String(process.env.REDIS_PASSWORD),
  socket: {
    host: process.env.REDIS_HOST,
    port: 14951,
  },
});

// Local development Redis client example

// const client = createClient({
//   url: "redis://127.0.0.1:6379",
// });

// Add event handlers for connection status
client.on("connect", () => {
  console.log("Connected to Redis");
});

// Handle connection errors
client.on("error", (err) => {
  console.error("Error connecting to Redis:", err);
});

export default client;
