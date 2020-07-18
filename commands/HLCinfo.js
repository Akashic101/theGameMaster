const Sequelize = require('sequelize');
const Discord = require('discord.js');
var pjson = require('../package.json');

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
	name: 'hlcinfo',
	description: 'Send info about the current Hot-Lap-Challenge!',
	async execute(message, args) {
        const infoURL = new URL(process.env.HLC_LINK)

        const infoTrackID = infoURL.searchParams.get('track')
        const infoCarID = infoURL.searchParams.get('vehicle')

        try {
            const trackMatch = await trackList.findOne({where: {id: infoTrackID}});
            const carMatch = await carList.findOne({where: {id: infoCarID}});

            if(carMatch && trackMatch) {

                const infoEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Hot-Lap-Challenge')
                    .setURL(process.env.HLC_LINK)
                    .setDescription(`The current Hot-Lap-Challenge is on **${trackMatch.name}** and **${carMatch.name}**`)
                    .setThumbnail(carMatch.link)
                    .setImage(trackMatch.link)
                    .setTimestamp()
                    .setFooter('theGameMaster V' + pjson.version, 'https://i.imgur.com/U16E2rZ.png');
                    message.channel.send(infoEmbed);
            }
            else {
                message.channel.send("There was an error. Please recheck if your input was correct. If you think something is broken please open an issue on https://www.github.com/Akashic101/theGameMaster");
            }
        } catch (e) {
            console.log("error: " + e);
        }
	},
};