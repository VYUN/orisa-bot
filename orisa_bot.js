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

var name = '';
var evidence = '';
var time = '';


controller.hears(['stop harassing me'], 'ambient', function(bot, message){
  var channelID = message.channel;
  
  bot.startPrivateConversation(message, function(err, dm) {
    
    dm.say('*_Message recorded:_ *');
    bot.api.mpim.history({
        timestamp: "latest",
        channel: channelID,
        inclusive: true,
        count: 2,


     } , function(err, res){
        if (err){
          bot.botkit.log('Failed to post message', err);
        }
        else {
          
          bot.api.users.info({
               user: res.messages[1].user
            }, function(err, usrd){
              dm.say('*User:* '+usrd.user.real_name);
              name = usrd.user.real_name;
              // Create a yes/no question in the default thread...

              dm.addQuestion('*Please list the witnesses below: *', function(res, dm){
                    dm.gotoThread('description_thread');}, {'key':'witnesses'}, 'yes_thread');

              dm.addQuestion('*Please provide a short description of the incident below: *', function(res, dm){
                    dm.gotoThread('links_thread');}, {'key':'description'}, 'description_thread');

              dm.addMessage({
                  text: 'That is fine.',
                  action: 'description_thread'
              },'no_thread');

              
              dm.addMessage({
                  text: 'Sorry I did not understand.',
                  action: 'default',
              },'bad_response');

              dm.addMessage({
                  text: '*Thank you for logging this incident. Here are some resources regarding workplace harassment:*\nhttps://www.worksafebc.com/en/health-safety/hazards-exposures/bullying-harassment'
                          + '\nhttps://www.canada.ca/en/treasury-board-secretariat/services/healthy-workplace/prevention-resolution-harassment/harassment-tool-employees.html'
                          + '\nhttps://www.labour.gov.on.ca/english/hs/pubs/wpvh/harassment.php'
              },'links_thread');


              dm.ask('*Were there any possible witnesses?* (yes/no)', [
                  {
                      pattern: 'yes',
                      callback: function(res, dm) {
                          dm.gotoThread('yes_thread');
                      },
                  },
                  {
                      pattern: 'no',
                      callback: function(res, dm) {
                          dm.gotoThread('no_thread');
                      },
                  },
                  {
                      default: true,
                      callback: function(res, dm) {
                          dm.gotoThread('bad_response');
                      },
                  }
              ]);

              dm.on('end', function(dm){

                if(dm.status =='completed') {
                    var witnessesValue = dm.extractResponse('witnesses');
                    var descriptionValue = dm.extractResponse('description');
                    var summary = "*_Harassment report:_* \n *Offender:* " + name + "\n *Message:* " + evidence + "\n *Time:* " + 
                      time + "\n *Witnesses:* " + witnessesValue + "\n *Description:* " + descriptionValue
                    bot.reply(message, summary);
                    message.user = "U4L70084B"; // hardcoded user
                    bot.startPrivateConversation(message, function(err, dm) {
                      dm.say(summary);
                    });


                } else{
                    bot.reply(message, 'Nice');
                }
              });

          });
          dm.say('*Message:* '+res.messages[1].text);
          //dm.say('*User:* '+res.messages[1].user);
          dm.say('*Timestamp:* '+res.messages[1].ts);

          evidence = res.messages[1].text;
          time = res.messages[1].ts;


        }//end 

    });

  });
});

controller.hears(['shutdown'], 'direct_message', function(bot, message) {

    bot.startConversation(message, function(err, dm) {

        dm.ask('Can I shutdown?', [
            {
                pattern: bot.utterances.yes,
                callback: function(response, dm) {
                    dm.say('See you!');
                    dm.next();
                    setTimeout(function() {
                        process.exit();
                    }, 3000);
                }
            },
        {
            pattern: bot.utterances.no,
            default: true,
            callback: function(response, dm) {
                dm.say('I will stay');
                dm.next();
            }
        }
        ]);
    });
});


controller.hears(['uptime', 'who are you', 'what is your name'],
    'direct_message', function(bot, message) {

        var hostname = os.hostname();
        var uptime = formatUptime(process.uptime());

        bot.reply(message,
            'I am a bot named <@' + bot.identity.name +
             '>. I have been running for ' + uptime + ' on ' + hostname + '.');

    });

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}

