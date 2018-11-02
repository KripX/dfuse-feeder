import app from './app';
import backend from './backend';
import {get_actions, parse_actions} from "eosws";

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
    backend.post(process.env.HTTP_HOST, action.data)
      .catch(function (error) {
        if (error.response) {
          console.log('ERROR:' + error.response.data);
          console.log('ERROR:' + error.response.status);
          console.log('ERROR:' + error.response.headers);
        } else if (error.request) {
          console.log('ERROR:' + error.request);
        } else {
          console.log('ERROR:' + error.message);
        }
        setTimeout(() => { backend.post(process.env.HTTP_HOST, action.data); }, 5000);
      });
  }
};

app.onclose = () => {
  console.log({ref: "app", message: "connection closed"});
};
