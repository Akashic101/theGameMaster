const Discord = require('discord.js');
var pjson = require('../package.json');
const Canvas = require(`canvas`);
const Sequelize = require('sequelize');
const fs = require('fs');

const trackListSeq = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'trackList.sqlite',
});

const trackList = trackListSeq.define('trackList', {

    timestamps: false,

    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING
    },
    link: {
        type: Sequelize.STRING
    },
    used: {
        type: Sequelize.INTEGER
    }
});

const carListSeq = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'carList.sqlite',
});

const carList = carListSeq.define('carList', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING
    },
    link: {
        type: Sequelize.STRING
    },
    used: {
        type: Sequelize.INTEGER
    }
});

module.exports = {
    name: '1v1',
    description: 'Creates a 1v1 race between two members',
    async execute(client, message, args) {
        if (!message.mentions.users.size) {
            return message.reply('Please mention the user you want to challenge');
        }

        const canvas = Canvas.createCanvas(784 * 2, 500);
        const ctx = canvas.getContext(`2d`);

        var background = await Canvas.loadImage('./images/canvas_background.jpg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.font = `bold 30px Arial`;
        ctx.fillStyle = `white`;
        ctx.fillText(`CAR`, 784 * 0.5, 50);
        ctx.fillText(`TRACK`, 784 * 1.25, 50);

        try {
            var carMatch = await carList.findOne({
                order: Sequelize.literal('random()')
            })
            var trackMatch = await trackList.findOne({
                order: Sequelize.literal('random()')
            })

            if (carMatch && trackMatch) {
                var car = await Canvas.loadImage(carMatch.link);
                var track = await Canvas.loadImage(trackMatch.link);

                ctx.drawImage(car, 0, 100);
                ctx.drawImage(track, 784, 100);
            }

        } catch (e) {
            console.log("error: " + e);
        }
        var buffer = canvas.toBuffer('image/png')
        fs.writeFileSync('./images/canvas.png', buffer)

        var attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'image.png');

        var challenge = new Discord.MessageEmbed()
            .setTitle(`**A new challenge!**`)
            .setDescription(`${message.author.username} has challenged ${message.mentions.users.first().username} to a 1v1-race`)
            .setColor(`#02E9CF`)
            .setTimestamp()
            .addFields({
                name: `Car`,
                value: carMatch.name,
                inline: true
            }, {
                name: `Track`,
                value: trackMatch.name,
                inline: true
            })
            .attachFiles(attachment)
            .setImage(`attachment://image.png`)
            .setFooter(`theGameMaster V` + pjson.version, 'https://i.imgur.com/BrFMwZX.png');
        message.channel.send(challenge)
    },
};