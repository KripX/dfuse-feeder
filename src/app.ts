import WebSocket from "ws"

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}
const origin = process.env.ORIGIN;
const app = new WebSocket(`wss://mainnet.eos.dfuse.io/v1/stream?token=${process.env.API_TOKEN}`, { origin });

export default app;
