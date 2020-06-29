const Discord = require('discord.js');

const realmutils = require('../realm/utils.js');

module.exports = {
	name: 'rrcm',
	args: true,
	async execute(msg, args){
		const {realmAPI, realmPlayers} = msg.client;

		const players = args.join(' ').split(',');
		if(players.length < 2) return;

		const playersid = await Promise.all(players.map(p => realmutils.getPlayer(p, msg.client)));
		if(playersid.indexOf(undefined) !== -1)
			return msg.channel.send(`Player ${players[playersid.indexOf(undefined)]} not found.`);

		console.log(playersid);

		const pmh = [];
		for(const p of playersid){
			const cpmh = await realmAPI.request('getPlayerMatchHistory', [p]);
			if(!cpmh.matches) return msg.channel.send(`Player ${p} does not exist.`);
			pmh.push(cpmh);
		}

		msg.channel.send(`Common matches for ${pmh.map(x => x.name)} :`);

		for(const m of pmh[0].matches){
			const emb = [];
			let icm;
			for(p of pmh){
				icm = p.matches.findIndex(x => x.match_id === m.match_id);
				if(icm === -1) break;
				const cm = p.matches[icm];
				emb.push(new Discord.MessageEmbed()
					.setColor(realmutils.placementColor(cm.placement))
					.setTitle(`[${cm.class_name}] ${p.name}`)
					.setDescription(`Placement : ${cm.placement}\nKills : ${cm.kills} Deaths : ${cm.deaths} K/D : ${realmutils.kd(cm.kills, cm.deaths)}\nDamage : ${cm.damage} DPK : ${realmutils.dpk(cm.damage, cm.kills)}\nTaken : ${cm.damage_taken} Healing : ${cm.healing_player_self}`)
					.setURL(`https://realmtracker.com/match/pc/${m.match_id}`)
				);
			}
			if(icm === -1) continue;
			msg.channel.send(`Match ${m.match_queue_name} ${m.region} ${m.match_datetime} (${m.match_id}) :`);
			for(e of emb) msg.channel.send(e);
		}
		
	}
}
