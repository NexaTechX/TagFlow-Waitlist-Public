import{r as c}from"./vendor-f2a9e80b.js";let F={data:""},_=t=>typeof window=="object"?((t?t.querySelector("#_goober"):window._goober)||Object.assign((t||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:t||F,H=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,Z=/\/\*[^]*?\*\/|  +/g,z=/\n+/g,b=(t,e)=>{let a="",s="",o="";for(let r in t){let n=t[r];r[0]=="@"?r[1]=="i"?a=r+" "+n+";":s+=r[1]=="f"?b(n,r):r+"{"+b(n,r[1]=="k"?"":e)+"}":typeof n=="object"?s+=b(n,e?e.replace(/([^,])+/g,i=>r.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,l=>/&/.test(l)?l.replace(/&/g,i):i?i+" "+l:l)):r):n!=null&&(r=/^--/.test(r)?r:r.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=b.p?b.p(r,n):r+":"+n+";")}return a+(e&&o?e+"{"+o+"}":o)+s},h={},S=t=>{if(typeof t=="object"){let e="";for(let a in t)e+=a+S(t[a]);return e}return t},R=(t,e,a,s,o)=>{let r=S(t),n=h[r]||(h[r]=(l=>{let d=0,p=11;for(;d<l.length;)p=101*p+l.charCodeAt(d++)>>>0;return"go"+p})(r));if(!h[n]){let l=r!==t?t:(d=>{let p,f,u=[{}];for(;p=H.exec(d.replace(Z,""));)p[4]?u.shift():p[3]?(f=p[3].replace(z," ").trim(),u.unshift(u[0][f]=u[0][f]||{})):u[0][p[1]]=p[2].replace(z," ").trim();return u[0]})(t);h[n]=b(o?{["@keyframes "+n]:l}:l,a?"":"."+n)}let i=a&&h.g?h.g:null;return a&&(h.g=h[n]),((l,d,p,f)=>{f?d.data=d.data.replace(f,l):d.data.indexOf(l)===-1&&(d.data=p?l+d.data:d.data+l)})(h[n],e,s,i),n},U=(t,e,a)=>t.reduce((s,o,r)=>{let n=e[r];if(n&&n.call){let i=n(a),l=i&&i.props&&i.props.className||/^go/.test(i)&&i;n=l?"."+l:i&&typeof i=="object"?i.props?"":b(i,""):i===!1?"":i}return s+o+(n??"")},"");function A(t){let e=this||{},a=t.call?t(e.p):t;return R(a.unshift?a.raw?U(a,[].slice.call(arguments,1),e.p):a.reduce((s,o)=>Object.assign(s,o&&o.call?o(e.p):o),{}):a,_(e.target),e.g,e.o,e.k)}let P,N,O;A.bind({g:1});let y=A.bind({k:1});function q(t,e,a,s){b.p=e,P=t,N=a,O=s}function v(t,e){let a=this||{};return function(){let s=arguments;function o(r,n){let i=Object.assign({},r),l=i.className||o.className;a.p=Object.assign({theme:N&&N()},i),a.o=/ *go\d+/.test(l),i.className=A.apply(a,s)+(l?" "+l:""),e&&(i.ref=n);let d=t;return t[0]&&(d=i.as||t,delete i.as),O&&d[0]&&O(i),P(d,i)}return e?e(o):o}}var B=t=>typeof t=="function",C=(t,e)=>B(t)?t(e):t,W=(()=>{let t=0;return()=>(++t).toString()})(),L=(()=>{let t;return()=>{if(t===void 0&&typeof window<"u"){let e=matchMedia("(prefers-reduced-motion: reduce)");t=!e||e.matches}return t}})(),Y=20,E=new Map,G=1e3,D=t=>{if(E.has(t))return;let e=setTimeout(()=>{E.delete(t),x({type:4,toastId:t})},G);E.set(t,e)},J=t=>{let e=E.get(t);e&&clearTimeout(e)},I=(t,e)=>{switch(e.type){case 0:return{...t,toasts:[e.toast,...t.toasts].slice(0,Y)};case 1:return e.toast.id&&J(e.toast.id),{...t,toasts:t.toasts.map(r=>r.id===e.toast.id?{...r,...e.toast}:r)};case 2:let{toast:a}=e;return t.toasts.find(r=>r.id===a.id)?I(t,{type:1,toast:a}):I(t,{type:0,toast:a});case 3:let{toastId:s}=e;return s?D(s):t.toasts.forEach(r=>{D(r.id)}),{...t,toasts:t.toasts.map(r=>r.id===s||s===void 0?{...r,visible:!1}:r)};case 4:return e.toastId===void 0?{...t,toasts:[]}:{...t,toasts:t.toasts.filter(r=>r.id!==e.toastId)};case 5:return{...t,pausedAt:e.time};case 6:let o=e.time-(t.pausedAt||0);return{...t,pausedAt:void 0,toasts:t.toasts.map(r=>({...r,pauseDuration:r.pauseDuration+o}))}}},$=[],j={toasts:[],pausedAt:void 0},x=t=>{j=I(j,t),$.forEach(e=>{e(j)})},K={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},Q=(t={})=>{let[e,a]=c.useState(j);c.useEffect(()=>($.push(a),()=>{let o=$.indexOf(a);o>-1&&$.splice(o,1)}),[e]);let s=e.toasts.map(o=>{var r,n;return{...t,...t[o.type],...o,duration:o.duration||((r=t[o.type])==null?void 0:r.duration)||(t==null?void 0:t.duration)||K[o.type],style:{...t.style,...(n=t[o.type])==null?void 0:n.style,...o.style}}});return{...e,toasts:s}},V=(t,e="blank",a)=>({createdAt:Date.now(),visible:!0,type:e,ariaProps:{role:"status","aria-live":"polite"},message:t,pauseDuration:0,...a,id:(a==null?void 0:a.id)||W()}),w=t=>(e,a)=>{let s=V(e,t,a);return x({type:2,toast:s}),s.id},m=(t,e)=>w("blank")(t,e);m.error=w("error");m.success=w("success");m.loading=w("loading");m.custom=w("custom");m.dismiss=t=>{x({type:3,toastId:t})};m.remove=t=>x({type:4,toastId:t});m.promise=(t,e,a)=>{let s=m.loading(e.loading,{...a,...a==null?void 0:a.loading});return t.then(o=>(m.success(C(e.success,o),{id:s,...a,...a==null?void 0:a.success}),o)).catch(o=>{m.error(C(e.error,o),{id:s,...a,...a==null?void 0:a.error})}),t};var X=(t,e)=>{x({type:1,toast:{id:t,height:e}})},tt=()=>{x({type:5,time:Date.now()})},et=t=>{let{toasts:e,pausedAt:a}=Q(t);c.useEffect(()=>{if(a)return;let r=Date.now(),n=e.map(i=>{if(i.duration===1/0)return;let l=(i.duration||0)+i.pauseDuration-(r-i.createdAt);if(l<0){i.visible&&m.dismiss(i.id);return}return setTimeout(()=>m.dismiss(i.id),l)});return()=>{n.forEach(i=>i&&clearTimeout(i))}},[e,a]);let s=c.useCallback(()=>{a&&x({type:6,time:Date.now()})},[a]),o=c.useCallback((r,n)=>{let{reverseOrder:i=!1,gutter:l=8,defaultPosition:d}=n||{},p=e.filter(g=>(g.position||d)===(r.position||d)&&g.height),f=p.findIndex(g=>g.id===r.id),u=p.filter((g,M)=>M<f&&g.visible).length;return p.filter(g=>g.visible).slice(...i?[u+1]:[0,u]).reduce((g,M)=>g+(M.height||0)+l,0)},[e]);return{toasts:e,handlers:{updateHeight:X,startPause:tt,endPause:s,calculateOffset:o}}},at=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,rt=y`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ot=y`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,st=v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${t=>t.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${at} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${rt} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${t=>t.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${ot} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,it=y`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,nt=v("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${t=>t.secondary||"#e0e0e0"};
  border-right-color: ${t=>t.primary||"#616161"};
  animation: ${it} 1s linear infinite;
`,lt=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,dt=y`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,ct=v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${t=>t.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${lt} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${dt} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${t=>t.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,pt=v("div")`
  position: absolute;
`,ut=v("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,mt=y`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ft=v("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${mt} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,gt=({toast:t})=>{let{icon:e,type:a,iconTheme:s}=t;return e!==void 0?typeof e=="string"?c.createElement(ft,null,e):e:a==="blank"?null:c.createElement(ut,null,c.createElement(nt,{...s}),a!=="loading"&&c.createElement(pt,null,a==="error"?c.createElement(st,{...s}):c.createElement(ct,{...s})))},ht=t=>`
0% {transform: translate3d(0,${t*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,yt=t=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${t*-150}%,-1px) scale(.6); opacity:0;}
`,bt="0%{opacity:0;} 100%{opacity:1;}",vt="0%{opacity:1;} 100%{opacity:0;}",xt=v("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,wt=v("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,kt=(t,e)=>{let a=t.includes("top")?1:-1,[s,o]=L()?[bt,vt]:[ht(a),yt(a)];return{animation:e?`${y(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${y(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},Et=c.memo(({toast:t,position:e,style:a,children:s})=>{let o=t.height?kt(t.position||e||"top-center",t.visible):{opacity:0},r=c.createElement(gt,{toast:t}),n=c.createElement(wt,{...t.ariaProps},C(t.message,t));return c.createElement(xt,{className:t.className,style:{...o,...a,...t.style}},typeof s=="function"?s({icon:r,message:n}):c.createElement(c.Fragment,null,r,n))});q(c.createElement);var $t=({id:t,className:e,style:a,onHeightUpdate:s,children:o})=>{let r=c.useCallback(n=>{if(n){let i=()=>{let l=n.getBoundingClientRect().height;s(t,l)};i(),new MutationObserver(i).observe(n,{subtree:!0,childList:!0,characterData:!0})}},[t,s]);return c.createElement("div",{ref:r,className:e,style:a},o)},jt=(t,e)=>{let a=t.includes("top"),s=a?{top:0}:{bottom:0},o=t.includes("center")?{justifyContent:"center"}:t.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:L()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${e*(a?1:-1)}px)`,...s,...o}},Ct=A`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,k=16,Ot=({reverseOrder:t,position:e="top-center",toastOptions:a,gutter:s,children:o,containerStyle:r,containerClassName:n})=>{let{toasts:i,handlers:l}=et(a);return c.createElement("div",{style:{position:"fixed",zIndex:9999,top:k,left:k,right:k,bottom:k,pointerEvents:"none",...r},className:n,onMouseEnter:l.startPause,onMouseLeave:l.endPause},i.map(d=>{let p=d.position||e,f=l.calculateOffset(d,{reverseOrder:t,gutter:s,defaultPosition:e}),u=jt(p,f);return c.createElement($t,{id:d.id,key:d.id,onHeightUpdate:l.updateHeight,className:d.visible?Ct:"",style:u},d.type==="custom"?C(d.message,d):o?o(d):c.createElement(Et,{toast:d,position:p}))}))},It=m;/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var At={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mt=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase().trim(),T=(t,e)=>{const a=c.forwardRef(({color:s="currentColor",size:o=24,strokeWidth:r=2,absoluteStrokeWidth:n,className:i="",children:l,...d},p)=>c.createElement("svg",{ref:p,...At,width:o,height:o,stroke:s,strokeWidth:n?Number(r)*24/Number(o):r,className:["lucide",`lucide-${Mt(t)}`,i].join(" "),...d},[...e.map(([f,u])=>c.createElement(f,u)),...Array.isArray(l)?l:[l]]));return a.displayName=`${t}`,a};/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zt=T("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dt=T("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);export{Ot as I,zt as M,Dt as S,It as _,T as c};
//# sourceMappingURL=sun-ab41fa77.js.map
