const utils = require('../utils.js');

module.exports = {
	name: 'rrcp',
	args: true,
	usage: '<ranking points> <kills points> <matches>',
	async execute(msg, args){
		if(args.length !== 2 && args.length !== 3) return;
		
		const ranks = Object.fromEntries(args[0].split(',').map(x => x.split(':').map(x => parseInt(x, 10))));
		const [ppk, maxKills] = args[1].split(',').map(x => parseInt(x, 10));

		const data = [];
		data.push(`Points system used :`);
		let precr = 0;
		for(const r in ranks){
			const pr = (precr+1 < r) ? `${utils.toOrd(precr+1)} - ` : '';
			data.push(`${pr}${utils.toOrd(r)} : ${ranks[r]} point${(ranks[r] !== 1) ? 's' : ''}`);
			precr = parseInt(r, 10);
		}
		data.push(`${ppk} point${(ppk !== 1) ? 's' : ''}/kill (max ${maxKills} kill${(maxKills !== 1) ? 's' : ''}/match)`);

		if(args.length === 2) return msg.channel.send(data, {split: true});
		data.push('');
		const matches = args[2].split(',');

		const idToName = {};
		const teams = {};
		const {realmAPI} = msg.client;
		
		for(const match of matches){
			const m = await realmAPI.request('getMatchDetails', [match]);
			if(!m.teams) continue;
			for(const t of m.teams){
				const currentTeamId = t.players.map(p => p.id).sort().join('-');
				if(!teams[currentTeamId])
					teams[currentTeamId] = {gamesPlayed:0, gamesWon:0, killsTotal:0, killsCounted:0, damage:0, points:0};
				teams[currentTeamId].gamesPlayed++;
				if(t.placement === 1) teams[currentTeamId].gamesWon++;
				let kills = 0;
				for(const p of t.players){
					if(!idToName[p.id]) idToName[p.id] = p.name;
					kills += p.kills_player;
					teams[currentTeamId].damage += p.damage_player;
				}
				teams[currentTeamId].killsTotal += kills;
				const counted = (kills > maxKills) ? maxKills : kills;
				teams[currentTeamId].killsCounted += counted;
				teams[currentTeamId].points += counted * ppk;
				const teamrank = Object.keys(ranks).filter(x => x >= t.placement)[0];
				if(teamrank) teams[currentTeamId].points += ranks[teamrank];
			}
		}
		console.log(teams);
		
		let realRank = 0;
		let standRank;
		let precpoints = NaN;
		for(const teamId of Object.keys(teams).sort( (a,b) => {
			if(teams[a].points !== teams[b].points)
				return teams[b].points - teams[a].points;
			if(teams[a].gamesWon !== teams[b].gamesWon)
				return teams[b].gamesWon - teams[a].gamesWon;
			if(teams[a].killsCounted !== teams[b].killsCounted)
				return teams[b].killsCounted - teams[a].killsCounted;
			return teams[b].damage - teams[a].damage;
		})){
			realRank++;
			if(teams[teamId].points !== precpoints){
				standRank = realRank;
				precpoints = teams[teamId].points;
			}
			const teamRank = standRank === 1 ? ':first_place:' :
				standRank === 2 ? ':second_place:' :
				standRank === 3 ? ':third_place:' : `${standRank} :`;
			const teamName = teamId.split('-').map(x => idToName[x]).join(' - ');
			const won = (teams[teamId].gamesWon !== 0) ? `**${teams[teamId].gamesWon}**` : '0';
			const killsdiff = teams[teamId].killsTotal - teams[teamId].killsCounted;
			data.push(`${teamRank} **${teamName}** : ${teams[teamId].points} points, ${won}/${teams[teamId].gamesPlayed} won, ${teams[teamId].killsCounted}${(killsdiff > 0) ? '+'+killsdiff : ''} kills, ${teams[teamId].damage} damage`);
		}
		msg.channel.send(data, {split: true});
	}
}
