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
                timestampArray[counter] = $(this).find('td.timestamp').text().trim();
                counter++;
            });

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