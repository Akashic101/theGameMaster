require('dotenv').config();
const Discord = require('discord.js');
var request = require('request');
var cheerio = require('cheerio');
var pjson = require('../package.json');

module.exports = {
    name: 'time',
    description: 'Send the time of the current Hot-Lap-Challenge of the Full-Send-Team',
    execute(message, args) {
        var racerArray = [];
        var timeArray = [];
        var setupArray = [];
        var inputArray = [];
        var cameraArray = [];
        var assistArray = [];
        var timestampArray = [];

        request(process.env.HLC_LINK, function (error, response, body) {
            if (error) {
                console.log("Error: " + error);
            }
            var $ = cheerio.load(body);
            var counter = 0;
            $('div.leaderboard > table > tbody > tr > td > table > tbody >').each(function (index) {
                racerArray[counter] = $(this).find('td.user').text().trim();
                timeArray[counter] = $(this).find('td.time').text().trim();
                setupArray[counter] = $(this).find('td.assists').find('img').eq(0).attr('title');
                inputArray[counter] = $(this).find('td.assists').find('img').eq(1).attr('title');
                cameraArray[counter] = $(this).find('td.assists').find('img').eq(2).attr('title');
                assistArray[counter] = $(this).find('td.assists').find('img').eq(3).attr('title');
                timestampArray[counter] = $(this).find('td.timestamp').text().trim();
                counter++;
            });

            console.log(setupArray[0])
            console.log(inputArray[0])
            console.log(cameraArray[0])
            console.log(assistArray[0])

            const fullSend = /\[FS\]/;

            try {

                const timeEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setURL(process.env.HLC_LINK)
                    .setTitle('Hot-Lap-Challenge')
                    .setDescription('The current Hot-Lap-Challenge is with the **' + process.env.CAR + "** on **" + process.env.TRACK + "**")
                    .setTimestamp()
                    .setFooter('theGameMaster V' + pjson.version, 'https://i.imgur.com/U16E2rZ.png');
                for (var i = 0; i < racerArray.length; i++) {
                    if (fullSend.exec(racerArray[i])) {
                        timeEmbed.addFields({
                            name: racerArray[i],
                            value: timeArray[i],
                            inline: true
                        }, {
                            name: "Assists",
                            value: setupArray[i] + " " + inputArray[i] + " " + cameraArray[i],
                            //value: (matchImage(setupArray[i]) + " " + matchImage(inputArray[i]) + " " + matchImage(cameraArray[i])),
                            inline: true
                        }, {
                            name: "Timestamp",
                            value: timestampArray[i],
                            inline: true
                        });
                    }
                }
                message.channel.send(timeEmbed);
            } catch (e) {
                console.log("error: " + e);
            }
        });
    },
};

function matchImage(input) {
    switch (input) {
        case 'Setup: Custom':
            return client.emojis.cache.find(emoji => emoji.name === "custom");
            break;
        case 'Controller: Wheel':
            return client.emojis.cache.find(emoji => emoji.name === "wheel");
            break;
        case 'Controller: Gamepad':
            return client.emojis.cache.find(emoji => emoji.name === "gamepad");
            break;
        case 'Controller: Keyboard':
            return client.emojis.cache.find(emoji => emoji.name === "keybaord");
            break;
        case 'Camera: External':
            return client.emojis.cache.find(emoji => emoji.name === "external");
            break;
        case 'Controller: Wheel':
            return client.emojis.cache.find(emoji => emoji.name === "wheel");
            break;
    }
}