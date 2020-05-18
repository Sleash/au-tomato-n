const fetch = require('node-fetch');

module.exports = {
	name: 'tos',
	async execute(msg, args){
		const r = await fetch('https://thesetermsofservicedontexist.com/api/tos').then(res => res.json());

		msg.channel.send(`**${r.t}**`);
		for(let i = 0; i < 5; i++)
			msg.channel.send(r.p[i]);
	}
}
