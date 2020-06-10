var request = require('request');
var cheerio = require('cheerio');
require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();

const token = process.env.DISCORD_TOKEN;

const prefix = '!';

client.once('ready', () => {
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

      request("http://cars2-stats-steam.wmdportal.com/index.php/leaderboard?track=1876749797&vehicle=3581682802", function(error, response, body) {
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
      .setURL('http://cars2-stats-steam.wmdportal.com/index.php/leaderboard?track=1876749797&vehicle=3581682802')
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

    case 'top' :

      var racerArray = [];
      var timeArray = [];

      request("http://cars2-stats-steam.wmdportal.com/index.php/leaderboard?track=1876749797&vehicle=3581682802", function(error, response, body) {
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
      .setURL('http://cars2-stats-steam.wmdportal.com/index.php/leaderboard?track=1876749797&vehicle=3581682802')
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