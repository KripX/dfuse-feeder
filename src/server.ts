import app from './app';
import {get_actions, parse_actions} from "eosws"
import axios from 'axios';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

app.onopen = () => {
  app.send(get_actions("decentwitter", null, null, {
    start_block: Number(process.env.START_BLOCK)
  }));
  /* app.send(get_actions("nebulajobbbb", null, null, {
    start_block: Number(20910700)
  })); */
};

app.onmessage = (message) => {
  const actions = parse_actions(message.data);

  if (actions) {
    console.log(actions.data.trace.act);
    //axios.get('/user?ID=12345');
  }
};
