require('dotenv').config();
const fetch = require('node-fetch');
const moment = require('moment');
const md5 = require('md5');

class RealmAPI{
	constructor(){
		this.devId = process.env.RR_DEVID;
		this.authKey = process.env.RR_AUTHKEY;
		this.endpoint = "http://api.realmroyale.com/realmapi.svc"
	}
	
	//Internal methods
	_getTimestamp(){
		return moment.utc().format('YYYYMMDDHHmmss');
	}
	_generateSignature(method){
		return md5(`${this.devId}${method}${this.authKey}${this._getTimestamp()}`);
	}
	_generateURL(method){
		return `${this.endpoint}/${method}json/${this.devId}/${this._generateSignature(method)}`;
	}
	_generateURLwSession(method){
		return `${this._generateURL(method)}/${this.sessionId}/${this.getTimestamp()}`;
	}
	_httpRequest(url){
		const r = fetch(url)
			.then(res => (res.ok) ? res.json() : `[ERROR] Request answered with a ${res.status} status code.`);
		return r;
	}
	
	//Public methods
	async createSession(){
		const uri = `${this._generateURL('createsession')}/${this._getTimestamp()}`;
		const resJSON = await this._httpRequest(uri);
		if(resJSON.ret_msg.toLowerCase() === 'approved')
			this.sessionId = resJSON.session_id;
		return resJSON;
	}
	ping(){
		const uri = `${this.endpoint}/pingjson`;
		return this._httpRequest(uri);
	}
}

module.exports = {RealmAPI};
