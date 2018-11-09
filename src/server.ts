import {get_actions, parse_actions} from "eosws";
import * as Amqp from "amqp-ts";
import WebSocket from "ws"

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const contracts = [
  'decentwitter',
  'nebulasystem',
  'nebulaccount',
  'nebulatokenn',
  'nebulacoinnn',
  'nebulatalked',
  'nebulaskills',
  'nebulajobbbb',
  'nebulaoracle',
  'nebulawhitel'
];

const connection = new Amqp.Connection(process.env.CLOUDAMQP_URL);
const queue = connection.declareQueue('messages', {durable: true});

function init() {
  const origin = process.env.ORIGIN;
  const app = new WebSocket(`wss://mainnet.eos.dfuse.io/v1/stream?token=${process.env.API_TOKEN}`, {origin});

  app.onopen = () => {
    console.log({ref: "app::open", message: "connection open"});

    for (const account of contracts) {
      app.send(get_actions(account, null, null, {start_block: Number(process.env.START_BLOCK)}))
    }
  };

  app.onmessage = (message: any) => {
    const action = parse_actions(message.data);

    if (action) {
      console.log(action.data.trace.act);
      const message = new Amqp.Message(JSON.stringify(action));
      queue.send(message);
    }
  };

  app.onclose = () => {
    console.log({ref: "app", message: "connection closed"});
    setTimeout(init, 5000);
  };
}

init();
