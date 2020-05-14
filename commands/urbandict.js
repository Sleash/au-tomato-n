const fetch = require('node-fetch');
const querystring = require('querystring');

module.exports = {
	name: 'urbandict',
	aliases: ['urban', 'dict'],
	args: true,
	async execute(msg, args){
		const query = querystring.stringify({ term: args.join(' ') });
		const {list} = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(res => res.json());
		
		if(!list.length)
			return msg.channel.send(`No results found for **${args.join(' ')}**.`);

		msg.channel.send(list[0].definition);
		//TO COMPLETE
	}
}
