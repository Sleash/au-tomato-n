module.exports = {
	name: 'server',
	execute(msg, args){
		msg.channel.send(`You're in ${msg.guild.name}, with ${msg.guild.memberCount} members.`);
	}
}
