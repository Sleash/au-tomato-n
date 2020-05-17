const fetch = require('node-fetch');

module.exports = {
	name: 'dog',
	async execute(msg, args){
		const r = await fetch('https://random.dog/woof.json').then(res => res.json());
		msg.channel.send(r.url);
	}
}
