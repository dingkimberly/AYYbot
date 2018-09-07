const Discord = require("discord.js");
const client = new Discord.Client();
const auth = require("./auth.json");

client.on("ready", () => {
  console.log("AYYbot is connected!");
});

/**********************************************************************************************************************/
/**********************************************************************************************************************/

function getDateMsg() {
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

/**********************************************************************************************************************/

function getTimeMsg() {
    var d = new Date();
    var m = "AM";
    var hour = d.getHours();

    if (hour >= 12) {
        m = "PM";
        hour = hour % 12;
    } else if (hour === 0 ) {hour === 12; }

    return "It is " + hour + ":" + leftPad(d.getMinutes(), 2) + ":" + leftPad(d.getSeconds(), 2) + " " + m + ".";
}

/**********************************************************************************************************************/

function getRandomMsg(args) {

    var msg = "";

    if (args.length === 0) {
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


        if (max === 0) {
            return "I picked a random integer from 0 to 0. Surprise: IT'S ZERO, DUMBASS.\n" +
                   "Bots think much faster than humans, but this was still a waste of my time.";
        }

        if (!(Number.isInteger(max))) {
            msg += "Just so you know, I only pick random integers, so you might well enter an integer " +
                        "next time.\nAnyway, "
        }

        if (max < 0) {
            msg += "I picked a random integer from " + max + " to 0. It's " +
                          Math.floor(Math.random() * (max-1) + 1) + "."
        } else {
            msg += "I picked a random number from 0 to " + max + ". It's " +
                          Math.floor(Math.random() * (max + 1)) + "."
        }
    }
    return msg;
}

/**********************************************************************************************************************/

function getValidationMsg(msg) {

    friend_ids = ["373214112269860868", "425544164365565962", "322214531793289226", "322214531793289226",
              "428402654146723849"];

    v_msgs = ["Wow, %s, you're so cool.", "I'm validating you right now.", "Could you be any more legitimate?",
                       "Just so you know, %s, I am so proud of you."];

    write_message = Math.floor(Math.random() * 10);

    if (friend_ids.indexOf(msg.author.id) >= 0 && write_message <= 3) {
        name = msg.author;
        v_index = Math.floor(Math.random() * v_msgs.length);
        v_msg = parse(v_msgs[v_index], name);
        msg.channel.send(v_msg);
    }
}

function parse(str) {
    var args = [].slice.call(arguments, 1),
        i = 0;
    return str.replace(/%s/g, function() {
        return args[i++];
    });
}

/**********************************************************************************************************************/
/**********************************************************************************************************************/


client.on("message", (msg) => {

    // Ignore bot msgs.
    if (msg.author.bot) return;

    // Ignore DMs.
    if (msg.channel.type !=='text') return;

    getValidationMsg(msg);

    if (msg.content.length > 1000) {
        msg.channel.send("Whoa there, buddy, that's a lot of text. Why don't you calm down.");
    }

    if (msg.content.substring(0, 1) === '!') {
        var args = msg.content.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {

            case 'date':
                msg.channel.send(getDateMsg());
                break;

            case 'time':
                msg.channel.send(getTimeMsg());
                break;

            case 'rand': // fallthrough
            case 'random':
                msg.channel.send(getRandomMsg(args));
                break;
        }
    }
});

/**********************************************************************************************************************/
/**********************************************************************************************************************/

client.login(auth.token);