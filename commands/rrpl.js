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

		const mr = {}, mq = {}, mc = {};
		let tk = 0, td = 0, tdmg = 0, ttkn = 0;
		for(const m of mh.matches){
			if(!mr[m.region]) mr[m.region] = 0;
			mr[m.region]++;
			if(!mq[m.match_queue_name]) mq[m.match_queue_name] = 0;
			mq[m.match_queue_name]++;
			if(!mc[m.class_name]) mc[m.class_name] = 0;
			mc[m.class_name]++;
			tk += m.kills;
			td += m.deaths;
			tdmg += m.damage;
			ttkn += m.damage_taken;
		}

		const disp = x => Object.entries(x).map(y => `\t${y[0]} : ${y[1]}`);
		const data = [];
		data.push(`Last matches stats for ${mh.name} (${mh.id}) :`);
		data.push(`**Performance**`);
		data.push(`\t${tk} kills, ${td} deaths, ${realmutils.kd(tk, td)} K/D`);
		data.push(`\t${tdmg} damage, ${ttkn} taken, ${realmutils.dpk(tdmg, tk)} DPK`);
		data.push(`**Locations**`);
		data.push(...disp(mr));
		data.push(`**Queues**`);
		data.push(...disp(mq));
		data.push(`**Classes**`);
		data.push(...disp(mc));

		msg.channel.send(data)
	}
}
