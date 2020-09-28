const utils = require('../utils.js');

module.exports = {
	name: 'rrrt',
	args: true,
	execute(msg, args){
		if(args.length < 2) return;

		const params = args.shift();
		const sizeTeam = parseInt(params[0], 10);
		if(sizeTeam < 1 || sizeTeam > 4) return;

		const uniqueClass = params.includes('u');
		const rClasses = params.includes('uc');
		const rWeapon = params.includes('w');
		const rBuild = params.includes('b');
		const rFull = params.includes('f');
		const rSpawn = params.includes('s');

		let team = 1;
		const data = [];

		const classes = ['Warrior', 'Hunter', 'Assassin', 'Mage'];
		const cweapons = ['Throwing Axe', 'Heavy Hammer', 'Longsword', 'Crossbow', 'Arbalest', 'Longbow', 'Shredder', 'Heirloom Rifle', 'Sniper Rifle', 'Bolt Staff', 'Stone Staff', 'Ice Staff'];
		const csabis = ['Shielding Shout', 'Healing Shout', 'Proximity Trap', 'Flare', 'Sensor Drone', 'Smoke Screen', 'Ice Block', 'Healing Station'];
		const coabis = ['Net Shot', 'Blast Arrow', 'Concussion Grenade', 'Soul Gust'];
		const movs = ['Heroic Leap', 'Charge', 'Dodge Roll', 'Withdraw', 'Blink', 'Hidden', 'Soar', 'Ghost Walk'];

		const nweapons = ['Slug Rifle', 'Revolver', 'Burst Rifle', 'Assaut Rifle', 'SMG', 'Shotgun', 'Pistol', 'The Gatekeeper', 'LMG', 'Plasma Launcher'];
		const nsabis = ['Healing Flask', 'Shielding Flask', 'Barricade', 'Fortification'];
		const noabis = ['Turret', 'Fire Bomb', 'Skull of Chaos', 'Grounding Shock'];

		const spawns = ['Goblin Gulch', 'Northport', 'Old Manor', 'Frozen Cemetery', 'Icehaven', 'Coldmist Village', 'Valley', 'Crossing', 'Gun Town', 'Outpost', 'Lumberfall', 'Fungal Jungle', 'Jaguar\'s Claws', 'Forbidden Swamp', 'Lost Forge', 'Autumn Fields', 'Jade Gardens', 'Sentinel Hold', 'Trinity Hills', 'Seaside Graveyard'];

		const aweapons = cweapons.concat(nweapons);
		const asabis = csabis.concat(nsabis);
		const aoabis = coabis.concat(noabis);

		while(args.length){
			data.push(`**Team ${team}**`);
			let teammember = 0;
			let dclasses = 0;
			while(args.length && teammember < sizeTeam){
				let p, c, w, w2, sa, oa, m, s;
				p = args.splice(utils.randInt(args.length), 1);
				if(rClasses || rFull){
					do{ c = utils.randInt(4) } while(uniqueClass && (dclasses & (1 << c)));
					dclasses |= 1 << c;
				}
				if(rWeapon || rFull){
					if(rClasses && !rFull){
						w = cweapons[3 * c + utils.randInt(3)];
					}else{
						w = aweapons[utils.randInt(aweapons.length)];
					}
				}
				if(rClasses && rBuild){
					sa = csabis[2 * c + utils.randInt(2)];
					m = movs[2 * c + utils.randInt(2)];
				}
				if(rFull){
					do{ w2 = aweapons[utils.randInt(aweapons.length)] } while(w === w2);
					sa = asabis[utils.randInt(asabis.length)];
					oa = aoabis[utils.randInt(aoabis.length)];
					m = movs[utils.randInt(movs.length)];
				}
				if(rSpawn){
					s = ` \u2192 ${utils.prob(1, 1000) ? 'Ocean' : spawns[utils.randInt(spawns.length)]}`;
				}
				c = classes[c];

				data.push(`\t${p} (${c?c+',':''}${w?w+',':''}${w2?w2+',':''}${sa?sa+',':''}${oa?oa+',':''}${m?m:''})${s?s:''}`);
				teammember++;
			}
			team++;
		}
		msg.channel.send(data, {split: true});
	}
}
