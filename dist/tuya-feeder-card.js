var B=globalThis,O=B.ShadowRoot&&(B.ShadyCSS===void 0||B.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,F=Symbol(),oe=new WeakMap,E=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==F)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(O&&e===void 0){let i=t!==void 0&&t.length===1;i&&(e=oe.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&oe.set(t,e))}return e}toString(){return this.cssText}},de=a=>new E(typeof a=="string"?a:a+"",void 0,F),j=(a,...e)=>{let t=a.length===1?a[0]:e.reduce((i,s,r)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+a[r+1],a[0]);return new E(t,a,F)},le=(a,e)=>{if(O)a.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let i=document.createElement("style"),s=B.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=t.cssText,a.appendChild(i)}},q=O?a=>a:a=>a instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return de(t)})(a):a;var{is:Se,defineProperty:Ce,getOwnPropertyDescriptor:Pe,getOwnPropertyNames:Te,getOwnPropertySymbols:ze,getPrototypeOf:Ne}=Object,I=globalThis,he=I.trustedTypes,De=he?he.emptyScript:"",Me=I.reactiveElementPolyfillSupport,S=(a,e)=>a,W={toAttribute(a,e){switch(e){case Boolean:a=a?De:null;break;case Object:case Array:a=a==null?a:JSON.stringify(a)}return a},fromAttribute(a,e){let t=a;switch(e){case Boolean:t=a!==null;break;case Number:t=a===null?null:Number(a);break;case Object:case Array:try{t=JSON.parse(a)}catch{t=null}}return t}},pe=(a,e)=>!Se(a,e),ce={attribute:!0,type:String,converter:W,reflect:!1,useDefault:!1,hasChanged:pe};Symbol.metadata??=Symbol("metadata"),I.litPropertyMetadata??=new WeakMap;var b=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ce){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(e,i,t);s!==void 0&&Ce(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){let{get:s,set:r}=Pe(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:s,set(n){let d=s?.call(this);r?.call(this,n),this.requestUpdate(e,d,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ce}static _$Ei(){if(this.hasOwnProperty(S("elementProperties")))return;let e=Ne(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(S("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(S("properties"))){let t=this.properties,i=[...Te(t),...ze(t)];for(let s of i)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[i,s]of t)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let s=this._$Eu(t,i);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let s of i)t.unshift(q(s))}else e!==void 0&&t.push(q(e));return t}static _$Eu(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return le(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){let i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(s!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:W).toAttribute(t,i.type);this._$Em=e,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(e,t){let i=this.constructor,s=i._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let r=i.getPropertyOptions(s),n=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:W;this._$Em=s;let d=n.fromAttribute(t,r.type);this[s]=d??this._$Ej?.get(s)??d,this._$Em=null}}requestUpdate(e,t,i,s=!1,r){if(e!==void 0){let n=this.constructor;if(s===!1&&(r=this[e]),i??=n.getPropertyOptions(e),!((i.hasChanged??pe)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:r},n){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),r!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,r]of i){let{wrapped:n}=r,d=this[s];n!==!0||this._$AL.has(s)||d===void 0||this.C(s,void 0,r,d)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[S("elementProperties")]=new Map,b[S("finalized")]=new Map,Me?.({ReactiveElement:b}),(I.reactiveElementVersions??=[]).push("2.1.2");var Q=globalThis,ue=a=>a,L=Q.trustedTypes,fe=L?L.createPolicy("lit-html",{createHTML:a=>a}):void 0,_e="$lit$",y=`lit$${Math.random().toFixed(9).slice(2)}$`,$e="?"+y,Re=`<${$e}>`,$=document,P=()=>$.createComment(""),T=a=>a===null||typeof a!="object"&&typeof a!="function",X=Array.isArray,Ue=a=>X(a)||typeof a?.[Symbol.iterator]=="function",V=`[ 	
\f\r]`,C=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,me=/-->/g,ge=/>/g,v=RegExp(`>|${V}(?:([^\\s"'>=/]+)(${V}*=${V}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),be=/'/g,ye=/"/g,xe=/^(?:script|style|textarea|title)$/i,ee=a=>(e,...t)=>({_$litType$:a,strings:e,values:t}),u=ee(1),qe=ee(2),We=ee(3),x=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),ve=new WeakMap,_=$.createTreeWalker($,129);function we(a,e){if(!X(a)||!a.hasOwnProperty("raw"))throw Error("invalid template strings array");return fe!==void 0?fe.createHTML(e):e}var He=(a,e)=>{let t=a.length-1,i=[],s,r=e===2?"<svg>":e===3?"<math>":"",n=C;for(let d=0;d<t;d++){let o=a[d],c,p,l=-1,f=0;for(;f<o.length&&(n.lastIndex=f,p=n.exec(o),p!==null);)f=n.lastIndex,n===C?p[1]==="!--"?n=me:p[1]!==void 0?n=ge:p[2]!==void 0?(xe.test(p[2])&&(s=RegExp("</"+p[2],"g")),n=v):p[3]!==void 0&&(n=v):n===v?p[0]===">"?(n=s??C,l=-1):p[1]===void 0?l=-2:(l=n.lastIndex-p[2].length,c=p[1],n=p[3]===void 0?v:p[3]==='"'?ye:be):n===ye||n===be?n=v:n===me||n===ge?n=C:(n=v,s=void 0);let g=n===v&&a[d+1].startsWith("/>")?" ":"";r+=n===C?o+Re:l>=0?(i.push(c),o.slice(0,l)+_e+o.slice(l)+y+g):o+y+(l===-2?d:g)}return[we(a,r+(a[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},z=class a{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let r=0,n=0,d=e.length-1,o=this.parts,[c,p]=He(e,t);if(this.el=a.createElement(c,i),_.currentNode=this.el.content,t===2||t===3){let l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;(s=_.nextNode())!==null&&o.length<d;){if(s.nodeType===1){if(s.hasAttributes())for(let l of s.getAttributeNames())if(l.endsWith(_e)){let f=p[n++],g=s.getAttribute(l).split(y),H=/([.?@])?(.*)/.exec(f);o.push({type:1,index:r,name:H[2],strings:g,ctor:H[1]==="."?K:H[1]==="?"?G:H[1]==="@"?J:A}),s.removeAttribute(l)}else l.startsWith(y)&&(o.push({type:6,index:r}),s.removeAttribute(l));if(xe.test(s.tagName)){let l=s.textContent.split(y),f=l.length-1;if(f>0){s.textContent=L?L.emptyScript:"";for(let g=0;g<f;g++)s.append(l[g],P()),_.nextNode(),o.push({type:2,index:++r});s.append(l[f],P())}}}else if(s.nodeType===8)if(s.data===$e)o.push({type:2,index:r});else{let l=-1;for(;(l=s.data.indexOf(y,l+1))!==-1;)o.push({type:7,index:r}),l+=y.length-1}r++}}static createElement(e,t){let i=$.createElement("template");return i.innerHTML=e,i}};function w(a,e,t=a,i){if(e===x)return e;let s=i!==void 0?t._$Co?.[i]:t._$Cl,r=T(e)?void 0:e._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),r===void 0?s=void 0:(s=new r(a),s._$AT(a,t,i)),i!==void 0?(t._$Co??=[])[i]=s:t._$Cl=s),s!==void 0&&(e=w(a,s._$AS(a,e.values),s,i)),e}var Z=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??$).importNode(t,!0);_.currentNode=s;let r=_.nextNode(),n=0,d=0,o=i[0];for(;o!==void 0;){if(n===o.index){let c;o.type===2?c=new N(r,r.nextSibling,this,e):o.type===1?c=new o.ctor(r,o.name,o.strings,this,e):o.type===6&&(c=new Y(r,this,e)),this._$AV.push(c),o=i[++d]}n!==o?.index&&(r=_.nextNode(),n++)}return _.currentNode=$,s}p(e){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},N=class a{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=w(this,e,t),T(e)?e===h||e==null||e===""?(this._$AH!==h&&this._$AR(),this._$AH=h):e!==this._$AH&&e!==x&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ue(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==h&&T(this._$AH)?this._$AA.nextSibling.data=e:this.T($.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:i}=e,s=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=z.createElement(we(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{let r=new Z(s,this),n=r.u(this.options);r.p(t),this.T(n),this._$AH=r}}_$AC(e){let t=ve.get(e.strings);return t===void 0&&ve.set(e.strings,t=new z(e)),t}k(e){X(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,s=0;for(let r of e)s===t.length?t.push(i=new a(this.O(P()),this.O(P()),this,this.options)):i=t[s],i._$AI(r),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let i=ue(e).nextSibling;ue(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},A=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,r){this.type=1,this._$AH=h,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=h}_$AI(e,t=this,i,s){let r=this.strings,n=!1;if(r===void 0)e=w(this,e,t,0),n=!T(e)||e!==this._$AH&&e!==x,n&&(this._$AH=e);else{let d=e,o,c;for(e=r[0],o=0;o<r.length-1;o++)c=w(this,d[i+o],t,o),c===x&&(c=this._$AH[o]),n||=!T(c)||c!==this._$AH[o],c===h?e=h:e!==h&&(e+=(c??"")+r[o+1]),this._$AH[o]=c}n&&!s&&this.j(e)}j(e){e===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},K=class extends A{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===h?void 0:e}},G=class extends A{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==h)}},J=class extends A{constructor(e,t,i,s,r){super(e,t,i,s,r),this.type=5}_$AI(e,t=this){if((e=w(this,e,t,0)??h)===x)return;let i=this._$AH,s=e===h&&i!==h||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==h&&(i===h||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Y=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){w(this,e)}};var Be=Q.litHtmlPolyfillSupport;Be?.(z,N),(Q.litHtmlVersions??=[]).push("3.3.3");var Ae=(a,e,t)=>{let i=t?.renderBefore??e,s=i._$litPart$;if(s===void 0){let r=t?.renderBefore??null;i._$litPart$=s=new N(e.insertBefore(P(),r),r,void 0,t??{})}return s._$AI(a),s};var te=globalThis,m=class extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ae(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return x}};m._$litElement$=!0,m.finalized=!0,te.litElementHydrateSupport?.({LitElement:m});var Oe=te.litElementPolyfillSupport;Oe?.({LitElement:m});(te.litElementVersions??=[]).push("4.2.2");async function D(){if(!["ha-dialog","ha-form","ha-button","ha-dialog-footer"].every(a=>customElements.get(a))){let a=await window.loadCardHelpers?.();if(!a)throw new Error("Home Assistant dialog controls are unavailable");await(await a.createCardElement({type:"entities",entities:[]})).constructor.getConfigElement?.()}if(!["ha-dialog","ha-form","ha-button","ha-dialog-footer"].every(a=>customElements.get(a)))throw new Error("Home Assistant dialog controls are unavailable")}function M(a){a.dispatchEvent(new CustomEvent("show-dialog",{bubbles:!0,composed:!0,detail:{dialogTag:"tuya-feeder-meal-dialog",dialogImport:()=>Promise.resolve(),dialogParams:{owner:a}}}))}var ie=class extends m{constructor(){super(...arguments);this.open=!1}static{this.properties={hass:{attribute:!1},owner:{state:!0},open:{state:!0}}}async showDialog(t){this.owner=t.owner,this.owner.nativeDialog=this,this.open=!0,await this.updateComplete}invalidate(){this.open&&(this.open=!1,this.owner.nativeDialog=void 0,this.dispatchEvent(new CustomEvent("dialog-closed",{bubbles:!0,composed:!0,detail:{dialog:this.localName}})))}closeDialog(){return this.dismiss(),!0}dismiss(){this.open&&(this.open=!1,this.owner.nativeDialog=void 0,this.owner.view==="delete"&&!this.owner.busy&&(this.owner.view="edit"),this.owner.cancel(),this.dispatchEvent(new CustomEvent("dialog-closed",{bubbles:!0,composed:!0,detail:{dialog:this.localName}})))}save(){!this.renderRoot.querySelector("ha-form")?.reportValidity?.()||!this.owner.saveable||(this.owner.save(),this.dismiss())}render(){let t=this.owner,i=t?.draft[t?.editing];if(t?.view==="feed")return u`<ha-dialog
        .open=${this.open}
        header-title=${`Feed ${t.feedDose} portions?`}
        @closed=${this.dismiss}
        ><p>This dispenses food immediately.</p>
        <ha-dialog-footer slot="footer"
          ><ha-button
            slot="secondaryAction"
            appearance="plain"
            @click=${this.dismiss}
            >Cancel</ha-button
          ><ha-button
            slot="primaryAction"
            ?disabled=${!t.feedReady}
            @click=${()=>{t.feed(),this.dismiss()}}
            >Feed now</ha-button
          ></ha-dialog-footer
        ></ha-dialog
      >`;if(!t||!i)return h;let s=t.view==="delete",r=[{name:"time",required:!0,selector:{time:{no_second:!0}}},{name:"portions",required:!0,selector:{number:{min:1,max:Math.min(60,t.attrs.max_portions??60),step:1,mode:"box"}}},{name:"enabled",selector:{boolean:{}}},...t.attrs.snapshot_source==="restored"?[{name:"acknowledged",selector:{boolean:{}}}]:[]];return u`<ha-dialog
      .open=${this.open}
      .headerTitle=${s?"Delete meal?":t.operation==="add_meal"?"Add meal":"Edit meal"}
      @closed=${this.dismiss}
    >
      ${s?u`<p>Delete ${i.time} · ${i.portions} portions?</p>`:u`<ha-form
              autofocus
              .hass=${this.hass??t.hass}
              .locale=${(this.hass??t.hass).locale}
              .data=${{time:i.time,portions:i.portions,enabled:i.enabled,acknowledged:t.acknowledged}}
              .schema=${r}
              .computeLabel=${n=>({time:"Time",portions:"Portions",enabled:"Enabled",acknowledged:"Use saved plan?"})[n.name]}
              @value-changed=${n=>{let d=n.detail.value;t.edit("time",d.time?.slice(0,5)),t.edit("portions",d.portions),t.edit("enabled",d.enabled),t.acknowledged=d.acknowledged===!0,this.requestUpdate()}}
            ></ha-form>`}
      <ha-dialog-footer slot="footer">
        ${!s&&t.operation!=="add_meal"?u`<ha-button
                slot="secondaryAction"
                appearance="plain"
                variant="danger"
                @click=${()=>{t.view="delete",this.requestUpdate()}}
                >Delete</ha-button
              >`:h}
        <ha-button
          slot="secondaryAction"
          appearance="plain"
          @click=${()=>{s?(t.view="edit",this.requestUpdate()):this.dismiss()}}
          >Cancel</ha-button
        >
        <ha-button
          slot="primaryAction"
          variant=${s?"danger":"brand"}
          ?disabled=${s?t.locked||t.attrs.snapshot_source==="restored"&&!t.acknowledged:!t.saveable}
          @click=${()=>{s?(t.save(!0),this.dismiss()):this.save()}}
          >${s?"Delete":"Save"}</ha-button
        >
      </ha-dialog-footer>
    </ha-dialog>`}};customElements.define("tuya-feeder-meal-dialog",ie);var ke=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],R=a=>a.map(e=>({...e,days:[...e.days]})),U=(a,e=10,t=60)=>Array.isArray(a)&&a.length<=Math.min(10,e)&&a.every(i=>i&&typeof i=="object"&&Object.keys(i).sort().join(",")==="days,enabled,portions,time"&&Array.isArray(i.days)&&i.days.length===7&&new Set(i.days).size===7&&ke.every(s=>i.days.includes(s))&&typeof i.time=="string"&&/^([01]\d|2[0-3]):[0-5]\d$/.test(i.time)&&Number.isInteger(i.portions)&&i.portions>=1&&i.portions<=Math.min(60,t)&&typeof i.enabled=="boolean"),k=(a,e)=>a.length===e.length&&a.every((t,i)=>t.time===e[i].time&&t.portions===e[i].portions&&t.enabled===e[i].enabled&&t.days.length===e[i].days.length&&t.days.every(s=>e[i].days.includes(s))),ne=["accent_color","border_radius","font_family","header_font_size","meal_time_font_size","row_background","card_background","control_size"];function Ee(a={}){let e={},t={accent_color:"color",border_radius:"border-radius",font_family:"font-family",header_font_size:"font-size",meal_time_font_size:"font-size",row_background:"background-color",card_background:"background-color",control_size:"width"};for(let i of ne){let s=a[i];if(!(s===void 0||s==="")){if(typeof s!="string"||s.length>160||/[;{}<>\\]|url\s*\(|expression\s*\(|!important|\/\*/i.test(s)||!CSS.supports(t[i],s))throw new Error(`Invalid appearance.${i}`);e[i]=s}}return e}var se=class extends m{constructor(){super(...arguments);this.draft=[];this.editing=null;this.view="list";this.busy=!1;this.feedBusy=!1;this.helperBusy=!1;this.message="";this.conflict=!1;this.acknowledged=!1;this.feedPortions=1;this.base=0;this.baseline=[];this.serviceCompleted=!1;this.attempt=0;this.failed=!1;this.toggling=null;this.operation="update_meal"}static{this.properties={config:{state:!0},draft:{state:!0},editing:{state:!0},view:{state:!0},busy:{state:!0},message:{state:!0},conflict:{state:!0},acknowledged:{state:!0},feedPortions:{state:!0},feedBusy:{state:!0},helperBusy:{state:!0}}}setConfig(t){if(!t.entity?.startsWith("sensor."))throw new Error("Select a schedule sensor");if(t.portions_entity&&!t.portions_entity.startsWith("input_number."))throw new Error("Select a portions helper");if(this.busy||this.feedBusy)throw new Error("Wait for completion before changing config");this.config={...t,appearance:Ee(t.appearance)};for(let i of ne){this.style.removeProperty(`--feeder-${i.replaceAll("_","-")}`);let s=this.config.appearance?.[i];s&&this.style.setProperty(`--feeder-${i.replaceAll("_","-")}`,s)}this.reset()}set hass(t){this._hass=t;let i=this.attrs;this.busy?i.error&&!i.pending?this.failure(i.error):this.toggling!==null&&i.revision>this.base&&this.sent&&U(i.meals,i.max_meals,i.max_portions)&&!k(this.sent,i.meals)?this.failure("Schedule changed during update"):this.serviceCompleted&&this.writable&&i.snapshot_source==="received"&&i.revision>this.base&&Date.parse(i.last_received_at)>Date.parse(this.sentAt??"")&&this.sent&&k(this.sent,i.meals)&&(this.clearTimer(),this.busy=!1,this.failed=!1,this.sent=void 0,this.toggling=null,this.editing=null,this.load(),this.message="Saved"):this.editing!==null||this.failed?(i.revision!==this.base||!this.writable||!k(this.baseline,i.meals))&&(this.conflict=!0,this.view="list",this.message="Schedule changed. Reload to continue.",this.nativeDialog?.invalidate()):this.load(),this.nativeDialog?.requestUpdate(),this.requestUpdate()}get hass(){return this._hass}get attrs(){return this._hass?.states[this.config?.entity]?.attributes??{}}get writable(){let t=this._hass?.states[this.config?.entity],i=this.attrs;return!!t&&(!this._hass?.services||["update_meal","add_meal","delete_meal"].every(s=>!!this._hass?.services?.tuya_feeder?.[s]))&&!["unknown","unavailable"].includes(t.state)&&(i.supports_schedule_write===!0&&i.snapshot_source==="received"||i.supports_restored_schedule_write===!0&&i.snapshot_source==="restored"&&i.requires_restored_snapshot_acknowledgement===!0)&&i.supported_days_mode==="every_day"&&Number.isSafeInteger(i.revision)&&i.revision>0&&typeof i.last_received_at=="string"&&Number.isFinite(Date.parse(i.last_received_at))&&i.schedule_valid===!0&&i.pending===!1&&!i.error&&Number.isInteger(i.max_meals)&&i.max_meals>0&&Number.isInteger(i.max_portions)&&i.max_portions>0&&U(i.meals,i.max_meals,i.max_portions)}get scheduleActive(){let t=this._hass?.states[this.config?.entity],i=this.attrs;return!!t&&!["unknown","unavailable"].includes(t.state)&&i.schedule_valid===!0&&["received","restored"].includes(i.snapshot_source)&&U(i.meals,i.max_meals,i.max_portions)&&i.meals.some(s=>s.enabled===!0)}get locked(){return!this.writable||this.conflict||this.busy||this.feedBusy||this.attrs.feeding_pending===!0}load(){this.base=this.attrs.revision,this.baseline=U(this.attrs.meals,this.attrs.max_meals,this.attrs.max_portions)?R(this.attrs.meals):[],this.draft=R(this.baseline)}reset(){this.busy||this.feedBusy||(this.editing=null,this.view="list",this.conflict=!1,this.failed=!1,this.toggling=null,this.message="",this.acknowledged=!1,this.load())}async openEditor(t,i){if(!(this.locked||this.view!=="list")){this.load(),this.operation="update_meal",this.editing=t,this.view="edit",this.acknowledged=!1,this.message="",i!==void 0&&this.edit("enabled",i);try{await D(),M(this)}catch(s){this.view="list",this.message="Couldn\u2019t open editor. Refresh Home Assistant.",console.error(s)}}}async toggle(t,i){let s=i.target,r=s.tagName==="BUTTON"?!this.baseline[t]?.enabled:s.checked;s.checked=this.busy&&this.toggling===t?this.sent?.[t].enabled??!1:this.baseline[t]?.enabled??!1,!(this.locked||this.failed||this.view!=="list")&&(this.load(),!(!this.baseline[t]||this.baseline[t].enabled===r)&&(this.operation="update_meal",this.editing=t,this.toggling=t,this.acknowledged=this.attrs.snapshot_source==="restored",this.edit("enabled",r),await this.save()))}async add(){if(!(this.locked||this.view!=="list"||this.baseline.length>=Math.min(10,this.attrs.max_meals))){this.load(),this.editing=this.draft.length,this.operation="add_meal",this.view="edit",this.acknowledged=!1,this.message="",this.draft=[...this.draft,{days:[...ke],time:"23:59",portions:1,enabled:!1}];try{await D(),M(this)}catch(t){this.view="list",this.message="Couldn\u2019t open editor. Refresh Home Assistant.",console.error(t)}}}edit(t,i){this.locked||this.editing===null||(this.draft=this.draft.map((s,r)=>r===this.editing?{...s,[t]:i}:s))}async cancel(){if(this.busy||this.feedBusy)return;if(this.view==="delete"){this.view="edit";return}let t=this.editing;this.reset(),await this.updateComplete,this.renderRoot.querySelector(`[data-meal="${t}"]`)?.focus()}get saveable(){return!this.locked&&this.editing!==null&&U(this.draft,this.attrs.max_meals,this.attrs.max_portions)&&!k(this.draft,this.baseline)&&(this.attrs.snapshot_source!=="restored"||this.acknowledged)}clearTimer(){this.timer&&clearTimeout(this.timer),this.timer=void 0}failure(t){if(console.error("Tuya feeder operation failed",t),this.attempt++,this.clearTimer(),this.busy=!1,this.failed=!0,this.toggling!==null){this.toggling=null,this.sent=void 0,this.editing=null,this.failed=!1,this.load(),this.message="Couldn\u2019t change meal. Check the schedule before trying again.",this.requestUpdate();return}this.message="Couldn\u2019t save. Try again.",this.requestUpdate()}async retry(){if(!(this.busy||this.conflict||this.editing===null||this.attrs.revision!==this.base||!this.writable||!k(this.baseline,this.attrs.meals))){this.failed=!1,this.view=this.operation==="delete_meal"?"delete":"edit",this.message="";try{await D(),M(this)}catch(t){this.view="list",this.message="Couldn\u2019t open editor. Refresh Home Assistant.",console.error(t)}}}async save(t=!1){if(this.editing===null||this.locked||this.attrs.revision!==this.base||!k(this.baseline,this.attrs.meals)||(t?this.view!=="delete"||this.attrs.snapshot_source==="restored"&&!this.acknowledged:!this.saveable))return;t&&(this.operation="delete_meal");let i=this.editing;this.sent=R(t?this.baseline.filter((n,d)=>d!==i):this.draft);let s={entity_id:this.config.entity,expected_revision:this.base,...this.operation!=="add_meal"?{meal_index:i}:{},...t?{}:{meal:R([this.draft[i]])[0]},...this.attrs.snapshot_source==="restored"?{acknowledge_restored_snapshot:!0}:{}};this.sentAt=this.attrs.last_received_at;let r=++this.attempt;this.serviceCompleted=!1,this.busy=!0,this.failed=!1,this.view="list",this.message="Saving\u2026",this.clearTimer(),this.timer=setTimeout(()=>{this.busy&&this.attempt===r&&this.failure(new Error("Schedule confirmation timed out; no retry sent"))},2e4);try{let n=await this.hass.callService("tuya_feeder",this.operation,s);if(!this.busy||this.attempt!==r)return;n?.error||n?.response?.error||n?.confirmed===!1||n?.response?.confirmed===!1?this.failure(n?.error??n?.response?.error??"unconfirmed"):(this.serviceCompleted=!0,this.hass=this.hass)}catch(n){this.busy&&this.attempt===r&&this.failure(n)}}get helper(){return this.config.portions_entity?this._hass?.states[this.config.portions_entity]:void 0}get selectedPortions(){return this.config.portions_entity?Number(this.helper?.state):this.feedPortions}get feedBounds(){if(!this.config.portions_entity)return{min:1,max:60};let t=this.helper;if(!(!t||["unknown","unavailable",""].includes(t.state)||!Number.isInteger(Number(t.attributes.min))||!Number.isInteger(Number(t.attributes.max))))return{min:Math.max(1,Number(t.attributes.min)),max:Math.min(60,Number(t.attributes.max))}}get feedReady(){let t=this.selectedPortions,i=this.feedBounds;return this.attrs.supports_manual_feed===!0&&!this.attrs.feeding_pending&&!this.attrs.pending&&(!this.hass.services||!!this.hass.services.tuya_feeder?.feed)&&!!i&&Number.isInteger(t)&&t>=i.min&&t<=i.max&&!this.busy&&!this.feedBusy&&!this.helperBusy}async selectFeed(t){let i=this.feedBounds,s=this.selectedPortions;if(!(!i||this.helperBusy||this.feedBusy||this.busy||!Number.isInteger(s)||s<i.min||s>i.max||s+t<i.min||s+t>i.max)){if(!this.config.portions_entity){this.feedPortions=s+t;return}this.helperBusy=!0;try{await this.hass.callService("input_number",t>0?"increment":"decrement",{entity_id:this.config.portions_entity})}catch(r){console.error("Tuya feeder portions selection failed",r),this.message="Couldn\u2019t change portions. Try again."}finally{this.helperBusy=!1}}}async confirmFeed(){if(!(!this.feedReady||this.view!=="list")){this.feedDose=this.selectedPortions,this.view="feed",this.message="";try{await D(),M(this)}catch(t){this.view="list",this.message="Couldn\u2019t open confirmation. Refresh Home Assistant.",console.error(t)}}}async feed(){if(!(!this.feedReady||!Number.isInteger(this.feedDose)||this.feedDose<1||this.feedDose>60)){this.feedBusy=!0,this.view="list",this.message="Feeding\u2026";try{let t=await this.hass.callService("tuya_feeder","feed",{entity_id:this.config.entity,portions:this.feedDose});if(t?.error)throw new Error(String(t.error));this.message="Feed requested"}catch(t){console.error("Tuya feeder manual feed failed",t),this.message="Couldn\u2019t feed. Try again."}finally{this.feedBusy=!1,this.feedDose=void 0}}}static getConfigElement(){return document.createElement("tuya-feeder-card-editor")}static getStubConfig(){return{entity:"",title:"Feeder",icon:"mdi:food-drumstick"}}getCardSize(){return 2+this.baseline.length}getGridOptions(){return{columns:12,min_columns:6}}lastFeedLabel(){let t=this.attrs.last_feed_at;if(typeof t!="string"||!/(Z|[+-]\d{2}:\d{2})$/.test(t))return"No recent feeding";let i=new Date(t),s=new Date;if(!Number.isFinite(i.getTime())||i>s)return"No recent feeding";let r=this.hass?.config?.time_zone,n=f=>new Intl.DateTimeFormat("en-CA",{timeZone:r,year:"numeric",month:"2-digit",day:"2-digit"}).format(f),d=new Intl.DateTimeFormat("en-CA",{timeZone:r,year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(s),o=f=>Number(d.find(g=>g.type===f)?.value),c=new Date(Date.UTC(o("year"),o("month")-1,o("day")-1,12)),p=new Intl.DateTimeFormat("en-CA",{timeZone:"UTC",year:"numeric",month:"2-digit",day:"2-digit"}).format(c),l=new Intl.DateTimeFormat("en-GB",{timeZone:r,hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(i);return n(i)===n(s)?`Last fed ${l}`:n(i)===p?`Last fed yesterday \xB7 ${l}`:`Last fed ${new Intl.DateTimeFormat("en-US",{timeZone:r,month:"short",day:"numeric"}).format(i)} \xB7 ${l}`}render(){return this.config?u`<ha-card
      part="card outer"
      data-active=${String(this.scheduleActive)}
      @keydown=${t=>{t.key==="Escape"&&this.view!=="list"&&(t.preventDefault(),this.cancel())}}
    >
      ${u`<header
          part=${this.config.manual_feed?"header feed-container manual-feed row":"header feed-container"}
          data-active=${String(this.scheduleActive)}
          class=${this.config.manual_feed?"manual":""}
        >
          <ha-icon
            part="header-icon"
            .icon=${this.config.icon??this.config.feed_icon??"mdi:food-drumstick"}
          ></ha-icon>
          <div class="identity">
            <h2 part="title">
              ${this.config.title??this.config.feed_title??"Feeder"}
            </h2>
            <div class="last-feed" part="subtitle">${this.lastFeedLabel()}</div>
          </div>
          ${this.config.manual_feed?u`<button part="control" aria-label="Decrease feeding portions" ?disabled=${!this.feedBounds||!Number.isInteger(this.selectedPortions)||this.selectedPortions<=this.feedBounds.min||this.helperBusy||this.feedBusy||this.busy} @click=${()=>this.selectFeed(-1)}>−</button><output aria-label="Feeding portions">${Number.isInteger(this.selectedPortions)&&this.feedBounds&&this.selectedPortions>=this.feedBounds.min&&this.selectedPortions<=this.feedBounds.max?this.selectedPortions:"\u2014"}</output><button part="control" aria-label="Increase feeding portions" ?disabled=${!this.feedBounds||!Number.isInteger(this.selectedPortions)||this.selectedPortions>=this.feedBounds.max||this.helperBusy||this.feedBusy||this.busy} @click=${()=>this.selectFeed(1)}>+</button><button class="accent feed" ?disabled=${!this.feedReady} @click=${this.confirmFeed}>Feed</button>`:h}
        </header>
        ${this.message&&!["Saved","Feed requested"].includes(this.message)?u`<div part="status" class="status" role="status">${this.message}</div>`:h}
        <section
          aria-label="Meal schedule"
          ?inert=${this.busy||this.feedBusy}
        >
          ${this.writable||this.busy||this.failed||this.conflict?this.baseline.map((t,i)=>u`<div
                      class="meal"
                      part="meal row"
                      data-enabled=${String(t.enabled)}
                    >
                      <button
                        class="meal-toggle"
                        part="enabled control"
                        role="switch"
                        aria-label=${`Enabled ${i+1}`}
                        aria-checked=${String(t.enabled)}
                        aria-busy=${String(this.busy&&this.toggling===i)}
                        ?disabled=${this.locked||this.failed}
                        @click=${s=>{s.stopPropagation(),this.toggle(i,{target:s.currentTarget})}}
                      >
                        <ha-icon
                          .icon=${this.config.icon??"mdi:food-drumstick"}
                        ></ha-icon>
                      </button>
                      <button
                        part="meal-button"
                        class="open"
                        data-meal=${i}
                        aria-label=${`Edit meal ${i+1}`}
                        ?disabled=${this.locked||this.failed}
                        @click=${()=>this.openEditor(i)}
                      >
                        <span class="time" part="meal-time">${t.time}</span
                        ><span class="detail"
                          >Every day ·
                          <span aria-label=${`Portions ${i+1}`}
                            >${t.portions}</span
                          >
                          portion${t.portions===1?"":"s"}</span
                        >
                      </button>
                    </div>`):u`<div class="unavailable">Schedule unavailable</div>`}
          ${this.writable||this.busy||this.failed||this.conflict?u`<button part="add control" class="add" aria-label="Add meal" title="Add meal" ?disabled=${this.locked||this.failed||this.baseline.length>=Math.min(10,this.attrs.max_meals)} @click=${this.add}><ha-icon icon="mdi:plus"></ha-icon></button>`:h}
          ${!this.writable&&!this.busy&&!this.failed&&!this.conflict?u`<button @click=${this.reset}>Retry</button>`:h}
        </section>`}
      ${this.conflict?u`<button @click=${this.reset}>Reload</button>`:this.failed?u`<div class="actions"><button @click=${this.reset}>Cancel</button><button ?disabled=${!this.writable} @click=${this.retry}>Try again</button></div>`:h}
    </ha-card>`:h}static{this.styles=j`
    :host {
      display: block;
      container-type: inline-size;
      color: var(--primary-text-color, #222);
      font-family: var(
        --feeder-font-family,
        var(--ha-font-family-body, system-ui)
      );
      font-size: 15px;
      --accent: var(
        --feeder-accent-color,
        var(--accent-color, var(--primary-color, #03a9f4))
      );
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
    header[data-active="true"] {
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
    ha-card {
      padding: 0;
      background: var(--feeder-outer-background, transparent);
      border: 0;
      box-shadow: none;
    }
    header:not(.edit-header):has(> ha-icon),
    header.manual:not(.edit-header):has(> ha-icon) {
      margin: 0 0 8px;
      min-height: 68px;
      border-radius: var(
        --feeder-border-radius,
        var(--ha-card-border-radius, 20px)
      );
      background: var(
        --feeder-feed-background,
        var(--feeder-card-background, rgba(0, 0, 0, 0.3))
      );
      box-shadow:
        0 2px 4px rgba(0, 0, 0, 0.1),
        0 6px 10px rgba(0, 0, 0, 0.08);
    }
    header[data-active="true"]:not(.edit-header):has(> ha-icon) {
      background: var(--feeder-active-card-background, white);
    }
    header > ha-icon {
      margin-left: 11.5px;
      background: var(--feeder-header-icon-background, rgba(0, 0, 0, 0.2));
      color: var(--feeder-header-icon-color, white);
    }
    .identity {
      min-width: 0;
    }
    .last-feed {
      font-size: 15px;
      line-height: 1.3;
      color: var(--secondary-text-color, #777);
      white-space: normal;
    }
    header.manual:not(.edit-header):has(> ha-icon) {
      grid-template-columns:
        64px minmax(80px, 1fr) var(--control) 32px var(--control)
        minmax(64px, 1fr);
    }
    .meal {
      display: grid;
      grid-template-columns: 66px minmax(0, 1fr);
      gap: 0;
      min-height: 69px;
      margin: 8px 0;
      background: var(
        --feeder-meal-background,
        var(--feeder-row-background, rgba(0, 0, 0, 0.3))
      );
      color: white;
      box-shadow:
        0 2px 4px rgba(0, 0, 0, 0.1),
        0 6px 10px rgba(0, 0, 0, 0.08);
    }
    .meal[data-enabled="true"] {
      background: var(
        --feeder-meal-active-background,
        var(--feeder-active-card-background, white)
      );
      color: var(--feeder-active-text-color, black);
    }
    .meal-toggle {
      width: 66px;
      height: 69px;
      padding: 0;
      display: grid;
      place-items: center;
      border-radius: 0;
    }
    .meal-toggle ha-icon {
      width: 45px;
      height: 45px;
      padding: 10px;
      --mdc-icon-size: 25px;
      border-radius: 24px;
      color: white;
      background: rgba(0, 0, 0, 0.2);
    }
    .meal[data-enabled="true"] .meal-toggle ha-icon {
      background: var(--feeder-active-icon-background, var(--accent));
      color: var(--feeder-active-icon-color, white);
    }
    .open {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      gap: 0;
      min-height: 69px;
      padding: 0 10px 0 0;
    }
    .open .time {
      font-size: var(--feeder-meal-time-font-size, 17px);
      letter-spacing: normal;
      font-weight: 500;
      line-height: 1.3;
    }
    .open .detail {
      font-size: 15px;
      line-height: 1.3;
      color: rgba(255, 255, 255, 0.5);
    }
    .meal[data-enabled="true"] .detail {
      color: var(--feeder-active-muted-color, rgba(0, 0, 0, 0.5));
    }
    .status {
      margin: 0 0 8px;
      font-size: 15px;
    }
    @container (max-width:360px) {
      header.manual:not(.edit-header):has(> ha-icon) {
        grid-template-columns:
          64px minmax(0, 1fr) var(--control) 28px var(--control)
          55px;
        padding-right: 0;
      }
      .manual .feed {
        min-width: 50px;
        margin-left: 5px;
      }
      .manual output {
        min-width: 28px;
      }
      .last-feed {
        font-size: 12px;
      }
      .meal {
        gap: 0;
      }
      .open {
        gap: 0;
        padding: 0 10px 0 0;
      }
      .open .time {
        font-size: var(--feeder-meal-time-font-size, 17px);
      }
      .open .detail {
        font-size: 15px;
      }
    }
    [inert] {
      pointer-events: none;
    }
    p {
      color: var(--secondary-text-color, #777);
    }
  `}},ae=class extends m{static{this.properties={hass:{attribute:!1},config:{state:!0}}}setConfig(e){this.config={...e}}render(){let e={entity:"Schedule sensor",title:"Title",icon:"Icon",manual_feed:"Show manual feeding",feed_title:"Feeding title",feed_icon:"Feeding icon",portions_entity:"Portions helper (optional)",appearance:"Appearance",accent_color:"Accent color",border_radius:"Corner radius",font_family:"Font family",header_font_size:"Header size",meal_time_font_size:"Meal time size",row_background:"Row color",card_background:"Card color",control_size:"Control size (minimum 44px)"};return u`<ha-form
      .hass=${this.hass}
      .data=${this.config}
      .schema=${[{name:"entity",required:!0,selector:{entity:{domain:"sensor",integration:"tuya_feeder"}}},{name:"title",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"manual_feed",selector:{boolean:{}}},{name:"feed_title",selector:{text:{}}},{name:"feed_icon",selector:{icon:{}}},{name:"portions_entity",selector:{entity:{domain:"input_number"}}},{name:"appearance",type:"expandable",schema:ne.map(t=>({name:t,selector:{text:{}}}))}]}
      .computeLabel=${t=>e[t.name]??t.name}
      @value-changed=${t=>{let i={...this.config,...t.detail.value};Ee(i.appearance),this.config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this.config},bubbles:!0,composed:!0}))}}
    ></ha-form>`}};customElements.define("tuya-feeder-card",se);customElements.define("tuya-feeder-card-editor",ae);var re=window;re.customCards=re.customCards||[];re.customCards.push({type:"tuya-feeder-card",name:"Tuya Feeder",description:"Daily meals with in-card editing and optional manual feeding.",documentationURL:"https://github.com/myevit/tuya-feeder-card"});export{se as TuyaFeederCard};
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
