module.exports = {
	name: 'presence',
	args: true,
	usage: '<user>',
	execute(msg, args){
		const usr = msg.mentions.users.first();
		const data = [];
		data.push(`**Status :** ${usr.presence.status}`);
		const sta = usr.presence.clientStatus;
		data.push(`\t*Web :* ${usr.presence.clientStatus.web || 'offline'}`);
		data.push(`\t*Mobile :* ${usr.presence.clientStatus.mobile || 'offline'}`);
		data.push(`\t*Desktop :* ${usr.presence.clientStatus.desktop || 'offline'}`);
		msg.channel.send(data);
	}
}
