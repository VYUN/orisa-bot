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
          bot.api.users.info({
               user: res.messages[1].user
            }, function(err, usrd){
              dm.say('*User:* '+usrd.user.real_name);

              dm.addMessage({
                  text: 'Please list them below:',
                  action: 'description_thread'
              },'yes_thread');

              dm.addMessage({
                  text: 'That is fine.',
                  action: 'description_thread'
              },'no_thread');

              
              dm.addMessage({
                  text: 'Sorry I did not understand.',
                  action: 'default',
              },'bad_response');

              dm.addMessage({
                  text: 'Thank you. Here are some links regarding workplace harassment: https://www.worksafebc.com/en/health-safety/hazards-exposures/bullying-harassment'

              }, 'links_thread')

              dm.addMessage({
                  text: 'Please provide a short description of the incident: ',
                  action: 'links_thread'
              }, 'description_thread');


              // Create a yes/no question in the default thread...
              dm.ask('Were there any possible witnesses? (yes/no)', [
                  {
                      pattern: 'yes',
                      callback: function(response, dm) {
                          dm.gotoThread('yes_thread');
                      },
                  },
                  {
                      pattern: 'no',
                      callback: function(response, dm) {
                          dm.gotoThread('no_thread');
                      },
                  },
                  {
                      default: true,
                      callback: function(response, dm) {
                          dm.gotoThread('bad_response');
                      },
                  }
              ]);
          });
          dm.say('*Message:* '+res.messages[1].text);
          //dm.say('*User:* '+res.messages[1].user);
          dm.say('*Timestamp:* '+res.messages[1].ts);


        }//end 

    });


  });
});
