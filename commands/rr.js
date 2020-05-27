const Discord = require('discord.js');

module.exports = {
	name: 'rr',
	args: true,
	async execute(msg, args){
		const command = args.shift();
		if(!command.startsWith('&')) return;

		const {realmAPI} = msg.client;

		if(command === '&gsid') return msg.channel.send(realmAPI._sessionId || 'undefined');
		if(command === '&ssid') return realmAPI._sessionId = args[0];
		
		const r = await realmAPI.request(command.slice(1), args);
		console.log(r);
		if(r.teams)
			for(q of r.teams) console.log(q.players);
	}
}
