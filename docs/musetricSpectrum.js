/*! For license information please see musetricSpectrum.js.LICENSE.txt */
var _;(()=>{"use strict";var __webpack_modules__={337:(e,r,t)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.useAnimation=r.startAnimation=void 0;const n=t(294);r.startAnimation=e=>{let r=!0,t=0;const n=o=>{const a=e();a&&a(o-t),t=o,r&&requestAnimationFrame(n)};return requestAnimationFrame(n),{stop:()=>{r=!1}}},r.useAnimation=(e,t)=>{const o=n.useRef();n.useEffect((()=>{o.current=e}),t),n.useEffect((()=>{const e=r.startAnimation((()=>o.current));return()=>e.stop()}),[])}},175:(e,r)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.convertAmplitudeToBel=void 0,r.convertAmplitudeToBel=e=>{for(let r=0;r<e.length;r++){const t=e[r],n=Math.log10(t)/5,o=Math.max(0,Math.min(1,n+1));e[r]=o}}},608:(e,r)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.normComplexArray=r.createComplexArray=r.createRealArray=void 0,r.createRealArray=(e,r)=>{if("float32"===r)return new Float32Array(e);if("float64"===r)return new Float64Array(e);const t=new Array(e);for(let r=0;r<e;r++)t[r]=0;return t},r.createComplexArray=(e,t)=>({real:r.createRealArray(e,t),imag:r.createRealArray(e,t)}),r.normComplexArray=(e,r,t)=>{const n=r.length;for(let o=0;o<n;o++){const n=e.real[o],a=e.imag[o];r[o]=t*Math.sqrt(n*n+a*a)}}},819:(e,r,t)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.createFftRadix4=r.createFftRadix4Base=r.createArrayRadix4=void 0;const n=t(608),o=t(343),a=e=>{const{input:r,output:t,outOff:n,off:o,step:a}=e,i=r.real[o],u=r.imag[o],c=r.real[o+a],l=r.imag[o+a],s=i+c,f=u+l,p=i-c,d=u-l;t.real[n]=s,t.imag[n]=f,t.real[n+1]=p,t.imag[n+1]=d},i=e=>{const{input:r,output:t,inv:n,outOff:o,off:a,step:i}=e,u=n?-1:1,c=2*i,l=3*i,s=r.real[a],f=r.imag[a],p=r.real[a+i],d=r.imag[a+i],_=r.real[a+c],y=r.imag[a+c],m=r.real[a+l],w=r.imag[a+l],h=s+_,v=f+y,b=s-_,g=f-y,A=p+m,E=d+w,S=u*(p-m),M=u*(d-w),R=h+A,F=v+E,P=b+M,k=g-S,O=h-A,j=v-E,x=b-M,C=g+S;t.real[o]=R,t.imag[o]=F,t.real[o+1]=P,t.imag[o+1]=k,t.real[o+2]=O,t.imag[o+2]=j,t.real[o+3]=x,t.imag[o+3]=C},u=e=>{const{input:r,output:t,inv:n,windowSize:o,width:u,reverseTable:c,table:l}=e;let s,f,p=1<<u,d=o/p<<1;if(2===d)for(s=0,f=0;s<o;s+=d,f++){const e=c[f];a({input:r,output:t,outOff:s,off:e,step:p>>1})}else for(s=0,f=0;s<o;s+=d,f++){const e=c[f];i({input:r,output:t,inv:n,outOff:s,off:e,step:p>>1})}const _=n?-1:1;for(p>>=2;p>=2;p>>=2){d=o/p<<1;const e=d>>>2;for(s=0;s<o;s+=d){const r=s+e;for(let n=s,o=0;n<r;n++,o+=p){const r=n,a=r+e,i=a+e,u=i+e,c=t.real[r],s=t.imag[r],f=t.real[a],p=t.imag[a],d=t.real[i],y=t.imag[i],m=t.real[u],w=t.imag[u],h=c,v=s,b=l[o],g=_*l[o+1],A=f*b-p*g,E=f*g+p*b,S=l[2*o],M=_*l[2*o+1],R=d*S-y*M,F=d*M+y*S,P=l[3*o],k=_*l[3*o+1],O=m*P-w*k,j=m*k+w*P,x=h+R,C=v+F,W=h-R,q=v-F,T=A+O,$=E+j,B=_*(A-O),I=_*(E-j),z=x+T,U=C+$,L=x-T,N=C-$,D=W+I,H=q-B,V=W-I,Y=q+B;t.real[r]=z,t.imag[r]=U,t.real[a]=D,t.imag[a]=H,t.real[i]=L,t.imag[i]=N,t.real[u]=V,t.imag[u]=Y}}}};r.createArrayRadix4=e=>{const r={createComplexArray:()=>{const r=new Array(2*e);for(let t=0;t<2*e;t++)r[t]=0;return r},toComplexArray:t=>{const n=r.createComplexArray();for(let r=0;r<2*e;r+=2)n[r]=t[r>>>1],n[r+1]=0;return n},toArray:t=>{const n=r.createComplexArray();for(let r=0;r<2*e;r+=2)n[r]=t.real[r>>>1],n[r+1]=t.imag[r>>>1];return n},fromArray:(r,t)=>{for(let n=0;n<2*e;n+=2)t.real[n>>>1]=r[n],t.imag[n>>>1]=r[n+1]}};return r},r.createFftRadix4Base=e=>{if(e<=1||0!=(e&e-1))throw new Error("FFT size must be a power of two and bigger than 1");const r=(e=>{const r=n.createRealArray(2*e,"list");for(let t=0;t<r.length;t+=2){const n=Math.PI*t/e;r[t]=Math.cos(n),r[t+1]=-Math.sin(n)}return r})(e),t=(e=>{let r=0;for(let t=1;e>t;t<<=1)r++;return r%2==0?r-1:r})(e),o=(e=>{const r=new Array(1<<e-1);for(let t=0;t<r.length;t++){r[t]=0;for(let n=0;n<e;n+=2){const o=e-n-2;r[t]|=(t>>>n&3)<<o}r[t]/=2}return r})(t);return{forward:(n,a)=>{u({input:n,output:a,inv:!1,windowSize:e,width:t,reverseTable:o,table:r})},inverse:(n,a)=>{u({input:n,output:a,inv:!0,windowSize:e,width:t,reverseTable:o,table:r});for(let r=0;r<e;r++)a.real[r]/=e,a.imag[r]/=e}}},r.createFftRadix4=e=>{const t=r.createFftRadix4Base(e);return o.createSpectrometer(e,t)}},343:(e,r,t)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.createSpectrometer=void 0;const n=t(175),o=t(608),a=t(119);r.createSpectrometer=(e,r)=>{const{forward:t,inverse:i}=r,u=o.createComplexArray(e,"list"),c=o.createRealArray(e/2,"float64"),l=o.createComplexArray(e,"list"),s=a.gaussWindowFilter(e,"list"),f={forward:t,inverse:i,frequency:(r,a,i)=>{const{convert:c=n.convertAmplitudeToBel}=i;for(let t=0;t<e;t++)u.real[t]=r[t]*s[t],u.imag[t]=0;t(u,l),o.normComplexArray(l,a,1/e),c(a)},frequencies:(r,t,n)=>{const{step:o,count:a,convert:i}=n;let{offset:u}=n;for(let n=0;n<a;n++){const a=Math.floor(u)*Float32Array.BYTES_PER_ELEMENT,c=new Float32Array(r.buffer,a,e);f.frequency(c,t[n],{convert:i}),u+=o}},byteFrequencies:(r,t,n)=>{const{step:o,count:a,convert:i}=n;let{offset:u}=n;for(let n=0;n<a;n++){const a=Math.floor(u)*Float32Array.BYTES_PER_ELEMENT,l=new Float32Array(r.buffer,a,e);f.frequency(l,c,{convert:i});for(let r=0;r<e/2;r++)t[n][r]=Math.round(255*c[r]);u+=o}}};return f}},785:(e,r,t)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.runSpectrumWorker=r.createSpectrumHandlers=r.createFrequenciesView=void 0;const n=t(819),o=t(337),a=t(292);r.createFrequenciesView=(e,r,t)=>{const n=r/2,o=n*Uint8Array.BYTES_PER_ELEMENT,a=[];let i=0;for(let r=0;r<t;r++){const r=new Uint8Array(e,i,n);a.push(r),i+=o}return a},r.createSpectrumHandlers=()=>{let e,t;const a=()=>{if(!e||!t)return;const{windowSize:r,count:n,spectrometer:o,frequencies:a}=e,i={offset:0,step:(t.length-r)/(n-1),count:n};o.byteFrequencies(t,a,i),(()=>{if(!e||!t)return;const{raw:r,result:n}=e;n.set(r)})()};let i;return{setup:t=>{const{windowSize:o,count:a}=t,i=o/2,u=n.createFftRadix4(o),c=new SharedArrayBuffer(a*i*Uint8Array.BYTES_PER_ELEMENT),l=new ArrayBuffer(a*i*Uint8Array.BYTES_PER_ELEMENT),s=r.createFrequenciesView(l,o,a),f=new Uint8Array(l),p=new Uint8Array(c);return e={windowSize:o,count:a,spectrometer:u,frequencies:s,raw:f,result:p},c},start:()=>{i&&i.stop(),i=o.startAnimation((()=>a))},stop:()=>{i&&i.stop(),i=void 0},setSoundBuffer:e=>{t=new Float32Array(e)}}},r.runSpectrumWorker=e=>{a.runPromiseWorker(e,r.createSpectrumHandlers)}},119:(e,r,t)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.triangularWindowFilter=r.rectangularWindowFilter=r.lanczozWindowFilter=r.hannWindowFilter=r.hammingWindowFilter=r.gaussWindowFilter=r.cosineWindowFilter=r.blackmanWindowFilter=r.bartlettHannWindowFilter=r.bartlettWindowFilter=r.zeroWindowFilter=void 0;const n=t(608);r.zeroWindowFilter=(e,r)=>{const t=n.createRealArray(e,r);for(let r=0;r<e;r++)t[r]=0;return t},r.bartlettWindowFilter=(e,r)=>{const t=n.createRealArray(e,r),o=e-1;for(let r=0;r<e;r++)t[r]=2/o*(o/2-Math.abs(r-o/2));return t},r.bartlettHannWindowFilter=(e,r)=>{const t=n.createRealArray(e,r),o=e-1;for(let r=0;r<e;r++)t[r]=2/o*(o/2-Math.abs(r-o/2));return t},r.blackmanWindowFilter=(e,r)=>{const t=n.createRealArray(e,r),o=e-1;for(let r=0;r<e;r++){const e=2*Math.PI*r/o,n=4*Math.PI*r/o;t[r]=.42-.5*Math.cos(e)+.08*Math.cos(n)}return t},r.cosineWindowFilter=(e,r)=>{const t=n.createRealArray(e,r);for(let r=0;r<e;r++)t[r]=Math.cos(Math.PI*r/(e-1)-Math.PI/2);return t},r.gaussWindowFilter=(e,r)=>{const t=n.createRealArray(e,r);for(let r=0;r<e;r++){const n=(r-(e-1)/2)/(.25*(e-1)/2);t[r]=Math.pow(Math.E,-.5*Math.pow(n,2))}return t},r.hammingWindowFilter=(e,r)=>{const t=n.createRealArray(e,r);for(let r=0;r<e;r++)t[r]=.54-.46*Math.cos(2*Math.PI*r/(e-1));return t},r.hannWindowFilter=(e,r)=>{const t=n.createRealArray(e,r);for(let r=0;r<e;r++)t[r]=.5*(1-Math.cos(2*Math.PI*r/(e-1)));return t},r.lanczozWindowFilter=(e,r)=>{const t=n.createRealArray(e,r),o=e-1;for(let r=0;r<e;r++)t[r]=Math.sin(Math.PI*(2*r/o-1))/(Math.PI*(2*r/o-1));return t},r.rectangularWindowFilter=(e,r)=>{const t=n.createRealArray(e,r);for(let r=0;r<e;r++)t[r]=1;return t},r.triangularWindowFilter=(e,r)=>{const t=n.createRealArray(e,r);for(let r=0;r<e;r++)t[r]=2/e*(e/2-Math.abs(r-(e-1)/2));return t}},292:(e,r)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.runPromiseWorker=void 0,r.runPromiseWorker=(e,r)=>{const t=r=>{e.postMessage(r)},n=r(t);e.onmessage=e=>{const{id:r,type:o,args:a}=e.data,i=n[o](...a);t({id:r,type:o,result:i})}}},418:e=>{var r=Object.getOwnPropertySymbols,t=Object.prototype.hasOwnProperty,n=Object.prototype.propertyIsEnumerable;function o(e){if(null==e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}e.exports=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var r={},t=0;t<10;t++)r["_"+String.fromCharCode(t)]=t;if("0123456789"!==Object.getOwnPropertyNames(r).map((function(e){return r[e]})).join(""))return!1;var n={};return"abcdefghijklmnopqrst".split("").forEach((function(e){n[e]=e})),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},n)).join("")}catch(e){return!1}}()?Object.assign:function(e,a){for(var i,u,c=o(e),l=1;l<arguments.length;l++){for(var s in i=Object(arguments[l]))t.call(i,s)&&(c[s]=i[s]);if(r){u=r(i);for(var f=0;f<u.length;f++)n.call(i,u[f])&&(c[u[f]]=i[u[f]])}}return c}},408:(e,r,t)=>{var n=t(418),o=60103,a=60106;r.Fragment=60107,r.StrictMode=60108,r.Profiler=60114;var i=60109,u=60110,c=60112;r.Suspense=60113;var l=60115,s=60116;if("function"==typeof Symbol&&Symbol.for){var f=Symbol.for;o=f("react.element"),a=f("react.portal"),r.Fragment=f("react.fragment"),r.StrictMode=f("react.strict_mode"),r.Profiler=f("react.profiler"),i=f("react.provider"),u=f("react.context"),c=f("react.forward_ref"),r.Suspense=f("react.suspense"),l=f("react.memo"),s=f("react.lazy")}var p="function"==typeof Symbol&&Symbol.iterator;function d(e){for(var r="https://reactjs.org/docs/error-decoder.html?invariant="+e,t=1;t<arguments.length;t++)r+="&args[]="+encodeURIComponent(arguments[t]);return"Minified React error #"+e+"; visit "+r+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var _={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},y={};function m(e,r,t){this.props=e,this.context=r,this.refs=y,this.updater=t||_}function w(){}function h(e,r,t){this.props=e,this.context=r,this.refs=y,this.updater=t||_}m.prototype.isReactComponent={},m.prototype.setState=function(e,r){if("object"!=typeof e&&"function"!=typeof e&&null!=e)throw Error(d(85));this.updater.enqueueSetState(this,e,r,"setState")},m.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},w.prototype=m.prototype;var v=h.prototype=new w;v.constructor=h,n(v,m.prototype),v.isPureReactComponent=!0;var b={current:null},g=Object.prototype.hasOwnProperty,A={key:!0,ref:!0,__self:!0,__source:!0};function E(e,r,t){var n,a={},i=null,u=null;if(null!=r)for(n in void 0!==r.ref&&(u=r.ref),void 0!==r.key&&(i=""+r.key),r)g.call(r,n)&&!A.hasOwnProperty(n)&&(a[n]=r[n]);var c=arguments.length-2;if(1===c)a.children=t;else if(1<c){for(var l=Array(c),s=0;s<c;s++)l[s]=arguments[s+2];a.children=l}if(e&&e.defaultProps)for(n in c=e.defaultProps)void 0===a[n]&&(a[n]=c[n]);return{$$typeof:o,type:e,key:i,ref:u,props:a,_owner:b.current}}function S(e){return"object"==typeof e&&null!==e&&e.$$typeof===o}var M=/\/+/g;function R(e,r){return"object"==typeof e&&null!==e&&null!=e.key?function(e){var r={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,(function(e){return r[e]}))}(""+e.key):r.toString(36)}function F(e,r,t,n,i){var u=typeof e;"undefined"!==u&&"boolean"!==u||(e=null);var c=!1;if(null===e)c=!0;else switch(u){case"string":case"number":c=!0;break;case"object":switch(e.$$typeof){case o:case a:c=!0}}if(c)return i=i(c=e),e=""===n?"."+R(c,0):n,Array.isArray(i)?(t="",null!=e&&(t=e.replace(M,"$&/")+"/"),F(i,r,t,"",(function(e){return e}))):null!=i&&(S(i)&&(i=function(e,r){return{$$typeof:o,type:e.type,key:r,ref:e.ref,props:e.props,_owner:e._owner}}(i,t+(!i.key||c&&c.key===i.key?"":(""+i.key).replace(M,"$&/")+"/")+e)),r.push(i)),1;if(c=0,n=""===n?".":n+":",Array.isArray(e))for(var l=0;l<e.length;l++){var s=n+R(u=e[l],l);c+=F(u,r,t,s,i)}else if("function"==typeof(s=function(e){return null===e||"object"!=typeof e?null:"function"==typeof(e=p&&e[p]||e["@@iterator"])?e:null}(e)))for(e=s.call(e),l=0;!(u=e.next()).done;)c+=F(u=u.value,r,t,s=n+R(u,l++),i);else if("object"===u)throw r=""+e,Error(d(31,"[object Object]"===r?"object with keys {"+Object.keys(e).join(", ")+"}":r));return c}function P(e,r,t){if(null==e)return e;var n=[],o=0;return F(e,n,"","",(function(e){return r.call(t,e,o++)})),n}function k(e){if(-1===e._status){var r=e._result;r=r(),e._status=0,e._result=r,r.then((function(r){0===e._status&&(r=r.default,e._status=1,e._result=r)}),(function(r){0===e._status&&(e._status=2,e._result=r)}))}if(1===e._status)return e._result;throw e._result}var O={current:null};function j(){var e=O.current;if(null===e)throw Error(d(321));return e}var x={ReactCurrentDispatcher:O,ReactCurrentBatchConfig:{transition:0},ReactCurrentOwner:b,IsSomeRendererActing:{current:!1},assign:n};r.Children={map:P,forEach:function(e,r,t){P(e,(function(){r.apply(this,arguments)}),t)},count:function(e){var r=0;return P(e,(function(){r++})),r},toArray:function(e){return P(e,(function(e){return e}))||[]},only:function(e){if(!S(e))throw Error(d(143));return e}},r.Component=m,r.PureComponent=h,r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=x,r.cloneElement=function(e,r,t){if(null==e)throw Error(d(267,e));var a=n({},e.props),i=e.key,u=e.ref,c=e._owner;if(null!=r){if(void 0!==r.ref&&(u=r.ref,c=b.current),void 0!==r.key&&(i=""+r.key),e.type&&e.type.defaultProps)var l=e.type.defaultProps;for(s in r)g.call(r,s)&&!A.hasOwnProperty(s)&&(a[s]=void 0===r[s]&&void 0!==l?l[s]:r[s])}var s=arguments.length-2;if(1===s)a.children=t;else if(1<s){l=Array(s);for(var f=0;f<s;f++)l[f]=arguments[f+2];a.children=l}return{$$typeof:o,type:e.type,key:i,ref:u,props:a,_owner:c}},r.createContext=function(e,r){return void 0===r&&(r=null),(e={$$typeof:u,_calculateChangedBits:r,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null}).Provider={$$typeof:i,_context:e},e.Consumer=e},r.createElement=E,r.createFactory=function(e){var r=E.bind(null,e);return r.type=e,r},r.createRef=function(){return{current:null}},r.forwardRef=function(e){return{$$typeof:c,render:e}},r.isValidElement=S,r.lazy=function(e){return{$$typeof:s,_payload:{_status:-1,_result:e},_init:k}},r.memo=function(e,r){return{$$typeof:l,type:e,compare:void 0===r?null:r}},r.useCallback=function(e,r){return j().useCallback(e,r)},r.useContext=function(e,r){return j().useContext(e,r)},r.useDebugValue=function(){},r.useEffect=function(e,r){return j().useEffect(e,r)},r.useImperativeHandle=function(e,r,t){return j().useImperativeHandle(e,r,t)},r.useLayoutEffect=function(e,r){return j().useLayoutEffect(e,r)},r.useMemo=function(e,r){return j().useMemo(e,r)},r.useReducer=function(e,r,t){return j().useReducer(e,r,t)},r.useRef=function(e){return j().useRef(e)},r.useState=function(e){return j().useState(e)},r.version="17.0.2"},294:(e,r,t)=>{e.exports=t(408)}},__webpack_module_cache__={};function __webpack_require__(e){var r=__webpack_module_cache__[e];if(void 0!==r)return r.exports;var t=__webpack_module_cache__[e]={exports:{}};return __webpack_modules__[e](t,t.exports,__webpack_require__),t.exports}__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var __webpack_exports__={};(()=>{__webpack_require__.r(__webpack_exports__);var musetric_Sounds_SpectrumWorker__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(785);(0,musetric_Sounds_SpectrumWorker__WEBPACK_IMPORTED_MODULE_0__.runSpectrumWorker)(eval("this"))})(),_=__webpack_exports__})();