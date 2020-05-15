const {RealmAPI} = require('../realm.js');

const realmAPI = new RealmAPI();

module.exports = {
	name: 'rr',
	aliases: ['realm'],
	args: true,
	async execute(msg, args){
		
		if(args[0] === 'ping'){
			const r = await realmAPI.ping();
			msg.channel.send(JSON.stringify(r));
		}
		else if(args[0] === 'cs'){
			const r = await realmAPI.createSession();
			msg.channel.send(JSON.stringify(r));
		}

	}
}
