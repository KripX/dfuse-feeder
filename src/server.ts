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
  'nebulawhitel',
  'nebulapredic'
];

const connection = new Amqp.Connection(process.env.CLOUDAMQP_URL);
const queue = connection.declareQueue('messages', {durable: true});

function init() {
  const origin = process.env.ORIGIN;
  const socketFactory = () => new WebSocket(`wss://mainnet.eos.dfuse.io/v1/stream?token=${process.env.API_TOKEN}`, {origin});

  const onMessage = (message: InboundMessage<any>) => {
    if (message.type === InboundMessageType.ACTION_TRACE) {
      const actionTraceData = message.data as ActionTraceData<any>;
      console.log(actionTraceData.trace.act);
      const amqMessage = new Amqp.Message(JSON.stringify(message));
      queue.send(amqMessage);
      return;
    }
    if (message.type === InboundMessageType.ERROR) {
      const error = message.data as ErrorData;
      console.log(`Received error: ${error.message} (${error.code})`, error.details);
      return;
    }
  };

  const onClose = () => {
    console.log({ref: "app", message: "connection closed"});
    setTimeout(init, 5000);
  };

  const onError = () => {
    console.log({ref: "app", message: "error detected"});
  };

  const client = new EoswsClient(createEoswsSocket(socketFactory, {onError, onClose, autoReconnect: false}));
  client.connect().then(() => {
    console.log({ref: "app::open", message: "connection open"});
    for (const account of contracts) {
      client
        .getActionTraces({account}, {start_block: Number(process.env.START_BLOCK)})
        .onMessage(onMessage);
    }
  }).catch((error) => {
    console.log("error: Unable to connect", error);
    setTimeout(init, 10000);
  });
}

try {
  init();
}
catch (err) {
  console.log("error: Catch", err);
  setTimeout(init, 5000);
}
