const fetch = require('node-fetch');

module.exports = {
	name: 'cat',
	aliases: ['hugo'],
	async execute(msg, args){
		const r = await fetch('https://aws.random.cat/meow').then(res => res.json());
		msg.channel.send(r.file);
	}
}
