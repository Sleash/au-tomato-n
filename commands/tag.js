const Discord = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment');

const utils = require('../utils.js');

moment.locale('fr', {weekdays: 'Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi'.split('_')});

const currentDaystamp = () => (moment().format('X') % 86400 + 60 * moment().utcOffset());
const currentMillistamp = () =>(parseInt(moment().format('x')) + 60000 * moment().utcOffset());

function daystampToString(ds){
	const dur = moment.duration(ds, 's');
	return `${utils.pad2(dur.hours())}h${utils.pad2(dur.minutes())}`;
}

async function getLigne(msg, ligne, color){

	const now = currentMillistamp();
	const r = await fetch(`http://data.metromobilite.fr/api/ficheHoraires/json?route=SEM:${ligne}&time=${now}`)
		.then(res => res.json());

	const data = [];
	for(let a = 0; a < 2; a++){
		for(const b of r[a].arrets){
			const hm = b.trips.map(x => daystampToString(x));
			data.push(`${b.stopName} : ${hm.join(' | ')}`);
		}
		data.push('');
	}
	msg.channel.send(data, {split: true} );
}

async function getArret(msg, ligne, arret, color){

	const arretId = await retrieveStopId(ligne, arret);
	if(!arretId.length) return msg.channel.send('Stop not found.');

	console.log(arretId);

	const cds = currentDaystamp();

	for(const i of arretId){
		const arretData = await fetch(`http://data.metromobilite.fr/api/routers/default/index/stops/${i}/stoptimes`)
			.then(res => res.json());
		if(!arretData.length) continue;
		const hor = [];
		for (const arret of arretData) {
			if(!arret.pattern.id.startsWith(`SEM:${ligne}`)) continue;
			for (const h of arret.times) {
				const timeLeft = moment.duration(h.realtimeDeparture - cds, 's');
				hor.push(`${daystampToString(h.realtimeDeparture)} (${timeLeft.minutes()}min${timeLeft.seconds()}s) [${h.realtime ? 'realtime' : 'scheduled'}]`);
			}

			const emb = new Discord.MessageEmbed()
				.setColor(color)
				.setTitle(`${ligne} \u2192 ${arret.pattern.lastStopName}`)
				.setDescription(`${hor.join('\n')}`)
				.setAuthor(`${arret.times[0].stopId} ${arret.times[0].stopName}`)
				.setFooter(`${moment().format('dddd DD-MM-YYYY HH:mm:ss')}`);
			msg.channel.send(emb);
		}
	}
}

async function retrieveLineColor(ligne){
	const r = await fetch(`http://data.metromobilite.fr/api/routers/default/index/routes?codes=SEM:${ligne}`)
		.then(res => (res.ok) ? res.json() : 0);
	if(r.length) return `#${r[0].color}`;
}

async function retrieveStopId(ligne, arret){
	const r = await fetch(`http://data.metromobilite.fr/api/ficheHoraires/json?route=SEM:${ligne}`)
		.then(res => res.json());

	data = [];
	for(let a = 0; a < 2; a++)
		for(b of r[a].arrets)
			if(b.parentStation.name === arret)
				data.push(b.stopId);
	return data;
}

module.exports = {
	name: 'tag',
	args: true,
	async execute(msg, args){

		const ligne = args.shift();
		const color = await retrieveLineColor(ligne);
		if(!color) return msg.channel.send('Line not found.');
		
		if(!args.length) getLigne(msg, ligne, color);
		else {
			const arret = args.join(' ');
			getArret(msg, ligne, arret, color);
		}
	}
}
