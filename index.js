var request = require('request');
var cheerio = require('cheerio');
require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const Sequelize = require('sequelize');
const url = require('url');

const token = process.env.DISCORD_TOKEN;

const prefix = '.';

var HLCLink = process.env.HLC_LINK

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

client.once('ready', () => {
  trackList.sync();
  carList.sync();
  client.user.setPresence({
    activity: {
        name: '.time' },
        status: 'idle',
        url: 'https://www.github/Akashic101/theGameMaster'})
    .catch(console.error);
    console.log('Ready!');
});

client.on('message', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  let args = message.content.substring(prefix.length).split(" ");

  switch (args[0]) {

    case 'time' :

      var racerArray = [];
      var timeArray = [];

      request(process.env.HLC_LINK, function(error, response, body) {
        if(error) {
          console.log("Error: " + error);
        }
      
        var $ = cheerio.load(body);

        var counter = 0;
      
        $('div.leaderboard > table > tbody > tr > td > table > tbody >').each(function( index ) {
          racerArray[counter] = $(this).find('td.user').text().trim();
          timeArray[counter] = $(this).find('td.time').text().trim();
          counter++;
        });

      const fullSend = /\[FS\]/;

        try {

          const timeEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setURL(HLCLink)
            .setTitle('Hot-Lap-Challenge')
            .setDescription('The current Hot-Lap-Challenge is with the **' + process.env.CAR + "** on **" + process.env.TRACK + "**")
            .setTimestamp()
            .setFooter('theGameMaster', 'https://i.imgur.com/U16E2rZ.png')
            for(var i = 0; i < racerArray.length; i++) {
              if(fullSend.exec(racerArray[i])) {
               timeEmbed.addFields(
                { name: racerArray[i], value: timeArray[i] }); 
              }
            }
          message.channel.send(timeEmbed);
        } catch (e) {
          console.log("error: " + e);
      }
      
    });
    break;

    case 'updateHLC' :

      if(args.length != 2) {return}

      process.env.HLC_LINK = args[1]

      const myURL = new URL(args[1])
      const trackID = myURL.searchParams.get('track')
      const carID = myURL.searchParams.get('vehicle')

      try {
        const trackMatch = await trackList.findOne({where: {id: trackID}});
        const carMatch = await carList.findOne({where: {id: carID}});

        if(carMatch && trackMatch) {

          process.env.CAR = carMatch.name
          process.env.TRACK = trackMatch.name

          const hotLapChallengeEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Hot-Lap-Challenge')
            .setURL(process.env.HLC_LINK)
            .setDescription(`The new Hot-Lap-Challenge is on **${trackMatch.name}** and **${carMatch.name}**`)
            .setThumbnail(carMatch.link)
            .setImage(trackMatch.link)
            .setTimestamp()
            .setFooter('theGameMaster', 'https://i.imgur.com/U16E2rZ.png');
          message.channel.send(hotLapChallengeEmbed);
        }
        else {
          message.channel.send("There was an error. Please recheck if your input was correct. If you think something is broken please open an issue on https://www.github.com/Akashic101/theGameMaster");
        }
      } catch (e) {
        console.log("error: " + e);
    }
    break;

    case 'randomRace' :

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
            .setFooter('theGameMaster', 'https://i.imgur.com/U16E2rZ.png');
          message.channel.send(randomRaceEmbed);
        }
        else {
          message.channel.send("There was an error. Please recheck if your input was correct. If you think something is broken please open an issue on https://www.github.com/Akashic101/theGameMaster");
        }
      } catch (e) {
        message.channel.send("error: " + e);
      }
    break;

    case 'top' :

      var racerArray = [];
      var timeArray = [];
  
      request(process.env.HLC_LINK, function(error, response, body) {
        if(error) {
          console.log("Error: " + error);
        }
        
      var $ = cheerio.load(body);
  
      var counter = 0;
        
      $('div.leaderboard > table > tbody > tr > td > table > tbody >').each(function( index ) {
        racerArray[counter] = $(this).find('td.user').text().trim();
        timeArray[counter] = $(this).find('td.time').text().trim();
        counter++;
      });
  
      const topEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setURL(process.env.HLC_LINK)
        .setTitle('Hot-Lap-Challenge')
        .setDescription('The current Hot-Lap-Challenge is with the **' + process.env.CAR + "** on **" + process.env.TRACK + "**")
        .setTimestamp()
        .setFooter('theGameMaster', 'https://i.imgur.com/U16E2rZ.png')
        for(var i = 0; i < args[1]; i++) {
          topEmbed.addFields(
            { name: racerArray[i], value: timeArray[i] }); 
        }
        return message.channel.send(topEmbed);
      });
    break;
  }
});

client.login(token);
