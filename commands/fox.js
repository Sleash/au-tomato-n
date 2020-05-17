const fetch = require('node-fetch');

module.exports = {
	name: 'fox',
	async execute(msg, args){
		const r = await fetch('https://randomfox.ca/floof').then(res => res.json());
		msg.channel.send(r.image);
	}
}
