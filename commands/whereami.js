module.exports = {
	name: 'whereami',
	execute(msg, args){
		msg.channel.send(`${msg.channel}`);
		msg.channel.send(`${msg.channel.name}, ${msg.channel.last_message_id}, ${msg.channel.parent_id}`);
	}
}
