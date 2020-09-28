module.exports = {
	name: 'age',
	execute(msg, args){
		if(!msg.mentions.users.size)
			msg.channel.send(`Discord : ${msg.author.createdAt}\nServer : ${msg.member.joinedAt}`);	
		else
			msg.channel.send(msg.mentions.members.map(mbr => `**${mbr.user.username}** :\n\t*Discord* : ${mbr.user.createdAt}\n\t*Server* : ${mbr.joinedAt}`));	
	}
};
