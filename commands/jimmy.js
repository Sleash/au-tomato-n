const Discord = require('discord.js'); 
const fetch = require('node-fetch');

module.exports = {
	name: 'jimmy',
	aliases: ['japojuif'],
	args: true,
	async execute(msg, args){
		let nb = parseInt(args[0], 10);
		if(isNaN(nb)) nb = 1;
		else args.shift();

		const r = await fetch(`https://jisho.org/search/${args.join(' ')}`).then(res => res.text());
		const rsplit = r.split('\n');
		let ind = 0;
		let ri = 0;
		while(ri < nb){
			ind = rsplit.findIndex( (s,i) => i > ind && s.trim() === '<span class="text">');
			if(ind === -1) break;
			const word = rsplit[ind+1].trim().replace( /<\/?span>/g , '');
			ind = rsplit.findIndex( (s,i) => i > ind && s.trim().startsWith("<div class='meanings-wrapper'>") );
			const def = rsplit[ind]
				.replace( /Read more/g , '')
				.replace( /<\/div>/g , '\n')
				.replace( /&#8203/g , '\u200b')
				.replace( /&quot;/g , '"')
				.replace( /<[^>]*>/g , '');
			console.log(`https://jisho.org/word/${word}`);
			const emb = new Discord.MessageEmbed()
				.setColor('#FF0000')
				.setTitle(word)
				.setDescription(def)
				.setAuthor(`Result ${++ri}`, '', `https://jisho.org/word/${word}`);
			msg.channel.send(emb);
		}
		if(ri === 0)
			msg.channel.send('No results found.');
	}
}
