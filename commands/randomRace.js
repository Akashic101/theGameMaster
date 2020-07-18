const Sequelize = require('sequelize');
const Discord = require('discord.js');

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
	name: 'randomrace',
	description: 'Creates a random race with a random car/track-combo',
	async execute(message, args) {
        try {
            const carMatch = await carList.findOne({ order: Sequelize.literal('random()') })
            const trackMatch = await trackList.findOne({ order: Sequelize.literal('random()') })
            if(carMatch && trackMatch) {
              const randomRaceEmbed = new Discord.MessageEmbed()
                .setColor('#ec4536')
                .setTitle('Random Race')
                .setURL(`http://cars2-stats-steam.wmdportal.com/index.php/leaderboard?track=${trackMatch.id}&vehicle=${carMatch.id}`)
                .setDescription(`The random race is on **${trackMatch.name}** and **${carMatch.name}**`)
                .setThumbnail(carMatch.link)
                .setImage(trackMatch.link)
                .setTimestamp()
                .setFooter('theGameMaster V' + pjson.version, 'https://i.imgur.com/U16E2rZ.png');
              message.channel.send(randomRaceEmbed);
            }
            else {
              message.channel.send("There was an error. Please recheck if your input was correct. If you think something is broken please open an issue on https://www.github.com/Akashic101/theGameMaster");
            }
          } catch (e) {
            message.channel.send("error: " + e);
          }
	},
};