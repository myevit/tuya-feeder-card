var H=globalThis,O=H.ShadowRoot&&(H.ShadyCSS===void 0||H.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,D=Symbol(),st=new WeakMap,E=class{constructor(t,s,e){if(this._$cssResult$=!0,e!==D)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=s}get styleSheet(){let t=this.o,s=this.t;if(O&&t===void 0){let e=s!==void 0&&s.length===1;e&&(t=st.get(s)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&st.set(s,t))}return t}toString(){return this.cssText}},it=r=>new E(typeof r=="string"?r:r+"",void 0,D),L=(r,...t)=>{let s=r.length===1?r[0]:t.reduce((e,i,o)=>e+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[o+1],r[0]);return new E(s,r,D)},rt=(r,t)=>{if(O)r.adoptedStyleSheets=t.map(s=>s instanceof CSSStyleSheet?s:s.styleSheet);else for(let s of t){let e=document.createElement("style"),i=H.litNonce;i!==void 0&&e.setAttribute("nonce",i),e.textContent=s.cssText,r.appendChild(e)}},z=O?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let s="";for(let e of t.cssRules)s+=e.cssText;return it(s)})(r):r;var{is:xt,defineProperty:At,getOwnPropertyDescriptor:wt,getOwnPropertyNames:Et,getOwnPropertySymbols:St,getPrototypeOf:Ct}=Object,U=globalThis,ot=U.trustedTypes,kt=ot?ot.emptyScript:"",Mt=U.reactiveElementPolyfillSupport,S=(r,t)=>r,I={toAttribute(r,t){switch(t){case Boolean:r=r?kt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let s=r;switch(t){case Boolean:s=r!==null;break;case Number:s=r===null?null:Number(r);break;case Object:case Array:try{s=JSON.parse(r)}catch{s=null}}return s}},at=(r,t)=>!xt(r,t),nt={attribute:!0,type:String,converter:I,reflect:!1,useDefault:!1,hasChanged:at};Symbol.metadata??=Symbol("metadata"),U.litPropertyMetadata??=new WeakMap;var m=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=nt){if(s.state&&(s.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=!0),this.elementProperties.set(t,s),!s.noAccessor){let e=Symbol(),i=this.getPropertyDescriptor(t,e,s);i!==void 0&&At(this.prototype,t,i)}}static getPropertyDescriptor(t,s,e){let{get:i,set:o}=wt(this.prototype,t)??{get(){return this[s]},set(n){this[s]=n}};return{get:i,set(n){let h=i?.call(this);o?.call(this,n),this.requestUpdate(t,h,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??nt}static _$Ei(){if(this.hasOwnProperty(S("elementProperties")))return;let t=Ct(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(S("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(S("properties"))){let s=this.properties,e=[...Et(s),...St(s)];for(let i of e)this.createProperty(i,s[i])}let t=this[Symbol.metadata];if(t!==null){let s=litPropertyMetadata.get(t);if(s!==void 0)for(let[e,i]of s)this.elementProperties.set(e,i)}this._$Eh=new Map;for(let[s,e]of this.elementProperties){let i=this._$Eu(s,e);i!==void 0&&this._$Eh.set(i,s)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let s=[];if(Array.isArray(t)){let e=new Set(t.flat(1/0).reverse());for(let i of e)s.unshift(z(i))}else t!==void 0&&s.push(z(t));return s}static _$Eu(t,s){let e=s.attribute;return e===!1?void 0:typeof e=="string"?e:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,s=this.constructor.elementProperties;for(let e of s.keys())this.hasOwnProperty(e)&&(t.set(e,this[e]),delete this[e]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return rt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,s,e){this._$AK(t,e)}_$ET(t,s){let e=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,e);if(i!==void 0&&e.reflect===!0){let o=(e.converter?.toAttribute!==void 0?e.converter:I).toAttribute(s,e.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,s){let e=this.constructor,i=e._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let o=e.getPropertyOptions(i),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:I;this._$Em=i;let h=n.fromAttribute(s,o.type);this[i]=h??this._$Ej?.get(i)??h,this._$Em=null}}requestUpdate(t,s,e,i=!1,o){if(t!==void 0){let n=this.constructor;if(i===!1&&(o=this[t]),e??=n.getPropertyOptions(t),!((e.hasChanged??at)(o,s)||e.useDefault&&e.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,e))))return;this.C(t,s,e)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,s,{useDefault:e,reflect:i,wrapped:o},n){e&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??s??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||e||(s=void 0),this._$AL.set(t,s)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(s){Promise.reject(s)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[i,o]of e){let{wrapped:n}=o,h=this[i];n!==!0||this._$AL.has(i)||h===void 0||this.C(i,void 0,o,h)}}let t=!1,s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(s)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(s)}willUpdate(t){}_$AE(t){this._$EO?.forEach(s=>s.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(s=>this._$ET(s,this[s])),this._$EM()}updated(t){}firstUpdated(t){}};m.elementStyles=[],m.shadowRootOptions={mode:"open"},m[S("elementProperties")]=new Map,m[S("finalized")]=new Map,Mt?.({ReactiveElement:m}),(U.reactiveElementVersions??=[]).push("2.1.2");var F=globalThis,lt=r=>r,N=F.trustedTypes,dt=N?N.createPolicy("lit-html",{createHTML:r=>r}):void 0,mt="$lit$",v=`lit$${Math.random().toFixed(9).slice(2)}$`,gt="?"+v,Tt=`<${gt}>`,_=document,k=()=>_.createComment(""),M=r=>r===null||typeof r!="object"&&typeof r!="function",J=Array.isArray,Pt=r=>J(r)||typeof r?.[Symbol.iterator]=="function",j=`[ 	
\f\r]`,C=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ht=/-->/g,ct=/>/g,$=RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),pt=/'/g,ut=/"/g,yt=/^(?:script|style|textarea|title)$/i,G=r=>(t,...s)=>({_$litType$:r,strings:t,values:s}),u=G(1),zt=G(2),It=G(3),x=Symbol.for("lit-noChange"),l=Symbol.for("lit-nothing"),ft=new WeakMap,b=_.createTreeWalker(_,129);function vt(r,t){if(!J(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return dt!==void 0?dt.createHTML(t):t}var Rt=(r,t)=>{let s=r.length-1,e=[],i,o=t===2?"<svg>":t===3?"<math>":"",n=C;for(let h=0;h<s;h++){let a=r[h],c,p,d=-1,f=0;for(;f<a.length&&(n.lastIndex=f,p=n.exec(a),p!==null);)f=n.lastIndex,n===C?p[1]==="!--"?n=ht:p[1]!==void 0?n=ct:p[2]!==void 0?(yt.test(p[2])&&(i=RegExp("</"+p[2],"g")),n=$):p[3]!==void 0&&(n=$):n===$?p[0]===">"?(n=i??C,d=-1):p[1]===void 0?d=-2:(d=n.lastIndex-p[2].length,c=p[1],n=p[3]===void 0?$:p[3]==='"'?ut:pt):n===ut||n===pt?n=$:n===ht||n===ct?n=C:(n=$,i=void 0);let y=n===$&&r[h+1].startsWith("/>")?" ":"";o+=n===C?a+Tt:d>=0?(e.push(c),a.slice(0,d)+mt+a.slice(d)+v+y):a+v+(d===-2?h:y)}return[vt(r,o+(r[s]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),e]},T=class r{constructor({strings:t,_$litType$:s},e){let i;this.parts=[];let o=0,n=0,h=t.length-1,a=this.parts,[c,p]=Rt(t,s);if(this.el=r.createElement(c,e),b.currentNode=this.el.content,s===2||s===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=b.nextNode())!==null&&a.length<h;){if(i.nodeType===1){if(i.hasAttributes())for(let d of i.getAttributeNames())if(d.endsWith(mt)){let f=p[n++],y=i.getAttribute(d).split(v),R=/([.?@])?(.*)/.exec(f);a.push({type:1,index:o,name:R[2],strings:y,ctor:R[1]==="."?B:R[1]==="?"?W:R[1]==="@"?V:w}),i.removeAttribute(d)}else d.startsWith(v)&&(a.push({type:6,index:o}),i.removeAttribute(d));if(yt.test(i.tagName)){let d=i.textContent.split(v),f=d.length-1;if(f>0){i.textContent=N?N.emptyScript:"";for(let y=0;y<f;y++)i.append(d[y],k()),b.nextNode(),a.push({type:2,index:++o});i.append(d[f],k())}}}else if(i.nodeType===8)if(i.data===gt)a.push({type:2,index:o});else{let d=-1;for(;(d=i.data.indexOf(v,d+1))!==-1;)a.push({type:7,index:o}),d+=v.length-1}o++}}static createElement(t,s){let e=_.createElement("template");return e.innerHTML=t,e}};function A(r,t,s=r,e){if(t===x)return t;let i=e!==void 0?s._$Co?.[e]:s._$Cl,o=M(t)?void 0:t._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(r),i._$AT(r,s,e)),e!==void 0?(s._$Co??=[])[e]=i:s._$Cl=i),i!==void 0&&(t=A(r,i._$AS(r,t.values),i,e)),t}var q=class{constructor(t,s){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=s}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:s},parts:e}=this._$AD,i=(t?.creationScope??_).importNode(s,!0);b.currentNode=i;let o=b.nextNode(),n=0,h=0,a=e[0];for(;a!==void 0;){if(n===a.index){let c;a.type===2?c=new P(o,o.nextSibling,this,t):a.type===1?c=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(c=new K(o,this,t)),this._$AV.push(c),a=e[++h]}n!==a?.index&&(o=b.nextNode(),n++)}return b.currentNode=_,i}p(t){let s=0;for(let e of this._$AV)e!==void 0&&(e.strings!==void 0?(e._$AI(t,e,s),s+=e.strings.length-2):e._$AI(t[s])),s++}},P=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,s,e,i){this.type=2,this._$AH=l,this._$AN=void 0,this._$AA=t,this._$AB=s,this._$AM=e,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,s=this._$AM;return s!==void 0&&t?.nodeType===11&&(t=s.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,s=this){t=A(this,t,s),M(t)?t===l||t==null||t===""?(this._$AH!==l&&this._$AR(),this._$AH=l):t!==this._$AH&&t!==x&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Pt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==l&&M(this._$AH)?this._$AA.nextSibling.data=t:this.T(_.createTextNode(t)),this._$AH=t}$(t){let{values:s,_$litType$:e}=t,i=typeof e=="number"?this._$AC(t):(e.el===void 0&&(e.el=T.createElement(vt(e.h,e.h[0]),this.options)),e);if(this._$AH?._$AD===i)this._$AH.p(s);else{let o=new q(i,this),n=o.u(this.options);o.p(s),this.T(n),this._$AH=o}}_$AC(t){let s=ft.get(t.strings);return s===void 0&&ft.set(t.strings,s=new T(t)),s}k(t){J(this._$AH)||(this._$AH=[],this._$AR());let s=this._$AH,e,i=0;for(let o of t)i===s.length?s.push(e=new r(this.O(k()),this.O(k()),this,this.options)):e=s[i],e._$AI(o),i++;i<s.length&&(this._$AR(e&&e._$AB.nextSibling,i),s.length=i)}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(!1,!0,s);t!==this._$AB;){let e=lt(t).nextSibling;lt(t).remove(),t=e}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},w=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,s,e,i,o){this.type=1,this._$AH=l,this._$AN=void 0,this.element=t,this.name=s,this._$AM=i,this.options=o,e.length>2||e[0]!==""||e[1]!==""?(this._$AH=Array(e.length-1).fill(new String),this.strings=e):this._$AH=l}_$AI(t,s=this,e,i){let o=this.strings,n=!1;if(o===void 0)t=A(this,t,s,0),n=!M(t)||t!==this._$AH&&t!==x,n&&(this._$AH=t);else{let h=t,a,c;for(t=o[0],a=0;a<o.length-1;a++)c=A(this,h[e+a],s,a),c===x&&(c=this._$AH[a]),n||=!M(c)||c!==this._$AH[a],c===l?t=l:t!==l&&(t+=(c??"")+o[a+1]),this._$AH[a]=c}n&&!i&&this.j(t)}j(t){t===l?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},B=class extends w{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===l?void 0:t}},W=class extends w{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==l)}},V=class extends w{constructor(t,s,e,i,o){super(t,s,e,i,o),this.type=5}_$AI(t,s=this){if((t=A(this,t,s,0)??l)===x)return;let e=this._$AH,i=t===l&&e!==l||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,o=t!==l&&(e===l||i);i&&this.element.removeEventListener(this.name,this,e),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},K=class{constructor(t,s,e){this.element=t,this.type=6,this._$AN=void 0,this._$AM=s,this.options=e}get _$AU(){return this._$AM._$AU}_$AI(t){A(this,t)}};var Ht=F.litHtmlPolyfillSupport;Ht?.(T,P),(F.litHtmlVersions??=[]).push("3.3.3");var $t=(r,t,s)=>{let e=s?.renderBefore??t,i=e._$litPart$;if(i===void 0){let o=s?.renderBefore??null;e._$litPart$=i=new P(t.insertBefore(k(),o),o,void 0,s??{})}return i._$AI(r),i};var Y=globalThis,g=class extends m{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let s=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=$t(s,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return x}};g._$litElement$=!0,g.finalized=!0,Y.litElementHydrateSupport?.({LitElement:g});var Ot=Y.litElementPolyfillSupport;Ot?.({LitElement:g});(Y.litElementVersions??=[]).push("4.2.2");var Q=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],bt=r=>r.map(t=>({...t,days:[...t.days]})),_t=(r,t=10,s=60)=>Array.isArray(r)&&r.length<=Math.min(10,t)&&r.every(e=>e&&typeof e=="object"&&Object.keys(e).sort().join(",")==="days,enabled,portions,time"&&Array.isArray(e.days)&&e.days.length===7&&new Set(e.days).size===7&&Q.every(i=>e.days.includes(i))&&typeof e.time=="string"&&/^([01]\d|2[0-3]):[0-5]\d$/.test(e.time)&&Number.isInteger(e.portions)&&e.portions>=1&&e.portions<=Math.min(60,s)&&typeof e.enabled=="boolean"),Z=(r,t)=>r.length===t.length&&r.every((s,e)=>s.time===t[e].time&&s.portions===t[e].portions&&s.enabled===t[e].enabled&&s.days.length===t[e].days.length&&s.days.every(i=>t[e].days.includes(i))),X=class extends g{constructor(){super(...arguments);this.draft=[];this.dirty=!1;this.conflict=!1;this.busy=!1;this.message="";this.dialogOpen=!1;this.editing=null;this.deleteConfirm=!1;this.infoOpen=!1;this.serviceCompleted=!1}static{this.properties={config:{state:!0},draft:{state:!0},dirty:{state:!0},conflict:{state:!0},busy:{state:!0},message:{state:!0},dialogOpen:{state:!0},editing:{state:!0},deleteConfirm:{state:!0},infoOpen:{state:!0}}}clearConfirmationTimer(){this.confirmationTimer&&clearTimeout(this.confirmationTimer),this.confirmationTimer=void 0}setConfig(s){if(!s.entity?.startsWith("sensor."))throw new Error("Select a schedule sensor");if(this.busy)throw new Error("Wait for schedule confirmation before changing entity");this.config={...s},this.dirty=!1,this.conflict=!1,this.load()}set hass(s){this._hass=s;let e=this.attrs;this.busy?e.error&&!e.pending?(this.clearConfirmationTimer(),this.busy=!1,this.message=String(e.error),this.conflict=!0):this.writable&&this.attrs.snapshot_source==="received"&&this.serviceCompleted&&!e.pending&&e.revision>this.base&&e.last_received_at!==this.sentAt&&this.sent?.length===e.meals.length&&this.sent?.every((i,o)=>i.time===e.meals[o].time&&i.portions===e.meals[o].portions&&i.enabled===e.meals[o].enabled)&&(this.busy=!1,this.dirty=!1,this.sent=void 0,this.clearConfirmationTimer(),this.load(),this.message="Schedule confirmed by incoming device report."):this.dirty&&e.revision!==this.base?(this.conflict=!0,this.message="Schedule changed while editing. Reload explicitly before saving.",this.closeDialog(),this.closeEditor()):this.dirty||this.load(),this.requestUpdate()}get hass(){return this._hass}get attrs(){return this._hass?.states[this.config?.entity]?.attributes??{}}get writable(){let s=this._hass?.states[this.config?.entity],e=this.attrs;return!!s&&!["unknown","unavailable"].includes(s.state)&&(e.supports_schedule_write===!0&&e.snapshot_source==="received"||e.supports_restored_schedule_write===!0&&e.snapshot_source==="restored"&&e.requires_restored_snapshot_acknowledgement===!0)&&e.supported_days_mode==="every_day"&&Number.isSafeInteger(e.revision)&&e.revision>0&&typeof e.last_received_at=="string"&&!!e.last_received_at&&Number.isFinite(Date.parse(e.last_received_at))&&e.schedule_valid===!0&&e.pending===!1&&!e.error&&Number.isInteger(e.max_meals)&&e.max_meals>0&&Number.isInteger(e.max_portions)&&e.max_portions>0&&_t(e.meals,e.max_meals,e.max_portions)}get locked(){return!this.writable||this.conflict||this.busy}load(){if(!this.config)return;let s=this.attrs;this.base=s.revision,this.draft=Array.isArray(s.meals)?s.meals.map(e=>({...e,days:e.days==="Everyday"?[...Q]:Array.isArray(e.days)?[...e.days]:[]})):[],this.requestUpdate()}edit(s,e,i){this.locked||(this.draft=this.draft.map((o,n)=>n===s?{...o,[e]:i}:o),this.dirty=!Z(this.draft,this.attrs.meals))}add(){this.locked||this.draft.length>=Math.min(10,this.attrs.max_meals)||(this.draft=[...this.draft,{days:[...Q],time:"23:59",portions:1,enabled:!1}],this.dirty=!0)}reset(){this.busy||(this.dirty=!1,this.conflict=!1,this.message="",this.closeDialog(),this.closeEditor(),this.load())}get saveable(){return!this.locked&&this.dirty&&!Z(this.draft,this.attrs.meals)&&_t(this.draft,this.attrs.max_meals,this.attrs.max_portions)}async review(){if(!this.saveable)return;this.dialogOpen=!0,await this.updateComplete;let s=this.renderRoot.querySelector("dialog[data-review]");s.showModal(),s.querySelector("[data-cancel]")?.focus()}closeDialog(){this.renderRoot.querySelector("dialog[data-review]")?.close(),this.dialogOpen=!1,this.renderRoot.querySelector("[data-save]")?.focus()}async confirm(){if(this.saveable){this.sent=bt(this.draft),this.sentAt=this.attrs.last_received_at,this.serviceCompleted=!1,this.busy=!0,this.clearConfirmationTimer(),this.confirmationTimer=setTimeout(()=>{this.busy&&(this.busy=!1,this.conflict=!0,this.message="Confirmation timed out. Draft retained; check incoming state and reload before trying again. No retry was sent.",this.requestUpdate())},2e4),this.closeDialog(),this.message="Awaiting confirmed incoming schedule. An empty acknowledgement is not confirmation.";try{let s=await this.hass.callService("tuya_feeder","set_schedule",{entity_id:this.config.entity,expected_revision:this.base,meals:bt(this.sent),...this.attrs.snapshot_source==="restored"?{acknowledge_restored_snapshot:!0}:{}});s?.error&&this.busy?(this.clearConfirmationTimer(),this.busy=!1,this.conflict=!0,this.message=String(s.error)):this.busy&&(this.serviceCompleted=!0,this.hass=this.hass)}catch(s){if(!this.busy)return;this.clearConfirmationTimer(),this.busy=!1,this.conflict=!0,this.message=`Save failed: ${String(s)}. Reload before retrying.`}}}static getConfigElement(){return document.createElement("tuya-feeder-card-editor")}static getStubConfig(){return{entity:"",title:"Feeder schedule",icon:"mdi:calendar-clock"}}getCardSize(){return 2+this.draft.length}getGridOptions(){return{columns:12,min_columns:6}}async openEditor(s){this.locked||(this.editing=s,this.deleteConfirm=!1,await this.updateComplete,this.renderRoot.querySelector("dialog[data-editor]")?.showModal())}closeEditor(){let s=this.editing;this.renderRoot.querySelector("dialog[data-editor]")?.close(),this.editing=null,this.deleteConfirm=!1,s!==null&&this.renderRoot.querySelector(`[data-meal="${s}"]`)?.focus()}removeMeal(){this.locked||this.editing===null||!this.deleteConfirm||(this.draft=this.draft.filter((s,e)=>e!==this.editing),this.dirty=!Z(this.draft,this.attrs.meals),this.closeEditor())}render(){if(!this.config)return l;let s=this.editing,e=s===null?void 0:this.draft[s];return u`<ha-card>
      <header>
        <div>
          <h2>${this.config.title??"Feeder schedule"}</h2>
          <small>Device-owned · Every day</small>
        </div>
        <button
          class="info"
          aria-label="Schedule information"
          @click=${()=>this.infoOpen=!this.infoOpen}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 10v7" />
            <circle cx="12" cy="7" r=".8" fill="currentColor" stroke="none" />
          </svg>
        </button>
      </header>
      ${this.infoOpen?u`<aside>
              <p>
                Last locally reported snapshot, not an active query. External
                app changes may be stale until a new local report.
              </p>
              <p>
                Source: ${this.attrs.snapshot_source??"unknown"} · Revision:
                ${this.attrs.revision??0}<br />Received:
                ${this.attrs.last_received_at??"Not yet received"}
              </p>
              <p>
                Saved sources are manually trusted HA metadata, not fresh device
                evidence. Import a selected passive LAN DP1 sensor with the
                integration's Import snapshot action.
              </p>
            </aside>`:l}
      <section aria-label="Schedule draft" ?inert=${this.busy}>
        ${this.draft.map((i,o)=>u`<div class="meal">
              <button
                class="open"
                data-meal=${o}
                aria-label=${`Edit meal ${o+1}`}
                ?disabled=${this.locked}
                @click=${()=>this.openEditor(o)}
              >
                <span class="time">${i.time}</span
                ><span class="detail"
                  >Every day ·
                  <span aria-label=${`Portions ${o+1}`}
                    >${i.portions}</span
                  >
                  portion${i.portions===1?"":"s"}</span
                >
              </button>
              <input
                class="switch"
                type="checkbox"
                role="switch"
                aria-label=${`Enabled ${o+1}`}
                ?disabled=${this.locked}
                .checked=${i.enabled===!0}
                @change=${n=>this.edit(o,"enabled",n.target.checked)}
              />
            </div>`)}
        <button
          class="add accent"
          aria-label="Add disabled meal"
          ?disabled=${this.locked||this.draft.length>=Math.min(10,this.attrs.max_meals??10)}
          @click=${this.add}
        >
          Add meal
        </button>
      </section>
      <div class="status" role="status">
        ${this.message||(this.busy?"Awaiting device report\u2026":this.dirty?"Unsaved changes":this.attrs.snapshot_source==="restored"?"Saved schedule \xB7 confirmation required to overwrite":this.writable?"Changes stay local until Save":"No editable snapshot \xB7 see information")}
      </div>
      ${this.dirty||this.conflict?u`<footer><button @click=${this.reset} ?disabled=${this.busy}>${this.conflict?"Reload schedule":"Reset draft"}</button>${this.dirty?u`<button data-save class="accent" ?disabled=${!this.saveable} @click=${this.review}>Save</button>`:l}</footer>`:l}
      ${e&&s!==null?u`<dialog
              data-editor
              aria-labelledby="editor-title"
              @cancel=${i=>{i.preventDefault(),this.closeEditor()}}
            >
              <h2 id="editor-title">Edit meal</h2>
              <fieldset ?disabled=${this.locked}>
                <label class="field"
                  >Time<input
                    type="time"
                    aria-label=${`Time ${s+1}`}
                    .value=${e.time}
                    @input=${i=>this.edit(s,"time",i.target.value)}
                /></label>
                <div class="field">
                  <span>Portions</span>
                  <div class="stepper">
                    <button
                      aria-label=${`Decrease portions ${s+1}`}
                      ?disabled=${e.portions<=1}
                      @click=${()=>this.edit(s,"portions",e.portions-1)}
                    >
                      −</button
                    ><output>${e.portions}</output
                    ><button
                      aria-label=${`Increase portions ${s+1}`}
                      ?disabled=${e.portions>=Math.min(60,this.attrs.max_portions??60)}
                      @click=${()=>this.edit(s,"portions",e.portions+1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <label class="field"
                  >Enabled<input
                    class="switch"
                    type="checkbox"
                    role="switch"
                    aria-label="Meal enabled"
                    .checked=${e.enabled===!0}
                    @change=${i=>this.edit(s,"enabled",i.target.checked)}
                /></label>
                <div class="field">
                  <span>Repeat</span><span>Every day</span>
                </div>
                ${this.deleteConfirm?u`<p>
                          Remove this meal from the draft? The device is
                          unchanged until Confirm Save.
                        </p>
                        <div class="dialog-actions">
                          <button @click=${()=>this.deleteConfirm=!1}>
                            Keep meal</button
                          ><button class="danger" @click=${this.removeMeal}>
                            Confirm Delete
                          </button>
                        </div>`:u`<button
                        class="danger delete"
                        @click=${()=>this.deleteConfirm=!0}
                      >
                        Delete meal
                      </button>`}
              </fieldset>
              <div class="dialog-actions">
                <button class="accent" @click=${this.closeEditor}>Done</button>
              </div>
            </dialog>`:l}
      ${this.dialogOpen?u`<dialog
              data-review
              aria-labelledby="confirm-title"
              @cancel=${i=>{i.preventDefault(),this.closeDialog()}}
            >
              <h2 id="confirm-title">Replace device schedule?</h2>
              <p>
                The complete plan below replaces the device plan. No immediate
                feeding command is sent.
              </p>
              ${this.attrs.snapshot_source==="restored"?u`<p class="historical">Based on saved schedule from ${this.attrs.last_received_at}. External app changes could be overwritten. Confirm Save explicitly accepts this historical baseline.</p>`:l}
              <ol>
                ${this.draft.map(i=>u`<li>Every day · ${i.time} · ${i.portions} portion${i.portions===1?"":"s"} · ${i.enabled?"Enabled":"Disabled"}</li>`)}
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
            </dialog>`:l}
    </ha-card>`}static{this.styles=L`
    :host {
      display: block;
      color: var(--primary-text-color, #222);
      font-family: var(--ha-font-family-body, system-ui);
      font-size: 14px;
    }
    * {
      box-sizing: border-box;
    }
    ha-card {
      display: block;
      padding: 18px;
      background: var(--card-background-color, var(--ha-card-background, #fff));
      border-radius: var(--ha-card-border-radius, 20px);
      border: 1px solid var(--divider-color, #ddd);
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      gap: 12px;
    }
    h2 {
      font-size: 23px;
      letter-spacing: -0.6px;
      margin: 0 0 6px;
      font-weight: 600;
    }
    small,
    .status,
    .detail {
      color: var(--secondary-text-color, #666);
    }
    .info {
      font-size: 22px;
      width: 44px;
      padding: 0;
      flex-shrink: 0;
    }
    .meal {
      display: flex;
      align-items: center;
      gap: 12px;
      border: 1px solid var(--divider-color, #ddd);
      background: var(--secondary-background-color, #f9f9fb);
      border-radius: 20px;
      margin: 10px 0;
      overflow: hidden;
    }
    .open {
      flex: 1;
      min-width: 0;
      text-align: left;
      padding: 18px 20px;
      border-radius: 0;
    }
    .time {
      display: block;
      font-size: 34px;
      letter-spacing: -1px;
      line-height: 1.15;
      font-variant-numeric: tabular-nums;
    }
    .detail {
      display: block;
      font-size: 13px;
      margin-top: 7px;
    }
    button {
      min-height: 44px;
      border: 0;
      border-radius: 24px;
      background: transparent;
      color: inherit;
      font: inherit;
      padding: 10px 16px;
      cursor: pointer;
      touch-action: manipulation;
      transition: none;
      transform: none;
    }
    button:disabled {
      opacity: 0.4;
      cursor: default;
    }
    button:focus-visible,
    input:focus-visible {
      outline: 2px solid var(--primary-color, #f4a631);
      outline-offset: 2px;
    }
    .accent {
      background: var(--primary-color, #f4a631);
      color: var(--text-primary-color, #241907);
      font-weight: 600;
    }
    .add {
      width: 100%;
      margin-top: 16px;
    }
    .status {
      font-size: 12px;
      line-height: 1.5;
      margin-top: 14px;
      min-height: 18px;
      overflow-wrap: anywhere;
    }
    footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
      gap: 10px;
    }
    footer > button:first-child {
      color: var(--secondary-text-color, #666);
    }
    .switch {
      appearance: none;
      width: 49px;
      height: 44px;
      flex: 0 0 49px;
      margin: 0 18px 0 0;
      border-radius: 22px;
      background: linear-gradient(
          var(--disabled-text-color, #aaa),
          var(--disabled-text-color, #aaa)
        )
        center/49px 30px no-repeat;
      position: relative;
      cursor: pointer;
    }
    .switch:after {
      content: "";
      position: absolute;
      left: 3px;
      top: 10px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: white;
    }
    .switch:checked {
      background: linear-gradient(
          var(--primary-color, #f4a631),
          var(--primary-color, #f4a631)
        )
        center/49px 30px no-repeat;
    }
    .switch:checked:after {
      left: 22px;
    }
    .switch:disabled {
      opacity: 0.4;
      cursor: default;
    }
    dialog {
      width: 380px;
      max-width: calc(100vw - 30px);
      max-height: calc(100dvh - 30px);
      overflow: auto;
      padding: 22px;
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 24px;
      background: var(--card-background-color, #fff);
      color: inherit;
    }
    dialog::backdrop {
      background: #0007;
    }
    dialog h2 {
      font-size: 21px;
      margin: 0 0 20px;
    }
    .field {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 0;
      border-bottom: 1px solid var(--divider-color, #ddd);
      gap: 12px;
    }
    fieldset {
      border: 0;
      margin: 0;
      padding: 0;
      min-width: 0;
    }
    input[type="time"] {
      color: inherit;
      background: transparent;
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 10px;
      padding: 8px;
      font: inherit;
      min-height: 44px;
      max-width: 160px;
    }
    .stepper {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .stepper button {
      width: 44px;
      height: 44px;
      padding: 0;
      font-size: 22px;
      background: var(--secondary-background-color, #f2f2f7);
    }
    .stepper output {
      min-width: 24px;
      text-align: center;
      font-size: 20px;
      font-variant-numeric: tabular-nums;
    }
    .field .switch {
      margin: 0;
    }
    .danger {
      color: var(--error-color, #d83232);
    }
    .delete {
      width: 100%;
      text-align: left;
      margin: 10px 0;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 16px;
    }
    p,
    li {
      line-height: 1.6;
      overflow-wrap: anywhere;
    }
    ol {
      padding-left: 20px;
    }
    aside {
      font-size: 12px;
      color: var(--secondary-text-color, #666);
    }
    [inert] {
      pointer-events: none;
    }
  `}},tt=class extends g{static{this.properties={hass:{attribute:!1},config:{state:!0}}}setConfig(t){this.config={...t}}render(){return u`<ha-form
      .hass=${this.hass}
      .data=${this.config}
      .schema=${[{name:"entity",required:!0,selector:{entity:{domain:"sensor"}}},{name:"title",selector:{text:{}}},{name:"icon",selector:{icon:{}}}]}
      .computeLabel=${t=>t.name==="entity"?"Schedule sensor":t.name==="title"?"Title":"Icon"}
      @value-changed=${t=>{this.config={...this.config,...t.detail.value},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this.config},bubbles:!0,composed:!0}))}}
    ></ha-form>`}};customElements.define("tuya-feeder-card",X);customElements.define("tuya-feeder-card-editor",tt);var et=window;et.customCards=et.customCards||[];et.customCards.push({type:"tuya-feeder-card",name:"Tuya Feeder Schedule",description:"Draft and confirm a device-owned daily schedule. No feed actions.",documentationURL:"https://github.com/myevit/tuya-feeder-card"});export{X as TuyaFeederCard};
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
