module.exports = {
	name: 'dick',
	aliases : ['cock'],
	args: true,
	execute(msg, args){
		const data = [];
		for(const a of args){
			let lg = 0;
			while(94 > 100 * Math.random()) lg++;
			const balls = (1 > 100 * Math.random()) ? 'o' : '8';
			const rod = (lg == 0) ? '' : '='.repeat(lg - 1)+'D';
			data.push(`${a} : ${balls}${rod}`);
		}
		msg.channel.send(data, {split: true});
	}
}
