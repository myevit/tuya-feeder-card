var H=globalThis,R=H.ShadowRoot&&(H.ShadyCSS===void 0||H.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,D=Symbol(),et=new WeakMap,w=class{constructor(t,s,e){if(this._$cssResult$=!0,e!==D)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=s}get styleSheet(){let t=this.o,s=this.t;if(R&&t===void 0){let e=s!==void 0&&s.length===1;e&&(t=et.get(s)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&et.set(s,t))}return t}toString(){return this.cssText}},st=r=>new w(typeof r=="string"?r:r+"",void 0,D),L=(r,...t)=>{let s=r.length===1?r[0]:t.reduce((e,i,n)=>e+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new w(s,r,D)},it=(r,t)=>{if(R)r.adoptedStyleSheets=t.map(s=>s instanceof CSSStyleSheet?s:s.styleSheet);else for(let s of t){let e=document.createElement("style"),i=H.litNonce;i!==void 0&&e.setAttribute("nonce",i),e.textContent=s.cssText,r.appendChild(e)}},z=R?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let s="";for(let e of t.cssRules)s+=e.cssText;return st(s)})(r):r;var{is:_t,defineProperty:At,getOwnPropertyDescriptor:xt,getOwnPropertyNames:St,getOwnPropertySymbols:wt,getPrototypeOf:Et}=Object,O=globalThis,rt=O.trustedTypes,Ct=rt?rt.emptyScript:"",kt=O.reactiveElementPolyfillSupport,E=(r,t)=>r,j={toAttribute(r,t){switch(t){case Boolean:r=r?Ct:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let s=r;switch(t){case Boolean:s=r!==null;break;case Number:s=r===null?null:Number(r);break;case Object:case Array:try{s=JSON.parse(r)}catch{s=null}}return s}},ot=(r,t)=>!_t(r,t),nt={attribute:!0,type:String,converter:j,reflect:!1,useDefault:!1,hasChanged:ot};Symbol.metadata??=Symbol("metadata"),O.litPropertyMetadata??=new WeakMap;var f=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=nt){if(s.state&&(s.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=!0),this.elementProperties.set(t,s),!s.noAccessor){let e=Symbol(),i=this.getPropertyDescriptor(t,e,s);i!==void 0&&At(this.prototype,t,i)}}static getPropertyDescriptor(t,s,e){let{get:i,set:n}=xt(this.prototype,t)??{get(){return this[s]},set(o){this[s]=o}};return{get:i,set(o){let d=i?.call(this);n?.call(this,o),this.requestUpdate(t,d,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??nt}static _$Ei(){if(this.hasOwnProperty(E("elementProperties")))return;let t=Et(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(E("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(E("properties"))){let s=this.properties,e=[...St(s),...wt(s)];for(let i of e)this.createProperty(i,s[i])}let t=this[Symbol.metadata];if(t!==null){let s=litPropertyMetadata.get(t);if(s!==void 0)for(let[e,i]of s)this.elementProperties.set(e,i)}this._$Eh=new Map;for(let[s,e]of this.elementProperties){let i=this._$Eu(s,e);i!==void 0&&this._$Eh.set(i,s)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let s=[];if(Array.isArray(t)){let e=new Set(t.flat(1/0).reverse());for(let i of e)s.unshift(z(i))}else t!==void 0&&s.push(z(t));return s}static _$Eu(t,s){let e=s.attribute;return e===!1?void 0:typeof e=="string"?e:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,s=this.constructor.elementProperties;for(let e of s.keys())this.hasOwnProperty(e)&&(t.set(e,this[e]),delete this[e]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return it(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,s,e){this._$AK(t,e)}_$ET(t,s){let e=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,e);if(i!==void 0&&e.reflect===!0){let n=(e.converter?.toAttribute!==void 0?e.converter:j).toAttribute(s,e.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,s){let e=this.constructor,i=e._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let n=e.getPropertyOptions(i),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:j;this._$Em=i;let d=o.fromAttribute(s,n.type);this[i]=d??this._$Ej?.get(i)??d,this._$Em=null}}requestUpdate(t,s,e,i=!1,n){if(t!==void 0){let o=this.constructor;if(i===!1&&(n=this[t]),e??=o.getPropertyOptions(t),!((e.hasChanged??ot)(n,s)||e.useDefault&&e.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,e))))return;this.C(t,s,e)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,s,{useDefault:e,reflect:i,wrapped:n},o){e&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??s??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||e||(s=void 0),this._$AL.set(t,s)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(s){Promise.reject(s)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[i,n]of e){let{wrapped:o}=n,d=this[i];o!==!0||this._$AL.has(i)||d===void 0||this.C(i,void 0,n,d)}}let t=!1,s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(s)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(s)}willUpdate(t){}_$AE(t){this._$EO?.forEach(s=>s.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(s=>this._$ET(s,this[s])),this._$EM()}updated(t){}firstUpdated(t){}};f.elementStyles=[],f.shadowRootOptions={mode:"open"},f[E("elementProperties")]=new Map,f[E("finalized")]=new Map,kt?.({ReactiveElement:f}),(O.reactiveElementVersions??=[]).push("2.1.2");var K=globalThis,at=r=>r,N=K.trustedTypes,lt=N?N.createPolicy("lit-html",{createHTML:r=>r}):void 0,ft="$lit$",y=`lit$${Math.random().toFixed(9).slice(2)}$`,mt="?"+y,Mt=`<${mt}>`,b=document,k=()=>b.createComment(""),M=r=>r===null||typeof r!="object"&&typeof r!="function",J=Array.isArray,Tt=r=>J(r)||typeof r?.[Symbol.iterator]=="function",I=`[ 	
\f\r]`,C=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ht=/-->/g,dt=/>/g,$=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ct=/'/g,pt=/"/g,gt=/^(?:script|style|textarea|title)$/i,G=r=>(t,...s)=>({_$litType$:r,strings:t,values:s}),A=G(1),zt=G(2),jt=G(3),_=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),ut=new WeakMap,v=b.createTreeWalker(b,129);function yt(r,t){if(!J(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return lt!==void 0?lt.createHTML(t):t}var Pt=(r,t)=>{let s=r.length-1,e=[],i,n=t===2?"<svg>":t===3?"<math>":"",o=C;for(let d=0;d<s;d++){let a=r[d],c,p,l=-1,u=0;for(;u<a.length&&(o.lastIndex=u,p=o.exec(a),p!==null);)u=o.lastIndex,o===C?p[1]==="!--"?o=ht:p[1]!==void 0?o=dt:p[2]!==void 0?(gt.test(p[2])&&(i=RegExp("</"+p[2],"g")),o=$):p[3]!==void 0&&(o=$):o===$?p[0]===">"?(o=i??C,l=-1):p[1]===void 0?l=-2:(l=o.lastIndex-p[2].length,c=p[1],o=p[3]===void 0?$:p[3]==='"'?pt:ct):o===pt||o===ct?o=$:o===ht||o===dt?o=C:(o=$,i=void 0);let g=o===$&&r[d+1].startsWith("/>")?" ":"";n+=o===C?a+Mt:l>=0?(e.push(c),a.slice(0,l)+ft+a.slice(l)+y+g):a+y+(l===-2?d:g)}return[yt(r,n+(r[s]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),e]},T=class r{constructor({strings:t,_$litType$:s},e){let i;this.parts=[];let n=0,o=0,d=t.length-1,a=this.parts,[c,p]=Pt(t,s);if(this.el=r.createElement(c,e),v.currentNode=this.el.content,s===2||s===3){let l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;(i=v.nextNode())!==null&&a.length<d;){if(i.nodeType===1){if(i.hasAttributes())for(let l of i.getAttributeNames())if(l.endsWith(ft)){let u=p[o++],g=i.getAttribute(l).split(y),U=/([.?@])?(.*)/.exec(u);a.push({type:1,index:n,name:U[2],strings:g,ctor:U[1]==="."?B:U[1]==="?"?W:U[1]==="@"?V:S}),i.removeAttribute(l)}else l.startsWith(y)&&(a.push({type:6,index:n}),i.removeAttribute(l));if(gt.test(i.tagName)){let l=i.textContent.split(y),u=l.length-1;if(u>0){i.textContent=N?N.emptyScript:"";for(let g=0;g<u;g++)i.append(l[g],k()),v.nextNode(),a.push({type:2,index:++n});i.append(l[u],k())}}}else if(i.nodeType===8)if(i.data===mt)a.push({type:2,index:n});else{let l=-1;for(;(l=i.data.indexOf(y,l+1))!==-1;)a.push({type:7,index:n}),l+=y.length-1}n++}}static createElement(t,s){let e=b.createElement("template");return e.innerHTML=t,e}};function x(r,t,s=r,e){if(t===_)return t;let i=e!==void 0?s._$Co?.[e]:s._$Cl,n=M(t)?void 0:t._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,s,e)),e!==void 0?(s._$Co??=[])[e]=i:s._$Cl=i),i!==void 0&&(t=x(r,i._$AS(r,t.values),i,e)),t}var q=class{constructor(t,s){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=s}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:s},parts:e}=this._$AD,i=(t?.creationScope??b).importNode(s,!0);v.currentNode=i;let n=v.nextNode(),o=0,d=0,a=e[0];for(;a!==void 0;){if(o===a.index){let c;a.type===2?c=new P(n,n.nextSibling,this,t):a.type===1?c=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(c=new F(n,this,t)),this._$AV.push(c),a=e[++d]}o!==a?.index&&(n=v.nextNode(),o++)}return v.currentNode=b,i}p(t){let s=0;for(let e of this._$AV)e!==void 0&&(e.strings!==void 0?(e._$AI(t,e,s),s+=e.strings.length-2):e._$AI(t[s])),s++}},P=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,s,e,i){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=t,this._$AB=s,this._$AM=e,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,s=this._$AM;return s!==void 0&&t?.nodeType===11&&(t=s.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,s=this){t=x(this,t,s),M(t)?t===h||t==null||t===""?(this._$AH!==h&&this._$AR(),this._$AH=h):t!==this._$AH&&t!==_&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Tt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==h&&M(this._$AH)?this._$AA.nextSibling.data=t:this.T(b.createTextNode(t)),this._$AH=t}$(t){let{values:s,_$litType$:e}=t,i=typeof e=="number"?this._$AC(t):(e.el===void 0&&(e.el=T.createElement(yt(e.h,e.h[0]),this.options)),e);if(this._$AH?._$AD===i)this._$AH.p(s);else{let n=new q(i,this),o=n.u(this.options);n.p(s),this.T(o),this._$AH=n}}_$AC(t){let s=ut.get(t.strings);return s===void 0&&ut.set(t.strings,s=new T(t)),s}k(t){J(this._$AH)||(this._$AH=[],this._$AR());let s=this._$AH,e,i=0;for(let n of t)i===s.length?s.push(e=new r(this.O(k()),this.O(k()),this,this.options)):e=s[i],e._$AI(n),i++;i<s.length&&(this._$AR(e&&e._$AB.nextSibling,i),s.length=i)}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(!1,!0,s);t!==this._$AB;){let e=at(t).nextSibling;at(t).remove(),t=e}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},S=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,s,e,i,n){this.type=1,this._$AH=h,this._$AN=void 0,this.element=t,this.name=s,this._$AM=i,this.options=n,e.length>2||e[0]!==""||e[1]!==""?(this._$AH=Array(e.length-1).fill(new String),this.strings=e):this._$AH=h}_$AI(t,s=this,e,i){let n=this.strings,o=!1;if(n===void 0)t=x(this,t,s,0),o=!M(t)||t!==this._$AH&&t!==_,o&&(this._$AH=t);else{let d=t,a,c;for(t=n[0],a=0;a<n.length-1;a++)c=x(this,d[e+a],s,a),c===_&&(c=this._$AH[a]),o||=!M(c)||c!==this._$AH[a],c===h?t=h:t!==h&&(t+=(c??"")+n[a+1]),this._$AH[a]=c}o&&!i&&this.j(t)}j(t){t===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},B=class extends S{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===h?void 0:t}},W=class extends S{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==h)}},V=class extends S{constructor(t,s,e,i,n){super(t,s,e,i,n),this.type=5}_$AI(t,s=this){if((t=x(this,t,s,0)??h)===_)return;let e=this._$AH,i=t===h&&e!==h||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==h&&(e===h||i);i&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},F=class{constructor(t,s,e){this.element=t,this.type=6,this._$AN=void 0,this._$AM=s,this.options=e}get _$AU(){return this._$AM._$AU}_$AI(t){x(this,t)}};var Ut=K.litHtmlPolyfillSupport;Ut?.(T,P),(K.litHtmlVersions??=[]).push("3.3.3");var $t=(r,t,s)=>{let e=s?.renderBefore??t,i=e._$litPart$;if(i===void 0){let n=s?.renderBefore??null;e._$litPart$=i=new P(t.insertBefore(k(),n),n,void 0,s??{})}return i._$AI(r),i};var Y=globalThis,m=class extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let s=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=$t(s,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return _}};m._$litElement$=!0,m.finalized=!0,Y.litElementHydrateSupport?.({LitElement:m});var Ht=Y.litElementPolyfillSupport;Ht?.({LitElement:m});(Y.litElementVersions??=[]).push("4.2.2");var Z=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],vt=r=>r.map(t=>({...t,days:[...t.days]})),bt=(r,t=10,s=60)=>Array.isArray(r)&&r.length<=Math.min(10,t)&&r.every(e=>e&&typeof e=="object"&&Object.keys(e).sort().join(",")==="days,enabled,portions,time"&&Array.isArray(e.days)&&e.days.length===7&&new Set(e.days).size===7&&Z.every(i=>e.days.includes(i))&&typeof e.time=="string"&&/^([01]\d|2[0-3]):[0-5]\d$/.test(e.time)&&Number.isInteger(e.portions)&&e.portions>=1&&e.portions<=Math.min(60,s)&&typeof e.enabled=="boolean"),Rt=(r,t)=>r.length===t.length&&r.every((s,e)=>s.time===t[e].time&&s.portions===t[e].portions&&s.enabled===t[e].enabled&&s.days.length===t[e].days.length&&s.days.every(i=>t[e].days.includes(i))),Q=class extends m{constructor(){super(...arguments);this.draft=[];this.dirty=!1;this.conflict=!1;this.busy=!1;this.message="";this.dialogOpen=!1;this.serviceCompleted=!1}static{this.properties={config:{state:!0},draft:{state:!0},dirty:{state:!0},conflict:{state:!0},busy:{state:!0},message:{state:!0},dialogOpen:{state:!0}}}clearConfirmationTimer(){this.confirmationTimer&&clearTimeout(this.confirmationTimer),this.confirmationTimer=void 0}setConfig(s){if(!s.entity?.startsWith("sensor."))throw new Error("Select a schedule sensor");if(this.busy)throw new Error("Wait for schedule confirmation before changing entity");this.config={...s},this.dirty=!1,this.conflict=!1,this.load()}set hass(s){this._hass=s;let e=this.attrs;this.busy?e.error&&!e.pending?(this.clearConfirmationTimer(),this.busy=!1,this.message=String(e.error),this.conflict=!0):this.writable&&this.serviceCompleted&&!e.pending&&e.revision>this.base&&e.last_received_at!==this.sentAt&&this.sent?.length===e.meals.length&&this.sent?.every((i,n)=>i.time===e.meals[n].time&&i.portions===e.meals[n].portions&&i.enabled===e.meals[n].enabled)&&(this.busy=!1,this.dirty=!1,this.sent=void 0,this.clearConfirmationTimer(),this.load(),this.message="Schedule confirmed by incoming device report."):this.dirty&&e.revision!==this.base?(this.conflict=!0,this.message="Schedule changed while editing. Reload explicitly before saving.",this.closeDialog()):this.dirty||this.load(),this.requestUpdate()}get hass(){return this._hass}get attrs(){return this._hass?.states[this.config?.entity]?.attributes??{}}get writable(){let s=this._hass?.states[this.config?.entity],e=this.attrs;return!!s&&!["unknown","unavailable"].includes(s.state)&&e.supports_schedule_write===!0&&e.supported_days_mode==="every_day"&&Number.isSafeInteger(e.revision)&&e.revision>0&&typeof e.last_received_at=="string"&&!!e.last_received_at&&Number.isFinite(Date.parse(e.last_received_at))&&e.schedule_valid===!0&&e.snapshot_source==="received"&&e.pending===!1&&!e.error&&Number.isInteger(e.max_meals)&&e.max_meals>0&&Number.isInteger(e.max_portions)&&e.max_portions>0&&bt(e.meals,e.max_meals,e.max_portions)}get locked(){return!this.writable||this.conflict||this.busy}load(){if(!this.config)return;let s=this.attrs;this.base=s.revision,this.draft=Array.isArray(s.meals)?s.meals.map(e=>({...e,days:e.days==="Everyday"?[...Z]:Array.isArray(e.days)?[...e.days]:[]})):[],this.requestUpdate()}edit(s,e,i){this.locked||(this.draft=this.draft.map((n,o)=>o===s?{...n,[e]:i}:n),this.dirty=!0)}add(){this.locked||this.draft.length>=Math.min(10,this.attrs.max_meals)||(this.draft=[...this.draft,{days:[...Z],time:"23:59",portions:1,enabled:!1}],this.dirty=!0)}reset(){this.busy||(this.dirty=!1,this.conflict=!1,this.message="",this.closeDialog(),this.load())}get saveable(){return!this.locked&&this.dirty&&!Rt(this.draft,this.attrs.meals)&&bt(this.draft,this.attrs.max_meals,this.attrs.max_portions)}async review(){if(!this.saveable)return;this.dialogOpen=!0,await this.updateComplete;let s=this.renderRoot.querySelector("dialog");s.showModal(),s.querySelector("[data-cancel]")?.focus()}closeDialog(){this.renderRoot.querySelector("dialog")?.close(),this.dialogOpen=!1,this.renderRoot.querySelector("[data-save]")?.focus()}async confirm(){if(this.saveable){this.sent=vt(this.draft),this.sentAt=this.attrs.last_received_at,this.serviceCompleted=!1,this.busy=!0,this.clearConfirmationTimer(),this.confirmationTimer=setTimeout(()=>{this.busy&&(this.busy=!1,this.conflict=!0,this.message="Confirmation timed out. Draft retained; check incoming state and reload before trying again. No retry was sent.",this.requestUpdate())},2e4),this.closeDialog(),this.message="Awaiting confirmed incoming schedule. An empty acknowledgement is not confirmation.";try{let s=await this.hass.callService("tuya_feeder","set_schedule",{entity_id:this.config.entity,expected_revision:this.base,meals:vt(this.sent)});s?.error&&this.busy?(this.clearConfirmationTimer(),this.busy=!1,this.conflict=!0,this.message=String(s.error)):this.busy&&(this.serviceCompleted=!0,this.hass=this.hass)}catch(s){if(!this.busy)return;this.clearConfirmationTimer(),this.busy=!1,this.conflict=!0,this.message=`Save failed: ${String(s)}. Reload before retrying.`}}}static getConfigElement(){return document.createElement("tuya-feeder-card-editor")}static getStubConfig(){return{entity:"",title:"Feeder schedule",icon:"mdi:calendar-clock"}}getCardSize(){return 2+this.draft.length}getGridOptions(){return{columns:12,min_columns:6}}render(){return this.config?A`<ha-card
      ><header>
        <ha-icon .icon=${this.config.icon??"mdi:calendar-clock"}></ha-icon>
        <div>
          <h2>${this.config.title??"Feeder schedule"}</h2>
          <small>Device-owned · Every day</small>
        </div>
        ${this.dirty?A`<span class="badge">Draft</span>`:h}
      </header>
      <div class="status" role="status">
        ${this.message||(this.writable?"Changes remain local until you confirm Save.":"Read only \u2014 validated locally received writable snapshot required.")}
      </div>
      <small class="observation"
        >Last locally received snapshot, not an active query. External-app
        changes may be stale until a new local report.</small
      >
      <section aria-label="Schedule draft" ?inert=${this.busy}>
        <fieldset ?disabled=${this.locked}>
          ${this.draft.map((s,e)=>A`<div class="meal">
                <input
                  type="text"
                  inputmode="numeric"
                  maxlength="5"
                  placeholder="HH:MM"
                  pattern="([01][0-9]|2[0-3]):[0-5][0-9]"
                  aria-label=${`Time ${e+1}`}
                  .value=${s.time??""}
                  @input=${i=>this.edit(e,"time",i.target.value)}
                />
                <div class="stepper">
                  <button
                    aria-label=${`Decrease portions ${e+1}`}
                    ?disabled=${s.portions<=1}
                    @click=${()=>this.edit(e,"portions",s.portions-1)}
                  >
                    −</button
                  ><output aria-label=${`Portions ${e+1}`}
                    >${s.portions}</output
                  ><button
                    aria-label=${`Increase portions ${e+1}`}
                    ?disabled=${s.portions>=Math.min(60,this.attrs.max_portions??60)}
                    @click=${()=>this.edit(e,"portions",s.portions+1)}
                  >
                    +
                  </button>
                </div>
                <input
                  class="switch"
                  type="checkbox"
                  role="switch"
                  aria-label=${`Enabled ${e+1}`}
                  .checked=${s.enabled===!0}
                  @change=${i=>this.edit(e,"enabled",i.target.checked)}
                />
              </div>`)}<button
            class="add"
            ?disabled=${this.draft.length>=Math.min(10,this.attrs.max_meals??10)}
            @click=${this.add}
          >
            Add disabled meal
          </button>
        </fieldset>
      </section>
      <footer>
        <button @click=${this.reset} ?disabled=${this.busy}>
          ${this.conflict?"Reload schedule":"Reset draft"}</button
        ><button
          data-save
          class="accent"
          ?disabled=${!this.saveable}
          @click=${this.review}
        >
          Save
        </button>
      </footer>
      ${this.dialogOpen?A`<dialog
              aria-labelledby="confirm-title"
              @cancel=${s=>{s.preventDefault(),this.closeDialog()}}
            >
              <h2 id="confirm-title">Replace device schedule?</h2>
              <p>
                The complete plan below replaces the device plan. No immediate
                feeding command is sent.
              </p>
              <ol>
                ${this.draft.map(s=>A`<li>Every day · ${s.time} · ${s.portions} portion${s.portions===1?"":"s"} · ${s.enabled?"Enabled":"Disabled"}</li>`)}
              </ol>
              <div class="dialog-actions">
                <button data-cancel @click=${this.closeDialog}>Cancel</button
                ><button
                  class="accent"
                  ?disabled=${!this.saveable}
                  @click=${this.confirm}
                >
                  Confirm Save
                </button>
              </div>
            </dialog>`:h}</ha-card
    >`:h}static{this.styles=L`
    :host {
      display: block;
      color: var(--primary-text-color);
      font-family: var(--ha-font-family-body, system-ui);
      font-size: 14px;
    }
    ha-card {
      display: block;
      background: var(--card-background-color, var(--ha-card-background, #fff));
      border-radius: var(--ha-card-border-radius, 20px);
      border: 1px solid var(--divider-color, #ddd);
      overflow: hidden;
    }
    header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 18px 16px 8px;
    }
    ha-icon {
      color: var(--primary-color);
      width: 24px;
    }
    h2 {
      font-size: 18px;
      letter-spacing: -0.4px;
      margin: 0 0 3px;
      font-weight: 600;
    }
    small,
    .status {
      color: var(--secondary-text-color, #666);
    }
    .badge {
      margin-left: auto;
      font-size: 12px;
      color: var(--primary-color);
    }
    .status {
      padding: 8px 16px 12px;
      font-size: 12px;
      line-height: 1.45;
    }
    fieldset {
      border: 0;
      padding: 0;
      margin: 0;
      min-width: 0;
    }
    section {
      padding: 0 12px;
    }
    .meal {
      box-sizing: border-box;
      height: 68px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      border-top: 1px solid var(--divider-color, #eee);
    }
    input[type="text"] {
      box-sizing: border-box;
      width: 94px;
      min-width: 0;
      font: inherit;
      font-size: 16px;
      border: 0;
      background: transparent;
      color: inherit;
      padding: 0;
      height: 44px;
      font-variant-numeric: tabular-nums;
    }
    .stepper {
      display: flex;
      align-items: center;
      gap: 0;
    }
    .stepper output {
      width: 30px;
      text-align: center;
      font-size: 21px;
      font-weight: 500;
      font-variant-numeric: tabular-nums;
    }
    .stepper button {
      width: 44px;
      padding: 0;
      font-size: 22px;
      background: var(--secondary-background-color, #f2f2f7);
    }
    button {
      min-height: 44px;
      border: 0;
      border-radius: 12px;
      background: transparent;
      color: inherit;
      font: inherit;
      padding: 0 12px;
      cursor: pointer;
      touch-action: manipulation;
      transition: none;
      transform: none;
    }
    button:disabled {
      opacity: 0.35;
      cursor: default;
    }
    button:focus-visible,
    input:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .switch {
      appearance: none;
      width: 44px;
      height: 44px;
      flex: 0 0 44px;
      margin: 0;
      background: linear-gradient(
          var(--disabled-text-color, #aaa),
          var(--disabled-text-color, #aaa)
        )
        center/40px 24px no-repeat;
      border-radius: 22px;
      position: relative;
      cursor: pointer;
    }
    .switch:after {
      content: "";
      position: absolute;
      left: 5px;
      top: 12px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: white;
    }
    .switch:checked {
      background: linear-gradient(var(--primary-color), var(--primary-color))
        center/40px 24px no-repeat;
    }
    .switch:checked:after {
      left: 19px;
    }
    .switch:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .add {
      width: 100%;
      color: var(--primary-color);
      text-align: left;
    }
    footer {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      padding: 12px 16px;
      border-top: 1px solid var(--divider-color, #eee);
    }
    .accent {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      min-width: 80px;
    }
    dialog {
      max-width: min(400px, calc(100vw - 64px));
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 20px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #222);
      padding: 20px;
    }
    dialog::backdrop {
      background: #0006;
    }
    dialog p,
    li {
      line-height: 1.6;
    }
    ol {
      padding-left: 20px;
    }
    .dialog-actions {
      display: flex;
      gap: 20px;
      justify-content: flex-end;
    }
    [inert] {
      pointer-events: none;
    }
  `}},X=class extends m{static{this.properties={hass:{attribute:!1},config:{state:!0}}}setConfig(t){this.config={...t}}render(){return A`<ha-form
      .hass=${this.hass}
      .data=${this.config}
      .schema=${[{name:"entity",required:!0,selector:{entity:{domain:"sensor"}}},{name:"title",selector:{text:{}}},{name:"icon",selector:{icon:{}}}]}
      .computeLabel=${t=>t.name==="entity"?"Schedule sensor":t.name==="title"?"Title":"Icon"}
      @value-changed=${t=>{this.config={...this.config,...t.detail.value},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this.config},bubbles:!0,composed:!0}))}}
    ></ha-form>`}};customElements.define("tuya-feeder-card",Q);customElements.define("tuya-feeder-card-editor",X);var tt=window;tt.customCards=tt.customCards||[];tt.customCards.push({type:"tuya-feeder-card",name:"Tuya Feeder Schedule",description:"Draft and confirm a device-owned daily schedule. No feed actions.",documentationURL:"https://github.com/myevit/tuya-feeder-card"});export{Q as TuyaFeederCard};
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
