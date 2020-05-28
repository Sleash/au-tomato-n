require('dotenv').config();
const fetch = require('node-fetch');
const moment = require('moment');
const md5 = require('md5');

class RealmAPI{
	constructor(){
		this._devId = process.env.RR_DEVID;
		this._authKey = process.env.RR_AUTHKEY;
		this._endpoint = "http://api.realmroyale.com/realmapi.svc";

		this.QUEUE = {
			Solo: 474,
			Duo: 475,
			Quad: 476
		};
	}
	
	//Internal methods
	_getTimestamp(){
		return moment.utc().format('YYYYMMDDHHmmss');
	}
	_generateSignature(method){
		return md5(`${this._devId}${method.toLowerCase()}${this._authKey}${this._getTimestamp()}`);
	}
	_generateURL(method){
		return `${this._endpoint}/${method}json/${this._devId}/${this._generateSignature(method)}`;
	}
	_generateURLwSession(method){
		return `${this._generateURL(method)}/${this._sessionId}/${this._getTimestamp()}`;
	}
	_httpRequest(url){
		const r = fetch(url)
			.then(res => (res.ok) ? res.json() : `[ERROR] Request answered with a ${res.status} status code.`);
		return r;
	}
	
	//Public generic methods
	ping(){
		const uri = `${this._endpoint}/pingjson`;
		return this._httpRequest(uri);
	}
	async request(req, args){
		if(this.sessionExpired())
			await this.createSession();
		return await this[req](...args);
	}
	sessionExpired(){
		return !this._sessionId || !this._sessionEnd || !this._sessionEnd.isValid() || moment.utc().isAfter(this._sessionEnd);
	}
	async createSession(){
		const uri = `${this._generateURL('createsession')}/${this._getTimestamp()}`;
		const resJSON = await this._httpRequest(uri);
		if(resJSON.ret_msg.toLowerCase() === 'approved'){
			this._sessionId = resJSON.session_id;
			this._sessionEnd = moment.utc().add(15, 'm');
			console.log(`Created Realm API session with id ${this._sessionId}.`);
		}
		return resJSON;
	}
	testSession(){
		const uri = this._generateURLwSession('testsession');
		return this._httpRequest(uri);
	}
	getDataUsed(){
		const uri = this._generateURLwSession('getdataused');
		return this._httpRequest(uri);
	}
	getHirezServerStatus(){
		const uri = this._generateURLwSession('gethirezserverstatus');
		return this._httpRequest(uri);
	}
	getPatchInfo(){
		const uri = this._generateURLwSession('getpatchinfo');
		return this._httpRequest(uri);
	}

	//Public specific methods
	getLeaderboard(queue, criteria){
		const uri = `${this._generateURLwSession('getleaderboard')}/${queue}/${criteria}`;
		return this._httpRequest(uri);
	}
	getMatchDetails(matchId){
		const uri = `${this._generateURLwSession('getmatchdetails')}/${matchId}`;
		return this._httpRequest(uri);
	}
	getMatchIDsByQueue(queue, date, hour){
		const uri = `${this._generateURLwSession('getmatchidsbyqueue')}/${queue}/${date}/${hour}`;
		return this._httpRequest(uri);
	}
	getPlayer(player, platform){
		const uri = `${this._generateURLwSession('getplayer')}/${player}/${platform}`;
		return this._httpRequest(uri);
	}
	getPlayerMatchHistory(player){
		const uri = `${this._generateURLwSession('getplayermatchhistory')}/${player}`;
		return this._httpRequest(uri);
	}
	getPlayerStats(player){
		const uri = `${this._generateURLwSession('getplayerstats')}/${player}`;
		return this._httpRequest(uri);
	}
	getPlayerStatus(player){
		const uri = `${this._generateURLwSession('getplayerstatus')}/${player}`;
		return this._httpRequest(uri);
	}
	searchPlayers(...aplayer){
		const player = aplayer.join(' ');
		const uri = `${this._generateURLwSession('searchplayers')}/${player}`;
		return this._httpRequest(uri);
	}
}

module.exports = {RealmAPI};
