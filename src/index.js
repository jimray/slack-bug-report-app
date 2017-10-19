require('dotenv').config();

const axios = require('axios');
const bodyParser = require('body-parser');
const express = require('express');
const qs = require('querystring');

const app = express();

app.set('port', process.env.PORT || 3000);

/*
 * Parse application/x-www-form-urlencoded && application/json
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*
 * Default endpoint
 */
app.get('/', (req, res) => {
  res.send('<h2>The Dialog Slash Command app is running</h2> <p>Follow the' +
  ' instructions in the README to configure the Slack App and your environment variables.</p>');
});

/*
 * Endpoint to handle slash commands from Slack
 * Echos submitted text back to user
 */
app.post('/slack/commands', (req, res) => {
  // respond immediately!
  res.status(200).end();
  
  const { token, text, response_url } = req.body;

  if (token === process.env.SLACK_VERIFICATION_TOKEN) {
    axios.post(response_url, text);
  } else { res.sendStatus(500); }
});

/*
 * Start the express server
 */
app.listen(app.get('port'), () => {
  console.log(`App listening on port ${app.get('port')}!`);
});
