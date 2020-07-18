const Sequelize = require('sequelize');
const Discord = require('discord.js');

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
	name: 'randomcar',
	description: 'Creates a random car',
	async execute(message, args) {
        try {
            const carMatch = await carList.findOne({ order: Sequelize.literal('random()') })
            if(carMatch) {
              const randomCarEmbed = new Discord.MessageEmbed()
                .setColor('#ec4536')
                .setTitle('Random Car')
                .setDescription(`The random car is **${carMatch.name}**`)
                .setImage(carMatch.link)
                .setTimestamp()
                .setFooter('theGameMaster V' + pjson.version, 'https://i.imgur.com/U16E2rZ.png');
              message.channel.send(randomCarEmbed);
            }
            else {
              message.channel.send("There was an error. Please recheck if your input was correct. If you think something is broken please open an issue on https://www.github.com/Akashic101/theGameMaster");
            }
          } catch (e) {
            message.channel.send("error: " + e);
          }
	},
};