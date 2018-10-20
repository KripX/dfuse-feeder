import app from './app';
import backend from './backend';
import {get_actions, parse_actions} from "eosws"
import {Tweet} from './models/tweet';

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
    backend.post(process.env.HTTP_HOST, tweets.data)
      .catch(function (error) {
        console.log('http error: ' + error.response);
    });
  }
};

app.onclose = () => {
  console.log({ref: "app", message: "connection closed"});
};
