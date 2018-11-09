import {
  ActionTraceData,
  createEoswsSocket,
  EoswsClient,
  ErrorData,
  InboundMessage,
  InboundMessageType
} from "@dfuse/eosws-js";
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
const origin = process.env.ORIGIN;
const socketFactory = () => new WebSocket(`wss://staging-mainnet.eos.dfuse.io/v1/stream?token=${process.env.API_TOKEN}`, {origin});

const onMessage = (message: InboundMessage<any>) => {
  if (message.type === InboundMessageType.ACTION_TRACE) {
    const actionTraceData = message.data as ActionTraceData<any>;
    console.log(actionTraceData.trace.act);
    const amqMessage = new Amqp.Message(JSON.stringify(actionTraceData.trace.act));
    queue.send(amqMessage);
    return;
  }
  if (message.type === InboundMessageType.ERROR) {
    const error = message.data as ErrorData;
    console.log(`Received ERROR: ${error.message} (${error.code})`, error.details);
    return;
  }
};

const onClose = () => {
  console.log({ref: "app", message: "connection closed"});
};

const client = new EoswsClient(createEoswsSocket(socketFactory, {onClose, autoReconnect: true}));
client.connect().then(() => {
  console.log({ref: "app::open", message: "connection open"});
  for (const account of contracts) {
    client
      .getActionTraces({account}, {start_block: Number(process.env.START_BLOCK)})
      .onMessage(onMessage);
  }
}).catch((error) => {
  console.log("ERROR: Unable to connect", error)
});

