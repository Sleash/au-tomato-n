const Discord = require('discord.js');

const realmutils = require('../realmutils.js');

module.exports = {
	name: 'rrmd',
	args: true,
	async execute(msg, args){
		const {realmAPI} = msg.client;

		const r = await realmAPI.request('getMatchDetails', args.slice(0, 1) );

		if(!r.teams.length) return msg.channel.send(`No results found for match ${r.match_queue_name} ${r.region} (${r.match_id})`);

		msg.channel.send(`Results for match ${r.match_queue_name} ${r.region} (${r.match_id})`);	

		for(m of r.teams){
			const emb = new Discord.MessageEmbed()
				.setColor(realmutils.placementColor(m.placement))
				.setTitle(m.placement);
			for(p of m.players){
				emb.addField(`[${p.class_name}] **${p.name}** (level ${p.level})`, `K **${p.kills_bot}** D **${p.deaths}** K/D **${realmutils.kd(p.kills_bot, p.deaths)}**\nDamage **${p.damage_player}** DPK **${realmutils.dpk(p.damage_player, p.kills_bot)}**\nTaken **${p.damage_taken}** Heal **${p.healing_player}** Self-heal **${p.healing_player_self}**`);
			}
			msg.channel.send(emb);
		}
	}
}
