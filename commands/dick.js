const utils = require('../utils.js');

module.exports = {
	name: 'dick',
	aliases : ['cock'],
	args: true,
	execute(msg, args){
		const data = [];
		for(const a of args){
			let lg = 0;
			while(utils.prob(94, 100)) lg++;

			let balls = '8';
			if(utils.prob(1, 100)) balls = 'o';
			if(utils.prob(1, 2000)) balls = 'ꙮ';

			let baserod = '=';
			if(utils.prob(1, 60)) baserod = '-';
			if(utils.prob(1, 900)) baserod = '≈';

			let tip = 'D';
			if(utils.prob(1, 25)) tip = 'Đ';
			if(utils.prob(1, 400)) tip = 'B';

			const rod = (lg == 0) ? '' : baserod.repeat(lg - 1) + tip;
			data.push(`${a} : ${balls}${rod}`);
		}
		msg.channel.send(data, {split: true});
	}
}
