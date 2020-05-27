const Discord = require('discord.js');

const realmutils = require('../realmutils.js');

module.exports = {
	name: 'rrmh',
	args: true,
	async execute(msg, args){
		const {realmAPI} = msg.client;

		const r = await realmAPI.request('getPlayerMatchHistory', args.slice(0, 1) );

		if(!r.matches.length) return msg.channel.send(`No results found for players ${r.name} (${r.id}).`);

		let nm = 3;
		if(args[1]){
			nm = parseInt(args[1], 10);
			if(isNaN(nm)) nm = 3;
		}

		msg.channel.send(`Results for player ${r.name} (${r.id}).`);
		for(m of r.matches.slice(0, nm)){
			const kd = realmutils.kd(m.kills, m.deaths);
			const emb = new Discord.MessageEmbed()
				.setColor(realmutils.placementColor(m.placement))
				.setTitle(`${m.class_name} ${m.match_queue_name} ${m.region}`)
				.setDescription(`Placement : ${m.placement}\nKills : ${m.kills} Deaths : ${m.deaths} K/D : ${realmutils.kd(m.kills, m.deaths)}\nDamage : ${m.damage} DPK : ${realmutils.dpk(m.damage, m.kills)}\nTaken : ${m.damage_taken} Healing : ${m.healing_player_self}`)
				.setAuthor(`${m.match_id}`);
			msg.channel.send(emb);
		}
	}
}
