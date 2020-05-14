module.exports = {
	name: 'args',
	args: true,
	execute(msg, args){
		msg.channel.send(`Command : ${this.name}\nArgs : ${args}`);
	}
}
