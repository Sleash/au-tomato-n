module.exports = {
	name: 'dick',
	args: true,
	execute(msg, args){
		const data = [];
		for(const a of args){
			data.push(`${a} : 8${'='.repeat(Math.random() * 30)}D`);
		}
		msg.channel.send(data, {split: true});
	}
}
