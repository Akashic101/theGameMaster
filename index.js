require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const token = process.env.DISCORD_TOKEN;

const prefix = '.';

client.login(token)

client.once('ready', () => {
  console.log('Ready!');
  client.user.setPresence({
    activity: {
        name: '.time' },
        status: 'idle',
        url: 'https://www.github/Akashic101/theGameMaster'})
    .catch(console.error);

});

client.on('message', async message => {

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  
  if (!client.commands.has(command)) return;

  try {
    client.commands.get(command).execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
})