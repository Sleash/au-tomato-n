const Discord = require('discord.js');
const fetch = require('node-fetch');

const utils = require('../utils.js');

module.exports = {
	name: 'or',
	args: true,
	async execute(msg, args){

		const r = await fetch(`https://en.openrussian.org/suggestions?q=${encodeURIComponent(args.join(' '))}&dummy=${Date.now()}`)
			.then(res => res.json());

		if(r.words.length === 0) return msg.channel.send('No results found.');

		const rwords = [];
		for(const w of r.words)
			rwords.push(`**${w.ru}** : ${w.tls}`);

		const rsent = [];
		for(const s of r.sentences)
			rsent.push(`**${s.ru}** : ${s.tl}`);

		const emb = new Discord.MessageEmbed()
			.setColor('#0000FF')
			.setTitle(r.term)
			.addFields(
				{name: "Words", value: utils.trim(rwords.join('\n'), 1024)},
				{name: "Sentences", value: utils.trim(rsent.join('\n'), 1024)}
			);
		msg.channel.send(emb);
	}
}
