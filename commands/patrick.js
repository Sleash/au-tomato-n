module.exports = {
	name: 'patrick',
	execute(msg, args){
		let tosend = '';
		for(const emo of msg.guild.emojis.cache.array()){
			console.log(emo.toString());
			tosend += emo.toString();
		}
		msg.channel.send(tosend);
	}
}
