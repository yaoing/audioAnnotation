(function(t){function e(e){for(var a,o,c=e[0],d=e[1],u=e[2],l=0,f=[];l<c.length;l++)o=c[l],Object.prototype.hasOwnProperty.call(i,o)&&i[o]&&f.push(i[o][0]),i[o]=0;for(a in d)Object.prototype.hasOwnProperty.call(d,a)&&(t[a]=d[a]);s&&s(e);while(f.length)f.shift()();return r.push.apply(r,u||[]),n()}function n(){for(var t,e=0;e<r.length;e++){for(var n=r[e],a=!0,c=1;c<n.length;c++){var d=n[c];0!==i[d]&&(a=!1)}a&&(r.splice(e--,1),t=o(o.s=n[0]))}return t}var a={},i={app:0},r=[];function o(e){if(a[e])return a[e].exports;var n=a[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=t,o.c=a,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)o.d(n,a,function(e){return t[e]}.bind(null,a));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="/audioAnnotation/";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],d=c.push.bind(c);c.push=e,c=c.slice();for(var u=0;u<c.length;u++)e(c[u]);var s=d;r.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"034f":function(t,e,n){"use strict";var a=n("85ec"),i=n.n(a);i.a},"283d":function(t,e,n){"use strict";var a=n("7e63"),i=n.n(a);i.a},"56d7":function(t,e,n){"use strict";n.r(e);var a=n("2b0e"),i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("Annotator")],1)},r=[],o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container"},[n("div",{attrs:{id:"text-box"}},[n("div",{staticStyle:{margin:"auto"}},[t._v(t._s(t.data[t.activeIndex].text))])]),n("div",{attrs:{id:"item-bar"}},t._l(t.data,(function(e,a){return n("div",{key:a,class:{selectedBtn:a==t.activeIndex},on:{click:function(e){return t.changeBtn(a)}}},[t._v(t._s(a+1))])})),0),n("div",{attrs:{id:"tip-bar"}},[t.recording?n("p",[t._v("正在录音...")]):n("p",[t._v("长按按钮进行录音")])]),n("div",{attrs:{id:"audio-bar"}},[n("div",{class:{btnMd:t.recording},attrs:{id:"record"},on:{mousedown:t.startRecording,mouseup:t.stopRecording,touchstart:t.startRecording,touchend:t.stopRecording}},[n("i",{staticClass:"el-icon-microphone"})]),t.data[t.activeIndex].audio?n("div",{attrs:{id:"play"}},[n("i",{staticClass:"el-icon-headset",on:{click:t.playAudio}})]):t._e()]),t.data[t.data.length-1].audio?n("el-button",{attrs:{id:"upload",type:"primary"},on:{click:t.submit}},[t._v("提交数据")]):t._e(),n("audio",{ref:"audioPlayer",staticStyle:{visibility:"hidden"}})],1)},c=[],d=n("c50a"),u=n("6c03"),s=n("bc3a"),l=n.n(s),f=l.a.create({baseURL:"http://101.37.245.209:5555/"}),p={getTextList:function(){return f.post("api/text/textList")},uploadAudios:function(t){return f.post("api/audio/uploadAudio",t)}},h={name:"HelloWorld",data:function(){return{client:null,data:[],activeIndex:0,recording:!1,recorder:null,audio:null}},methods:{changeBtn:function(t){this.data[this.activeIndex].audio&&t==this.activeIndex+1||t<this.activeIndex?this.activeIndex=t:t>this.activeIndex&&this.data[t-1].audio&&(console.log(t),this.activeIndex=t)},setUid:function(){var t=document.cookie;if(-1==t.indexOf("client")){var e=Object(d["a"])().split("-").join("");document.cookie="client=".concat(e,"; expires=Thu, 18 Dec 2043 12:00:00 GMT")}this.client=t.slice(7)},getTextList:function(){var t=this;p.getTextList().then((function(e){var n=e.data,a=n.data,i=n.code;200==i&&(t.data=a)}))},submit:function(){for(var t=this,e=0;e<this.data.length;++e)if(!this.data[e].audio){var n="请检查第".concat(e,"条录音!");return this.$message.error(n),0}for(var a=function(e){r=new FormData,r.append("data",t.data[e].audio,"".concat(t.data[e].id,"-").concat(t.data[e].text,"-").concat(t.client,".wav")),p.uploadAudios(r).then((function(n){var a=n.data.code;200==a&&e==t.data.length-1&&(t.getTextList(),t.activeIndex=0)})).catch((function(e){return t.$message.err(e),0}))},i=0;i<this.data.length;++i){var r;a(i)}},startRecording:function(){this.recording=!0,this.recorder.start().then((function(){})).catch((function(t){console.log("Recording failed.",t)}))},stopRecording:function(){var t=this;setTimeout((function(){t.recording=!1,t.recorder.pause();var e=t.recorder.getRecord({encodeTo:u["a"].WAV,compressible:!1});t.pushData(e),t.recorder.clear()}),700)},pushData:function(t){this.data[this.activeIndex].audio=t},playAudio:function(){var t=this.$refs.audioPlayer,e=URL.createObjectURL(this.data[this.activeIndex].audio);t.src=e,t.currentTime=0,t.play()}},created:function(){this.recorder=new u["b"],this.setUid(),this.getTextList()}},v=h,g=(n("283d"),n("2877")),b=Object(g["a"])(v,o,c,!1,null,"7039c71a",null),x=b.exports,m={name:"App",components:{Annotator:x}},y=m,_=(n("034f"),Object(g["a"])(y,i,r,!1,null,null,null)),O=_.exports,w=n("5c96"),j=n.n(w);n("0fae");a["default"].use(j.a),a["default"].config.productionTip=!1,new a["default"]({render:function(t){return t(O)}}).$mount("#app")},"7e63":function(t,e,n){},"85ec":function(t,e,n){}});
//# sourceMappingURL=app.07b50b13.js.map