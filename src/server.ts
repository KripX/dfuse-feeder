import app from './app';
import {get_actions, parse_actions} from "eosws"
import {Tweet} from './models/tweet';
import axios from 'axios';
import axiosRetry from 'axios-retry';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

app.onopen = () => {
  console.log({ref: "app::open", message: "connection open"});
  app.send(get_actions("decentwitter", "tweet", null, {
    req_id: "decentwitter::tweet",
    start_block: Number(process.env.START_BLOCK)
  }));
};

app.onmessage = (message) => {
  const tweets = parse_actions<Tweet>(message.data, "decentwitter::tweet");

  if (tweets) {
    console.log(tweets.data.trace.act);
    axiosRetry(axios, { retries: 3 });
    axios.defaults.headers.post['Content-Type'] = 'text/plain';
    axios.post(process.env.HTTP_HOST, tweets.data)
      .catch(function (error) {
        console.log('http error: ' + error.response);
      });
  }
};

app.onclose = () => {
  console.log({ref: "app", message: "connection closed"});
};
