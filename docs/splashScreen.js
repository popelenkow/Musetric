!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var r=t();for(var o in r)("object"==typeof exports?exports:e)[o]=r[o]}}(self,(function(){return(()=>{"use strict";var e={1317:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default={app:"rgb(33, 33, 33)",sidebar:"rgb(61, 61, 61)",content:"rgb(255, 255, 255)",disabled:"rgb(150, 150, 150)",hover:"rgba(255, 255, 255, 0.2)",active:"rgb(255, 0, 0)",splitter:"rgb(128, 128, 128)"}},7838:function(e,t,r){var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.setStorageThemeId=t.getStorageThemeId=t.isThemeId=t.allThemeIds=t.localizeThemeId=t.allThemes=void 0;const l=o(r(7522)),a=o(r(1317));t.allThemes={white:l.default,dark:a.default},t.localizeThemeId=(e,t)=>"white"===e?t("Musetric:theme.white"):"dark"===e?t("Musetric:theme.dark"):void 0,t.allThemeIds=Object.keys(t.allThemes),t.isThemeId=e=>-1!==t.allThemeIds.findIndex((t=>t===e)),t.getStorageThemeId=()=>{const e=localStorage.getItem("theme");return t.isThemeId(e)?e:"dark"},t.setStorageThemeId=e=>{localStorage.setItem("theme",e)}},7522:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default={app:"rgb(255, 255, 255)",sidebar:"rgb(240, 240, 240)",content:"rgb(50, 50, 50)",disabled:"rgb(150, 150, 150)",hover:"rgba(0, 0, 0, 0.2)",active:"rgb(255, 0, 0)",splitter:"rgb(191, 191, 191)"}}},t={};function r(o){var l=t[o];if(void 0!==l)return l.exports;var a=t[o]={exports:{}};return e[o].call(a.exports,a,a.exports,r),a.exports}r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var o in t)r.o(t,o)&&!r.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var o={};return(()=>{r.r(o);var e=r(7838);(()=>{const t=(0,e.getStorageThemeId)(),r=e.allThemes[t],o=document.getElementById("root");if(!o)return;const l=document.createElement("div");l.style.height=`${window.innerHeight}px`,l.style.width="100%",l.style.display="flex",l.style.justifyContent="center",l.style.alignItems="center",l.style.font='36px/40px "Segoe UI", Arial, sans-serif',l.style.backgroundColor=r.app,l.style.color=r.content,l.innerText="Musetric",o.appendChild(l)})()})(),o})()}));