require('dotenv').config();
const prefix = process.env.PREFIX;

module.exports = {
	name: 'help',
	description: 'List all commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	execute(msg, args){
		const data = [];
		const {commands} = msg.client;

		if(!args.length){
			data.push("Here's a list of all commands :");
			data.push(commands.map(command => command.name).join(', '));
			data.push(`Use \`${prefix}help [command name]\` to get info on a specific command.`);

			return msg.channel.send(data, {split: true});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if(!command) return msg.channel.send("That's not a valid command !");

		data.push(`**Name :** ${command.name}`);
		if(command.aliases) data.push(`**Aliases :** ${command.aliases.join(', ')}`);
		if(command.description) data.push(`**Description :** ${command.description}`);
		if(command.usage) data.push(`**Usage :** ${prefix}${command.name} ${command.usage}`);
		data.push(`**Cooldown :** ${command.cooldown || 5} seconds`);

		msg.channel.send(data, {split: true});
		
	}
};
