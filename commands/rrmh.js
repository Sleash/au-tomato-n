const Discord = require('discord.js');

const realmutils = require('../realm/utils.js');

module.exports = {
	name: 'rrmh',
	args: true,
	async execute(msg, args){
		const {realmAPI, realmPlayers} = msg.client;

		let nm = parseInt(args[0], 10);
		if(isNaN(nm)) nm = 3;
		else args.shift();

		player = await realmutils.getPlayer(args.join(' '), msg.client);
		if(!player) return msg.channel.send('Player not found.');

		const mh = await realmAPI.request('getPlayerMatchHistory', [player]);
		if(!mh.matches) return msg.channel.send('This player does not exist.');
		if(!mh.matches.length) return msg.channel.send(`No matches found for player ${mh.name} (${mh.id}).`);

		msg.channel.send(`Results for player ${mh.name} (${mh.id}).`);
		for(m of mh.matches.slice(0, nm)){
			const kd = realmutils.kd(m.kills, m.deaths);
			const emb = new Discord.MessageEmbed()
				.setColor(realmutils.placementColor(m.placement))
				.setTitle(`${m.class_name} ${m.match_queue_name} ${m.region}`)
				.setDescription(`Placement : ${m.placement}\nKills : ${m.kills} Deaths : ${m.deaths} K/D : ${realmutils.kd(m.kills, m.deaths)}\nDamage : ${m.damage} DPK : ${realmutils.dpk(m.damage, m.kills)}\nTaken : ${m.damage_taken} Healing : ${m.healing_player_self}`)
				.setAuthor(`${m.match_id}`)
				.setFooter(`${m.match_datetime}`);
			msg.channel.send(emb);
		}
	}
}
