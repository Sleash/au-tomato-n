module.exports = {
	name: 'avatar',
	execute(msg, args){
		if(!msg.mentions.users.size)
			msg.channel.send(msg.author.displayAvatarURL({format: 'png', dynamic: true}));
		else
			msg.channel.send(msg.mentions.users.map(usr => `${usr.username} : ${usr.displayAvatarURL({format: 'png', dynamic: true })}`));
		},
	};
