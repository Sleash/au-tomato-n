
exports.trim = (str, max) => ((str.length > max) ? `${str.slice(0, max-3)}...` : str);

exports.convertFromHTML = str => (str
		.replace( /<\/div>/g , '\n')
		.replace( /&#8203/g , '\u200b')
		.replace( /&#34;|&quot;/g , '"')
		.replace( /&#39;|&apos;/g , "'")
		.replace( /&#60;|&lt;/g , '<')
		.replace( /&#62;|&gt;/g , '>')
		.replace( /<[^>]*>/g , ''));

exports.randInt = i => Math.floor(Math.random() * Math.floor(i));

exports.prob = (num, den) => (num > exports.randInt(den));

exports.pad2 = n => (`0${n}`.slice(-2));

exports.toOrd = n => (
	(n%10 === 1 && n%100 !== 11) ? `${n}st` :
	(n%10 === 2 && n%100 !== 12) ? `${n}nd` :
	(n%10 === 3 && n%100 !== 13) ? `${n}rd` :
	`${n}th`);
