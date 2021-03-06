const Discord = require('discord.js');
const fetch = require('node-fetch');
const querystring = require('querystring');

const utils = require('../utils.js');

module.exports = {
	name: 'urbandict',
	aliases: ['urban', 'dict'],
	args: true,
	usage: '<words>...',
	async execute(msg, args){
		const query = querystring.stringify({ term: args.join(' ') });
		const {list} = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(res => res.json());
		
		if(!list.length)
			return msg.channel.send(`No results found for **${args.join(' ')}**.`);

		const [answer] = list;
		const embed = new Discord.MessageEmbed()
			.setColor('#FF0000')
			.setTitle(answer.word)
			.setURL(answer.permalink)
			.addFields(
				{name: 'Definition', value: utils.trim(answer.definition, 1024) },
				{name: 'Example', value: utils.trim(answer.example, 1024) },
				{name: 'Rating', value: `${answer.thumbs_up} 👍\t${answer.thumbs_down} 👎`}
			);

		msg.channel.send(embed);
	}
}
