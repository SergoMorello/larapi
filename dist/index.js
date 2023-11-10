/*! For license information please see index.js.LICENSE.txt */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.API=t():e.API=t()}(self,(()=>{return e={487:e=>{var t={utf8:{stringToBytes:function(e){return t.bin.stringToBytes(unescape(encodeURIComponent(e)))},bytesToString:function(e){return decodeURIComponent(escape(t.bin.bytesToString(e)))}},bin:{stringToBytes:function(e){for(var t=[],s=0;s<e.length;s++)t.push(255&e.charCodeAt(s));return t},bytesToString:function(e){for(var t=[],s=0;s<e.length;s++)t.push(String.fromCharCode(e[s]));return t.join("")}}};e.exports=t},12:e=>{var t,s;t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",s={rotl:function(e,t){return e<<t|e>>>32-t},rotr:function(e,t){return e<<32-t|e>>>t},endian:function(e){if(e.constructor==Number)return 16711935&s.rotl(e,8)|4278255360&s.rotl(e,24);for(var t=0;t<e.length;t++)e[t]=s.endian(e[t]);return e},randomBytes:function(e){for(var t=[];e>0;e--)t.push(Math.floor(256*Math.random()));return t},bytesToWords:function(e){for(var t=[],s=0,i=0;s<e.length;s++,i+=8)t[i>>>5]|=e[s]<<24-i%32;return t},wordsToBytes:function(e){for(var t=[],s=0;s<32*e.length;s+=8)t.push(e[s>>>5]>>>24-s%32&255);return t},bytesToHex:function(e){for(var t=[],s=0;s<e.length;s++)t.push((e[s]>>>4).toString(16)),t.push((15&e[s]).toString(16));return t.join("")},hexToBytes:function(e){for(var t=[],s=0;s<e.length;s+=2)t.push(parseInt(e.substr(s,2),16));return t},bytesToBase64:function(e){for(var s=[],i=0;i<e.length;i+=3)for(var r=e[i]<<16|e[i+1]<<8|e[i+2],a=0;a<4;a++)8*i+6*a<=8*e.length?s.push(t.charAt(r>>>6*(3-a)&63)):s.push("=");return s.join("")},base64ToBytes:function(e){e=e.replace(/[^A-Z0-9+\/]/gi,"");for(var s=[],i=0,r=0;i<e.length;r=++i%4)0!=r&&s.push((t.indexOf(e.charAt(i-1))&Math.pow(2,-2*r+8)-1)<<2*r|t.indexOf(e.charAt(i))>>>6-2*r);return s}},e.exports=s},67:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=class{constructor(e,t,s){Object.defineProperty(this,"events",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"_name",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"callback",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.events=s,this._name=e,this.callback=t,this.events[e]||(this.events[e]=[]),this.events[e].push(this)}get name(){return this._name}emit(e){this.callback(e)}remove(){this.events[this.name]=this.events[this.name].filter((e=>e!==this)),this._name="",this.callback=()=>{}}}},452:function(e,t,s){"use strict";var i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const r=i(s(67));class a{constructor(e){Object.defineProperty(this,"listeners",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"events",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.listeners=[],this.events={},this.emit=this.emit.bind(this),this.addListener=this.addListener.bind(this),this.removeAllListeners=this.removeAllListeners.bind(this),"boolean"==typeof e&&!0===e?this.events=a.events[a.globalName]:"string"==typeof e&&e!==a.globalName&&(a.events[e]||(a.events[e]={}),this.events=a.events[e])}emit(e,t){this.events[e]&&this.events[e].forEach((e=>{e.emit(t)}))}addListener(e,t){const s=new r.default(e,t,this.events);return this.listeners.push(s),s}removeAllListeners(){this.listeners.reverse().forEach((e=>{e.remove()}))}}Object.defineProperty(a,"globalName",{enumerable:!0,configurable:!0,writable:!0,value:"__global"}),Object.defineProperty(a,"events",{enumerable:!0,configurable:!0,writable:!0,value:{[a.globalName]:{}}}),t.default=a},648:function(e,t,s){"use strict";var i,r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=r(s(452));class n extends a.default{}i=n,Object.defineProperty(n,"instance",{enumerable:!0,configurable:!0,writable:!0,value:new n(!0)}),Object.defineProperty(n,"emit",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.emit}),Object.defineProperty(n,"addListener",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.addListener}),Object.defineProperty(n,"removeAllListeners",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.removeAllListeners}),t.default=n},738:e=>{function t(e){return!!e.constructor&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)}e.exports=function(e){return null!=e&&(t(e)||function(e){return"function"==typeof e.readFloatLE&&"function"==typeof e.slice&&t(e.slice(0,0))}(e)||!!e._isBuffer)}},568:(e,t,s)=>{var i,r,a,n,h;i=s(12),r=s(487).utf8,a=s(738),n=s(487).bin,(h=function(e,t){e.constructor==String?e=t&&"binary"===t.encoding?n.stringToBytes(e):r.stringToBytes(e):a(e)?e=Array.prototype.slice.call(e,0):Array.isArray(e)||e.constructor===Uint8Array||(e=e.toString());for(var s=i.bytesToWords(e),o=8*e.length,c=1732584193,u=-271733879,l=-1732584194,d=271733878,p=0;p<s.length;p++)s[p]=16711935&(s[p]<<8|s[p]>>>24)|4278255360&(s[p]<<24|s[p]>>>8);s[o>>>5]|=128<<o%32,s[14+(o+64>>>9<<4)]=o;var f=h._ff,b=h._gg,m=h._hh,g=h._ii;for(p=0;p<s.length;p+=16){var v=c,y=u,P=l,O=d;c=f(c,u,l,d,s[p+0],7,-680876936),d=f(d,c,u,l,s[p+1],12,-389564586),l=f(l,d,c,u,s[p+2],17,606105819),u=f(u,l,d,c,s[p+3],22,-1044525330),c=f(c,u,l,d,s[p+4],7,-176418897),d=f(d,c,u,l,s[p+5],12,1200080426),l=f(l,d,c,u,s[p+6],17,-1473231341),u=f(u,l,d,c,s[p+7],22,-45705983),c=f(c,u,l,d,s[p+8],7,1770035416),d=f(d,c,u,l,s[p+9],12,-1958414417),l=f(l,d,c,u,s[p+10],17,-42063),u=f(u,l,d,c,s[p+11],22,-1990404162),c=f(c,u,l,d,s[p+12],7,1804603682),d=f(d,c,u,l,s[p+13],12,-40341101),l=f(l,d,c,u,s[p+14],17,-1502002290),c=b(c,u=f(u,l,d,c,s[p+15],22,1236535329),l,d,s[p+1],5,-165796510),d=b(d,c,u,l,s[p+6],9,-1069501632),l=b(l,d,c,u,s[p+11],14,643717713),u=b(u,l,d,c,s[p+0],20,-373897302),c=b(c,u,l,d,s[p+5],5,-701558691),d=b(d,c,u,l,s[p+10],9,38016083),l=b(l,d,c,u,s[p+15],14,-660478335),u=b(u,l,d,c,s[p+4],20,-405537848),c=b(c,u,l,d,s[p+9],5,568446438),d=b(d,c,u,l,s[p+14],9,-1019803690),l=b(l,d,c,u,s[p+3],14,-187363961),u=b(u,l,d,c,s[p+8],20,1163531501),c=b(c,u,l,d,s[p+13],5,-1444681467),d=b(d,c,u,l,s[p+2],9,-51403784),l=b(l,d,c,u,s[p+7],14,1735328473),c=m(c,u=b(u,l,d,c,s[p+12],20,-1926607734),l,d,s[p+5],4,-378558),d=m(d,c,u,l,s[p+8],11,-2022574463),l=m(l,d,c,u,s[p+11],16,1839030562),u=m(u,l,d,c,s[p+14],23,-35309556),c=m(c,u,l,d,s[p+1],4,-1530992060),d=m(d,c,u,l,s[p+4],11,1272893353),l=m(l,d,c,u,s[p+7],16,-155497632),u=m(u,l,d,c,s[p+10],23,-1094730640),c=m(c,u,l,d,s[p+13],4,681279174),d=m(d,c,u,l,s[p+0],11,-358537222),l=m(l,d,c,u,s[p+3],16,-722521979),u=m(u,l,d,c,s[p+6],23,76029189),c=m(c,u,l,d,s[p+9],4,-640364487),d=m(d,c,u,l,s[p+12],11,-421815835),l=m(l,d,c,u,s[p+15],16,530742520),c=g(c,u=m(u,l,d,c,s[p+2],23,-995338651),l,d,s[p+0],6,-198630844),d=g(d,c,u,l,s[p+7],10,1126891415),l=g(l,d,c,u,s[p+14],15,-1416354905),u=g(u,l,d,c,s[p+5],21,-57434055),c=g(c,u,l,d,s[p+12],6,1700485571),d=g(d,c,u,l,s[p+3],10,-1894986606),l=g(l,d,c,u,s[p+10],15,-1051523),u=g(u,l,d,c,s[p+1],21,-2054922799),c=g(c,u,l,d,s[p+8],6,1873313359),d=g(d,c,u,l,s[p+15],10,-30611744),l=g(l,d,c,u,s[p+6],15,-1560198380),u=g(u,l,d,c,s[p+13],21,1309151649),c=g(c,u,l,d,s[p+4],6,-145523070),d=g(d,c,u,l,s[p+11],10,-1120210379),l=g(l,d,c,u,s[p+2],15,718787259),u=g(u,l,d,c,s[p+9],21,-343485551),c=c+v>>>0,u=u+y>>>0,l=l+P>>>0,d=d+O>>>0}return i.endian([c,u,l,d])})._ff=function(e,t,s,i,r,a,n){var h=e+(t&s|~t&i)+(r>>>0)+n;return(h<<a|h>>>32-a)+t},h._gg=function(e,t,s,i,r,a,n){var h=e+(t&i|s&~i)+(r>>>0)+n;return(h<<a|h>>>32-a)+t},h._hh=function(e,t,s,i,r,a,n){var h=e+(t^s^i)+(r>>>0)+n;return(h<<a|h>>>32-a)+t},h._ii=function(e,t,s,i,r,a,n){var h=e+(s^(t|~i))+(r>>>0)+n;return(h<<a|h>>>32-a)+t},h._blocksize=16,h._digestsize=16,e.exports=function(e,t){if(null==e)throw new Error("Illegal argument "+e);var s=i.wordsToBytes(h(e,t));return t&&t.asBytes?s:t&&t.asString?n.bytesToString(s):i.bytesToHex(s)}},828:function(e,t,s){"use strict";var i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const r=i(s(648));t.default=class{constructor(e){Object.defineProperty(this,"cache",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"initData",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"events",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"host",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.events=new r.default,this.host="http://127.0.0.1/",this.cache={},this.initData={},this.setHost=this.setHost.bind(this),this.setInitData=this.setInitData.bind(this),this.clearCacheGroup=this.clearCacheGroup.bind(this),e&&Object.assign(this,{host:null==e?void 0:e.host,events:null==e?void 0:e.events,cache:null==e?void 0:e.cache,initData:null==e?void 0:e.initData})}getCache(e){if(this.cache[e]){if((new Date).getTime()<=this.cache[e].time+36e8)return this.cache[e].data;delete this.cache[e]}}isJsonString(e){try{JSON.parse(e)}catch(e){return!1}return!0}setHost(e){this.host=e}setCache(e,t,s){this.cache[e]={time:(new Date).getTime(),data:t,group:s}}clearCacheGroup(e,t,s="id"){if(t){const i=e=>{if(s&&(null==e?void 0:e[s])===(null==t?void 0:t[s])||null===s)for(const s in e)if(s in t)return!1;return!0};for(const t in this.cache)this.cache[t].group===e&&(Array.isArray(this.cache[t].data)?this.cache[t].data=Object.values(this.cache[t].data).filter(i):i(this.cache[t].data)||delete this.cache[t])}else for(const t in this.cache)this.cache[t].group===e&&delete this.cache[t]}setDataTree(e,t,s){const i=t.split("."),r=i.pop(),a=i.reduce(((e,t)=>e[t]=e[t]||{}),e);return"number"==typeof r&&(a[r]=s),e}updateCacheGroup(e,t,s="id"){const i=e=>{const i=e,r=s.split(".");if(r.length>1)for(const t of r)e=e[t];if(s&&e[s]===t[s]||null===s)for(const s in e)s in t&&(e[s]=t[s]);return i};for(const t in this.cache)this.cache[t].group===e&&(Array.isArray(this.cache[t].data)?this.cache[t].data=Object.values(this.cache[t].data).map(i):this.cache[t].data=i(this.cache[t].data))}appendCacheGroup(e,t){}getCacheByIndex(e){return this.cache[e]}deleteCache(e){if(!this.cache[e])return;const t=this.cache[e].group;t&&this.clearCacheGroup(t),delete this.cache[e]}setInitData(e){this.initData=e}}},383:function(e,t,s){"use strict";var i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const r=i(s(568)),a=i(s(828)),n=i(s(840)),h=i(s(648));class o extends a.default{constructor(e,t,s){super(s),Object.defineProperty(this,"cacheIndex",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"currentCache",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"currentEvents",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"requestParams",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"method",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"params",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"path",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.currentEvents=new h.default,this.cacheIndex="",this.method=e,this.params=t,this.path=this.params.path,this.requestParams={method:this.method},this.success=this.success.bind(this),this.fail=this.fail.bind(this),this.error=this.error.bind(this),this.complete=this.complete.bind(this),this.setEmit=this.setEmit.bind(this),this.request=this.request.bind(this),this.addHeader=this.addHeader.bind(this),this.deleteHeader=this.deleteHeader.bind(this),this.initRequest(),this.initCache()}initRequest(){this.requestParams.headers={Accept:"application/json","Content-Type":"application/json"},this.params.data=this.params.data?this.cuteUndifinedParams(this.params.data):this.params.data,"GET"!==this.method&&"HEAD"!==this.method||this.params.data&&(this.path=this.params.path+"?"+this.encodeUrlParams(this.params.data)),"POST"!==this.method&&"PUT"!==this.method||(this.requestParams.body=JSON.stringify(this.params.data))}initCache(){var e;this.cacheIndex=(0,r.default)(this.path+JSON.stringify(this.params.data)),this.params.globalName&&this.initData[this.params.globalName]&&(this.setCache(this.cacheIndex,this.initData[this.params.globalName],"boolean"==typeof this.params.cache?void 0:this.params.cache),this.params.cache=null===(e=this.params.cache)||void 0===e||e,delete this.initData[this.params.globalName]),this.params.cache?(this.currentCache=this.getCache(this.cacheIndex))&&(this.success(this.currentCache),this.complete(this.currentCache)):this.deleteCache(this.cacheIndex)}setEmit(e,t){this.currentEvents.emit(e,t[0]),this.events.emit(e,{cacheIndex:this.cacheIndex,args:t[0]})}success(...e){"function"==typeof this.params.success&&this.params.success(...e),this.params.cacheUpdate&&this.params.data&&this.updateCacheGroup("string"==typeof this.params.cacheUpdate?this.params.cacheUpdate:this.params.cacheUpdate.group,this.params.data,"string"==typeof this.params.cacheUpdate?void 0:this.params.cacheUpdate.fieldKey),this.params.cacheClear&&this.params.data&&this.clearCacheGroup("string"==typeof this.params.cacheClear?this.params.cacheClear:this.params.cacheClear.group,this.params.data,"string"==typeof this.params.cacheClear?void 0:this.params.cacheClear.fieldKey),this.setEmit("api-request-success",e)}fail(...e){"function"==typeof this.params.fail&&this.params.fail(...e),this.setEmit("api-request-fail",e)}error(...e){"function"==typeof this.params.error&&this.params.error(...e),this.setEmit("api-request-error",e)}complete(...e){"function"==typeof this.params.complete&&this.params.complete(...e),this.setEmit("api-request-complete",e)}encodeUrlParams(e){return Object.keys(e).map((function(t){return encodeURIComponent(t)+"="+encodeURIComponent(e[t])})).join("&")}cuteUndifinedParams(e){if("object"==typeof e){for(const t in e)e[t]||delete e[t];return e}}request(){if("undefined"==typeof XMLHttpRequest||this.currentCache||n.default.push(this.cacheIndex,this))return this;try{const e=new XMLHttpRequest;e.open(this.method,this.host+this.path,!0);for(const t in this.requestParams.headers)e.setRequestHeader(t,this.requestParams.headers[t]);e.onreadystatechange=()=>{if(4!==e.readyState)return;const t=this.isJsonString(e.responseText)?JSON.parse(e.responseText):{};e.status>=200&&e.status<=299?(this.params.cache&&this.setCache(this.cacheIndex,t,"boolean"==typeof this.params.cache?void 0:this.params.cache),this.success(t)):(e.status>=400&&e.status<=499&&this.fail(t),this.error(t),console.warn(t)),this.complete(t),n.default.clear(this.cacheIndex)},e.send(this.requestParams.body)}catch(e){throw console.warn(e),e}return this}addHeader(e,t){return this.requestParams.headers=Object.assign(Object.assign({},this.requestParams.headers),{[e]:t}),this}addListener(e,t){return this.currentEvents.addListener(e,t)}deleteHeader(e){return this.requestParams.headers&&e in this.requestParams.headers&&delete this.requestParams.headers[e],this}updateCache(e,t="id"){const s=this.getCacheByIndex(this.cacheIndex);s&&s.group&&this.updateCacheGroup(s.group,e,t)}clearCache(e,t="id"){if(e){const s=this.getCacheByIndex(this.cacheIndex);s&&s.group&&this.clearCacheGroup(s.group,e,t)}else this.deleteCache(this.cacheIndex)}}t.default=o},840:function(e,t,s){"use strict";var i,r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=r(s(383));class n{constructor(){Object.defineProperty(this,"queue",{enumerable:!0,configurable:!0,writable:!0,value:{}}),this.has=this.has.bind(this),this.get=this.get.bind(this),this.clear=this.clear.bind(this),this.push=this.push.bind(this)}has(e){return e in this.queue}get(e){return this.has(e)?this.queue[e]:void 0}clear(e){this.has(e)&&delete this.queue[e]}push(e,t){const s=this.get(e);return s?(null==s||s.addListener("api-request-success",t.success),null==s||s.addListener("api-request-error",t.error),null==s||s.addListener("api-request-fail",t.fail),null==s||s.addListener("api-request-complete",t.complete)):this.queue[e]=t,s instanceof a.default}}i=n,Object.defineProperty(n,"instance",{enumerable:!0,configurable:!0,writable:!0,value:new n}),Object.defineProperty(n,"has",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.has}),Object.defineProperty(n,"get",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.get}),Object.defineProperty(n,"clear",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.clear}),Object.defineProperty(n,"push",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.push}),t.default=n},607:function(e,t,s){"use strict";var i,r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=r(s(828)),n=r(s(383));class h extends a.default{constructor(e){super(),Object.defineProperty(this,"_user",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"token",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.setHost(e.host),this._user={},this.init(),this.setToken=this.setToken.bind(this),this.setUser=this.setUser.bind(this),this.updateUser=this.updateUser.bind(this),this.logout=this.logout.bind(this),this.getToken=this.getToken.bind(this),this.http=this.http.bind(this),this.get=this.get.bind(this),this.post=this.post.bind(this),this.put=this.put.bind(this),this.patch=this.patch.bind(this),this.delete=this.delete.bind(this),this.options=this.options.bind(this),this.getUid=this.getUid.bind(this),this.getUser=this.getUser.bind(this),this.addListener=this.addListener.bind(this)}http(e,t){const s=new n.default(e,t,this);return this.token&&s.addHeader("Authorization","Bearer "+this.token),s}get(e){return this.http("GET",e).request()}post(e){return this.http("POST",e).request()}put(e){return this.http("PUT",e).request()}patch(e){return this.http("PATCH",e).request()}delete(e){return this.http("DELETE",e).request()}options(e){return this.http("OPTIONS",e).request()}init(){if("undefined"==typeof window)return;const e=localStorage.getItem("token"),t=localStorage.getItem("user");if(t){const e=JSON.parse(t);this.setUser(e)}e&&this.setToken(e)}addListener(e,t){return this.events.addListener(e,t)}setToken(e){"undefined"!=typeof window&&(localStorage.setItem("token",e),this.token=e)}getToken(){return this.token}getUid(){return"id"in this._user?Number(this._user.id):0}getUser(){return this._user}get uid(){return this.getUid()}get user(){return this.getUser()}setUser(e){"undefined"!=typeof window&&(localStorage.setItem("user",JSON.stringify(e)),this._user=e,this.events.emit("login",e))}updateUser(e){this.events.emit("update",this.user),this.setUser(Object.assign(Object.assign({},this.user),e))}logout(){"undefined"!=typeof window&&(localStorage.removeItem("user"),localStorage.removeItem("token"),this.events.emit("logout",this.user),this.setUser({}),this.setToken(""))}}i=h,Object.defineProperty(h,"instance",{enumerable:!0,configurable:!0,writable:!0,value:new h({host:""})}),Object.defineProperty(h,"http",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.http}),Object.defineProperty(h,"get",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.get}),Object.defineProperty(h,"post",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.post}),Object.defineProperty(h,"setHost",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.setHost}),Object.defineProperty(h,"setUser",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.setUser}),Object.defineProperty(h,"updateUser",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.updateUser}),Object.defineProperty(h,"logout",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.logout}),Object.defineProperty(h,"setToken",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.setToken}),Object.defineProperty(h,"addListener",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.addListener}),Object.defineProperty(h,"setInitData",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.setInitData}),Object.defineProperty(h,"clearCacheGroup",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.clearCacheGroup}),Object.defineProperty(h,"getToken",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.getToken}),Object.defineProperty(h,"getUid",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.getUid}),Object.defineProperty(h,"getUser",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.getUser}),Object.defineProperty(h,"user",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.user}),Object.defineProperty(h,"uid",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.uid}),Object.defineProperty(h,"deleteCacheGroup",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.clearCacheGroup}),globalThis.apiSetInitData=h.setInitData,t.default=h}},t={},function s(i){var r=t[i];if(void 0!==r)return r.exports;var a=t[i]={exports:{}};return e[i].call(a.exports,a,a.exports,s),a.exports}(607);var e,t}));
//# sourceMappingURL=index.js.map