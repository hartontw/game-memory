const u=function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const s of t.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function i(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function n(e){if(e.ep)return;e.ep=!0;const t=i(e);fetch(e.href,t)}};u();function a(r,o){if(r<2)throw new Error("Unique cards must be greater than one");const i=r*2;let n,e;const t=r-1<o?r-1:o;for(let s=t;s>2;s--)if(i%s==0){n=s,e=i/s;break}return n||(n=r,e=2),n>o&&([n,e]=[e,n]),{rows:e,cols:n}}const c=document.querySelector(":root"),y=document.querySelector(".game"),l=25,f=.1;let d="";for(let r=0;r<l*2;r++)d+='<div class="card"></div>';y.innerHTML=d;function p(r=10){const o=a(l,r);c.style.setProperty("--cols",o.cols),c.style.setProperty("--rows",o.rows),c.style.setProperty("--size",`${f*100}vh`),c.style.setProperty("--gap",`${f*10}vh`)}p();window.addEventListener("resize",r=>{},!0);
