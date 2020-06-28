var request = require('request');
var cheerio = require('cheerio');
require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const Sequelize = require('sequelize');

const token = process.env.DISCORD_TOKEN;

const prefix = '.';

var trackCarLink = 'http://cars2-stats-steam.wmdportal.com/index.php/leaderboard?track=904625875&vehicle=809291220';
var car;
var track;

const trackListSeq = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'trackList.sqlite',
});

const trackList = trackListSeq.define('trackList', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
  },
  name: {
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
  used: {
    type: Sequelize.INTEGER
  }
});

client.once('ready', () => {
  trackList.sync();
  carList.sync();
  console.log('Ready!');
  client.user.setPresence({
    activity: {
        name: '!time' },
        status: 'idle',
        url: 'https://www.github/Akashic101/theGameMaster'})
    .catch(console.error);
});

client.on('message', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  let args = message.content.substring(prefix.length).split(" ");

  switch (args[0]) {

    case 'time' :

      var racerArray = [];
      var timeArray = [];

      request(trackCarLink, function(error, response, body) {
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

      const timeEmbed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setURL(trackCarLink)
      .setTitle('Hot-Lap-Challenge')
      .setDescription('The current Hot-Lap-Challenge is with the **' + car + "** on **" + track + "**")
      .setTimestamp()
      for(var i = 0; i < racerArray.length; i++) {
        if(fullSend.exec(racerArray[i])) {
          timeEmbed.addFields(
            { name: racerArray[i], value: timeArray[i] }); 
        }
      }
      message.channel.send(timeEmbed);
    });
    break;

    case 'randomRace' :

      try {
        console.log("Step 1")
        const carMatch = await carList.findOne({ order: Sequelize.literal('random()') })
        console.log("Step 2")
        const trackMatch = await trackList.findOne({ order: Sequelize.literal('random()') })
        console.log("Step 3")
        message.channel.send(`Your random race is on the ${trackMatch.name} with the ${carMatch.name}`)
        if(carMatch) {
          console.log("Step 4")
        }
        else {
            return message.channel.send('error');
        }
    } catch (e) {
        message.channel.send("error: " + e);
  }
  break;

    case 'updateInfo' :
      track = args[1].replace(/_/g, " ")
      car = args[2].replace(/_/g, " ")
      return message.channel.send('The new Hot-Lap-Challenge is with the **' + car + "** on **" + track + "**")

      case 'top' :

        var racerArray = [];
        var timeArray = [];
  
        request(trackCarLink, function(error, response, body) {
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
        .setURL(trackCarLink)
        .setTitle('Hot-Lap-Challenge')
        .setDescription('The current Hot-Lap-Challenge is with the **' + car + "** on **" + track + "**")
        .setTimestamp()
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
