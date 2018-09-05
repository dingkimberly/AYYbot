var Discord = require('discord.io');
var auth = require('./auth.json');

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('ready', function (evt) {
    console.log('Connected');
    console.log('Logged in as: ');
    console.log(bot.username + ' - (' + bot.id + ')');
});

function getDateMessage() {
    var d = new Date();
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ['January','February','March','April','May','June','July',
                  'August','September','October','November','December'];
    return "Today is " + days[d.getDay()] + ", " + months[d.getMonth()] + " " + d.getDate() +
                                       ", " + d.getFullYear() + ".";
}

function leftPad(number, targetLength) {
    var output = number + '';
    while (output.length < targetLength) {
        output = '0' + output;
    }
    return output;
}

function getTimeMessage() {
    var d = new Date();
    var m = "AM";
    var hour = d.getHours();

    if (hour >= 12) {
        m = "PM";
        hour = hour % 12;
    } else if (hour == 0 ) {hour == 12; }

    return "It is " + hour + ":" + leftPad(d.getMinutes(), 2) + ":" + leftPad(d.getSeconds(), 2) + " " + m;
}

function getRandomMessage(args) {

    var message = "";

    if (args.length == 0) {
        return "You didn't specify a range, so I picked a random integer from 0 to 2147483647. It's " +
                  Math.floor(Math.random() * (2147483647 + 1)) + ".\n" +
                  "Next time, type \"!rand n\" to get a random integer from 0 to n."
    }
    else if (args.length > 1) {
        return "There are too many arguments in this command. Are you trying to confuse me?\n" +
                  "Next time, type \"!rand n\" to get a random integer from 0 to n.";
    }
    else {
        var max = parseFloat(args[0]);

        if (isNaN(max)) { return "Very funny. Try again with an actual number, smartass."; }


        if (max == 0) {
            return "I picked a random integer from 0 to 0. Surprise: IT'S ZERO, DUMBASS.\n" +
                   "Bots think much faster than humans, but this was still a waste of my time.";
        }

        if (!(Number.isInteger(max))) {
            message += "Just so you know, I only pick random integers, so you might well enter an integer " +
                        "next time.\nAnyway, "
        }


        if (max < 0) {
            message += "I picked a random integer from " + max + " to 0. It's " +
                          Math.floor(Math.random() * (max-1) + 1) + "."
        } else {
            message += "I picked a random number from 0 to " + max + ". It's " +
                          Math.floor(Math.random() * (max + 1)) + "."
        }

    }

    return message;
}

bot.on('message', function (user, userID, channelID, message, evt) {

    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {

            case 'date':
                bot.sendMessage({
                    to: channelID,
                    message: getDateMessage()
                });
                break;

            case 'time':
                bot.sendMessage({
                    to: channelID,
                    message: getTimeMessage()
                });
                break;

            case 'rand': // fallthrough
            case 'random':
                bot.sendMessage({
                    to: channelID,
                    message: getRandomMessage(args)
                });
                break;
         }
    }

    if (message.length > 1000) {
                bot.sendMessage({
                    to: channelID,
                    message: "Whoa there, buddy, that's a lot of text."
                });
    }
});