var request = require('request');
var cheerio = require('cheerio');
require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const Sequelize = require('sequelize');

const token = process.env.DISCORD_TOKEN;

const prefix = '!';

var trackCarLink = "http://cars2-stats-steam.wmdportal.com/index.php/leaderboard?track=1876749797&vehicle=3581682802";

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
  if (message.author.bot) return;

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
        const carMatch = await carList.findOne({ order: Sequelize.literal('random()') })
        const trackMatch = await trackList.findOne({ order: Sequelize.literal('random()') })
        if(carMatch) {
          return message.channel.send('Your random race is on the ' + trackMatch.name + " Track with the car " + carMatch.name)
        }
        else {
            return message.channel.send('error');
        }
    } catch (e) {
        message.channel.send("error: " + e);
}

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

      const fullSend = /\[FS\]/;

      const top10Embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setURL(trackCarLink)
      .setTitle('Hot-Lap-Challenge')
      .setTimestamp()
      for(var i = 0; i < args[1]; i++) {
          top10Embed.addFields(
            { name: racerArray[i], value: timeArray[i] }); 
      }
      message.channel.send(top10Embed);
    });

    break;
  }
});

client.login(token);