if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./lib/Botkit.js');
var os = require('os');

var controller = Botkit.slackbot({
    debug: true,
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();



controller.hears(['stop harassing me'], 'ambient', function(bot, message){
  bot.startPrivateConversation(message, function(err, dm) {
    dm.say('*_Message recorded:_ *');
    bot.api.channels.history({
        timestamp: "latest",
        channel: "C4LVCQE31",
        inclusive: true,
        count: 2,


     } , function(err, res){
        if (err){
          bot.botkit.log('Failed to post message', err);
        }
        else {
          console.log("Got text:", res.messages[1].text);
          dm.say('*Message:* '+res.messages[1].text);
          dm.say('*User:* '+res.messages[1].user);
          dm.say('*Timestamp:* '+res.messages[1].ts);
        }
    });

  });
});
