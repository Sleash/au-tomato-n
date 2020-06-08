const realmutils = require('../realm/utils.js');

module.exports = {
	name: 'rrpl',
	args: true,
	async execute(msg, args){
		const {realmAPI, realmPlayers} = msg.client;

		player = await realmutils.getPlayer(args.join(' '), msg.client);
		if(!player) return msg.channel.send('Player not found.');

		const mh = await realmAPI.request('getPlayerMatchHistory', [player]);
		if(!mh.matches) return msg.channel.send(`Player ${player} does not exist.`);
		if(!mh.matches.length) return msg.channel.send(`No matches found for player ${mh.name} (${mh.id}).`);

		const mr = {};
		for(const m of mh.matches){
			if(!mr[m.region]) mr[m.region] = 0;
			mr[m.region]++;
		}
		const data = Object.entries(mr).map(x => `${x[0]} : ${x[1]}`);
		msg.channel.send(`Matches location for ${mh.name} (${mh.id}) :`);
		msg.channel.send(data);
	}
}
