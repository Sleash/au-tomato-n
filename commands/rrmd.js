const realmutils = require('../realm/utils.js');

module.exports = {
	name: 'rrmd',
	args: true,
	async execute(msg, args){
		const {realmAPI} = msg.client;
		const m = await realmAPI.request('getMatchDetails', args.slice(0, 1) );
		realmutils.displayMatch(m, msg.channel);
	}
}
