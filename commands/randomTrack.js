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

module.exports = {
	name: 'randomtrack',
	description: 'Creates a random track',
	async execute(message, args) {
        try {
            const trackMatch = await trackList.findOne({ order: Sequelize.literal('random()') })
            if(trackMatch) {
              const randomTrackEmbed = new Discord.MessageEmbed()
                .setColor('#ec4536')
                .setTitle('Random Track')
                .setDescription(`The random track is **${trackMatch.name}**`)
                .setImage(trackMatch.link)
                .setTimestamp()
                .setFooter('theGameMaster V' + pjson.version, 'https://i.imgur.com/U16E2rZ.png');
              message.channel.send(randomTrackEmbed);
            }
            else {
              message.channel.send("There was an error. Please recheck if your input was correct. If you think something is broken please open an issue on https://www.github.com/Akashic101/theGameMaster");
            }
          } catch (e) {
            message.channel.send("error: " + e);
          }
	},
};