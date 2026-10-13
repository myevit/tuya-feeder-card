var z=globalThis,O=z.ShadowRoot&&(z.ShadyCSS===void 0||z.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,K=Symbol(),le=new WeakMap,C=class{constructor(e,i,t){if(this._$cssResult$=!0,t!==K)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=i}get styleSheet(){let e=this.o,i=this.t;if(O&&e===void 0){let t=i!==void 0&&i.length===1;t&&(e=le.get(i)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&le.set(i,e))}return e}toString(){return this.cssText}},de=r=>new C(typeof r=="string"?r:r+"",void 0,K),Y=(r,...e)=>{let i=r.length===1?r[0]:e.reduce((t,s,a)=>t+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[a+1],r[0]);return new C(i,r,K)},he=(r,e)=>{if(O)r.adoptedStyleSheets=e.map(i=>i instanceof CSSStyleSheet?i:i.styleSheet);else for(let i of e){let t=document.createElement("style"),s=z.litNonce;s!==void 0&&t.setAttribute("nonce",s),t.textContent=i.cssText,r.appendChild(t)}},G=O?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let i="";for(let t of e.cssRules)i+=t.cssText;return de(i)})(r):r;var{is:Be,defineProperty:Ne,getOwnPropertyDescriptor:Ue,getOwnPropertyNames:He,getOwnPropertySymbols:ze,getPrototypeOf:Oe}=Object,D=globalThis,ce=D.trustedTypes,De=ce?ce.emptyScript:"",Ie=D.reactiveElementPolyfillSupport,P=(r,e)=>r,J={toAttribute(r,e){switch(e){case Boolean:r=r?De:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let i=r;switch(e){case Boolean:i=r!==null;break;case Number:i=r===null?null:Number(r);break;case Object:case Array:try{i=JSON.parse(r)}catch{i=null}}return i}},ue=(r,e)=>!Be(r,e),pe={attribute:!0,type:String,converter:J,reflect:!1,useDefault:!1,hasChanged:ue};Symbol.metadata??=Symbol("metadata"),D.litPropertyMetadata??=new WeakMap;var g=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,i=pe){if(i.state&&(i.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((i=Object.create(i)).wrapped=!0),this.elementProperties.set(e,i),!i.noAccessor){let t=Symbol(),s=this.getPropertyDescriptor(e,t,i);s!==void 0&&Ne(this.prototype,e,s)}}static getPropertyDescriptor(e,i,t){let{get:s,set:a}=Ue(this.prototype,e)??{get(){return this[i]},set(n){this[i]=n}};return{get:s,set(n){let h=s?.call(this);a?.call(this,n),this.requestUpdate(e,h,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??pe}static _$Ei(){if(this.hasOwnProperty(P("elementProperties")))return;let e=Oe(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(P("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(P("properties"))){let i=this.properties,t=[...He(i),...ze(i)];for(let s of t)this.createProperty(s,i[s])}let e=this[Symbol.metadata];if(e!==null){let i=litPropertyMetadata.get(e);if(i!==void 0)for(let[t,s]of i)this.elementProperties.set(t,s)}this._$Eh=new Map;for(let[i,t]of this.elementProperties){let s=this._$Eu(i,t);s!==void 0&&this._$Eh.set(s,i)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let i=[];if(Array.isArray(e)){let t=new Set(e.flat(1/0).reverse());for(let s of t)i.unshift(G(s))}else e!==void 0&&i.push(G(e));return i}static _$Eu(e,i){let t=i.attribute;return t===!1?void 0:typeof t=="string"?t:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,i=this.constructor.elementProperties;for(let t of i.keys())this.hasOwnProperty(t)&&(e.set(t,this[t]),delete this[t]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return he(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,i,t){this._$AK(e,t)}_$ET(e,i){let t=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,t);if(s!==void 0&&t.reflect===!0){let a=(t.converter?.toAttribute!==void 0?t.converter:J).toAttribute(i,t.type);this._$Em=e,a==null?this.removeAttribute(s):this.setAttribute(s,a),this._$Em=null}}_$AK(e,i){let t=this.constructor,s=t._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let a=t.getPropertyOptions(s),n=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:J;this._$Em=s;let h=n.fromAttribute(i,a.type);this[s]=h??this._$Ej?.get(s)??h,this._$Em=null}}requestUpdate(e,i,t,s=!1,a){if(e!==void 0){let n=this.constructor;if(s===!1&&(a=this[e]),t??=n.getPropertyOptions(e),!((t.hasChanged??ue)(a,i)||t.useDefault&&t.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,t))))return;this.C(e,i,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,i,{useDefault:t,reflect:s,wrapped:a},n){t&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??i??this[e]),a!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||t||(i=void 0),this._$AL.set(e,i)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(i){Promise.reject(i)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,a]of this._$Ep)this[s]=a;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[s,a]of t){let{wrapped:n}=a,h=this[s];n!==!0||this._$AL.has(s)||h===void 0||this.C(s,void 0,a,h)}}let e=!1,i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(i)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(i)}willUpdate(e){}_$AE(e){this._$EO?.forEach(i=>i.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(i=>this._$ET(i,this[i])),this._$EM()}updated(e){}firstUpdated(e){}};g.elementStyles=[],g.shadowRootOptions={mode:"open"},g[P("elementProperties")]=new Map,g[P("finalized")]=new Map,Ie?.({ReactiveElement:g}),(D.reactiveElementVersions??=[]).push("2.1.2");var Z=globalThis,fe=r=>r,I=Z.trustedTypes,me=I?I.createPolicy("lit-html",{createHTML:r=>r}):void 0,X="$lit$",b=`lit$${Math.random().toFixed(9).slice(2)}$`,ee="?"+b,Le=`<${ee}>`,x=document,R=()=>x.createComment(""),M=r=>r===null||typeof r!="object"&&typeof r!="function",te=Array.isArray,$e=r=>te(r)||typeof r?.[Symbol.iterator]=="function",Q=`[ 	
\f\r]`,T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ge=/-->/g,be=/>/g,y=RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),_e=/'/g,ve=/"/g,xe=/^(?:script|style|textarea|title)$/i,ie=r=>(e,...i)=>({_$litType$:r,strings:e,values:i}),p=ie(1),Ge=ie(2),Je=ie(3),f=Symbol.for("lit-noChange"),l=Symbol.for("lit-nothing"),ye=new WeakMap,$=x.createTreeWalker(x,129);function Ae(r,e){if(!te(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return me!==void 0?me.createHTML(e):e}var we=(r,e)=>{let i=r.length-1,t=[],s,a=e===2?"<svg>":e===3?"<math>":"",n=T;for(let h=0;h<i;h++){let o=r[h],c,u,d=-1,m=0;for(;m<o.length&&(n.lastIndex=m,u=n.exec(o),u!==null);)m=n.lastIndex,n===T?u[1]==="!--"?n=ge:u[1]!==void 0?n=be:u[2]!==void 0?(xe.test(u[2])&&(s=RegExp("</"+u[2],"g")),n=y):u[3]!==void 0&&(n=y):n===y?u[0]===">"?(n=s??T,d=-1):u[1]===void 0?d=-2:(d=n.lastIndex-u[2].length,c=u[1],n=u[3]===void 0?y:u[3]==='"'?ve:_e):n===ve||n===_e?n=y:n===ge||n===be?n=T:(n=y,s=void 0);let v=n===y&&r[h+1].startsWith("/>")?" ":"";a+=n===T?o+Le:d>=0?(t.push(c),o.slice(0,d)+X+o.slice(d)+b+v):o+b+(d===-2?h:v)}return[Ae(r,a+(r[i]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),t]},B=class r{constructor({strings:e,_$litType$:i},t){let s;this.parts=[];let a=0,n=0,h=e.length-1,o=this.parts,[c,u]=we(e,i);if(this.el=r.createElement(c,t),$.currentNode=this.el.content,i===2||i===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=$.nextNode())!==null&&o.length<h;){if(s.nodeType===1){if(s.hasAttributes())for(let d of s.getAttributeNames())if(d.endsWith(X)){let m=u[n++],v=s.getAttribute(d).split(b),H=/([.?@])?(.*)/.exec(m);o.push({type:1,index:a,name:H[2],strings:v,ctor:H[1]==="."?j:H[1]==="?"?F:H[1]==="@"?q:w}),s.removeAttribute(d)}else d.startsWith(b)&&(o.push({type:6,index:a}),s.removeAttribute(d));if(xe.test(s.tagName)){let d=s.textContent.split(b),m=d.length-1;if(m>0){s.textContent=I?I.emptyScript:"";for(let v=0;v<m;v++)s.append(d[v],R()),$.nextNode(),o.push({type:2,index:++a});s.append(d[m],R())}}}else if(s.nodeType===8)if(s.data===ee)o.push({type:2,index:a});else{let d=-1;for(;(d=s.data.indexOf(b,d+1))!==-1;)o.push({type:7,index:a}),d+=b.length-1}a++}}static createElement(e,i){let t=x.createElement("template");return t.innerHTML=e,t}};function A(r,e,i=r,t){if(e===f)return e;let s=t!==void 0?i._$Co?.[t]:i._$Cl,a=M(e)?void 0:e._$litDirective$;return s?.constructor!==a&&(s?._$AO?.(!1),a===void 0?s=void 0:(s=new a(r),s._$AT(r,i,t)),t!==void 0?(i._$Co??=[])[t]=s:i._$Cl=s),s!==void 0&&(e=A(r,s._$AS(r,e.values),s,t)),e}var L=class{constructor(e,i){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:i},parts:t}=this._$AD,s=(e?.creationScope??x).importNode(i,!0);$.currentNode=s;let a=$.nextNode(),n=0,h=0,o=t[0];for(;o!==void 0;){if(n===o.index){let c;o.type===2?c=new k(a,a.nextSibling,this,e):o.type===1?c=new o.ctor(a,o.name,o.strings,this,e):o.type===6&&(c=new V(a,this,e)),this._$AV.push(c),o=t[++h]}n!==o?.index&&(a=$.nextNode(),n++)}return $.currentNode=x,s}p(e){let i=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(e,t,i),i+=t.strings.length-2):t._$AI(e[i])),i++}},k=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,i,t,s){this.type=2,this._$AH=l,this._$AN=void 0,this._$AA=e,this._$AB=i,this._$AM=t,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,i=this._$AM;return i!==void 0&&e?.nodeType===11&&(e=i.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,i=this){e=A(this,e,i),M(e)?e===l||e==null||e===""?(this._$AH!==l&&this._$AR(),this._$AH=l):e!==this._$AH&&e!==f&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):$e(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==l&&M(this._$AH)?this._$AA.nextSibling.data=e:this.T(x.createTextNode(e)),this._$AH=e}$(e){let{values:i,_$litType$:t}=e,s=typeof t=="number"?this._$AC(e):(t.el===void 0&&(t.el=B.createElement(Ae(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===s)this._$AH.p(i);else{let a=new L(s,this),n=a.u(this.options);a.p(i),this.T(n),this._$AH=a}}_$AC(e){let i=ye.get(e.strings);return i===void 0&&ye.set(e.strings,i=new B(e)),i}k(e){te(this._$AH)||(this._$AH=[],this._$AR());let i=this._$AH,t,s=0;for(let a of e)s===i.length?i.push(t=new r(this.O(R()),this.O(R()),this,this.options)):t=i[s],t._$AI(a),s++;s<i.length&&(this._$AR(t&&t._$AB.nextSibling,s),i.length=s)}_$AR(e=this._$AA.nextSibling,i){for(this._$AP?.(!1,!0,i);e!==this._$AB;){let t=fe(e).nextSibling;fe(e).remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},w=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,i,t,s,a){this.type=1,this._$AH=l,this._$AN=void 0,this.element=e,this.name=i,this._$AM=s,this.options=a,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=l}_$AI(e,i=this,t,s){let a=this.strings,n=!1;if(a===void 0)e=A(this,e,i,0),n=!M(e)||e!==this._$AH&&e!==f,n&&(this._$AH=e);else{let h=e,o,c;for(e=a[0],o=0;o<a.length-1;o++)c=A(this,h[t+o],i,o),c===f&&(c=this._$AH[o]),n||=!M(c)||c!==this._$AH[o],c===l?e=l:e!==l&&(e+=(c??"")+a[o+1]),this._$AH[o]=c}n&&!s&&this.j(e)}j(e){e===l?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},j=class extends w{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===l?void 0:e}},F=class extends w{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==l)}},q=class extends w{constructor(e,i,t,s,a){super(e,i,t,s,a),this.type=5}_$AI(e,i=this){if((e=A(this,e,i,0)??l)===f)return;let t=this._$AH,s=e===l&&t!==l||e.capture!==t.capture||e.once!==t.once||e.passive!==t.passive,a=e!==l&&(t===l||s);s&&this.element.removeEventListener(this.name,this,t),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},V=class{constructor(e,i,t){this.element=e,this.type=6,this._$AN=void 0,this._$AM=i,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(e){A(this,e)}},Ee={M:X,P:b,A:ee,C:1,L:we,R:L,D:$e,V:A,I:k,H:w,N:F,U:q,B:j,F:V},je=Z.litHtmlPolyfillSupport;je?.(B,k),(Z.litHtmlVersions??=[]).push("3.3.3");var ke=(r,e,i)=>{let t=i?.renderBefore??e,s=t._$litPart$;if(s===void 0){let a=i?.renderBefore??null;t._$litPart$=s=new k(e.insertBefore(R(),a),a,void 0,i??{})}return s._$AI(r),s};var se=globalThis,_=class extends g{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ke(i,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return f}};_._$litElement$=!0,_.finalized=!0,se.litElementHydrateSupport?.({LitElement:_});var Fe=se.litElementPolyfillSupport;Fe?.({LitElement:_});(se.litElementVersions??=[]).push("4.2.2");var E={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Se=r=>(...e)=>({_$litDirective$:r,values:e}),W=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,i,t){this._$Ct=e,this._$AM=i,this._$Ci=t}_$AS(e,i){return this.update(e,i)}update(e,i){return this.render(...i)}};var{I:ct}=Ee;var Ce=r=>r.strings===void 0;var qe={},Pe=(r,e=qe)=>r._$AH=e;var Te=Se(class extends W{constructor(r){if(super(r),r.type!==E.PROPERTY&&r.type!==E.ATTRIBUTE&&r.type!==E.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!Ce(r))throw Error("`live` bindings can only contain a single expression")}render(r){return r}update(r,[e]){if(e===f||e===l)return e;let i=r.element,t=r.name;if(r.type===E.PROPERTY){if(e===i[t])return f}else if(r.type===E.BOOLEAN_ATTRIBUTE){if(!!e===i.hasAttribute(t))return f}else if(r.type===E.ATTRIBUTE&&i.getAttribute(t)===e+"")return f;return Pe(r),e}});var Re=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],N=r=>r.map(e=>({...e,days:[...e.days]})),U=(r,e=10,i=60)=>Array.isArray(r)&&r.length<=Math.min(10,e)&&r.every(t=>t&&typeof t=="object"&&Object.keys(t).sort().join(",")==="days,enabled,portions,time"&&Array.isArray(t.days)&&t.days.length===7&&new Set(t.days).size===7&&Re.every(s=>t.days.includes(s))&&typeof t.time=="string"&&/^([01]\d|2[0-3]):[0-5]\d$/.test(t.time)&&Number.isInteger(t.portions)&&t.portions>=1&&t.portions<=Math.min(60,i)&&typeof t.enabled=="boolean"),S=(r,e)=>r.length===e.length&&r.every((i,t)=>i.time===e[t].time&&i.portions===e[t].portions&&i.enabled===e[t].enabled&&i.days.length===e[t].days.length&&i.days.every(s=>e[t].days.includes(s))),oe=["accent_color","border_radius","font_family","header_font_size","meal_time_font_size","row_background","card_background","control_size"];function Me(r={}){let e={},i={accent_color:"color",border_radius:"border-radius",font_family:"font-family",header_font_size:"font-size",meal_time_font_size:"font-size",row_background:"background-color",card_background:"background-color",control_size:"width"};for(let t of oe){let s=r[t];if(!(s===void 0||s==="")){if(typeof s!="string"||s.length>160||/[;{}<>\\]|url\s*\(|expression\s*\(|!important|\/\*/i.test(s)||!CSS.supports(i[t],s))throw new Error(`Invalid appearance.${t}`);e[t]=s}}return e}var re=class extends _{constructor(){super(...arguments);this.draft=[];this.editing=null;this.view="list";this.busy=!1;this.feedBusy=!1;this.helperBusy=!1;this.message="";this.conflict=!1;this.acknowledged=!1;this.feedPortions=1;this.base=0;this.baseline=[];this.serviceCompleted=!1;this.attempt=0;this.failed=!1;this.toggling=null;this.operation="update_meal"}static{this.properties={config:{state:!0},draft:{state:!0},editing:{state:!0},view:{state:!0},busy:{state:!0},message:{state:!0},conflict:{state:!0},acknowledged:{state:!0},feedPortions:{state:!0},feedBusy:{state:!0},helperBusy:{state:!0}}}setConfig(i){if(!i.entity?.startsWith("sensor."))throw new Error("Select a schedule sensor");if(i.portions_entity&&!i.portions_entity.startsWith("input_number."))throw new Error("Select a portions helper");if(this.busy||this.feedBusy)throw new Error("Wait for completion before changing config");this.config={...i,appearance:Me(i.appearance)};for(let t of oe){this.style.removeProperty(`--feeder-${t.replaceAll("_","-")}`);let s=this.config.appearance?.[t];s&&this.style.setProperty(`--feeder-${t.replaceAll("_","-")}`,s)}this.reset()}set hass(i){this._hass=i;let t=this.attrs;this.busy?t.error&&!t.pending?this.failure(t.error):this.toggling!==null&&t.revision>this.base&&this.sent&&U(t.meals,t.max_meals,t.max_portions)&&!S(this.sent,t.meals)?this.failure("Schedule changed during update"):this.serviceCompleted&&this.writable&&t.snapshot_source==="received"&&t.revision>this.base&&Date.parse(t.last_received_at)>Date.parse(this.sentAt??"")&&this.sent&&S(this.sent,t.meals)&&(this.clearTimer(),this.busy=!1,this.failed=!1,this.sent=void 0,this.toggling=null,this.editing=null,this.load(),this.message="Saved"):this.editing!==null||this.failed?(t.revision!==this.base||!this.writable||!S(this.baseline,t.meals))&&(this.conflict=!0,this.view="list",this.message="Schedule changed. Reload to continue."):this.load(),this.requestUpdate()}get hass(){return this._hass}get attrs(){return this._hass?.states[this.config?.entity]?.attributes??{}}get writable(){let i=this._hass?.states[this.config?.entity],t=this.attrs;return!!i&&(!this._hass?.services||["update_meal","add_meal","delete_meal"].every(s=>!!this._hass?.services?.tuya_feeder?.[s]))&&!["unknown","unavailable"].includes(i.state)&&(t.supports_schedule_write===!0&&t.snapshot_source==="received"||t.supports_restored_schedule_write===!0&&t.snapshot_source==="restored"&&t.requires_restored_snapshot_acknowledgement===!0)&&t.supported_days_mode==="every_day"&&Number.isSafeInteger(t.revision)&&t.revision>0&&typeof t.last_received_at=="string"&&Number.isFinite(Date.parse(t.last_received_at))&&t.schedule_valid===!0&&t.pending===!1&&!t.error&&Number.isInteger(t.max_meals)&&t.max_meals>0&&Number.isInteger(t.max_portions)&&t.max_portions>0&&U(t.meals,t.max_meals,t.max_portions)}get scheduleActive(){let i=this._hass?.states[this.config?.entity],t=this.attrs;return!!i&&!["unknown","unavailable"].includes(i.state)&&t.schedule_valid===!0&&["received","restored"].includes(t.snapshot_source)&&U(t.meals,t.max_meals,t.max_portions)&&t.meals.some(s=>s.enabled===!0)}get locked(){return!this.writable||this.conflict||this.busy||this.feedBusy||this.attrs.feeding_pending===!0}load(){this.base=this.attrs.revision,this.baseline=U(this.attrs.meals,this.attrs.max_meals,this.attrs.max_portions)?N(this.attrs.meals):[],this.draft=N(this.baseline)}reset(){this.busy||this.feedBusy||(this.editing=null,this.view="list",this.conflict=!1,this.failed=!1,this.toggling=null,this.message="",this.acknowledged=!1,this.load())}async openEditor(i,t){this.locked||(this.load(),this.operation="update_meal",this.editing=i,this.view="edit",this.acknowledged=!1,this.message="",t!==void 0&&this.edit("enabled",t),await this.updateComplete,this.renderRoot.querySelector("[data-back]")?.focus())}async toggle(i,t){let s=t.target,a=s.checked;s.checked=this.busy&&this.toggling===i?this.sent?.[i].enabled??!1:this.baseline[i]?.enabled??!1,!(this.locked||this.failed||this.view!=="list")&&(this.load(),!(!this.baseline[i]||this.baseline[i].enabled===a)&&(this.operation="update_meal",this.editing=i,this.toggling=i,this.acknowledged=this.attrs.snapshot_source==="restored",this.edit("enabled",a),await this.save()))}add(){this.locked||this.baseline.length>=Math.min(10,this.attrs.max_meals)||(this.load(),this.editing=this.draft.length,this.operation="add_meal",this.view="edit",this.acknowledged=!1,this.message="",this.draft=[...this.draft,{days:[...Re],time:"23:59",portions:1,enabled:!1}])}edit(i,t){this.locked||this.editing===null||(this.draft=this.draft.map((s,a)=>a===this.editing?{...s,[i]:t}:s))}async cancel(){if(this.busy||this.feedBusy)return;if(this.view==="delete"){this.view="edit";return}let i=this.editing;this.reset(),await this.updateComplete,this.renderRoot.querySelector(`[data-meal="${i}"]`)?.focus()}get saveable(){return!this.locked&&this.editing!==null&&U(this.draft,this.attrs.max_meals,this.attrs.max_portions)&&!S(this.draft,this.baseline)&&(this.attrs.snapshot_source!=="restored"||this.acknowledged)}clearTimer(){this.timer&&clearTimeout(this.timer),this.timer=void 0}failure(i){if(console.error("Tuya feeder operation failed",i),this.attempt++,this.clearTimer(),this.busy=!1,this.failed=!0,this.toggling!==null){this.toggling=null,this.sent=void 0,this.editing=null,this.failed=!1,this.load(),this.message="Couldn\u2019t change meal. Check the schedule before trying again.",this.requestUpdate();return}this.message="Couldn\u2019t save. Try again.",this.requestUpdate()}retry(){this.busy||this.conflict||this.editing===null||this.attrs.revision!==this.base||!this.writable||!S(this.baseline,this.attrs.meals)||(this.failed=!1,this.view=this.operation==="delete_meal"?"delete":"edit",this.message="")}async save(i=!1){if(this.editing===null||this.locked||this.attrs.revision!==this.base||!S(this.baseline,this.attrs.meals)||(i?this.view!=="delete"||this.attrs.snapshot_source==="restored"&&!this.acknowledged:!this.saveable))return;i&&(this.operation="delete_meal");let t=this.editing;this.sent=N(i?this.baseline.filter((n,h)=>h!==t):this.draft);let s={entity_id:this.config.entity,expected_revision:this.base,...this.operation!=="add_meal"?{meal_index:t}:{},...i?{}:{meal:N([this.draft[t]])[0]},...this.attrs.snapshot_source==="restored"?{acknowledge_restored_snapshot:!0}:{}};this.sentAt=this.attrs.last_received_at;let a=++this.attempt;this.serviceCompleted=!1,this.busy=!0,this.failed=!1,this.view="list",this.message="Saving\u2026",this.clearTimer(),this.timer=setTimeout(()=>{this.busy&&this.attempt===a&&this.failure(new Error("Schedule confirmation timed out; no retry sent"))},2e4);try{let n=await this.hass.callService("tuya_feeder",this.operation,s);if(!this.busy||this.attempt!==a)return;n?.error||n?.response?.error||n?.confirmed===!1||n?.response?.confirmed===!1?this.failure(n?.error??n?.response?.error??"unconfirmed"):(this.serviceCompleted=!0,this.hass=this.hass)}catch(n){this.busy&&this.attempt===a&&this.failure(n)}}get helper(){return this.config.portions_entity?this._hass?.states[this.config.portions_entity]:void 0}get selectedPortions(){return this.config.portions_entity?Number(this.helper?.state):this.feedPortions}get feedBounds(){if(!this.config.portions_entity)return{min:1,max:60};let i=this.helper;if(!(!i||["unknown","unavailable",""].includes(i.state)||!Number.isInteger(Number(i.attributes.min))||!Number.isInteger(Number(i.attributes.max))))return{min:Math.max(1,Number(i.attributes.min)),max:Math.min(60,Number(i.attributes.max))}}get feedReady(){let i=this.selectedPortions,t=this.feedBounds;return this.attrs.supports_manual_feed===!0&&!this.attrs.feeding_pending&&!this.attrs.pending&&(!this.hass.services||!!this.hass.services.tuya_feeder?.feed)&&!!t&&Number.isInteger(i)&&i>=t.min&&i<=t.max&&!this.busy&&!this.feedBusy&&!this.helperBusy}async selectFeed(i){let t=this.feedBounds,s=this.selectedPortions;if(!(!t||this.helperBusy||this.feedBusy||this.busy||!Number.isInteger(s)||s<t.min||s>t.max||s+i<t.min||s+i>t.max)){if(!this.config.portions_entity){this.feedPortions=s+i;return}this.helperBusy=!0;try{await this.hass.callService("input_number",i>0?"increment":"decrement",{entity_id:this.config.portions_entity})}catch(a){console.error("Tuya feeder portions selection failed",a),this.message="Couldn\u2019t change portions. Try again."}finally{this.helperBusy=!1}}}confirmFeed(){this.feedReady&&(this.feedDose=this.selectedPortions,this.view="feed",this.message="")}async feed(){if(!(!this.feedReady||!Number.isInteger(this.feedDose)||this.feedDose<1||this.feedDose>60)){this.feedBusy=!0,this.view="list",this.message="Feeding\u2026";try{let i=await this.hass.callService("tuya_feeder","feed",{entity_id:this.config.entity,portions:this.feedDose});if(i?.error)throw new Error(String(i.error));this.message="Feed requested"}catch(i){console.error("Tuya feeder manual feed failed",i),this.message="Couldn\u2019t feed. Try again."}finally{this.feedBusy=!1,this.feedDose=void 0}}}static getConfigElement(){return document.createElement("tuya-feeder-card-editor")}static getStubConfig(){return{entity:"",title:"Feeder",icon:"mdi:food-drumstick"}}getCardSize(){return 2+this.baseline.length}getGridOptions(){return{columns:12,min_columns:6}}acknowledgement(){return this.attrs.snapshot_source==="restored"?p`<label class="field"
          ><span>Use saved plan?</span
          ><input
            type="checkbox"
            aria-label="Use saved plan?"
            .checked=${this.acknowledged}
            ?disabled=${this.locked}
            @change=${i=>this.acknowledged=i.target.checked}
        /></label>`:l}render(){if(!this.config)return l;let i=this.editing,t=i===null?void 0:this.draft[i];return p`<ha-card
      part="card"
      data-active=${String(this.scheduleActive)}
      @keydown=${s=>{s.key==="Escape"&&this.view!=="list"&&(s.preventDefault(),this.cancel())}}
    >
      ${this.view==="list"?p`<header
                part=${this.config.manual_feed?"header manual-feed row":"header"}
                class=${this.config.manual_feed?"manual":""}
              >
                <ha-icon
                  part="header-icon"
                  .icon=${this.config.icon??this.config.feed_icon??"mdi:food-drumstick"}
                ></ha-icon>
                <h2 part="title">
                  ${this.config.title??this.config.feed_title??"Feeder"}
                </h2>
                ${this.config.manual_feed?p`<button part="control" aria-label="Decrease feeding portions" ?disabled=${!this.feedBounds||!Number.isInteger(this.selectedPortions)||this.selectedPortions<=this.feedBounds.min||this.helperBusy||this.feedBusy||this.busy} @click=${()=>this.selectFeed(-1)}>−</button><output aria-label="Feeding portions">${Number.isInteger(this.selectedPortions)&&this.feedBounds&&this.selectedPortions>=this.feedBounds.min&&this.selectedPortions<=this.feedBounds.max?this.selectedPortions:"\u2014"}</output><button part="control" aria-label="Increase feeding portions" ?disabled=${!this.feedBounds||!Number.isInteger(this.selectedPortions)||this.selectedPortions>=this.feedBounds.max||this.helperBusy||this.feedBusy||this.busy} @click=${()=>this.selectFeed(1)}>+</button><button class="accent feed" ?disabled=${!this.feedReady} @click=${this.confirmFeed}>Feed</button>`:l}
              </header>
              <section
                aria-label="Meal schedule"
                ?inert=${this.busy||this.feedBusy}
              >
                ${this.writable||this.busy||this.failed||this.conflict?this.baseline.map((s,a)=>p`<div class="meal" part="meal row">
                            <button
                              part="meal-button"
                              class="open"
                              data-meal=${a}
                              aria-label=${`Edit meal ${a+1}`}
                              ?disabled=${this.locked||this.failed}
                              @click=${()=>this.openEditor(a)}
                            >
                              <span class="time" part="meal-time"
                                >${s.time}</span
                              ><span class="detail"
                                >Every day ·
                                <span aria-label=${`Portions ${a+1}`}
                                  >${s.portions}</span
                                >
                                portion${s.portions===1?"":"s"}</span
                              ></button
                            ><input
                              part="switch control"
                              class="switch"
                              type="checkbox"
                              role="switch"
                              aria-label=${`Enabled ${a+1}`}
                              .checked=${Te(this.busy&&this.toggling===a?this.sent?.[a].enabled??s.enabled:s.enabled)}
                              aria-busy=${String(this.busy&&this.toggling===a)}
                              ?disabled=${this.locked||this.failed}
                              @change=${n=>this.toggle(a,n)}
                            />
                          </div>`):p`<div class="unavailable">Schedule unavailable</div>`}
                ${this.writable||this.busy||this.failed||this.conflict?p`<button part="add control" class="add" aria-label="Add meal" title="Add meal" ?disabled=${this.locked||this.failed||this.baseline.length>=Math.min(10,this.attrs.max_meals)} @click=${this.add}><ha-icon icon="mdi:plus"></ha-icon></button>`:l}
                ${!this.writable&&!this.busy&&!this.failed&&!this.conflict?p`<button @click=${this.reset}>Retry</button>`:l}
              </section>`:this.view==="feed"?p`<header part="header">
                  <h2 part="title">
                    Feed ${this.feedDose}
                    portion${this.feedDose===1?"":"s"}?
                  </h2>
                </header>
                <div class="actions">
                  <button @click=${this.cancel}>Cancel</button
                  ><button
                    class="accent"
                    ?disabled=${!this.feedReady}
                    @click=${this.feed}
                  >
                    Feed
                  </button>
                </div>`:this.view==="delete"?p`<header part="header">
                    <h2 part="title">Delete meal?</h2>
                  </header>
                  <p>
                    ${t?.time} · ${t?.portions}
                    portion${t?.portions===1?"":"s"}
                  </p>
                  ${this.acknowledgement()}
                  <div class="actions">
                    <button @click=${this.cancel}>Cancel</button
                    ><button
                      class="danger"
                      ?disabled=${this.locked||this.attrs.snapshot_source==="restored"&&!this.acknowledged}
                      @click=${()=>this.save(!0)}
                    >
                      Delete
                    </button>
                  </div>`:t&&i!==null?p` <header part="header" class="edit-header">
                      <button data-back aria-label="Back" @click=${this.cancel}>
                        <ha-icon icon="mdi:chevron-left"></ha-icon
                        ><span>Back</span>
                      </button>
                      <h2 part="title">
                        ${this.operation==="add_meal"?"Add meal":"Edit meal"}
                      </h2>
                      <button
                        part="save control"
                        class="accent"
                        data-save
                        ?disabled=${!this.saveable}
                        @click=${()=>this.save()}
                      >
                        Save
                      </button>
                    </header>
                    <section aria-label="Edit meal">
                      <label class="field"
                        ><span>Time</span
                        ><input
                          type="time"
                          aria-label=${`Time ${i+1}`}
                          .value=${t.time}
                          ?disabled=${this.locked}
                          @input=${s=>this.edit("time",s.target.value)}
                      /></label>
                      <div class="field">
                        <span>Portions</span>
                        <div part="stepper" class="stepper">
                          <button
                            part="control"
                            aria-label=${`Decrease portions ${i+1}`}
                            ?disabled=${this.locked||t.portions<=1}
                            @click=${()=>this.edit("portions",t.portions-1)}
                          >
                            −</button
                          ><output aria-label=${`Portions ${i+1}`}
                            >${t.portions}</output
                          ><button
                            part="control"
                            aria-label=${`Increase portions ${i+1}`}
                            ?disabled=${this.locked||t.portions>=Math.min(60,this.attrs.max_portions)}
                            @click=${()=>this.edit("portions",t.portions+1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <label class="field"
                        ><span>Enabled</span
                        ><input
                          part="switch control"
                          class="switch"
                          type="checkbox"
                          role="switch"
                          aria-label="Meal enabled"
                          .checked=${t.enabled}
                          ?disabled=${this.locked}
                          @change=${s=>this.edit("enabled",s.target.checked)}
                      /></label>
                      <div class="field">
                        <span>Repeat</span><span class="detail">Every day</span>
                      </div>
                      ${this.acknowledgement()}${this.operation!=="add_meal"?p`<button class="danger delete" @click=${()=>this.view="delete"}>Delete meal</button>`:l}
                    </section>`:l}
      ${this.message?p`<div part="status" class="status" role="status">${this.message}</div>`:l}
      ${this.conflict?p`<button @click=${this.reset}>Reload</button>`:this.failed?p`<div class="actions"><button @click=${this.reset}>Cancel</button><button ?disabled=${!this.writable} @click=${this.retry}>Try again</button></div>`:l}
    </ha-card>`}static{this.styles=Y`
    :host {
      display: block;
      container-type: inline-size;
      color: var(--primary-text-color, #222);
      font-family: var(
        --feeder-font-family,
        var(--ha-font-family-body, system-ui)
      );
      font-size: 15px;
      --accent: var(--feeder-accent-color, var(--primary-color, #03a9f4));
      --control: max(44px, var(--feeder-control-size, 44px));
    }
    * {
      box-sizing: border-box;
    }
    ha-card {
      display: block;
      padding: 10px;
      background: var(
        --feeder-card-background,
        var(--ha-card-background, var(--card-background-color, #fff))
      );
      border-radius: var(
        --feeder-border-radius,
        var(--ha-card-border-radius, 20px)
      );
      border: var(--ha-card-border-width, 1px) solid
        var(--ha-card-border-color, var(--divider-color, #ddd));
      box-shadow: var(--ha-card-box-shadow, none);
    }
    ha-card[data-active="true"] {
      background: var(--feeder-active-card-background, white);
      color: var(--feeder-active-text-color, black);
      --primary-text-color: var(--feeder-active-text-color, black);
      --secondary-text-color: var(--feeder-active-muted-color, gray);
      --feeder-header-icon-background: var(
        --feeder-active-icon-background,
        var(--accent-color, var(--primary-color))
      );
      --feeder-header-icon-color: var(--feeder-active-icon-color, white);
    }
    section > .add {
      display: block;
      margin: 8px 0 0 auto;
    }
    header {
      display: flex;
      align-items: center;
      gap: 14px;
      min-height: 68px;
      margin-bottom: 12px;
    }
    h2 {
      margin: 0;
      font-size: var(--feeder-header-font-size, 18px);
      font-weight: 500;
      color: var(--primary-text-color, #222);
      line-height: 1.3;
    }
    ha-icon {
      --mdc-icon-size: 20px;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      color: var(--secondary-text-color, #777);
    }
    header > ha-icon {
      --mdc-icon-size: 25px;
      width: 45px;
      height: 45px;
      padding: 10px;
      border-radius: 50%;
      background: var(--feeder-header-icon-background, transparent);
      color: var(--feeder-header-icon-color, #9da0a2);
    }
    header:not(.edit-header):has(> ha-icon) {
      display: grid;
      grid-template-columns: 64px minmax(0, 1fr);
      gap: 0;
      margin-left: -10px;
      margin-right: -10px;
    }
    header > ha-icon {
      margin-left: 11.5px;
    }
    .meal {
      display: flex;
      align-items: center;
      gap: 8px;
      border-radius: var(
        --feeder-border-radius,
        var(--ha-card-border-radius, 20px)
      );
      background: var(
        --feeder-row-background,
        color-mix(in srgb, var(--primary-text-color, #222) 4.5%, transparent)
      );
      margin: 8px 0;
      overflow: hidden;
    }
    .open {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      min-width: 0;
      text-align: left;
      padding: 16px 12px;
      border-radius: 0;
    }
    .time {
      display: block;
      flex-shrink: 0;
      font-size: var(--feeder-meal-time-font-size, 32px);
      font-weight: 500;
      letter-spacing: -1.5px;
      line-height: 1.15;
      font-variant-numeric: tabular-nums;
    }
    .detail,
    .status,
    .unavailable {
      color: var(--secondary-text-color, #777);
    }
    .detail {
      font-size: 13px;
    }
    .open .detail {
      display: block;
      margin: 0;
      line-height: 1.3;
      text-wrap: pretty;
    }
    button {
      min-height: var(--control);
      min-width: 44px;
      border: 0;
      border-radius: 12px;
      background: transparent;
      color: inherit;
      font: inherit;
      font-weight: 500;
      padding: 10px 14px;
      cursor: pointer;
      touch-action: manipulation;
    }
    button:disabled,
    input:disabled {
      opacity: 0.28;
      cursor: default;
    }
    button:focus-visible,
    input:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }
    .accent {
      background: var(--accent);
      color: var(--text-primary-color, #fff);
    }
    .add {
      width: var(--control);
      height: var(--control);
      padding: 0;
      margin-left: auto;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent);
    }
    .add ha-icon {
      color: inherit;
    }
    .status {
      font-size: 13px;
      line-height: 1.5;
      margin-top: 12px;
    }
    .switch {
      appearance: none;
      width: 49px;
      height: var(--control);
      flex: 0 0 49px;
      margin: 0 14px 0 0;
      background: linear-gradient(
          var(--disabled-text-color, #aaa),
          var(--disabled-text-color, #aaa)
        )
        center/49px 30px no-repeat;
      position: relative;
      cursor: pointer;
      border: 0;
      border-radius: 22px;
    }
    .switch:after {
      content: "";
      position: absolute;
      left: 3px;
      top: calc(50% - 12px);
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #fff;
    }
    .switch:checked {
      background: linear-gradient(var(--accent), var(--accent)) center/49px 30px
        no-repeat;
    }
    .switch:checked:after {
      left: 22px;
    }
    .field {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 0;
      border-bottom: 1px solid var(--divider-color, #ddd);
      gap: 12px;
    }
    .field .switch {
      margin: 0;
    }
    input[type="time"] {
      color: inherit;
      background: transparent;
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 12px;
      padding: 8px;
      font: inherit;
      min-height: var(--control);
      max-width: 155px;
    }
    input[type="checkbox"]:not(.switch) {
      width: 44px;
      height: 44px;
      margin: 0;
      accent-color: var(--accent);
    }
    .stepper {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .stepper button,
    .manual > button:not(.feed) {
      width: var(--control);
      height: var(--control);
      padding: 0;
      font-size: 22px;
      background: var(
        --feeder-row-background,
        color-mix(in srgb, var(--primary-text-color, #222) 4.5%, transparent)
      );
    }
    output {
      min-width: 28px;
      text-align: center;
      font-size: 24px;
      font-weight: 500;
      font-variant-numeric: tabular-nums;
    }
    .danger {
      color: var(--error-color, #db4437);
    }
    .delete {
      width: 100%;
      text-align: left;
      margin-top: 12px;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 16px;
    }
    .edit-header {
      justify-content: space-between;
      gap: 6px;
    }
    .edit-header [data-back] {
      display: flex;
      align-items: center;
      padding-left: 0;
      gap: 2px;
    }
    .edit-header [data-back] ha-icon {
      color: inherit;
    }
    header.manual:not(.edit-header):has(> ha-icon) {
      display: grid;
      grid-template-columns:
        64px minmax(33px, 1fr) var(--control) 32px var(--control)
        minmax(64px, 1fr);
      column-gap: 0;
      align-items: center;
      min-height: 68px;
      margin: 0 -10px 12px;
      padding: 0 6px 0 0;
    }
    .manual h2 {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .manual output {
      font-size: 32px;
      letter-spacing: -2px;
    }
    .manual .feed {
      margin-left: 8px;
      padding: 8px;
    }
    .unavailable {
      padding: 16px 0;
    }
    @container (max-width: 360px) {
      .meal {
        gap: 4px;
      }
      .open {
        gap: 8px;
        padding: 16px 8px;
      }
      .open .time {
        font-size: var(--feeder-meal-time-font-size, 26px);
      }
      .open .detail {
        font-size: 12px;
      }
      .meal .switch {
        margin-right: 8px;
      }
    }
    [inert] {
      pointer-events: none;
    }
    p {
      color: var(--secondary-text-color, #777);
    }
  `}},ae=class extends _{static{this.properties={hass:{attribute:!1},config:{state:!0}}}setConfig(e){this.config={...e}}render(){let e={entity:"Schedule sensor",title:"Title",icon:"Icon",manual_feed:"Show manual feeding",feed_title:"Feeding title",feed_icon:"Feeding icon",portions_entity:"Portions helper (optional)",appearance:"Appearance",accent_color:"Accent color",border_radius:"Corner radius",font_family:"Font family",header_font_size:"Header size",meal_time_font_size:"Meal time size",row_background:"Row color",card_background:"Card color",control_size:"Control size (minimum 44px)"};return p`<ha-form
      .hass=${this.hass}
      .data=${this.config}
      .schema=${[{name:"entity",required:!0,selector:{entity:{domain:"sensor",integration:"tuya_feeder"}}},{name:"title",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"manual_feed",selector:{boolean:{}}},{name:"feed_title",selector:{text:{}}},{name:"feed_icon",selector:{icon:{}}},{name:"portions_entity",selector:{entity:{domain:"input_number"}}},{name:"appearance",type:"expandable",schema:oe.map(i=>({name:i,selector:{text:{}}}))}]}
      .computeLabel=${i=>e[i.name]??i.name}
      @value-changed=${i=>{let t={...this.config,...i.detail.value};Me(t.appearance),this.config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this.config},bubbles:!0,composed:!0}))}}
    ></ha-form>`}};customElements.define("tuya-feeder-card",re);customElements.define("tuya-feeder-card-editor",ae);var ne=window;ne.customCards=ne.customCards||[];ne.customCards.push({type:"tuya-feeder-card",name:"Tuya Feeder",description:"Daily meals with in-card editing and optional manual feeding.",documentationURL:"https://github.com/myevit/tuya-feeder-card"});export{re as TuyaFeederCard};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
lit-html/directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive-helpers.js:
lit-html/directives/live.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
