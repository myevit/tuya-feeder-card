var U=globalThis,z=U.ShadowRoot&&(U.ShadyCSS===void 0||U.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,I=Symbol(),re=new WeakMap,k=class{constructor(e,s,t){if(this._$cssResult$=!0,t!==I)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=s}get styleSheet(){let e=this.o,s=this.t;if(z&&e===void 0){let t=s!==void 0&&s.length===1;t&&(e=re.get(s)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&re.set(s,e))}return e}toString(){return this.cssText}},ae=r=>new k(typeof r=="string"?r:r+"",void 0,I),L=(r,...e)=>{let s=r.length===1?r[0]:e.reduce((t,i,a)=>t+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[a+1],r[0]);return new k(s,r,I)},ne=(r,e)=>{if(z)r.adoptedStyleSheets=e.map(s=>s instanceof CSSStyleSheet?s:s.styleSheet);else for(let s of e){let t=document.createElement("style"),i=U.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=s.cssText,r.appendChild(t)}},j=z?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let s="";for(let t of e.cssRules)s+=t.cssText;return ae(s)})(r):r;var{is:Ae,defineProperty:ke,getOwnPropertyDescriptor:Ee,getOwnPropertyNames:Se,getOwnPropertySymbols:Ce,getPrototypeOf:Pe}=Object,H=globalThis,oe=H.trustedTypes,Me=oe?oe.emptyScript:"",Te=H.reactiveElementPolyfillSupport,E=(r,e)=>r,F={toAttribute(r,e){switch(e){case Boolean:r=r?Me:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let s=r;switch(e){case Boolean:s=r!==null;break;case Number:s=r===null?null:Number(r);break;case Object:case Array:try{s=JSON.parse(r)}catch{s=null}}return s}},de=(r,e)=>!Ae(r,e),le={attribute:!0,type:String,converter:F,reflect:!1,useDefault:!1,hasChanged:de};Symbol.metadata??=Symbol("metadata"),H.litPropertyMetadata??=new WeakMap;var m=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,s=le){if(s.state&&(s.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((s=Object.create(s)).wrapped=!0),this.elementProperties.set(e,s),!s.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(e,t,s);i!==void 0&&ke(this.prototype,e,i)}}static getPropertyDescriptor(e,s,t){let{get:i,set:a}=Ee(this.prototype,e)??{get(){return this[s]},set(n){this[s]=n}};return{get:i,set(n){let h=i?.call(this);a?.call(this,n),this.requestUpdate(e,h,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??le}static _$Ei(){if(this.hasOwnProperty(E("elementProperties")))return;let e=Pe(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(E("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(E("properties"))){let s=this.properties,t=[...Se(s),...Ce(s)];for(let i of t)this.createProperty(i,s[i])}let e=this[Symbol.metadata];if(e!==null){let s=litPropertyMetadata.get(e);if(s!==void 0)for(let[t,i]of s)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[s,t]of this.elementProperties){let i=this._$Eu(s,t);i!==void 0&&this._$Eh.set(i,s)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let s=[];if(Array.isArray(e)){let t=new Set(e.flat(1/0).reverse());for(let i of t)s.unshift(j(i))}else e!==void 0&&s.push(j(e));return s}static _$Eu(e,s){let t=s.attribute;return t===!1?void 0:typeof t=="string"?t:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,s=this.constructor.elementProperties;for(let t of s.keys())this.hasOwnProperty(t)&&(e.set(t,this[t]),delete this[t]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ne(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,s,t){this._$AK(e,t)}_$ET(e,s){let t=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,t);if(i!==void 0&&t.reflect===!0){let a=(t.converter?.toAttribute!==void 0?t.converter:F).toAttribute(s,t.type);this._$Em=e,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(e,s){let t=this.constructor,i=t._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let a=t.getPropertyOptions(i),n=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:F;this._$Em=i;let h=n.fromAttribute(s,a.type);this[i]=h??this._$Ej?.get(i)??h,this._$Em=null}}requestUpdate(e,s,t,i=!1,a){if(e!==void 0){let n=this.constructor;if(i===!1&&(a=this[e]),t??=n.getPropertyOptions(e),!((t.hasChanged??de)(a,s)||t.useDefault&&t.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,t))))return;this.C(e,s,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,s,{useDefault:t,reflect:i,wrapped:a},n){t&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??s??this[e]),a!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||t||(s=void 0),this._$AL.set(e,s)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(s){Promise.reject(s)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,a]of this._$Ep)this[i]=a;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,a]of t){let{wrapped:n}=a,h=this[i];n!==!0||this._$AL.has(i)||h===void 0||this.C(i,void 0,a,h)}}let e=!1,s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(s)}willUpdate(e){}_$AE(e){this._$EO?.forEach(s=>s.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(s=>this._$ET(s,this[s])),this._$EM()}updated(e){}firstUpdated(e){}};m.elementStyles=[],m.shadowRootOptions={mode:"open"},m[E("elementProperties")]=new Map,m[E("finalized")]=new Map,Te?.({ReactiveElement:m}),(H.reactiveElementVersions??=[]).push("2.1.2");var Y=globalThis,he=r=>r,O=Y.trustedTypes,ce=O?O.createPolicy("lit-html",{createHTML:r=>r}):void 0,be="$lit$",_=`lit$${Math.random().toFixed(9).slice(2)}$`,_e="?"+_,Re=`<${_e}>`,$=document,C=()=>$.createComment(""),P=r=>r===null||typeof r!="object"&&typeof r!="function",Z=Array.isArray,Ne=r=>Z(r)||typeof r?.[Symbol.iterator]=="function",q=`[ 	
\f\r]`,S=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,pe=/-->/g,ue=/>/g,y=RegExp(`>|${q}(?:([^\\s"'>=/]+)(${q}*=${q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),fe=/'/g,me=/"/g,ye=/^(?:script|style|textarea|title)$/i,Q=r=>(e,...s)=>({_$litType$:r,strings:e,values:s}),p=Q(1),Le=Q(2),je=Q(3),x=Symbol.for("lit-noChange"),l=Symbol.for("lit-nothing"),ge=new WeakMap,v=$.createTreeWalker($,129);function ve(r,e){if(!Z(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ce!==void 0?ce.createHTML(e):e}var Be=(r,e)=>{let s=r.length-1,t=[],i,a=e===2?"<svg>":e===3?"<math>":"",n=S;for(let h=0;h<s;h++){let o=r[h],c,u,d=-1,f=0;for(;f<o.length&&(n.lastIndex=f,u=n.exec(o),u!==null);)f=n.lastIndex,n===S?u[1]==="!--"?n=pe:u[1]!==void 0?n=ue:u[2]!==void 0?(ye.test(u[2])&&(i=RegExp("</"+u[2],"g")),n=y):u[3]!==void 0&&(n=y):n===y?u[0]===">"?(n=i??S,d=-1):u[1]===void 0?d=-2:(d=n.lastIndex-u[2].length,c=u[1],n=u[3]===void 0?y:u[3]==='"'?me:fe):n===me||n===fe?n=y:n===pe||n===ue?n=S:(n=y,i=void 0);let b=n===y&&r[h+1].startsWith("/>")?" ":"";a+=n===S?o+Re:d>=0?(t.push(c),o.slice(0,d)+be+o.slice(d)+_+b):o+_+(d===-2?h:b)}return[ve(r,a+(r[s]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),t]},M=class r{constructor({strings:e,_$litType$:s},t){let i;this.parts=[];let a=0,n=0,h=e.length-1,o=this.parts,[c,u]=Be(e,s);if(this.el=r.createElement(c,t),v.currentNode=this.el.content,s===2||s===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=v.nextNode())!==null&&o.length<h;){if(i.nodeType===1){if(i.hasAttributes())for(let d of i.getAttributeNames())if(d.endsWith(be)){let f=u[n++],b=i.getAttribute(d).split(_),B=/([.?@])?(.*)/.exec(f);o.push({type:1,index:a,name:B[2],strings:b,ctor:B[1]==="."?V:B[1]==="?"?K:B[1]==="@"?J:A}),i.removeAttribute(d)}else d.startsWith(_)&&(o.push({type:6,index:a}),i.removeAttribute(d));if(ye.test(i.tagName)){let d=i.textContent.split(_),f=d.length-1;if(f>0){i.textContent=O?O.emptyScript:"";for(let b=0;b<f;b++)i.append(d[b],C()),v.nextNode(),o.push({type:2,index:++a});i.append(d[f],C())}}}else if(i.nodeType===8)if(i.data===_e)o.push({type:2,index:a});else{let d=-1;for(;(d=i.data.indexOf(_,d+1))!==-1;)o.push({type:7,index:a}),d+=_.length-1}a++}}static createElement(e,s){let t=$.createElement("template");return t.innerHTML=e,t}};function w(r,e,s=r,t){if(e===x)return e;let i=t!==void 0?s._$Co?.[t]:s._$Cl,a=P(e)?void 0:e._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(r),i._$AT(r,s,t)),t!==void 0?(s._$Co??=[])[t]=i:s._$Cl=i),i!==void 0&&(e=w(r,i._$AS(r,e.values),i,t)),e}var W=class{constructor(e,s){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=s}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:s},parts:t}=this._$AD,i=(e?.creationScope??$).importNode(s,!0);v.currentNode=i;let a=v.nextNode(),n=0,h=0,o=t[0];for(;o!==void 0;){if(n===o.index){let c;o.type===2?c=new T(a,a.nextSibling,this,e):o.type===1?c=new o.ctor(a,o.name,o.strings,this,e):o.type===6&&(c=new G(a,this,e)),this._$AV.push(c),o=t[++h]}n!==o?.index&&(a=v.nextNode(),n++)}return v.currentNode=$,i}p(e){let s=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(e,t,s),s+=t.strings.length-2):t._$AI(e[s])),s++}},T=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,s,t,i){this.type=2,this._$AH=l,this._$AN=void 0,this._$AA=e,this._$AB=s,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,s=this._$AM;return s!==void 0&&e?.nodeType===11&&(e=s.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,s=this){e=w(this,e,s),P(e)?e===l||e==null||e===""?(this._$AH!==l&&this._$AR(),this._$AH=l):e!==this._$AH&&e!==x&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ne(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==l&&P(this._$AH)?this._$AA.nextSibling.data=e:this.T($.createTextNode(e)),this._$AH=e}$(e){let{values:s,_$litType$:t}=e,i=typeof t=="number"?this._$AC(e):(t.el===void 0&&(t.el=M.createElement(ve(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(s);else{let a=new W(i,this),n=a.u(this.options);a.p(s),this.T(n),this._$AH=a}}_$AC(e){let s=ge.get(e.strings);return s===void 0&&ge.set(e.strings,s=new M(e)),s}k(e){Z(this._$AH)||(this._$AH=[],this._$AR());let s=this._$AH,t,i=0;for(let a of e)i===s.length?s.push(t=new r(this.O(C()),this.O(C()),this,this.options)):t=s[i],t._$AI(a),i++;i<s.length&&(this._$AR(t&&t._$AB.nextSibling,i),s.length=i)}_$AR(e=this._$AA.nextSibling,s){for(this._$AP?.(!1,!0,s);e!==this._$AB;){let t=he(e).nextSibling;he(e).remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},A=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,s,t,i,a){this.type=1,this._$AH=l,this._$AN=void 0,this.element=e,this.name=s,this._$AM=i,this.options=a,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=l}_$AI(e,s=this,t,i){let a=this.strings,n=!1;if(a===void 0)e=w(this,e,s,0),n=!P(e)||e!==this._$AH&&e!==x,n&&(this._$AH=e);else{let h=e,o,c;for(e=a[0],o=0;o<a.length-1;o++)c=w(this,h[t+o],s,o),c===x&&(c=this._$AH[o]),n||=!P(c)||c!==this._$AH[o],c===l?e=l:e!==l&&(e+=(c??"")+a[o+1]),this._$AH[o]=c}n&&!i&&this.j(e)}j(e){e===l?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},V=class extends A{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===l?void 0:e}},K=class extends A{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==l)}},J=class extends A{constructor(e,s,t,i,a){super(e,s,t,i,a),this.type=5}_$AI(e,s=this){if((e=w(this,e,s,0)??l)===x)return;let t=this._$AH,i=e===l&&t!==l||e.capture!==t.capture||e.once!==t.once||e.passive!==t.passive,a=e!==l&&(t===l||i);i&&this.element.removeEventListener(this.name,this,t),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},G=class{constructor(e,s,t){this.element=e,this.type=6,this._$AN=void 0,this._$AM=s,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(e){w(this,e)}};var Ue=Y.litHtmlPolyfillSupport;Ue?.(M,T),(Y.litHtmlVersions??=[]).push("3.3.3");var $e=(r,e,s)=>{let t=s?.renderBefore??e,i=t._$litPart$;if(i===void 0){let a=s?.renderBefore??null;t._$litPart$=i=new T(e.insertBefore(C(),a),a,void 0,s??{})}return i._$AI(r),i};var X=globalThis,g=class extends m{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let s=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=$e(s,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return x}};g._$litElement$=!0,g.finalized=!0,X.litElementHydrateSupport?.({LitElement:g});var ze=X.litElementPolyfillSupport;ze?.({LitElement:g});(X.litElementVersions??=[]).push("4.2.2");var xe=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],R=r=>r.map(e=>({...e,days:[...e.days]})),D=(r,e=10,s=60)=>Array.isArray(r)&&r.length<=Math.min(10,e)&&r.every(t=>t&&typeof t=="object"&&Object.keys(t).sort().join(",")==="days,enabled,portions,time"&&Array.isArray(t.days)&&t.days.length===7&&new Set(t.days).size===7&&xe.every(i=>t.days.includes(i))&&typeof t.time=="string"&&/^([01]\d|2[0-3]):[0-5]\d$/.test(t.time)&&Number.isInteger(t.portions)&&t.portions>=1&&t.portions<=Math.min(60,s)&&typeof t.enabled=="boolean"),N=(r,e)=>r.length===e.length&&r.every((s,t)=>s.time===e[t].time&&s.portions===e[t].portions&&s.enabled===e[t].enabled&&s.days.length===e[t].days.length&&s.days.every(i=>e[t].days.includes(i))),ie=["accent_color","border_radius","font_family","header_font_size","meal_time_font_size","row_background","card_background","control_size"];function we(r={}){let e={},s={accent_color:"color",border_radius:"border-radius",font_family:"font-family",header_font_size:"font-size",meal_time_font_size:"font-size",row_background:"background-color",card_background:"background-color",control_size:"width"};for(let t of ie){let i=r[t];if(!(i===void 0||i==="")){if(typeof i!="string"||i.length>160||/[;{}<>\\]|url\s*\(|expression\s*\(|!important|\/\*/i.test(i)||!CSS.supports(s[t],i))throw new Error(`Invalid appearance.${t}`);e[t]=i}}return e}var ee=class extends g{constructor(){super(...arguments);this.draft=[];this.editing=null;this.view="list";this.busy=!1;this.feedBusy=!1;this.helperBusy=!1;this.message="";this.conflict=!1;this.acknowledged=!1;this.feedPortions=1;this.base=0;this.baseline=[];this.serviceCompleted=!1;this.failed=!1;this.operation="update_meal"}static{this.properties={config:{state:!0},draft:{state:!0},editing:{state:!0},view:{state:!0},busy:{state:!0},message:{state:!0},conflict:{state:!0},acknowledged:{state:!0},feedPortions:{state:!0},feedBusy:{state:!0},helperBusy:{state:!0}}}setConfig(s){if(!s.entity?.startsWith("sensor."))throw new Error("Select a schedule sensor");if(s.portions_entity&&!s.portions_entity.startsWith("input_number."))throw new Error("Select a portions helper");if(this.busy||this.feedBusy)throw new Error("Wait for completion before changing config");this.config={...s,appearance:we(s.appearance)};for(let t of ie){this.style.removeProperty(`--feeder-${t.replaceAll("_","-")}`);let i=this.config.appearance?.[t];i&&this.style.setProperty(`--feeder-${t.replaceAll("_","-")}`,i)}this.reset()}set hass(s){this._hass=s;let t=this.attrs;this.busy?t.error&&!t.pending?this.failure(t.error):this.serviceCompleted&&this.writable&&t.snapshot_source==="received"&&t.revision>this.base&&Date.parse(t.last_received_at)>Date.parse(this.sentAt??"")&&this.sent&&N(this.sent,t.meals)&&(this.clearTimer(),this.busy=!1,this.failed=!1,this.sent=void 0,this.editing=null,this.load(),this.message="Saved"):this.editing!==null||this.failed?(t.revision!==this.base||!this.writable||!N(this.baseline,t.meals))&&(this.conflict=!0,this.view="list",this.message="Schedule changed. Reload to continue."):this.load(),this.requestUpdate()}get hass(){return this._hass}get attrs(){return this._hass?.states[this.config?.entity]?.attributes??{}}get writable(){let s=this._hass?.states[this.config?.entity],t=this.attrs;return!!s&&(!this._hass?.services||["update_meal","add_meal","delete_meal"].every(i=>!!this._hass?.services?.tuya_feeder?.[i]))&&!["unknown","unavailable"].includes(s.state)&&(t.supports_schedule_write===!0&&t.snapshot_source==="received"||t.supports_restored_schedule_write===!0&&t.snapshot_source==="restored"&&t.requires_restored_snapshot_acknowledgement===!0)&&t.supported_days_mode==="every_day"&&Number.isSafeInteger(t.revision)&&t.revision>0&&typeof t.last_received_at=="string"&&Number.isFinite(Date.parse(t.last_received_at))&&t.schedule_valid===!0&&t.pending===!1&&!t.error&&Number.isInteger(t.max_meals)&&t.max_meals>0&&Number.isInteger(t.max_portions)&&t.max_portions>0&&D(t.meals,t.max_meals,t.max_portions)}get scheduleActive(){let s=this._hass?.states[this.config?.entity],t=this.attrs;return!!s&&!["unknown","unavailable"].includes(s.state)&&t.schedule_valid===!0&&["received","restored"].includes(t.snapshot_source)&&D(t.meals,t.max_meals,t.max_portions)&&t.meals.some(i=>i.enabled===!0)}get locked(){return!this.writable||this.conflict||this.busy||this.feedBusy}load(){this.base=this.attrs.revision,this.baseline=D(this.attrs.meals,this.attrs.max_meals,this.attrs.max_portions)?R(this.attrs.meals):[],this.draft=R(this.baseline)}reset(){this.busy||this.feedBusy||(this.editing=null,this.view="list",this.conflict=!1,this.failed=!1,this.message="",this.acknowledged=!1,this.load())}async openEditor(s,t){this.locked||(this.load(),this.operation="update_meal",this.editing=s,this.view="edit",this.acknowledged=!1,this.message="",t!==void 0&&this.edit("enabled",t),await this.updateComplete,this.renderRoot.querySelector("[data-back]")?.focus())}add(){this.locked||this.baseline.length>=Math.min(10,this.attrs.max_meals)||(this.load(),this.editing=this.draft.length,this.operation="add_meal",this.view="edit",this.acknowledged=!1,this.message="",this.draft=[...this.draft,{days:[...xe],time:"23:59",portions:1,enabled:!1}])}edit(s,t){this.locked||this.editing===null||(this.draft=this.draft.map((i,a)=>a===this.editing?{...i,[s]:t}:i))}async cancel(){if(this.busy||this.feedBusy)return;if(this.view==="delete"){this.view="edit";return}let s=this.editing;this.reset(),await this.updateComplete,this.renderRoot.querySelector(`[data-meal="${s}"]`)?.focus()}get saveable(){return!this.locked&&this.editing!==null&&D(this.draft,this.attrs.max_meals,this.attrs.max_portions)&&!N(this.draft,this.baseline)&&(this.attrs.snapshot_source!=="restored"||this.acknowledged)}clearTimer(){this.timer&&clearTimeout(this.timer),this.timer=void 0}failure(s){console.error("Tuya feeder operation failed",s),this.clearTimer(),this.busy=!1,this.failed=!0,this.message="Couldn\u2019t save. Try again.",this.requestUpdate()}retry(){this.busy||this.conflict||this.editing===null||this.attrs.revision!==this.base||!this.writable||!N(this.baseline,this.attrs.meals)||(this.failed=!1,this.view=this.operation==="delete_meal"?"delete":"edit",this.message="")}async save(s=!1){if(this.editing===null||this.locked||this.attrs.revision!==this.base||!N(this.baseline,this.attrs.meals)||(s?this.view!=="delete"||this.attrs.snapshot_source==="restored"&&!this.acknowledged:!this.saveable))return;s&&(this.operation="delete_meal");let t=this.editing;this.sent=R(s?this.baseline.filter((a,n)=>n!==t):this.draft);let i={entity_id:this.config.entity,expected_revision:this.base,...this.operation!=="add_meal"?{meal_index:t}:{},...s?{}:{meal:R([this.draft[t]])[0]},...this.attrs.snapshot_source==="restored"?{acknowledge_restored_snapshot:!0}:{}};this.sentAt=this.attrs.last_received_at,this.serviceCompleted=!1,this.busy=!0,this.failed=!1,this.view="list",this.message="Saving\u2026",this.clearTimer(),this.timer=setTimeout(()=>{this.busy&&this.failure(new Error("Schedule confirmation timed out; no retry sent"))},2e4);try{let a=await this.hass.callService("tuya_feeder",this.operation,i);if(!this.busy)return;a?.error?this.failure(a.error):(this.serviceCompleted=!0,this.hass=this.hass)}catch(a){this.busy&&this.failure(a)}}get helper(){return this.config.portions_entity?this._hass?.states[this.config.portions_entity]:void 0}get selectedPortions(){return this.config.portions_entity?Number(this.helper?.state):this.feedPortions}get feedBounds(){if(!this.config.portions_entity)return{min:1,max:60};let s=this.helper;if(!(!s||["unknown","unavailable",""].includes(s.state)||!Number.isInteger(Number(s.attributes.min))||!Number.isInteger(Number(s.attributes.max))))return{min:Math.max(1,Number(s.attributes.min)),max:Math.min(60,Number(s.attributes.max))}}get feedReady(){let s=this.selectedPortions,t=this.feedBounds;return this.attrs.supports_manual_feed===!0&&!this.attrs.manual_feed_pending&&(!this.hass.services||!!this.hass.services.tuya_feeder?.feed)&&!!t&&Number.isInteger(s)&&s>=t.min&&s<=t.max&&!this.busy&&!this.feedBusy&&!this.helperBusy}async selectFeed(s){let t=this.feedBounds,i=this.selectedPortions;if(!(!t||this.helperBusy||this.feedBusy||this.busy||!Number.isInteger(i)||i<t.min||i>t.max||i+s<t.min||i+s>t.max)){if(!this.config.portions_entity){this.feedPortions=i+s;return}this.helperBusy=!0;try{await this.hass.callService("input_number",s>0?"increment":"decrement",{entity_id:this.config.portions_entity})}catch(a){console.error("Tuya feeder portions selection failed",a),this.message="Couldn\u2019t change portions. Try again."}finally{this.helperBusy=!1}}}confirmFeed(){this.feedReady&&(this.feedDose=this.selectedPortions,this.view="feed",this.message="")}async feed(){if(!(!this.feedReady||!Number.isInteger(this.feedDose)||this.feedDose<1||this.feedDose>60)){this.feedBusy=!0,this.view="list",this.message="Feeding\u2026";try{let s=await this.hass.callService("tuya_feeder","feed",{entity_id:this.config.entity,portions:this.feedDose});if(s?.error)throw new Error(String(s.error));this.message="Feed requested"}catch(s){console.error("Tuya feeder manual feed failed",s),this.message="Couldn\u2019t feed. Try again."}finally{this.feedBusy=!1,this.feedDose=void 0}}}static getConfigElement(){return document.createElement("tuya-feeder-card-editor")}static getStubConfig(){return{entity:"",title:"Feeder",icon:"mdi:food-drumstick"}}getCardSize(){return 2+this.baseline.length}getGridOptions(){return{columns:12,min_columns:6}}acknowledgement(){return this.attrs.snapshot_source==="restored"?p`<label class="field"
          ><span>Use saved plan?</span
          ><input
            type="checkbox"
            aria-label="Use saved plan?"
            .checked=${this.acknowledged}
            ?disabled=${this.locked}
            @change=${s=>this.acknowledged=s.target.checked}
        /></label>`:l}render(){if(!this.config)return l;let s=this.editing,t=s===null?void 0:this.draft[s];return p`<ha-card
      part="card"
      data-active=${String(this.scheduleActive)}
      @keydown=${i=>{i.key==="Escape"&&this.view!=="list"&&(i.preventDefault(),this.cancel())}}
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
                ${this.writable||this.busy||this.failed||this.conflict?this.baseline.map((i,a)=>p`<div class="meal" part="meal row">
                            <button
                              part="meal-button"
                              class="open"
                              data-meal=${a}
                              aria-label=${`Edit meal ${a+1}`}
                              ?disabled=${this.locked||this.failed}
                              @click=${()=>this.openEditor(a)}
                            >
                              <span class="time" part="meal-time"
                                >${i.time}</span
                              ><span class="detail"
                                >Every day ·
                                <span aria-label=${`Portions ${a+1}`}
                                  >${i.portions}</span
                                >
                                portion${i.portions===1?"":"s"}</span
                              ></button
                            ><input
                              part="switch control"
                              class="switch"
                              type="checkbox"
                              role="switch"
                              aria-label=${`Enabled ${a+1}`}
                              .checked=${i.enabled}
                              ?disabled=${this.locked||this.failed}
                              @change=${n=>this.openEditor(a,n.target.checked)}
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
                  </div>`:t&&s!==null?p` <header part="header" class="edit-header">
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
                          aria-label=${`Time ${s+1}`}
                          .value=${t.time}
                          ?disabled=${this.locked}
                          @input=${i=>this.edit("time",i.target.value)}
                      /></label>
                      <div class="field">
                        <span>Portions</span>
                        <div part="stepper" class="stepper">
                          <button
                            part="control"
                            aria-label=${`Decrease portions ${s+1}`}
                            ?disabled=${this.locked||t.portions<=1}
                            @click=${()=>this.edit("portions",t.portions-1)}
                          >
                            −</button
                          ><output aria-label=${`Portions ${s+1}`}
                            >${t.portions}</output
                          ><button
                            part="control"
                            aria-label=${`Increase portions ${s+1}`}
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
                          @change=${i=>this.edit("enabled",i.target.checked)}
                      /></label>
                      <div class="field">
                        <span>Repeat</span><span class="detail">Every day</span>
                      </div>
                      ${this.acknowledgement()}${this.operation!=="add_meal"?p`<button class="danger delete" @click=${()=>this.view="delete"}>Delete meal</button>`:l}
                    </section>`:l}
      ${this.message?p`<div part="status" class="status" role="status">${this.message}</div>`:l}
      ${this.conflict?p`<button @click=${this.reset}>Reload</button>`:this.failed?p`<div class="actions"><button @click=${this.reset}>Cancel</button><button ?disabled=${!this.writable} @click=${this.retry}>Try again</button></div>`:l}
    </ha-card>`}static{this.styles=L`
    :host {
      display: block;
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
      flex: 1;
      min-width: 0;
      text-align: left;
      padding: 16px;
      border-radius: 0;
    }
    .time {
      display: block;
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
      margin-top: 6px;
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
    .manual {
      display: grid;
      grid-template-columns:
        45px minmax(33px, 1fr) var(--control) 32px var(--control)
        minmax(64px, 1fr);
      column-gap: 2px;
      align-items: center;
      min-height: 68px;
      margin: 0 -4px 12px;
      padding: 10px 0;
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
    [inert] {
      pointer-events: none;
    }
    p {
      color: var(--secondary-text-color, #777);
    }
  `}},te=class extends g{static{this.properties={hass:{attribute:!1},config:{state:!0}}}setConfig(e){this.config={...e}}render(){let e={entity:"Schedule sensor",title:"Title",icon:"Icon",manual_feed:"Show manual feeding",feed_title:"Feeding title",feed_icon:"Feeding icon",portions_entity:"Portions helper (optional)",appearance:"Appearance",accent_color:"Accent color",border_radius:"Corner radius",font_family:"Font family",header_font_size:"Header size",meal_time_font_size:"Meal time size",row_background:"Row color",card_background:"Card color",control_size:"Control size (minimum 44px)"};return p`<ha-form
      .hass=${this.hass}
      .data=${this.config}
      .schema=${[{name:"entity",required:!0,selector:{entity:{domain:"sensor",integration:"tuya_feeder"}}},{name:"title",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"manual_feed",selector:{boolean:{}}},{name:"feed_title",selector:{text:{}}},{name:"feed_icon",selector:{icon:{}}},{name:"portions_entity",selector:{entity:{domain:"input_number"}}},{name:"appearance",type:"expandable",schema:ie.map(s=>({name:s,selector:{text:{}}}))}]}
      .computeLabel=${s=>e[s.name]??s.name}
      @value-changed=${s=>{let t={...this.config,...s.detail.value};we(t.appearance),this.config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this.config},bubbles:!0,composed:!0}))}}
    ></ha-form>`}};customElements.define("tuya-feeder-card",ee);customElements.define("tuya-feeder-card-editor",te);var se=window;se.customCards=se.customCards||[];se.customCards.push({type:"tuya-feeder-card",name:"Tuya Feeder",description:"Daily meals with in-card editing and optional manual feeding.",documentationURL:"https://github.com/myevit/tuya-feeder-card"});export{ee as TuyaFeederCard};
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
*/
