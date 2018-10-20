import app from './app';
import backend from './backend';
import {get_actions, parse_actions} from "eosws"
import {Tweet} from './models/tweet';

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
  'nebulajobbbb'
];

app.onopen = () => {
  console.log({ref: "app::open", message: "connection open"});

  for (const account of contracts) {
    app.send(get_actions(account, null, null, { start_block: Number(process.env.START_BLOCK) }))
  }

  /* app.send(get_actions("decentwitter", "tweet", null, { req_id: "decentwitter::tweet", start_block: Number(process.env.START_BLOCK) })); */
};

app.onmessage = (message) => {
  //const tweets = parse_actions<Tweet>(message.data, "decentwitter::tweet");
  const action = parse_actions(message.data);

  if (action) {
    console.log(action.data.trace.act);
    backend.post(process.env.HTTP_HOST, action.data)
      .catch(function (error) {
        console.log('http error: ' + error.response);
    });
  }
};

app.onclose = () => {
  console.log({ref: "app", message: "connection closed"});
};
