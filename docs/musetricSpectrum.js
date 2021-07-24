/*! For license information please see musetricSpectrum.js.LICENSE.txt */
var _;(()=>{"use strict";var __webpack_modules__={337:(e,r,t)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.useAnimation=r.startAnimation=void 0;const n=t(294);r.startAnimation=e=>{let r=!0,t=0;const n=o=>{const a=e();a&&a(o-t),t=o,r&&requestAnimationFrame(n)};return requestAnimationFrame(n),{stop:()=>{r=!1}}},r.useAnimation=(e,t)=>{const o=n.useRef();n.useEffect((()=>{o.current=e}),t),n.useEffect((()=>{const e=r.startAnimation((()=>o.current));return()=>e.stop()}),[])}},175:(e,r)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.convertAmplitudeToBel=void 0,r.convertAmplitudeToBel=e=>{for(let r=0;r<e.length;r++){const t=e[r],n=Math.log10(t)/5,o=Math.max(0,Math.min(1,n+1));e[r]=o}}},608:(e,r)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.normComplexArray=r.createComplexArray=void 0,r.createComplexArray=e=>({real:new Float32Array(e),imag:new Float32Array(e)}),r.normComplexArray=(e,r,t)=>{const n=r.length;for(let o=0;o<n;o++){const n=e.real[o],a=e.imag[o];r[o]=t*Math.sqrt(n*n+a*a)}}},819:(e,r,t)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.createFftRadix4=r.createFftRadix4Base=r.createArrayRadix4=void 0;const n=t(343),o=e=>{const{outOff:r,off:t,step:n,out:o,data:a}=e,u=a[t],i=a[t+1],c=a[t+n],s=a[t+n+1],l=u+c,f=i+s,p=u-c,d=i-s;o[r]=l,o[r+1]=f,o[r+2]=p,o[r+3]=d},a=e=>{const{outOff:r,off:t,step:n,out:o,data:a}=e,u=e.inv?-1:1,i=2*n,c=3*n,s=a[t],l=a[t+1],f=a[t+n],p=a[t+n+1],d=a[t+i],y=a[t+i+1],_=a[t+c],w=a[t+c+1],m=s+d,h=l+y,v=s-d,b=l-y,A=f+_,g=p+w,F=u*(f-_),S=u*(p-w),E=m+A,M=h+g,P=v+S,k=b-F,O=m-A,x=h-g,j=v-S,C=b+F;o[r]=E,o[r+1]=M,o[r+2]=P,o[r+3]=k,o[r+4]=O,o[r+5]=x,o[r+6]=j,o[r+7]=C},u=e=>{const{out:r,data:t,windowSize2:n,width:u,reverseTable:i,table:c}=e;let s,l,f=1<<u,p=n/f<<1;if(4===p)for(s=0,l=0;s<n;s+=p,l++){const e=i[l];o({outOff:s,off:e,step:f,out:r,data:t})}else for(s=0,l=0;s<n;s+=p,l++){const n=i[l];a({outOff:s,off:n,step:f,out:r,data:t,inv:e.inv})}const d=e.inv?-1:1;for(f>>=2;f>=2;f>>=2){p=n/f<<1;const e=p>>>2;for(s=0;s<n;s+=p){const t=s+e;for(let n=s,o=0;n<t;n+=2,o+=f){const t=n,a=t+e,u=a+e,i=u+e,s=r[t],l=r[t+1],f=r[a],p=r[a+1],y=r[u],_=r[u+1],w=r[i],m=r[i+1],h=s,v=l,b=c[o],A=d*c[o+1],g=f*b-p*A,F=f*A+p*b,S=c[2*o],E=d*c[2*o+1],M=y*S-_*E,P=y*E+_*S,k=c[3*o],O=d*c[3*o+1],x=w*k-m*O,j=w*O+m*k,C=h+M,R=v+P,W=h-M,q=v-P,T=g+x,$=F+j,B=d*(g-x),I=d*(F-j),z=C+T,U=R+$,L=C-T,N=R-$,D=W+I,H=q-B,V=W-I,Y=q+B;r[t]=z,r[t+1]=U,r[a]=D,r[a+1]=H,r[u]=L,r[u+1]=N,r[i]=V,r[i+1]=Y}}}};r.createArrayRadix4=e=>{const r={createComplexArray:()=>{const r=new Array(2*e);for(let t=0;t<2*e;t++)r[t]=0;return r},toComplexArray:t=>{const n=r.createComplexArray();for(let r=0;r<2*e;r+=2)n[r]=t[r>>>1],n[r+1]=0;return n},toArray:t=>{const n=r.createComplexArray();for(let r=0;r<2*e;r+=2)n[r]=t.real[r>>>1],n[r+1]=t.imag[r>>>1];return n},fromArray:(r,t)=>{for(let n=0;n<2*e;n+=2)t.real[n>>>1]=r[n],t.imag[n>>>1]=r[n+1]}};return r},r.createFftRadix4Base=e=>{if(e<=1||0!=(e&e-1))throw new Error("FFT size must be a power of two and bigger than 1");const t=2*e,n=(e=>{const r=new Array(2*e);for(let t=0;t<r.length;t+=2){const n=Math.PI*t/e;r[t]=Math.cos(n),r[t+1]=-Math.sin(n)}return r})(e),o=(e=>{let r=0;for(let t=1;e>t;t<<=1)r++;return r%2==0?r-1:r})(e),a=(e=>{const r=new Array(1<<e);for(let t=0;t<r.length;t++){r[t]=0;for(let n=0;n<e;n+=2){const o=e-n-2;r[t]|=(t>>>n&3)<<o}}return r})(o),i=r.createArrayRadix4(e);return{transform:(e,r)=>{u({out:r,data:e,inv:!1,windowSize2:t,width:o,reverseTable:a,table:n})},forward:(e,r)=>{const c=i.toArray(e),s=i.createComplexArray();u({out:s,data:c,inv:!1,windowSize2:t,width:o,reverseTable:a,table:n}),i.fromArray(s,r)},inverse:(r,c)=>{const s=i.toArray(r),l=i.createComplexArray();u({out:l,data:s,inv:!0,windowSize2:t,width:o,reverseTable:a,table:n});for(let r=0;r<l.length;r++)l[r]/=e;i.fromArray(l,c)}}},r.createFftRadix4=e=>{const t=r.createFftRadix4Base(e);return n.createSpectrometer(e,t)}},343:(e,r,t)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.createSpectrometer=void 0;const n=t(175),o=t(608),a=t(119);r.createSpectrometer=(e,r)=>{const{forward:t,inverse:u}=r,i=o.createComplexArray(e),c=new Float32Array(e/2),s=o.createComplexArray(e),l=a.gaussWindowFilter(e),f={forward:t,inverse:u,frequency:(r,a,u)=>{const{convert:c=n.convertAmplitudeToBel}=u;for(let t=0;t<e;t++)i.real[t]=r[t]*l[t],i.imag[t]=0;t(i,s),o.normComplexArray(s,a,1/e),c(a)},frequencies:(r,t,n)=>{const{step:o,count:a,convert:u}=n;let{offset:i}=n;for(let n=0;n<a;n++){const a=Math.floor(i)*Float32Array.BYTES_PER_ELEMENT,c=new Float32Array(r.buffer,a,e);f.frequency(c,t[n],{convert:u}),i+=o}},byteFrequencies:(r,t,n)=>{const{step:o,count:a,convert:u}=n;let{offset:i}=n;for(let n=0;n<a;n++){const a=Math.floor(i)*Float32Array.BYTES_PER_ELEMENT,s=new Float32Array(r.buffer,a,e);f.frequency(s,c,{convert:u});for(let r=0;r<e/2;r++)t[n][r]=Math.round(255*c[r]);i+=o}}};return f}},785:(e,r,t)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.runSpectrumWorker=r.createSpectrumHandlers=r.createFrequenciesView=void 0;const n=t(819),o=t(337),a=t(292);r.createFrequenciesView=(e,r,t)=>{const n=r/2,o=n*Uint8Array.BYTES_PER_ELEMENT,a=[];let u=0;for(let r=0;r<t;r++){const r=new Uint8Array(e,u,n);a.push(r),u+=o}return a},r.createSpectrumHandlers=()=>{let e,t;const a=()=>{if(!e||!t)return;const{windowSize:r,count:n,spectrometer:o,frequencies:a}=e,u={offset:0,step:(t.length-r)/(n-1),count:n};o.byteFrequencies(t,a,u),(()=>{if(!e||!t)return;const{raw:r,result:n}=e;n.set(r)})()};let u;return{setup:t=>{const{windowSize:o,count:a}=t,u=o/2,i=n.createFftRadix4(o),c=new SharedArrayBuffer(a*u*Uint8Array.BYTES_PER_ELEMENT),s=new ArrayBuffer(a*u*Uint8Array.BYTES_PER_ELEMENT),l=r.createFrequenciesView(s,o,a),f=new Uint8Array(s),p=new Uint8Array(c);return e={windowSize:o,count:a,spectrometer:i,frequencies:l,raw:f,result:p},c},start:()=>{u&&u.stop(),u=o.startAnimation((()=>a))},stop:()=>{u&&u.stop(),u=void 0},setSoundBuffer:e=>{t=new Float32Array(e)}}},r.runSpectrumWorker=e=>{a.runPromiseWorker(e,r.createSpectrumHandlers)}},119:(e,r)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.triangularWindowFilter=r.rectangularWindowFilter=r.lanczozWindowFilter=r.hannWindowFilter=r.hammingWindowFilter=r.gaussWindowFilter=r.cosineWindowFilter=r.blackmanWindowFilter=r.bartlettHannWindowFilter=r.bartlettWindowFilter=r.zeroWindowFilter=void 0,r.zeroWindowFilter=e=>{const r=new Float32Array(e);for(let t=0;t<e;t++)r[t]=0;return r},r.bartlettWindowFilter=e=>{const r=new Float32Array(e),t=e-1;for(let n=0;n<e;n++)r[n]=2/t*(t/2-Math.abs(n-t/2));return r},r.bartlettHannWindowFilter=e=>{const r=new Float32Array(e),t=e-1;for(let n=0;n<e;n++)r[n]=2/t*(t/2-Math.abs(n-t/2));return r},r.blackmanWindowFilter=e=>{const r=new Float32Array(e),t=e-1;for(let n=0;n<e;n++){const e=2*Math.PI*n/t,o=4*Math.PI*n/t;r[n]=.42-.5*Math.cos(e)+.08*Math.cos(o)}return r},r.cosineWindowFilter=e=>{const r=new Float32Array(e);for(let t=0;t<e;t++)r[t]=Math.cos(Math.PI*t/(e-1)-Math.PI/2);return r},r.gaussWindowFilter=e=>{const r=new Float32Array(e);for(let t=0;t<e;t++){const n=(t-(e-1)/2)/(.25*(e-1)/2);r[t]=Math.pow(Math.E,-.5*Math.pow(n,2))}return r},r.hammingWindowFilter=e=>{const r=new Float32Array(e);for(let t=0;t<e;t++)r[t]=.54-.46*Math.cos(2*Math.PI*t/(e-1));return r},r.hannWindowFilter=e=>{const r=new Float32Array(e);for(let t=0;t<e;t++)r[t]=.5*(1-Math.cos(2*Math.PI*t/(e-1)));return r},r.lanczozWindowFilter=e=>{const r=new Float32Array(e),t=e-1;for(let n=0;n<e;n++)r[n]=Math.sin(Math.PI*(2*n/t-1))/(Math.PI*(2*n/t-1));return r},r.rectangularWindowFilter=e=>{const r=new Float32Array(e);for(let t=0;t<e;t++)r[t]=1;return r},r.triangularWindowFilter=e=>{const r=new Float32Array(e);for(let t=0;t<e;t++)r[t]=2/e*(e/2-Math.abs(t-(e-1)/2));return r}},292:(e,r)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.runPromiseWorker=void 0,r.runPromiseWorker=(e,r)=>{const t=r=>{e.postMessage(r)},n=r(t);e.onmessage=e=>{const{id:r,type:o,args:a}=e.data,u=n[o](...a);t({id:r,type:o,result:u})}}},418:e=>{var r=Object.getOwnPropertySymbols,t=Object.prototype.hasOwnProperty,n=Object.prototype.propertyIsEnumerable;function o(e){if(null==e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}e.exports=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var r={},t=0;t<10;t++)r["_"+String.fromCharCode(t)]=t;if("0123456789"!==Object.getOwnPropertyNames(r).map((function(e){return r[e]})).join(""))return!1;var n={};return"abcdefghijklmnopqrst".split("").forEach((function(e){n[e]=e})),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},n)).join("")}catch(e){return!1}}()?Object.assign:function(e,a){for(var u,i,c=o(e),s=1;s<arguments.length;s++){for(var l in u=Object(arguments[s]))t.call(u,l)&&(c[l]=u[l]);if(r){i=r(u);for(var f=0;f<i.length;f++)n.call(u,i[f])&&(c[i[f]]=u[i[f]])}}return c}},408:(e,r,t)=>{var n=t(418),o=60103,a=60106;r.Fragment=60107,r.StrictMode=60108,r.Profiler=60114;var u=60109,i=60110,c=60112;r.Suspense=60113;var s=60115,l=60116;if("function"==typeof Symbol&&Symbol.for){var f=Symbol.for;o=f("react.element"),a=f("react.portal"),r.Fragment=f("react.fragment"),r.StrictMode=f("react.strict_mode"),r.Profiler=f("react.profiler"),u=f("react.provider"),i=f("react.context"),c=f("react.forward_ref"),r.Suspense=f("react.suspense"),s=f("react.memo"),l=f("react.lazy")}var p="function"==typeof Symbol&&Symbol.iterator;function d(e){for(var r="https://reactjs.org/docs/error-decoder.html?invariant="+e,t=1;t<arguments.length;t++)r+="&args[]="+encodeURIComponent(arguments[t]);return"Minified React error #"+e+"; visit "+r+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var y={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},_={};function w(e,r,t){this.props=e,this.context=r,this.refs=_,this.updater=t||y}function m(){}function h(e,r,t){this.props=e,this.context=r,this.refs=_,this.updater=t||y}w.prototype.isReactComponent={},w.prototype.setState=function(e,r){if("object"!=typeof e&&"function"!=typeof e&&null!=e)throw Error(d(85));this.updater.enqueueSetState(this,e,r,"setState")},w.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},m.prototype=w.prototype;var v=h.prototype=new m;v.constructor=h,n(v,w.prototype),v.isPureReactComponent=!0;var b={current:null},A=Object.prototype.hasOwnProperty,g={key:!0,ref:!0,__self:!0,__source:!0};function F(e,r,t){var n,a={},u=null,i=null;if(null!=r)for(n in void 0!==r.ref&&(i=r.ref),void 0!==r.key&&(u=""+r.key),r)A.call(r,n)&&!g.hasOwnProperty(n)&&(a[n]=r[n]);var c=arguments.length-2;if(1===c)a.children=t;else if(1<c){for(var s=Array(c),l=0;l<c;l++)s[l]=arguments[l+2];a.children=s}if(e&&e.defaultProps)for(n in c=e.defaultProps)void 0===a[n]&&(a[n]=c[n]);return{$$typeof:o,type:e,key:u,ref:i,props:a,_owner:b.current}}function S(e){return"object"==typeof e&&null!==e&&e.$$typeof===o}var E=/\/+/g;function M(e,r){return"object"==typeof e&&null!==e&&null!=e.key?function(e){var r={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,(function(e){return r[e]}))}(""+e.key):r.toString(36)}function P(e,r,t,n,u){var i=typeof e;"undefined"!==i&&"boolean"!==i||(e=null);var c=!1;if(null===e)c=!0;else switch(i){case"string":case"number":c=!0;break;case"object":switch(e.$$typeof){case o:case a:c=!0}}if(c)return u=u(c=e),e=""===n?"."+M(c,0):n,Array.isArray(u)?(t="",null!=e&&(t=e.replace(E,"$&/")+"/"),P(u,r,t,"",(function(e){return e}))):null!=u&&(S(u)&&(u=function(e,r){return{$$typeof:o,type:e.type,key:r,ref:e.ref,props:e.props,_owner:e._owner}}(u,t+(!u.key||c&&c.key===u.key?"":(""+u.key).replace(E,"$&/")+"/")+e)),r.push(u)),1;if(c=0,n=""===n?".":n+":",Array.isArray(e))for(var s=0;s<e.length;s++){var l=n+M(i=e[s],s);c+=P(i,r,t,l,u)}else if("function"==typeof(l=function(e){return null===e||"object"!=typeof e?null:"function"==typeof(e=p&&e[p]||e["@@iterator"])?e:null}(e)))for(e=l.call(e),s=0;!(i=e.next()).done;)c+=P(i=i.value,r,t,l=n+M(i,s++),u);else if("object"===i)throw r=""+e,Error(d(31,"[object Object]"===r?"object with keys {"+Object.keys(e).join(", ")+"}":r));return c}function k(e,r,t){if(null==e)return e;var n=[],o=0;return P(e,n,"","",(function(e){return r.call(t,e,o++)})),n}function O(e){if(-1===e._status){var r=e._result;r=r(),e._status=0,e._result=r,r.then((function(r){0===e._status&&(r=r.default,e._status=1,e._result=r)}),(function(r){0===e._status&&(e._status=2,e._result=r)}))}if(1===e._status)return e._result;throw e._result}var x={current:null};function j(){var e=x.current;if(null===e)throw Error(d(321));return e}var C={ReactCurrentDispatcher:x,ReactCurrentBatchConfig:{transition:0},ReactCurrentOwner:b,IsSomeRendererActing:{current:!1},assign:n};r.Children={map:k,forEach:function(e,r,t){k(e,(function(){r.apply(this,arguments)}),t)},count:function(e){var r=0;return k(e,(function(){r++})),r},toArray:function(e){return k(e,(function(e){return e}))||[]},only:function(e){if(!S(e))throw Error(d(143));return e}},r.Component=w,r.PureComponent=h,r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=C,r.cloneElement=function(e,r,t){if(null==e)throw Error(d(267,e));var a=n({},e.props),u=e.key,i=e.ref,c=e._owner;if(null!=r){if(void 0!==r.ref&&(i=r.ref,c=b.current),void 0!==r.key&&(u=""+r.key),e.type&&e.type.defaultProps)var s=e.type.defaultProps;for(l in r)A.call(r,l)&&!g.hasOwnProperty(l)&&(a[l]=void 0===r[l]&&void 0!==s?s[l]:r[l])}var l=arguments.length-2;if(1===l)a.children=t;else if(1<l){s=Array(l);for(var f=0;f<l;f++)s[f]=arguments[f+2];a.children=s}return{$$typeof:o,type:e.type,key:u,ref:i,props:a,_owner:c}},r.createContext=function(e,r){return void 0===r&&(r=null),(e={$$typeof:i,_calculateChangedBits:r,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null}).Provider={$$typeof:u,_context:e},e.Consumer=e},r.createElement=F,r.createFactory=function(e){var r=F.bind(null,e);return r.type=e,r},r.createRef=function(){return{current:null}},r.forwardRef=function(e){return{$$typeof:c,render:e}},r.isValidElement=S,r.lazy=function(e){return{$$typeof:l,_payload:{_status:-1,_result:e},_init:O}},r.memo=function(e,r){return{$$typeof:s,type:e,compare:void 0===r?null:r}},r.useCallback=function(e,r){return j().useCallback(e,r)},r.useContext=function(e,r){return j().useContext(e,r)},r.useDebugValue=function(){},r.useEffect=function(e,r){return j().useEffect(e,r)},r.useImperativeHandle=function(e,r,t){return j().useImperativeHandle(e,r,t)},r.useLayoutEffect=function(e,r){return j().useLayoutEffect(e,r)},r.useMemo=function(e,r){return j().useMemo(e,r)},r.useReducer=function(e,r,t){return j().useReducer(e,r,t)},r.useRef=function(e){return j().useRef(e)},r.useState=function(e){return j().useState(e)},r.version="17.0.2"},294:(e,r,t)=>{e.exports=t(408)}},__webpack_module_cache__={};function __webpack_require__(e){var r=__webpack_module_cache__[e];if(void 0!==r)return r.exports;var t=__webpack_module_cache__[e]={exports:{}};return __webpack_modules__[e](t,t.exports,__webpack_require__),t.exports}__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var __webpack_exports__={};(()=>{__webpack_require__.r(__webpack_exports__);var musetric_Sounds_SpectrumWorker__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(785);(0,musetric_Sounds_SpectrumWorker__WEBPACK_IMPORTED_MODULE_0__.runSpectrumWorker)(eval("this"))})(),_=__webpack_exports__})();