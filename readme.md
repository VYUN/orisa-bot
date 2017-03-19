# Orisa-Bot

Orisa-Bot is a Slack bot used for logging incidents of workplace harassment in an individual's direct messages. 
It was created using the BotKit framework by howdyai (https://github.com/howdyai/botkit)

## Running
```
$ npm install
```
then,

```
$ token=<MY_TOKEN> node orisa_bot.js
```

## Usage
Add the bot to a direct message conversation with another person. Use the phrase "stop harassing me" in order to trigger the bot to log the message directly before
the phrase, with an assumption that it was the offensive post. The bot will then log the message, offender's name, and timestamp in a separate direct message between
the bot and the victim only. It will then ask a couple of questions to record more data about the incident, and the summarize the final reporting before sending the
summary to a designated user (ideally a HR representative, in the real world). Finally, the bot will also display links regarding workplace harassment as potential
resources for the victim. 