/*! For license information please see index.js.LICENSE.txt */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.API=t():e.API=t()}(self,(()=>{return e={487:e=>{var t={utf8:{stringToBytes:function(e){return t.bin.stringToBytes(unescape(encodeURIComponent(e)))},bytesToString:function(e){return decodeURIComponent(escape(t.bin.bytesToString(e)))}},bin:{stringToBytes:function(e){for(var t=[],r=0;r<e.length;r++)t.push(255&e.charCodeAt(r));return t},bytesToString:function(e){for(var t=[],r=0;r<e.length;r++)t.push(String.fromCharCode(e[r]));return t.join("")}}};e.exports=t},12:e=>{var t,r;t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",r={rotl:function(e,t){return e<<t|e>>>32-t},rotr:function(e,t){return e<<32-t|e>>>t},endian:function(e){if(e.constructor==Number)return 16711935&r.rotl(e,8)|4278255360&r.rotl(e,24);for(var t=0;t<e.length;t++)e[t]=r.endian(e[t]);return e},randomBytes:function(e){for(var t=[];e>0;e--)t.push(Math.floor(256*Math.random()));return t},bytesToWords:function(e){for(var t=[],r=0,i=0;r<e.length;r++,i+=8)t[i>>>5]|=e[r]<<24-i%32;return t},wordsToBytes:function(e){for(var t=[],r=0;r<32*e.length;r+=8)t.push(e[r>>>5]>>>24-r%32&255);return t},bytesToHex:function(e){for(var t=[],r=0;r<e.length;r++)t.push((e[r]>>>4).toString(16)),t.push((15&e[r]).toString(16));return t.join("")},hexToBytes:function(e){for(var t=[],r=0;r<e.length;r+=2)t.push(parseInt(e.substr(r,2),16));return t},bytesToBase64:function(e){for(var r=[],i=0;i<e.length;i+=3)for(var s=e[i]<<16|e[i+1]<<8|e[i+2],a=0;a<4;a++)8*i+6*a<=8*e.length?r.push(t.charAt(s>>>6*(3-a)&63)):r.push("=");return r.join("")},base64ToBytes:function(e){e=e.replace(/[^A-Z0-9+\/]/gi,"");for(var r=[],i=0,s=0;i<e.length;s=++i%4)0!=s&&r.push((t.indexOf(e.charAt(i-1))&Math.pow(2,-2*s+8)-1)<<2*s|t.indexOf(e.charAt(i))>>>6-2*s);return r}},e.exports=r},67:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=class{constructor(e,t,r){Object.defineProperty(this,"events",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"_name",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"callback",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.events=r,this._name=e,this.callback=t,this.events[e]||(this.events[e]=[]),this.events[e].push(this)}get name(){return this._name}emit(e){this.callback(e)}remove(){this.events[this.name]=this.events[this.name].filter((e=>e!==this)),this._name="",this.callback=()=>{}}}},452:function(e,t,r){"use strict";var i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const s=i(r(67));class a{constructor(e){Object.defineProperty(this,"listeners",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"events",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.listeners=[],this.events={},this.emit=this.emit.bind(this),this.addListener=this.addListener.bind(this),this.removeAllListeners=this.removeAllListeners.bind(this),"boolean"==typeof e&&!0===e?this.events=a.events[a.globalName]:"string"==typeof e&&e!==a.globalName&&(a.events[e]||(a.events[e]={}),this.events=a.events[e])}emit(e,t){this.events[e]&&this.events[e].forEach((e=>{e.emit(t)}))}addListener(e,t){const r=new s.default(e,t,this.events);return this.listeners.push(r),r}removeAllListeners(){this.listeners.reverse().forEach((e=>{e.remove()}))}}Object.defineProperty(a,"globalName",{enumerable:!0,configurable:!0,writable:!0,value:"__global"}),Object.defineProperty(a,"events",{enumerable:!0,configurable:!0,writable:!0,value:{[a.globalName]:{}}}),t.default=a},648:function(e,t,r){"use strict";var i,s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=s(r(452));class n extends a.default{}i=n,Object.defineProperty(n,"instance",{enumerable:!0,configurable:!0,writable:!0,value:new n(!0)}),Object.defineProperty(n,"emit",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.emit}),Object.defineProperty(n,"addListener",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.addListener}),Object.defineProperty(n,"removeAllListeners",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.removeAllListeners}),t.default=n},738:e=>{function t(e){return!!e.constructor&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)}e.exports=function(e){return null!=e&&(t(e)||function(e){return"function"==typeof e.readFloatLE&&"function"==typeof e.slice&&t(e.slice(0,0))}(e)||!!e._isBuffer)}},568:(e,t,r)=>{var i,s,a,n,o;i=r(12),s=r(487).utf8,a=r(738),n=r(487).bin,(o=function(e,t){e.constructor==String?e=t&&"binary"===t.encoding?n.stringToBytes(e):s.stringToBytes(e):a(e)?e=Array.prototype.slice.call(e,0):Array.isArray(e)||e.constructor===Uint8Array||(e=e.toString());for(var r=i.bytesToWords(e),h=8*e.length,u=1732584193,c=-271733879,l=-1732584194,d=271733878,p=0;p<r.length;p++)r[p]=16711935&(r[p]<<8|r[p]>>>24)|4278255360&(r[p]<<24|r[p]>>>8);r[h>>>5]|=128<<h%32,r[14+(h+64>>>9<<4)]=h;var b=o._ff,f=o._gg,m=o._hh,g=o._ii;for(p=0;p<r.length;p+=16){var v=u,y=c,P=l,O=d;u=b(u,c,l,d,r[p+0],7,-680876936),d=b(d,u,c,l,r[p+1],12,-389564586),l=b(l,d,u,c,r[p+2],17,606105819),c=b(c,l,d,u,r[p+3],22,-1044525330),u=b(u,c,l,d,r[p+4],7,-176418897),d=b(d,u,c,l,r[p+5],12,1200080426),l=b(l,d,u,c,r[p+6],17,-1473231341),c=b(c,l,d,u,r[p+7],22,-45705983),u=b(u,c,l,d,r[p+8],7,1770035416),d=b(d,u,c,l,r[p+9],12,-1958414417),l=b(l,d,u,c,r[p+10],17,-42063),c=b(c,l,d,u,r[p+11],22,-1990404162),u=b(u,c,l,d,r[p+12],7,1804603682),d=b(d,u,c,l,r[p+13],12,-40341101),l=b(l,d,u,c,r[p+14],17,-1502002290),u=f(u,c=b(c,l,d,u,r[p+15],22,1236535329),l,d,r[p+1],5,-165796510),d=f(d,u,c,l,r[p+6],9,-1069501632),l=f(l,d,u,c,r[p+11],14,643717713),c=f(c,l,d,u,r[p+0],20,-373897302),u=f(u,c,l,d,r[p+5],5,-701558691),d=f(d,u,c,l,r[p+10],9,38016083),l=f(l,d,u,c,r[p+15],14,-660478335),c=f(c,l,d,u,r[p+4],20,-405537848),u=f(u,c,l,d,r[p+9],5,568446438),d=f(d,u,c,l,r[p+14],9,-1019803690),l=f(l,d,u,c,r[p+3],14,-187363961),c=f(c,l,d,u,r[p+8],20,1163531501),u=f(u,c,l,d,r[p+13],5,-1444681467),d=f(d,u,c,l,r[p+2],9,-51403784),l=f(l,d,u,c,r[p+7],14,1735328473),u=m(u,c=f(c,l,d,u,r[p+12],20,-1926607734),l,d,r[p+5],4,-378558),d=m(d,u,c,l,r[p+8],11,-2022574463),l=m(l,d,u,c,r[p+11],16,1839030562),c=m(c,l,d,u,r[p+14],23,-35309556),u=m(u,c,l,d,r[p+1],4,-1530992060),d=m(d,u,c,l,r[p+4],11,1272893353),l=m(l,d,u,c,r[p+7],16,-155497632),c=m(c,l,d,u,r[p+10],23,-1094730640),u=m(u,c,l,d,r[p+13],4,681279174),d=m(d,u,c,l,r[p+0],11,-358537222),l=m(l,d,u,c,r[p+3],16,-722521979),c=m(c,l,d,u,r[p+6],23,76029189),u=m(u,c,l,d,r[p+9],4,-640364487),d=m(d,u,c,l,r[p+12],11,-421815835),l=m(l,d,u,c,r[p+15],16,530742520),u=g(u,c=m(c,l,d,u,r[p+2],23,-995338651),l,d,r[p+0],6,-198630844),d=g(d,u,c,l,r[p+7],10,1126891415),l=g(l,d,u,c,r[p+14],15,-1416354905),c=g(c,l,d,u,r[p+5],21,-57434055),u=g(u,c,l,d,r[p+12],6,1700485571),d=g(d,u,c,l,r[p+3],10,-1894986606),l=g(l,d,u,c,r[p+10],15,-1051523),c=g(c,l,d,u,r[p+1],21,-2054922799),u=g(u,c,l,d,r[p+8],6,1873313359),d=g(d,u,c,l,r[p+15],10,-30611744),l=g(l,d,u,c,r[p+6],15,-1560198380),c=g(c,l,d,u,r[p+13],21,1309151649),u=g(u,c,l,d,r[p+4],6,-145523070),d=g(d,u,c,l,r[p+11],10,-1120210379),l=g(l,d,u,c,r[p+2],15,718787259),c=g(c,l,d,u,r[p+9],21,-343485551),u=u+v>>>0,c=c+y>>>0,l=l+P>>>0,d=d+O>>>0}return i.endian([u,c,l,d])})._ff=function(e,t,r,i,s,a,n){var o=e+(t&r|~t&i)+(s>>>0)+n;return(o<<a|o>>>32-a)+t},o._gg=function(e,t,r,i,s,a,n){var o=e+(t&i|r&~i)+(s>>>0)+n;return(o<<a|o>>>32-a)+t},o._hh=function(e,t,r,i,s,a,n){var o=e+(t^r^i)+(s>>>0)+n;return(o<<a|o>>>32-a)+t},o._ii=function(e,t,r,i,s,a,n){var o=e+(r^(t|~i))+(s>>>0)+n;return(o<<a|o>>>32-a)+t},o._blocksize=16,o._digestsize=16,e.exports=function(e,t){if(null==e)throw new Error("Illegal argument "+e);var r=i.wordsToBytes(o(e,t));return t&&t.asBytes?r:t&&t.asString?n.bytesToString(r):i.bytesToHex(r)}},828:function(e,t,r){"use strict";var i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const s=i(r(648));t.default=class{constructor(e){Object.defineProperty(this,"cache",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"initData",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"events",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"host",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.events=new s.default,this.host="http://127.0.0.1/",this.cache={},this.initData={},this.setHost=this.setHost.bind(this),this.setInitData=this.setInitData.bind(this),this.triggerByCacheGroup=this.triggerByCacheGroup.bind(this),this.clearCacheGroup=this.clearCacheGroup.bind(this),this.updateCacheGroup=this.updateCacheGroup.bind(this),e&&Object.assign(this,{host:null==e?void 0:e.host,events:null==e?void 0:e.events,cache:null==e?void 0:e.cache,initData:null==e?void 0:e.initData})}getCache(e){if(this.cache[e]){if((new Date).getTime()<=this.cache[e].time+36e8)return this.cache[e].data;delete this.cache[e]}}isJsonString(e){try{JSON.parse(e)}catch(e){return!1}return!0}setHost(e){this.host=e}setCache(e,t,r){this.cache[e]={time:(new Date).getTime(),data:t,group:r}}groupFromArray(e,t,r=!1){const i=e=>{if("string"!=typeof e||r)t(e);else{const r=e.split("."),i=r.shift();t(i,r)}};Array.isArray(e)?e.map(i):"string"==typeof e&&i(e)}triggerByCacheGroup(e){this.groupFromArray(e,(e=>this.events.emit("trigger-request-by-cache-"+e,void 0)))}clearCacheGroup(e,t,r="id"){this.groupFromArray(e,(e=>{if(t){const i=e=>{if(r&&(null==e?void 0:e[r])===(null==t?void 0:t[r])||null===r)for(const r in e)if(r in t)return!1;return!0};for(const t in this.cache)this.cache[t].group===e&&(Array.isArray(this.cache[t].data)?this.cache[t].data=Object.values(this.cache[t].data).filter(i):i(this.cache[t].data)||delete this.cache[t])}else for(const t in this.cache)this.cache[t].group===e&&delete this.cache[t]}))}setDataTree(e,t,r){const i=t.split("."),s=i.pop(),a=i.reduce(((e,t)=>e[t]=e[t]||{}),e);return"string"==typeof s&&(a[s]=r),e}updateCacheGroup(e,t,r="id"){const i=e=>{const i=e,s=r.split(".");if(s.length>1)for(const t of s)e=e[t];if(r&&e[r]===t[r]||null===r)for(const r in e)r in t&&(e[r]=t[r]);return i};this.groupFromArray(e,((e,t)=>{for(const t in this.cache)this.cache[t].group===e&&(Array.isArray(this.cache[t].data)?this.cache[t].data=Object.values(this.cache[t].data).map(i):this.cache[t].data=i(this.cache[t].data))}))}appendCacheGroup(e,t){}getCacheByIndex(e){return this.cache[e]}deleteCache(e){if(!this.cache[e])return;const t=this.cache[e].group;t&&this.clearCacheGroup(t),delete this.cache[e]}setInitData(e){this.initData=e}}},383:function(e,t,r){"use strict";var i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const s=i(r(568)),a=i(r(828)),n=i(r(840)),o=i(r(648));class h extends a.default{constructor(e,t,r){super(r),Object.defineProperty(this,"cacheIndex",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"currentCache",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"currentEvents",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"requestParams",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"method",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"params",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"path",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.currentEvents=new o.default,this.cacheIndex="",this.method=e,this.params=t,this.path=this.params.path,this.requestParams={method:this.method},this.success=this.success.bind(this),this.fail=this.fail.bind(this),this.error=this.error.bind(this),this.complete=this.complete.bind(this),this.progress=this.progress.bind(this),this.setEmit=this.setEmit.bind(this),this.request=this.request.bind(this),this.addHeader=this.addHeader.bind(this),this.deleteHeader=this.deleteHeader.bind(this),this.initRequest(),this.initCache()}initRequest(){this.requestParams.headers={Accept:"application/json","Content-Type":"application/json"},this.params.data=this.params.data?this.cuteUndifinedParams(this.params.data):this.params.data,["GET","HEAD"].includes(this.method)&&(this.params.data&&(this.path=this.params.path+"?"+this.encodeUrlParams(this.params.data)),"HEAD"===this.method&&(this.requestParams.withoutResponse=!0)),["POST","PUT","CONNECT","PATH"].includes(this.method)&&(this.requestParams.body=JSON.stringify(this.params.data)),["PUT","DELETE","CONNECT","OPTIONS","TRACE"].includes(this.method)&&(this.params.cache=!1)}initCache(){var e;this.cacheIndex=(0,s.default)(this.path+JSON.stringify(this.params.data)),this.params.globalName&&this.initData[this.params.globalName]&&(this.setCache(this.cacheIndex,this.initData[this.params.globalName],"boolean"==typeof this.params.cache?void 0:this.params.cache),this.params.cache=null===(e=this.params.cache)||void 0===e||e,delete this.initData[this.params.globalName]),this.params.cache?("string"==typeof this.params.cache&&this.events.addListener("trigger-request-by-cache-"+this.params.cache,this.request),(this.currentCache=this.getCache(this.cacheIndex))&&(this.success(this.currentCache),this.complete(this.currentCache))):this.deleteCache(this.cacheIndex)}setEmit(e,t){this.currentEvents.emit(e,t[0]),this.events.emit(e,{cacheIndex:this.cacheIndex,args:t[0]})}success(...e){"function"==typeof this.params.success&&this.params.success(...e),this.params.cacheUpdate&&this.params.data&&this.groupFromArray(this.params.cacheUpdate,((e,t)=>{var r;this.updateCacheGroup("string"==typeof e?e:e.group,null!==(r=this.params.data)&&void 0!==r?r:{},"string"==typeof e?void 0:e.fieldKey)}),!0),this.params.cacheClear&&this.params.data&&this.groupFromArray(this.params.cacheClear,(e=>{this.clearCacheGroup("string"==typeof e?e:e.group,this.params.data,"string"==typeof e?void 0:e.fieldKey)})),this.setEmit("api-request-success",e)}fail(...e){"function"==typeof this.params.fail&&this.params.fail(...e),this.setEmit("api-request-fail",e)}error(...e){"function"==typeof this.params.error&&this.params.error(...e),this.setEmit("api-request-error",e)}complete(...e){"function"==typeof this.params.complete&&this.params.complete(...e),this.setEmit("api-request-complete",e)}progress(e){"function"==typeof this.params.progress&&this.params.progress(e),this.setEmit("api-request-progress",e)}encodeUrlParams(e){return Object.keys(e).map((function(t){return encodeURIComponent(t)+"="+encodeURIComponent(e[t])})).join("&")}cuteUndifinedParams(e){if("object"==typeof e){for(const t in e)e[t]||delete e[t];return e}}request(){if("undefined"==typeof XMLHttpRequest||this.currentCache||n.default.push(this.cacheIndex,this))return this;try{const e=new XMLHttpRequest;e.open(this.method,this.host+this.path,!0);for(const t in this.requestParams.headers)e.setRequestHeader(t,this.requestParams.headers[t]);e.upload.onprogress=({lengthComputable:e,loaded:t,total:r})=>{e&&this.progress({percent:t/r*100,total:r,loaded:t})},e.onreadystatechange=()=>{if(4!==e.readyState)return;const t=!this.requestParams.withoutResponse&&this.isJsonString(e.responseText)?JSON.parse(e.responseText):{};e.status>=200&&e.status<=299?(this.params.cache&&this.setCache(this.cacheIndex,t,"boolean"==typeof this.params.cache?void 0:this.params.cache),this.success(t)):(e.status>=400&&e.status<=499&&this.fail(t),this.error(t),console.warn(t)),this.complete(t),n.default.clear(this.cacheIndex)},e.send(this.requestParams.body)}catch(e){throw console.warn(e),e}return this}addHeader(e,t){return this.requestParams.headers=Object.assign(Object.assign({},this.requestParams.headers),{[e]:t}),this}addListener(e,t){return this.currentEvents.addListener(e,t)}deleteHeader(e){return this.requestParams.headers&&e in this.requestParams.headers&&delete this.requestParams.headers[e],this}updateCache(e,t="id"){const r=this.getCacheByIndex(this.cacheIndex);r&&r.group&&this.updateCacheGroup(r.group,e,t)}clearCache(e,t="id"){if(e){const r=this.getCacheByIndex(this.cacheIndex);r&&r.group&&this.clearCacheGroup(r.group,e,t)}else this.deleteCache(this.cacheIndex)}}t.default=h},840:function(e,t,r){"use strict";var i,s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=s(r(383));class n{constructor(){Object.defineProperty(this,"queue",{enumerable:!0,configurable:!0,writable:!0,value:{}}),this.has=this.has.bind(this),this.get=this.get.bind(this),this.clear=this.clear.bind(this),this.push=this.push.bind(this)}has(e){return e in this.queue}get(e){return this.has(e)?this.queue[e]:void 0}clear(e){this.has(e)&&delete this.queue[e]}push(e,t){const r=this.get(e);return r?(null==r||r.addListener("api-request-success",t.success),null==r||r.addListener("api-request-error",t.error),null==r||r.addListener("api-request-fail",t.fail),null==r||r.addListener("api-request-complete",t.complete)):this.queue[e]=t,r instanceof a.default}}i=n,Object.defineProperty(n,"instance",{enumerable:!0,configurable:!0,writable:!0,value:new n}),Object.defineProperty(n,"has",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.has}),Object.defineProperty(n,"get",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.get}),Object.defineProperty(n,"clear",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.clear}),Object.defineProperty(n,"push",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.push}),t.default=n},607:function(e,t,r){"use strict";var i,s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=s(r(828)),n=s(r(383));class o extends a.default{constructor(e){super(),Object.defineProperty(this,"_user",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"token",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.setHost(e.host),this._user={},this.init(),this.setToken=this.setToken.bind(this),this.setUser=this.setUser.bind(this),this.updateUser=this.updateUser.bind(this),this.logout=this.logout.bind(this),this.getToken=this.getToken.bind(this),this.http=this.http.bind(this),this.get=this.get.bind(this),this.head=this.head.bind(this),this.post=this.post.bind(this),this.put=this.put.bind(this),this.patch=this.patch.bind(this),this.delete=this.delete.bind(this),this.options=this.options.bind(this),this.connect=this.connect.bind(this),this.trace=this.trace.bind(this),this.getUid=this.getUid.bind(this),this.getUser=this.getUser.bind(this),this.addListener=this.addListener.bind(this)}http(e,t){const r=new n.default(e,t,this);return this.token&&r.addHeader("Authorization","Bearer "+this.token),r}get(e){return this.http("GET",e).request()}head(e){return this.http("HEAD",e).request()}post(e){return this.http("POST",e).request()}put(e){return this.http("PUT",e).request()}patch(e){return this.http("PATCH",e).request()}delete(e){return this.http("DELETE",e).request()}options(e){return this.http("OPTIONS",e).request()}connect(e){return this.http("CONNECT",e).request()}trace(e){return this.http("TRACE",e).request()}init(){if("undefined"==typeof window)return;const e=localStorage.getItem("token"),t=localStorage.getItem("user");if(t){const e=JSON.parse(t);this.setUser(e)}e&&this.setToken(e)}addListener(e,t){return this.events.addListener(e,t)}setToken(e){"undefined"!=typeof window&&(localStorage.setItem("token",e),this.token=e)}getToken(){return this.token}getUid(){return"object"==typeof this._user&&"id"in this._user?Number(this._user.id):0}getUser(){return this._user}get uid(){return this.getUid()}get user(){return this.getUser()}setUser(e){"undefined"!=typeof window&&(localStorage.setItem("user",JSON.stringify(e)),this._user=e,this.events.emit("login",e))}updateUser(e){const t=Object.assign(Object.assign({},this.user),e);this.setUser(t),this.events.emit("user-update",t)}logout(){if("undefined"==typeof window)return;localStorage.removeItem("user"),localStorage.removeItem("token");const e=this.user;this.setUser({}),this.setToken(""),this.events.emit("logout",e)}}i=o,Object.defineProperty(o,"instance",{enumerable:!0,configurable:!0,writable:!0,value:new o({host:""})}),Object.defineProperty(o,"http",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.http}),Object.defineProperty(o,"get",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.get}),Object.defineProperty(o,"head",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.head}),Object.defineProperty(o,"post",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.post}),Object.defineProperty(o,"put",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.put}),Object.defineProperty(o,"patch",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.patch}),Object.defineProperty(o,"delete",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.delete}),Object.defineProperty(o,"options",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.options}),Object.defineProperty(o,"connect",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.connect}),Object.defineProperty(o,"trace",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.trace}),Object.defineProperty(o,"setHost",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.setHost}),Object.defineProperty(o,"setUser",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.setUser}),Object.defineProperty(o,"updateUser",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.updateUser}),Object.defineProperty(o,"logout",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.logout}),Object.defineProperty(o,"setToken",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.setToken}),Object.defineProperty(o,"addListener",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.addListener}),Object.defineProperty(o,"setInitData",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.setInitData}),Object.defineProperty(o,"triggerByCacheGroup",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.triggerByCacheGroup}),Object.defineProperty(o,"clearCacheGroup",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.clearCacheGroup}),Object.defineProperty(o,"updateCacheGroup",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.updateCacheGroup}),Object.defineProperty(o,"getToken",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.getToken}),Object.defineProperty(o,"getUid",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.getUid}),Object.defineProperty(o,"getUser",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.getUser}),Object.defineProperty(o,"user",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.user}),Object.defineProperty(o,"uid",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.uid}),Object.defineProperty(o,"deleteCacheGroup",{enumerable:!0,configurable:!0,writable:!0,value:i.instance.clearCacheGroup}),globalThis.apiSetInitData=o.setInitData,t.default=o}},t={},function r(i){var s=t[i];if(void 0!==s)return s.exports;var a=t[i]={exports:{}};return e[i].call(a.exports,a,a.exports,r),a.exports}(607);var e,t}));
//# sourceMappingURL=index.js.map