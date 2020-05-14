require('dotenv').config();

const fs = require('fs');
const Discord = require('discord.js');
const fetch = require('node-fetch');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag} !`);
});

client.login(process.env.DISCORD_TOKEN);
const prefix = process.env.PREFIX;

function react(msg){
	if(msg.content.toLowerCase().includes('japonais')){
		msg.react('🏣');
		msg.react('🏯');
		msg.react('🎎');
		msg.react('🈲');
		msg.react('🈵');
		msg.react('👺');
	}
}

client.on('message', msg => {
	react(msg);
	if(!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if(!command) return;

	if(msg.channel.type === 'dm')
		return msg.reply('I only work in a server !');

	if(command.args && !args.length){
		let reply = "You didn't provide any arguments.";
		if(command.usage)
			reply += `\nThe proper usage would be : \`${prefix}${command.name} ${command.usage}\``;
		return msg.channel.send(reply);
	}

	if(!cooldowns.has(command.name))
		cooldowns.set(command.name, new Discord.Collection());

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);	
	const cooldownAmount = (command.cooldown || 5) * 1000;

	if(timestamps.has(msg.author.id)){
		const expiration = timestamps.get(msg.author.id) + cooldownAmount;
		if(now < expiration){
			const timeLeft = (expiration - now) / 1000;
			return msg.channel.send(`You need to wait ${timeLeft.toFixed(1)} seconds before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(msg.author.id, now);
	setTimeout( () => timestamps.delete(msg.author.id), cooldownAmount);

	try{
		command.execute(msg, args);
	}catch(error){
		console.error(error);
		msg.reply('there was an error trying to execute that command !');
	}
});
