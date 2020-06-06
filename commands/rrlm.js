const realmutils = require('../realm/utils.js');

module.exports = {
	name: 'rrlm',
	args: true,
	async execute(msg, args){
		const {realmAPI} = msg.client;
		player = await realmutils.getPlayer(args.join(' '), msg.client);
		if(!player) return msg.channel.send('Player not found.');

		const mh = await realmAPI.request('getPlayerMatchHistory', [player]);
		if(!mh.matches) return msg.channel.send('This player does not exist.');
		if(!mh.matches.length) return msg.channel.send(`No matches found for player ${mh.name} (${mh.id}).`);

		const m = await realmAPI.request('getMatchDetails', [mh.matches[0].match_id]);
		realmutils.displayMatch(m, msg.channel);
	}
}
