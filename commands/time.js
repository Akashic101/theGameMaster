require('dotenv').config();
const Discord = require('discord.js');
var request = require('request');
var cheerio = require('cheerio');
var pjson = require('../package.json');
const Canvas = require(`canvas`);
const fs = require('fs');

module.exports = {
    name: 'time',
    description: 'Send the time of the current Hot-Lap-Challenge of the Full-Send-Team',
    async execute(client, message, args) {
        var racerArray = [];
        var timeArray = [];
        var setupArray = [];
        var inputArray = [];
        var cameraArray = [];
        var assistArray = [];
        var timestampArray = [];
        var width = 0;

        request(process.env.HLC_LINK, async function (error, response, body) {
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
                assistArray[counter] = $(this).find('td.assists').find('img').eq(3).attr('alt');
                timestampArray[counter] = $(this).find('td.timestamp').text().trim();
                counter++;
            });

            const fullSend = /\[FS\]/;

            for (var i = 0; i < racerArray.length; i++) {
                if (fullSend.exec(racerArray[i])) {
                    width = width + 100;
                }
            }

            try {

                const canvas = Canvas.createCanvas(1000, width);
                const ctx = canvas.getContext(`2d`);

                ctx.font = `bold 20px Arial`;
                ctx.fillStyle = `white`;

                var background = await Canvas.loadImage('./images/canvas_background.jpg');
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

                var distance = 50;
                var setup;
                var controls;
                var camera;
                var assists;

                for (var i = 0; i < racerArray.length; i++) {
                    if (fullSend.exec(racerArray[i])) {

                        ctx.fillText(`Place`, 10, 20);
                        ctx.fillText(`Driver`, 100, 20);
                        ctx.fillText(`Time`, 420, 20);
                        ctx.fillText(`Assists`, 585, 20);
                        ctx.fillText(`Timestamp`, 825, 20);

                        ctx.fillText(i + 1, 20, distance);
                        ctx.fillText(racerArray[i], 80, distance);
                        ctx.fillText(timeArray[i], 400, distance);

                        setup = await Canvas.loadImage(matchImage(setupArray[i]));
                        ctx.drawImage(setup, 550 + 13 * 2, distance - setup.height);

                        controls = await Canvas.loadImage(matchImage(inputArray[i]));
                        ctx.drawImage(controls, 550 + 26 * 2, distance - setup.height);

                        camera = await Canvas.loadImage(matchImage(cameraArray[i]));
                        ctx.drawImage(camera, 550 + 39 * 2, distance - setup.height);

                        assists = await Canvas.loadImage(matchImage(assistArray[i]));
                        ctx.drawImage(assists, 550 + 52 * 2, distance - setup.height);

                        ctx.fillText(timestampArray[i], 800, distance);

                        distance = distance + 95;
                    }
                }

                var buffer = canvas.toBuffer('image/png')
                fs.writeFileSync('./images/time.png', buffer)

                var attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'image.png');

                const timeEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setURL(process.env.HLC_LINK)
                    .setTitle('Hot-Lap-Challenge')
                    .setDescription('The current Hot-Lap-Challenge is with the **' + process.env.CAR + "** on **" + process.env.TRACK + "**")
                    .attachFiles(attachment)
                    .setImage("attachment://image.png")
                    .setTimestamp()
                    .setFooter("theGameMaster V" + pjson.version, "https://i.imgur.com/BrFMwZX.png");

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
            return "./images/custom.png";
        case 'Setup: Default':
            return "./images/default.png";
        case 'Controller: Wheel':
            return "./images/wheel.png";
        case 'Controller: Gamepad':
            return "./images/gamepad.png";
        case 'Controller: Keyboard':
            return "./images/keyboard.png";
        case 'Camera: External':
            return "./images/external.png";
        case 'Camera: In-car':
            return "./images/internal.png";
        case 'Driving aids: Enabled':
            return "./images/enabled.png";
        case 'Driving aids: Autoclutch only':
            return "./images/clutch_only.png";
        case 'Driving aids: None':
            return "./images/none.png";
    }
}