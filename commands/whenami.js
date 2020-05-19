const moment = require('moment');

moment.locale('fr');

module.exports = {
	name: 'whenami',
	execute(msg, args){
		const now = moment();
		const data = `${now.format()}
${now.format('[Y]YYYY [Q]Q [M]MM [WoY] WW[\nDoY]DDDD [DoM]DD [DoW]E[\nH]HH [M]mm [S]ss [FS]SSS[\nTZ] Z[\nTS] X[\nMTS] x')}`;

		msg.channel.send(data, {split: true});
	}
}
