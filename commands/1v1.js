const Discord = require('discord.js');
var pjson = require('../package.json');
const Canvas = require(`canvas`);
const Sequelize = require('sequelize');
const fs = require('fs');

const challengeSeq = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'challenge.sqlite',
});

const challengeList = challengeSeq.define('challengeList', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
    },
    driver_1: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    driver_2: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    track: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    car: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    winner: {
        type: Sequelize.STRING,
        defaultValue: 'TBD'
    }
});

challengeList.sync();

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

var raceId;

module.exports = {
    name: '1v1',
    description: 'Creates a 1v1 race between two members',
    async execute(client, message, args) {

        switch (args[0]) {
            case `update`:
                var messageEmbed = new Discord.MessageEmbed()
                    .setColor(`#02E9CF`)
                    .setDescription('What is the id of the challenge?');
                message.channel.send(messageEmbed)
                message.channel.awaitMessages(m => m.author.id == message.author.id, {
                    max: 1,
                    time: 30000
                }).then(async collected => {
                    if (isNaN(collected.first().content)) {
                        return message.reply(`Your input was not a number. Please specify the correct id to update the challenge`);
                    } else {
                        try {
                            raceId = collected.first().content;

                            var challengeMatch = await challengeList.findOne({
                                where: {
                                    id: raceId
                                }
                            })
                            if (challengeMatch) {

                                message.channel.send(`Challenge ${challengeMatch.id} is between <@${challengeMatch.driver_1}> and <@${challengeMatch.driver_2}> on ${challengeMatch.track} with the ${challengeMatch.car}. Who won the race (Please @ the winner)`)
                                message.channel.awaitMessages(m => m.author.id == message.author.id, {
                                    max: 1,
                                }).then(async collected => {
                                    winner = collected.first().content.slice(2, -1);

                                    if (!(challengeMatch.driver_1 == winner || challengeMatch.driver_2 == winner)) {
                                        return message.reply(`<@${winner}> is not one of the two drivers. Therefore they cannot win the race`)
                                    }

                                    var affectedRows = await challengeList.update({
                                        winner: winner
                                    }, {
                                        where: {
                                            id: raceId
                                        }
                                    });

                                    if (affectedRows > 0) {
                                        return message.reply(`Challenge ${raceId} was edited. The winner is <@${winner}>`);
                                    }
                                })
                            }
                        } catch (e) {
                            console.log(e)

                        }
                    }
                })
                break;
            case 'status':
                var messageEmbed = new Discord.MessageEmbed()
                    .setColor(`#02E9CF`)
                    .setDescription('What is the id of the challenge?');
                message.channel.send(messageEmbed)
                message.channel.awaitMessages(m => m.author.id == message.author.id, {
                    max: 1,
                }).then(async collected => {
                    if (isNaN(collected.first().content)) {
                        return message.reply(`Your input was not a number. Please specify the correct id to update the challenge`);
                    } else {
                        try {
                            raceId = collected.first().content;
                            var challengeMatch = await challengeList.findOne({
                                where: {
                                    id: raceId
                                }
                            })

                            if (challengeMatch) {
                                var car = await carList.findOne({
                                    where: {
                                        name: challengeMatch.car
                                    }
                                })

                                var track = await trackList.findOne({
                                    where: {
                                        name: challengeMatch.track
                                    }
                                })
                            } else {
                                return message.reply(`I could not find the challenge for this id`)
                            }

                            var canvas = Canvas.createCanvas(784 * 2, 500);
                            var ctx = canvas.getContext(`2d`);

                            var background = await Canvas.loadImage('./images/canvas_background.jpg');
                            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

                            ctx.font = `bold 30px Arial`;
                            ctx.fillStyle = `white`;
                            ctx.fillText(`CAR`, 784 * 0.5, 50);
                            ctx.fillText(`TRACK`, 784 * 1.40, 50);

                            var carImage = await Canvas.loadImage(car.link);
                            var trackImage = await Canvas.loadImage(track.link);

                            ctx.drawImage(carImage, 0, 100);
                            ctx.drawImage(trackImage, 784, 100);

                            var buffer = canvas.toBuffer('image/png')
                            fs.writeFileSync('./images/status.png', buffer)

                            var attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'image.png');

                            var statusEmbed = new Discord.MessageEmbed()
                                .setTitle(`**Challenge status!**`)
                                .setDescription(`Status of challenge ${challengeMatch.id} on **${challengeMatch.track}** with the **${challengeMatch.car}**`)
                                .setColor(`#02E9CF`)
                                .setTimestamp()
                                .addFields({
                                    name: `Driver 1`,
                                    value: `<@${challengeMatch.driver_1}>`,
                                    inline: true
                                }, {
                                    name: `Driver 2`,
                                    value: `<@${challengeMatch.driver_2}>`,
                                    inline: true
                                }, {
                                    name: `Winner`,
                                    value: `<@${challengeMatch.winner}>`,
                                    inline: true
                                })
                                .attachFiles(attachment)
                                .setImage("attachment://image.png")
                                .setFooter("theGameMaster V" + pjson.version, "https://i.imgur.com/BrFMwZX.png");

                            return message.channel.send(statusEmbed)

                        } catch (e) {
                            console.log(e)
                        }
                    }
                })
                break;
            case `info`:
                var messageEmbed = new Discord.MessageEmbed()
                    .setColor(`#02E9CF`)
                    .setDescription('Which driver do you want informations about? (Please @ them)');
                message.channel.send(messageEmbed)
                message.channel.awaitMessages(m => m.author.id == message.author.id, {
                    max: 1,
                    time: 30000
                }).then(collected => {
                    driver = collected.first().content.slice(2, -1);
                    challengeList.findAndCountAll({
                        where: {
                            winner: driver
                        }
                    }).then(wins => {
                        challengeList.findAndCountAll({
                            $or: [{
                                    driver_1: {
                                        $eq: driver
                                    }
                                },
                                {
                                    driver_2: {
                                        $eq: driver
                                    }
                                }
                            ]
                        }).then(races => {
                            var infoEmbed = new Discord.MessageEmbed()
                                .setColor(`#02E9CF`)
                                .setDescription(`<@${driver}> won ${wins.count} out of ${races.count} races`);
                            return message.channel.send(infoEmbed)
                        })
                    })
                })
                break;
            default:
                if (!message.mentions.users.size) {
                    var messageEmbed = new Discord.MessageEmbed()
                        .setColor(`#02E9CF`)
                        .setDescription(`Please mention the user with @ you want to race against`);
                    return message.channel.send(messageEmbed)
                }

                if (message.author.id == message.mentions.users.first().id) {
                    var messageEmbed = new Discord.MessageEmbed()
                        .setColor(`#02E9CF`)
                        .setDescription(`You cannot race against yourself`);
                    return message.channel.send(messageEmbed)
                }

                try {
                    var carMatch = await carList.findOne({
                        order: Sequelize.literal('random()')
                    })
                    var trackMatch = await trackList.findOne({
                        order: Sequelize.literal('random()')
                    })

                    if (carMatch && trackMatch) {
                        try {
                            var challenge = await challengeList.create({
                                driver_1: message.author.id,
                                driver_2: message.mentions.users.first().id,
                                track: trackMatch.name,
                                car: carMatch.name
                            })

                            var canvas = Canvas.createCanvas(784 * 2, 500);
                            var ctx = canvas.getContext(`2d`);

                            var background = await Canvas.loadImage('./images/canvas_background.jpg');
                            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

                            ctx.font = `bold 30px Arial`;
                            ctx.fillStyle = `white`;
                            ctx.fillText(`CAR`, 784 * 0.5, 50);
                            ctx.fillText(`TRACK`, 784 * 1.40, 50);

                            var car = await Canvas.loadImage(carMatch.link);
                            var track = await Canvas.loadImage(trackMatch.link);

                            ctx.drawImage(car, 0, 100);
                            ctx.drawImage(track, 784, 100);

                            var buffer = canvas.toBuffer('image/png')
                            fs.writeFileSync('./images/canvas.png', buffer)

                            var attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'image.png');

                            var challengeEmbed = new Discord.MessageEmbed()
                                .setTitle(`**A new challenge!**`)
                                .setDescription(`${message.author.username} has challenged ${message.mentions.users.first().username} to a 1v1-race. The challenge-id is **${challenge.id}**`)
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
                                .setImage("attachment://image.png")
                                .setFooter("theGameMaster V" + pjson.version, "https://i.imgur.com/BrFMwZX.png");

                            message.channel.send(challengeEmbed)
                        } catch (e) {
                            console.log("error: " + e);
                        }
                    }
                } catch (e) {
                    console.log("error: " + e);
                }
                break;
        }
    }
}