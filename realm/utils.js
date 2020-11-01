const Discord = require('discord.js');

exports.placementColor = p => (
	(p === 1) ? '#FFD700' :
	(p === 2) ? '#C0C0C0' :
	(p === 3) ? '#CD7F32' :
	(p <= 10) ? '#0000A0' : '#A00000');

exports.placementDisplay = p => (
	(p === 1) ? ':first_place:' :
	(p === 2) ? ':second_place:' :
	(p === 3) ? ':third_place:' : `${p}`);

exports.kd = (k, d) => ((d === 0) ? '\u221E' : (k/d).toFixed(2));

exports.dpk = (d, k) => ((k === 0) ? '\u221E' : (d/k).toFixed(2));

exports.getPlayer = async (p, client) => {
	const {realmAPI, realmPlayers} = client;
	const wtfp = `WTF ${p}`;
	if(realmPlayers[wtfp]) return realmPlayers[wtfp];
	if(realmPlayers[p]) return realmPlayers[p];
	if(!isNaN(parseInt(p, 10))) return p;
	const wtfps = await realmAPI.request('searchPlayers', [wtfp]);
	if(wtfps.length) return wtfps[0].id;
	const ps = await realmAPI.request('searchPlayers', [p]);
	if(ps.length) return ps[0].id;
};

exports.displayMatch = (m, channel) => {
	if(!m.teams) return channel.send('This match does not exist.');
	if(!m.teams.length) return channel.send(`No results found for match ${m.match_queue_name} ${m.region} (${m.match_id})`);

	channel.send(`Results for match ${m.match_queue_name} ${m.region} (${m.match_id})`);

	for(t of m.teams){
		const emb = new Discord.MessageEmbed()
			.setColor(exports.placementColor(t.placement))
			.setTitle(t.placement);
		for(p of t.players){
			emb.addField(`[${p.class_name}] **${p.name}** (level ${p.level}) (${p.id})`, `K **${p.kills_bot}** D **${p.deaths}** K/D **${exports.kd(p.kills_bot, p.deaths)}**\nDamage **${p.damage_player}** DPK **${exports.dpk(p.damage_player, p.kills_bot)}**\nTaken **${p.damage_taken}** Heal **${p.healing_player}** Self-heal **${p.healing_player_self}**`);
		}
		channel.send(emb);
	}
};
