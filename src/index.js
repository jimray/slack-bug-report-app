require('dotenv').config();

const axios = require('axios');
const bodyParser = require('body-parser');
const express = require('express');
const qs = require('querystring');

const dialogTemplate = require('./dialog');

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
 * Endpoint to receive slash commands from Slack.
 * Launches the dialog for the bug tracking ticket
 */
app.post('/slack/events/commands', (req, res) => {
  // `response_url` is no longer required, however `trigger_id` is for the dialog
  const { token, text, trigger_id } = req.body;

  if (token === process.env.SLACK_VERIFICATION_TOKEN) {
    // respond to the slash command with the dialog
    const dialog = dialogTemplate(trigger_id, text);
    axios.post('https://slack.com/api/dialog.open', qs.stringify(dialog)).then(result => console.log(result));
  } else { res.sendStatus(500); }
});

/*
 * Endpoint to receive interactive message events from Slack.
 */
app.post('/slack/events/components', (req, res) => {
  const body = JSON.parse(req.body.payload);

  if (body.token === process.env.SLACK_VERIFICATION_TOKEN) {
    // Dialog processing logic goes here
  } else { res.sendStatus(500); }
});

/*
 * Start the express server
 */
app.listen(app.get('port'), () => {
  console.log(`App listening on port ${app.get('port')}!`);
});
