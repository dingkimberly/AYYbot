const Discord = require("discord.js");
const client = new Discord.Client();
const auth = require("./auth.json");
const package = require("./package.json")

client.on("ready", () => {
    console.log("\nAyybot version " + package.version);
    console.log("Connected!\n");
});

/**********************************************************************************************************************/
/**********************************************************************************************************************/

function getDateMsg() {
    var d = new Date();
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ['January','February','March','April','May','June','July',
        'August','September','October','November','December'];

    console.log("Sent user the date.");
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

    console.log("Sent user the time.");
    return "It is " + hour + ":" + leftPad(d.getMinutes(), 2) + ":" + leftPad(d.getSeconds(), 2) + " " + m + ".";
}

/**********************************************************************************************************************/

function getRandomMsg(args) {

    var msg = "";

    if (args.length === 0) {
        return "You didn't specify a range, so I picked a random integer from 0 to 2147483647. It's " +
            Math.floor(Math.random() * (2147483647 + 1)) + ".\n" +
            "Next time, type \"!rand n\", where n is an integer, to get a random integer from 0 to n."
    }
    else if (args.length > 1) {
        return "There are too many arguments in this command. Are you trying to confuse me?\n" +
            "Next time, type \"!rand n\", where n is a integer, to get a random integer from 0 to n.";
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
            msg += "I picked a random integer from 0 to " + max + ". It's " +
                Math.floor(Math.random() * (max + 1)) + "."
        }
    }

    console.log("Sent user a random integer.");
    return msg;
}

/**********************************************************************************************************************/

function sendValidationMsg(msg, args, requested=false) {

    v_msgs = [
        "Wow, %s, you're so cool!", "I'm validating you right now, %s. You are valid.",
        "%s, you could not be any more legitimate.", "Just so you know, %s, I am so proud of you.",
        "Hey, %s, you are everything good.", "You’re amazing, %s!",
        "You're super fun and everyone likes you, %s.",
        "%s, you’ve got more charm than a charm bracelet with a lot of charms on it.",
        "I would totally go grocery shopping with %s.", "%s, you're the best!",
        "I am a robot lacking emotional capacity, but I still like %s a lot.",
        "Everything will happen for you, %s.",
        "%s, look at these cute animals! :bird::elephant::baby_chick::whale::pig2:"+
        ":dolphin::snail::chipmunk::rooster::rabbit2: "+
        "They are almost as cute as you.",
        "This dog wants to say hello to you, %s. :dog2: She thinks you're great!"
        ];

    validatedSomeone = false;

    write_msg = Math.floor(Math.random() * 100);

    if (write_msg <= 4 || requested) {

        // one or more arguments passed, validate those targets (ignore duplicates)
        if (args.length >= 1) {
            if (args.includes("me")) {
                validatedSomeone = true;
                name = msg.author;
                v_index = Math.floor(Math.random() * v_msgs.length);
                v_msg = parse(v_msgs[v_index], name);
                msg.channel.send(v_msg);
                console.log("Validated user.");
            }
            if (msg.isMentioned(client.user)) {
                validatedSomeone = true;
                v_msg = parse("Thanks for the sentiment, %s, but I'm a robot who doesn't need validation. " +
                    "I am very emotionally secure!", msg.author);

                console.log("Informed user of Ayybot's emotional security.\n");
                msg.channel.send(v_msg);
            }

            // maybe there are fake names in here. Ayybot will only acknowledge that if it didn't get to validate
            // anybody else.
            mentions = msg.mentions.users.array();
            if (mentions.length == 0) {
                if (!(validatedSomeone)) {
                    v_msg = "Who are you trying to validate? ";
                    if (args.length >= 2) { v_msg += "I don't recognize these names."; }
                    else { v_msg += "I don't recognize this name."; }
                    msg.channel.send(v_msg);
                    return;
                }
            }
            else {
                mentions.forEach(user => {
                    // don't let this dumb bot validate itself after it already made that comment above
                    if (!(user === client.user)) {
                        name = "<@" + user.id + ">";
                        v_index = Math.floor(Math.random() * v_msgs.length);
                        v_msg = parse(v_msgs[v_index], name);
                        msg.channel.send(v_msg);
                        console.log("Validated user.");
                    }
                });
            }
        }

        // no arguments passed; validate message author
        else {
            name = msg.author;
            v_index = Math.floor(Math.random() * v_msgs.length);
            v_msg = parse(v_msgs[v_index], name);
            msg.channel.send(v_msg);
            console.log("Validated user.");
        }
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

function getHelpMsg() {
    help_msgs = [
        "Here's the list of commands you can type.",
        "!help: You already typed this one.",
        "!date: Get the date.",
        "!time: Get the time.",
        "!rand n, where n is an integer: Get a random integer from 0 to n.",
        "!validate: Get a nice compliment from me.",
        "!validate @user: Give a nice compliment to that user."
    ]

    var help_msg = "";

    for (var i = 0; i < help_msgs.length; i++) {
        help_msg += help_msgs[i] + "\n";
    }

    return help_msg;
}

/**********************************************************************************************************************/
/**********************************************************************************************************************/

client.on("message", (msg) => {

    // Ignore bot msgs.
    if (msg.author.bot) return;

    // Ignore DMs.
    if (msg.channel.type !=='text') return;

    if (msg.content.length > 1500) {
        msg.channel.send("Whoa there, friend, that's a lot of text. Hope you're doing well.");
        console.log("User experienced some form of emotional breakdown.")
        return;
    }
    else if (msg.content.substring(0, 1) === '!') {

        var args = msg.content.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);

        switch(cmd) {

            case 'help':
                msg.channel.send(getHelpMsg());
                break;

            case 'date':
                msg.channel.send(getDateMsg());
                break;

            case 'time':
                msg.channel.send(getTimeMsg());
                break;

            case 'rand':
            case 'random':
                msg.channel.send(getRandomMsg(args));
                break;

            case 'validate':
                sendValidationMsg(msg, args, true);
                break;
        }
    }
    else {
        // randomly validate after about 5% of normal user messages (not bot commands)
        sendValidationMsg(msg, []);
    }
});

/**********************************************************************************************************************/
/**********************************************************************************************************************/

client.login(auth.token);