import app from './app';
import {get_actions, parse_actions} from "eosws";
import * as Amqp from "amqp-ts";
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
};