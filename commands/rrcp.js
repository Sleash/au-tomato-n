const utils = require('../utils.js');
const rrutils = require('../realm/utils.js');

module.exports = {
	name: 'rrcp',
	args: true,
	usage: '<c|i> <ranking points> <kills points> <matches>',
	async execute(msg, args){
		if(args.length !== 3 && args.length !== 4) return;

		const displayMode = args.shift();
		//if(displayMode !== 'c' && displayMode !== 'i' && displayMode !== 'ci') return;
		if(!['c', 'i', 'ci'].includes(displayMode)) return;
		
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

		const teams = {};
		const players = {};
		const {realmAPI} = msg.client;
		
		for(const match of matches){
			const m = await realmAPI.request('getMatchDetails', [match]);
			if(!m.teams) continue;
			for(const t of m.teams){
				const currentTeamId = t.players.map(p => p.id).sort().join('-');
				if(!teams[currentTeamId])
					teams[currentTeamId] = {gamesPlayed:0, gamesWon:0, killsTotal:0, killsCounted:0, damage:0, points:0};
				teams[currentTeamId].gamesPlayed++;
				let kills = 0;
				for(const p of t.players){
					if(!players[p.id])
						players[p.id] = {name:p.name, gamesPlayed:0, gamesWon:0, kills:0, damage:0, points:0};

					kills += p.kills_player;
					teams[currentTeamId].damage += p.damage_player;

					players[p.id].gamesPlayed++;
					if(t.placement === 1) players[p.id].gamesWon++;
					players[p.id].kills += p.kills_player;
					players[p.id].damage += p.damage_player;
				}
				if(t.placement === 1) teams[currentTeamId].gamesWon++;
				teams[currentTeamId].killsTotal += kills;
				const counted = (kills > maxKills) ? maxKills : kills;
				teams[currentTeamId].killsCounted += counted;

				let points = counted * ppk;
				const teamrank = Object.keys(ranks).filter(x => x >= t.placement)[0];
				if(teamrank) points += ranks[teamrank];

				teams[currentTeamId].points += points;
				for(const p of t.players) players[p.id].points += points;
			}
		}
		console.log(teams);
		
		let realRank;
		let standRank;
		let precpoints;

		if(displayMode.includes('c')){
			realRank = 0;
			precpoints = NaN;

			data.push("Classical ranking :");
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
				const teamName = teamId.split('-').map(x => players[x].name).join(' - ');
				const won = (teams[teamId].gamesWon !== 0) ? `**${teams[teamId].gamesWon}**` : '0';
				const killsdiff = teams[teamId].killsTotal - teams[teamId].killsCounted;
				data.push(`${rrutils.placementDisplay(standRank)} **${teamName}** : ${teams[teamId].points} points, ${won}/${teams[teamId].gamesPlayed} won, ${teams[teamId].killsCounted}${(killsdiff > 0) ? '+'+killsdiff : ''} kills, ${teams[teamId].damage} damage`);
			}
		}

		if(displayMode === 'ci') data.push("");

		if(displayMode.includes('i')){
			realRank = 0;
			precpoints = NaN;

			data.push("Individual ranking :");
			for(const pid of Object.keys(players).sort( (a,b) => {
				if(players[a].points !== players[b].points)
					return players[b].points - players[a].points;
				if(players[a].gamesWon !== players[b].gamesWon)
					return players[b].gamesWon - players[b].gamesWon;
				if(players[a].kills !== players[b].kills)
					return players[b].kills - players[a].kills;
				return players[b].damage - players[a].damage;
			})){
				realRank++;
				if(players[pid].points !== precpoints){
					standRank = realRank;
					precpoints = players[pid].points;
				}
				const pwon = (players[pid].gamesWon !== 0) ? `**${players[pid].gamesWon}**` : '0';
				data.push(`${rrutils.placementDisplay(standRank)} **${players[pid].name}** : ${players[pid].points} points, ${pwon}/${players[pid].gamesPlayed} won, ${players[pid].kills} kills, ${players[pid].damage} damage`);
			}
		}

		msg.channel.send(data, {split: true});
	}
}
