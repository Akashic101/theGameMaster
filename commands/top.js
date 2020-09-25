require('dotenv').config();
const Discord = require('discord.js');
var request = require('request');
var cheerio = require('cheerio');
var pjson = require('../package.json');

module.exports = {
    name: 'top',
    description: 'Send the top X of the current Hot-Lap-Challenge',
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

            const topEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setURL(process.env.HLC_LINK)
                .setTitle('Hot-Lap-Challenge')
                .setDescription('The current Hot-Lap-Challenge is with the **' + process.env.CAR + "** on **" + process.env.TRACK + "**")
                .setTimestamp()
                .setFooter('theGameMaster', 'https://i.imgur.com/U16E2rZ.png')
            for (var i = 0; i < args[0]; i++) {
                topEmbed.addFields({
                    name: racerArray[i],
                    value: timeArray[i],
                    inline: true
                }, {
                    name: "Assists",
                    value: setupArray[i] + "\n" + inputArray[i] + "\n" + cameraArray[i] + "\n" + assistArray[i],
                    //value: (matchImage(setupArray[i]) + " " + matchImage(inputArray[i]) + " " + matchImage(cameraArray[i])),
                    inline: true
                }, {
                    name: "Timestamp",
                    value: timestampArray[i],
                    inline: true
                });
            }
            return message.channel.send(topEmbed);
        });
    },
};