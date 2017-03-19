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
    dm.say('What is wrong?');
    bot.api.channels.history({
        timestamp: "latest",
        channel: "C4LVCQE31",
        inclusive: true,
        count: 2,


     } , function(err, res){
        if (err){
          bot.botkit.log('Failed to post message', err);
        }
    });

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });

  });
});
