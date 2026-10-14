var B=globalThis,O=B.ShadowRoot&&(B.ShadyCSS===void 0||B.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,F=Symbol(),oe=new WeakMap,E=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==F)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(O&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=oe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&oe.set(e,t))}return t}toString(){return this.cssText}},de=a=>new E(typeof a=="string"?a:a+"",void 0,F),j=(a,...t)=>{let e=a.length===1?a[0]:t.reduce((i,s,r)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+a[r+1],a[0]);return new E(e,a,F)},le=(a,t)=>{if(O)a.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let i=document.createElement("style"),s=B.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,a.appendChild(i)}},q=O?a=>a:a=>a instanceof CSSStyleSheet?(t=>{let e="";for(let i of t.cssRules)e+=i.cssText;return de(e)})(a):a;var{is:Se,defineProperty:Ce,getOwnPropertyDescriptor:Pe,getOwnPropertyNames:Te,getOwnPropertySymbols:ze,getPrototypeOf:Ne}=Object,I=globalThis,he=I.trustedTypes,Me=he?he.emptyScript:"",De=I.reactiveElementPolyfillSupport,S=(a,t)=>a,W={toAttribute(a,t){switch(t){case Boolean:a=a?Me:null;break;case Object:case Array:a=a==null?a:JSON.stringify(a)}return a},fromAttribute(a,t){let e=a;switch(t){case Boolean:e=a!==null;break;case Number:e=a===null?null:Number(a);break;case Object:case Array:try{e=JSON.parse(a)}catch{e=null}}return e}},pe=(a,t)=>!Se(a,t),ce={attribute:!0,type:String,converter:W,reflect:!1,useDefault:!1,hasChanged:pe};Symbol.metadata??=Symbol("metadata"),I.litPropertyMetadata??=new WeakMap;var b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ce){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Ce(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){let{get:s,set:r}=Pe(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:s,set(n){let d=s?.call(this);r?.call(this,n),this.requestUpdate(t,d,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ce}static _$Ei(){if(this.hasOwnProperty(S("elementProperties")))return;let t=Ne(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(S("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(S("properties"))){let e=this.properties,i=[...Te(e),...ze(e)];for(let s of i)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let s of i)e.unshift(q(s))}else t!==void 0&&e.push(q(t));return e}static _$Eu(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return le(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){let i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:W).toAttribute(e,i.type);this._$Em=t,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){let i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let r=i.getPropertyOptions(s),n=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:W;this._$Em=s;let d=n.fromAttribute(e,r.type);this[s]=d??this._$Ej?.get(s)??d,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(t!==void 0){let n=this.constructor;if(s===!1&&(r=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??pe)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),r!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,r]of i){let{wrapped:n}=r,d=this[s];n!==!0||this._$AL.has(s)||d===void 0||this.C(s,void 0,r,d)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[S("elementProperties")]=new Map,b[S("finalized")]=new Map,De?.({ReactiveElement:b}),(I.reactiveElementVersions??=[]).push("2.1.2");var Q=globalThis,ue=a=>a,L=Q.trustedTypes,me=L?L.createPolicy("lit-html",{createHTML:a=>a}):void 0,_e="$lit$",y=`lit$${Math.random().toFixed(9).slice(2)}$`,$e="?"+y,Re=`<${$e}>`,$=document,P=()=>$.createComment(""),T=a=>a===null||typeof a!="object"&&typeof a!="function",X=Array.isArray,Ue=a=>X(a)||typeof a?.[Symbol.iterator]=="function",V=`[ 	
\f\r]`,C=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,fe=/-->/g,ge=/>/g,v=RegExp(`>|${V}(?:([^\\s"'>=/]+)(${V}*=${V}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),be=/'/g,ye=/"/g,xe=/^(?:script|style|textarea|title)$/i,ee=a=>(t,...e)=>({_$litType$:a,strings:t,values:e}),u=ee(1),qe=ee(2),We=ee(3),x=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),ve=new WeakMap,_=$.createTreeWalker($,129);function we(a,t){if(!X(a)||!a.hasOwnProperty("raw"))throw Error("invalid template strings array");return me!==void 0?me.createHTML(t):t}var He=(a,t)=>{let e=a.length-1,i=[],s,r=t===2?"<svg>":t===3?"<math>":"",n=C;for(let d=0;d<e;d++){let o=a[d],c,p,l=-1,m=0;for(;m<o.length&&(n.lastIndex=m,p=n.exec(o),p!==null);)m=n.lastIndex,n===C?p[1]==="!--"?n=fe:p[1]!==void 0?n=ge:p[2]!==void 0?(xe.test(p[2])&&(s=RegExp("</"+p[2],"g")),n=v):p[3]!==void 0&&(n=v):n===v?p[0]===">"?(n=s??C,l=-1):p[1]===void 0?l=-2:(l=n.lastIndex-p[2].length,c=p[1],n=p[3]===void 0?v:p[3]==='"'?ye:be):n===ye||n===be?n=v:n===fe||n===ge?n=C:(n=v,s=void 0);let g=n===v&&a[d+1].startsWith("/>")?" ":"";r+=n===C?o+Re:l>=0?(i.push(c),o.slice(0,l)+_e+o.slice(l)+y+g):o+y+(l===-2?d:g)}return[we(a,r+(a[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},z=class a{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,n=0,d=t.length-1,o=this.parts,[c,p]=He(t,e);if(this.el=a.createElement(c,i),_.currentNode=this.el.content,e===2||e===3){let l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;(s=_.nextNode())!==null&&o.length<d;){if(s.nodeType===1){if(s.hasAttributes())for(let l of s.getAttributeNames())if(l.endsWith(_e)){let m=p[n++],g=s.getAttribute(l).split(y),H=/([.?@])?(.*)/.exec(m);o.push({type:1,index:r,name:H[2],strings:g,ctor:H[1]==="."?K:H[1]==="?"?G:H[1]==="@"?J:A}),s.removeAttribute(l)}else l.startsWith(y)&&(o.push({type:6,index:r}),s.removeAttribute(l));if(xe.test(s.tagName)){let l=s.textContent.split(y),m=l.length-1;if(m>0){s.textContent=L?L.emptyScript:"";for(let g=0;g<m;g++)s.append(l[g],P()),_.nextNode(),o.push({type:2,index:++r});s.append(l[m],P())}}}else if(s.nodeType===8)if(s.data===$e)o.push({type:2,index:r});else{let l=-1;for(;(l=s.data.indexOf(y,l+1))!==-1;)o.push({type:7,index:r}),l+=y.length-1}r++}}static createElement(t,e){let i=$.createElement("template");return i.innerHTML=t,i}};function w(a,t,e=a,i){if(t===x)return t;let s=i!==void 0?e._$Co?.[i]:e._$Cl,r=T(t)?void 0:t._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),r===void 0?s=void 0:(s=new r(a),s._$AT(a,e,i)),i!==void 0?(e._$Co??=[])[i]=s:e._$Cl=s),s!==void 0&&(t=w(a,s._$AS(a,t.values),s,i)),t}var Z=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??$).importNode(e,!0);_.currentNode=s;let r=_.nextNode(),n=0,d=0,o=i[0];for(;o!==void 0;){if(n===o.index){let c;o.type===2?c=new N(r,r.nextSibling,this,t):o.type===1?c=new o.ctor(r,o.name,o.strings,this,t):o.type===6&&(c=new Y(r,this,t)),this._$AV.push(c),o=i[++d]}n!==o?.index&&(r=_.nextNode(),n++)}return _.currentNode=$,s}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},N=class a{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=w(this,t,e),T(t)?t===h||t==null||t===""?(this._$AH!==h&&this._$AR(),this._$AH=h):t!==this._$AH&&t!==x&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ue(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==h&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T($.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=z.createElement(we(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{let r=new Z(s,this),n=r.u(this.options);r.p(e),this.T(n),this._$AH=r}}_$AC(t){let e=ve.get(t.strings);return e===void 0&&ve.set(t.strings,e=new z(t)),e}k(t){X(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,s=0;for(let r of t)s===e.length?e.push(i=new a(this.O(P()),this.O(P()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let i=ue(t).nextSibling;ue(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},A=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=h,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=h}_$AI(t,e=this,i,s){let r=this.strings,n=!1;if(r===void 0)t=w(this,t,e,0),n=!T(t)||t!==this._$AH&&t!==x,n&&(this._$AH=t);else{let d=t,o,c;for(t=r[0],o=0;o<r.length-1;o++)c=w(this,d[i+o],e,o),c===x&&(c=this._$AH[o]),n||=!T(c)||c!==this._$AH[o],c===h?t=h:t!==h&&(t+=(c??"")+r[o+1]),this._$AH[o]=c}n&&!s&&this.j(t)}j(t){t===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},K=class extends A{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===h?void 0:t}},G=class extends A{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==h)}},J=class extends A{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=w(this,t,e,0)??h)===x)return;let i=this._$AH,s=t===h&&i!==h||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==h&&(i===h||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Y=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){w(this,t)}};var Be=Q.litHtmlPolyfillSupport;Be?.(z,N),(Q.litHtmlVersions??=[]).push("3.3.3");var Ae=(a,t,e)=>{let i=e?.renderBefore??t,s=i._$litPart$;if(s===void 0){let r=e?.renderBefore??null;i._$litPart$=s=new N(t.insertBefore(P(),r),r,void 0,e??{})}return s._$AI(a),s};var te=globalThis,f=class extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ae(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return x}};f._$litElement$=!0,f.finalized=!0,te.litElementHydrateSupport?.({LitElement:f});var Oe=te.litElementPolyfillSupport;Oe?.({LitElement:f});(te.litElementVersions??=[]).push("4.2.2");async function M(){if(!["ha-dialog","ha-form","ha-button","ha-dialog-footer"].every(a=>customElements.get(a))){let a=await window.loadCardHelpers?.();if(!a)throw new Error("Home Assistant dialog controls are unavailable");await(await a.createCardElement({type:"entities",entities:[]})).constructor.getConfigElement?.()}if(!["ha-dialog","ha-form","ha-button","ha-dialog-footer"].every(a=>customElements.get(a)))throw new Error("Home Assistant dialog controls are unavailable")}function D(a){a.dispatchEvent(new CustomEvent("show-dialog",{bubbles:!0,composed:!0,detail:{dialogTag:"tuya-feeder-meal-dialog",dialogImport:()=>Promise.resolve(),dialogParams:{owner:a}}}))}var ie=class extends f{constructor(){super(...arguments);this.open=!1}static{this.properties={hass:{attribute:!1},owner:{state:!0},open:{state:!0}}}async showDialog(e){this.owner=e.owner,this.owner.nativeDialog=this,this.open=!0,await this.updateComplete}invalidate(){this.open&&(this.open=!1,this.owner.nativeDialog=void 0,this.dispatchEvent(new CustomEvent("dialog-closed",{bubbles:!0,composed:!0,detail:{dialog:this.localName}})))}closeDialog(){return this.dismiss(),!0}dismiss(){this.open&&(this.open=!1,this.owner.nativeDialog=void 0,this.owner.view==="delete"&&!this.owner.busy&&(this.owner.view="edit"),this.owner.cancel(),this.dispatchEvent(new CustomEvent("dialog-closed",{bubbles:!0,composed:!0,detail:{dialog:this.localName}})))}save(){!this.renderRoot.querySelector("ha-form")?.reportValidity?.()||!this.owner.saveable||(this.owner.save(),this.dismiss())}render(){let e=this.owner,i=e?.draft[e?.editing];if(e?.view==="feed")return u`<ha-dialog
        .open=${this.open}
        header-title=${`Feed ${e.feedDose} portions?`}
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
            ?disabled=${!e.feedReady}
            @click=${()=>{e.feed(),this.dismiss()}}
            >Feed now</ha-button
          ></ha-dialog-footer
        ></ha-dialog
      >`;if(!e||!i)return h;let s=e.view==="delete",r=[{name:"time",required:!0,selector:{time:{no_second:!0}}},{name:"portions",required:!0,selector:{number:{min:1,max:Math.min(60,e.attrs.max_portions??60),step:1,mode:"box"}}},{name:"enabled",selector:{boolean:{}}},...e.attrs.snapshot_source==="restored"?[{name:"acknowledged",selector:{boolean:{}}}]:[]];return u`<ha-dialog
      .open=${this.open}
      .headerTitle=${s?"Delete meal?":e.operation==="add_meal"?"Add meal":"Edit meal"}
      @closed=${this.dismiss}
    >
      ${s?u`<p>Delete ${i.time} · ${i.portions} portions?</p>`:u`<ha-form
              autofocus
              .hass=${this.hass??e.hass}
              .locale=${(this.hass??e.hass).locale}
              .data=${{time:i.time,portions:i.portions,enabled:i.enabled,acknowledged:e.acknowledged}}
              .schema=${r}
              .computeLabel=${n=>({time:"Time",portions:"Portions",enabled:"Enabled",acknowledged:"Use saved plan?"})[n.name]}
              @value-changed=${n=>{let d=n.detail.value;e.edit("time",d.time?.slice(0,5)),e.edit("portions",d.portions),e.edit("enabled",d.enabled),e.acknowledged=d.acknowledged===!0,this.requestUpdate()}}
            ></ha-form>`}
      <ha-dialog-footer slot="footer">
        ${!s&&e.operation!=="add_meal"?u`<ha-button
                slot="secondaryAction"
                appearance="plain"
                variant="danger"
                @click=${()=>{e.view="delete",this.requestUpdate()}}
                >Delete</ha-button
              >`:h}
        <ha-button
          slot="secondaryAction"
          appearance="plain"
          @click=${()=>{s?(e.view="edit",this.requestUpdate()):this.dismiss()}}
          >Cancel</ha-button
        >
        <ha-button
          slot="primaryAction"
          variant=${s?"danger":"brand"}
          ?disabled=${s?e.locked||e.attrs.snapshot_source==="restored"&&!e.acknowledged:!e.saveable}
          @click=${()=>{s?(e.save(!0),this.dismiss()):this.save()}}
          >${s?"Delete":"Save"}</ha-button
        >
      </ha-dialog-footer>
    </ha-dialog>`}};customElements.define("tuya-feeder-meal-dialog",ie);var ke=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],R=a=>a.map(t=>({...t,days:[...t.days]})),U=(a,t=10,e=60)=>Array.isArray(a)&&a.length<=Math.min(10,t)&&a.every(i=>i&&typeof i=="object"&&Object.keys(i).sort().join(",")==="days,enabled,portions,time"&&Array.isArray(i.days)&&i.days.length===7&&new Set(i.days).size===7&&ke.every(s=>i.days.includes(s))&&typeof i.time=="string"&&/^([01]\d|2[0-3]):[0-5]\d$/.test(i.time)&&Number.isInteger(i.portions)&&i.portions>=1&&i.portions<=Math.min(60,e)&&typeof i.enabled=="boolean"),k=(a,t)=>a.length===t.length&&a.every((e,i)=>e.time===t[i].time&&e.portions===t[i].portions&&e.enabled===t[i].enabled&&e.days.length===t[i].days.length&&e.days.every(s=>t[i].days.includes(s))),ne=["accent_color","icon_color","border_radius","font_family","header_font_size","meal_time_font_size","row_background","card_background","control_size"];function Ee(a={}){let t={},e={accent_color:"color",icon_color:"color",border_radius:"border-radius",font_family:"font-family",header_font_size:"font-size",meal_time_font_size:"font-size",row_background:"background-color",card_background:"background-color",control_size:"width"};for(let i of ne){let s=a[i];if(!(s===void 0||s==="")){if(typeof s!="string"||s.length>160||/[;{}<>\\]|url\s*\(|expression\s*\(|!important|\/\*/i.test(s)||!CSS.supports(e[i],s))throw new Error(`Invalid appearance.${i}`);t[i]=s}}return t}var se=class extends f{constructor(){super(...arguments);this.draft=[];this.editing=null;this.view="list";this.busy=!1;this.feedBusy=!1;this.helperBusy=!1;this.message="";this.conflict=!1;this.acknowledged=!1;this.feedPortions=1;this.base=0;this.baseline=[];this.serviceCompleted=!1;this.attempt=0;this.failed=!1;this.toggling=null;this.operation="update_meal"}static{this.properties={config:{state:!0},draft:{state:!0},editing:{state:!0},view:{state:!0},busy:{state:!0},message:{state:!0},conflict:{state:!0},acknowledged:{state:!0},feedPortions:{state:!0},feedBusy:{state:!0},helperBusy:{state:!0}}}setConfig(e){if(!e.entity?.startsWith("sensor."))throw new Error("Select a schedule sensor");if(e.portions_entity&&!e.portions_entity.startsWith("input_number."))throw new Error("Select a portions helper");if(this.busy||this.feedBusy)throw new Error("Wait for completion before changing config");if(e.meal_icon_mode&&!["time_of_day","fixed"].includes(e.meal_icon_mode))throw new Error("Select time_of_day or fixed meal icons");this.config={...e,appearance:Ee(e.appearance)};for(let i of ne){this.style.removeProperty(`--feeder-${i.replaceAll("_","-")}`);let s=this.config.appearance?.[i];s&&this.style.setProperty(`--feeder-${i.replaceAll("_","-")}`,s)}this.reset()}set hass(e){this._hass=e;let i=this.attrs;this.busy?i.error&&!i.pending?this.failure(i.error):this.toggling!==null&&i.revision>this.base&&this.sent&&U(i.meals,i.max_meals,i.max_portions)&&!k(this.sent,i.meals)?this.failure("Schedule changed during update"):this.serviceCompleted&&this.writable&&i.snapshot_source==="received"&&i.revision>this.base&&Date.parse(i.last_received_at)>Date.parse(this.sentAt??"")&&this.sent&&k(this.sent,i.meals)&&(this.clearTimer(),this.busy=!1,this.failed=!1,this.sent=void 0,this.toggling=null,this.editing=null,this.load(),this.message="Saved"):this.editing!==null||this.failed?(i.revision!==this.base||!this.writable||!k(this.baseline,i.meals))&&(this.conflict=!0,this.view="list",this.message="Schedule changed. Reload to continue.",this.nativeDialog?.invalidate()):this.load(),this.nativeDialog?.requestUpdate(),this.requestUpdate()}get hass(){return this._hass}get attrs(){return this._hass?.states[this.config?.entity]?.attributes??{}}get writable(){let e=this._hass?.states[this.config?.entity],i=this.attrs;return!!e&&(!this._hass?.services||["update_meal","add_meal","delete_meal"].every(s=>!!this._hass?.services?.tuya_feeder?.[s]))&&!["unknown","unavailable"].includes(e.state)&&(i.supports_schedule_write===!0&&i.snapshot_source==="received"||i.supports_restored_schedule_write===!0&&i.snapshot_source==="restored"&&i.requires_restored_snapshot_acknowledgement===!0)&&i.supported_days_mode==="every_day"&&Number.isSafeInteger(i.revision)&&i.revision>0&&typeof i.last_received_at=="string"&&Number.isFinite(Date.parse(i.last_received_at))&&i.schedule_valid===!0&&i.pending===!1&&!i.error&&Number.isInteger(i.max_meals)&&i.max_meals>0&&Number.isInteger(i.max_portions)&&i.max_portions>0&&U(i.meals,i.max_meals,i.max_portions)}get scheduleActive(){let e=this._hass?.states[this.config?.entity],i=this.attrs;return!!e&&!["unknown","unavailable"].includes(e.state)&&i.schedule_valid===!0&&["received","restored"].includes(i.snapshot_source)&&U(i.meals,i.max_meals,i.max_portions)&&i.meals.some(s=>s.enabled===!0)}get locked(){return!this.writable||this.conflict||this.busy||this.feedBusy||this.attrs.feeding_pending===!0}load(){this.base=this.attrs.revision,this.baseline=U(this.attrs.meals,this.attrs.max_meals,this.attrs.max_portions)?R(this.attrs.meals):[],this.draft=R(this.baseline)}reset(){this.busy||this.feedBusy||(this.editing=null,this.view="list",this.conflict=!1,this.failed=!1,this.toggling=null,this.message="",this.acknowledged=!1,this.load())}async openEditor(e,i){if(!(this.locked||this.view!=="list")){this.load(),this.operation="update_meal",this.editing=e,this.view="edit",this.acknowledged=!1,this.message="",i!==void 0&&this.edit("enabled",i);try{await M(),D(this)}catch(s){this.view="list",this.message="Couldn\u2019t open editor. Refresh Home Assistant.",console.error(s)}}}async toggle(e,i){let s=i.target,r=s.tagName==="BUTTON"?!this.baseline[e]?.enabled:s.checked;s.checked=this.busy&&this.toggling===e?this.sent?.[e].enabled??!1:this.baseline[e]?.enabled??!1,!(this.locked||this.failed||this.view!=="list")&&(this.load(),!(!this.baseline[e]||this.baseline[e].enabled===r)&&(this.operation="update_meal",this.editing=e,this.toggling=e,this.acknowledged=this.attrs.snapshot_source==="restored",this.edit("enabled",r),await this.save()))}async add(){if(!(this.locked||this.view!=="list"||this.baseline.length>=Math.min(10,this.attrs.max_meals))){this.load(),this.editing=this.draft.length,this.operation="add_meal",this.view="edit",this.acknowledged=!1,this.message="",this.draft=[...this.draft,{days:[...ke],time:"23:59",portions:1,enabled:!1}];try{await M(),D(this)}catch(e){this.view="list",this.message="Couldn\u2019t open editor. Refresh Home Assistant.",console.error(e)}}}edit(e,i){this.locked||this.editing===null||(this.draft=this.draft.map((s,r)=>r===this.editing?{...s,[e]:i}:s))}async cancel(){if(this.busy||this.feedBusy)return;if(this.view==="delete"){this.view="edit";return}let e=this.editing;this.reset(),await this.updateComplete,this.renderRoot.querySelector(`[data-meal="${e}"]`)?.focus()}get saveable(){return!this.locked&&this.editing!==null&&U(this.draft,this.attrs.max_meals,this.attrs.max_portions)&&!k(this.draft,this.baseline)&&(this.attrs.snapshot_source!=="restored"||this.acknowledged)}clearTimer(){this.timer&&clearTimeout(this.timer),this.timer=void 0}failure(e){if(console.error("Tuya feeder operation failed",e),this.attempt++,this.clearTimer(),this.busy=!1,this.failed=!0,this.toggling!==null){this.toggling=null,this.sent=void 0,this.editing=null,this.failed=!1,this.load(),this.message="Couldn\u2019t change meal. Check the schedule before trying again.",this.requestUpdate();return}this.message="Couldn\u2019t save. Try again.",this.requestUpdate()}async retry(){if(!(this.busy||this.conflict||this.editing===null||this.attrs.revision!==this.base||!this.writable||!k(this.baseline,this.attrs.meals))){this.failed=!1,this.view=this.operation==="delete_meal"?"delete":"edit",this.message="";try{await M(),D(this)}catch(e){this.view="list",this.message="Couldn\u2019t open editor. Refresh Home Assistant.",console.error(e)}}}async save(e=!1){if(this.editing===null||this.locked||this.attrs.revision!==this.base||!k(this.baseline,this.attrs.meals)||(e?this.view!=="delete"||this.attrs.snapshot_source==="restored"&&!this.acknowledged:!this.saveable))return;e&&(this.operation="delete_meal");let i=this.editing;this.sent=R(e?this.baseline.filter((n,d)=>d!==i):this.draft);let s={entity_id:this.config.entity,expected_revision:this.base,...this.operation!=="add_meal"?{meal_index:i}:{},...e?{}:{meal:R([this.draft[i]])[0]},...this.attrs.snapshot_source==="restored"?{acknowledge_restored_snapshot:!0}:{}};this.sentAt=this.attrs.last_received_at;let r=++this.attempt;this.serviceCompleted=!1,this.busy=!0,this.failed=!1,this.view="list",this.message="Saving\u2026",this.clearTimer(),this.timer=setTimeout(()=>{this.busy&&this.attempt===r&&this.failure(new Error("Schedule confirmation timed out; no retry sent"))},2e4);try{let n=await this.hass.callService("tuya_feeder",this.operation,s);if(!this.busy||this.attempt!==r)return;n?.error||n?.response?.error||n?.confirmed===!1||n?.response?.confirmed===!1?this.failure(n?.error??n?.response?.error??"unconfirmed"):(this.serviceCompleted=!0,this.hass=this.hass)}catch(n){this.busy&&this.attempt===r&&this.failure(n)}}get helper(){return this.config.portions_entity?this._hass?.states[this.config.portions_entity]:void 0}get selectedPortions(){return this.config.portions_entity?Number(this.helper?.state):this.feedPortions}get feedBounds(){if(!this.config.portions_entity)return{min:1,max:60};let e=this.helper;if(!(!e||["unknown","unavailable",""].includes(e.state)||!Number.isInteger(Number(e.attributes.min))||!Number.isInteger(Number(e.attributes.max))))return{min:Math.max(1,Number(e.attributes.min)),max:Math.min(60,Number(e.attributes.max))}}get feedReady(){let e=this.selectedPortions,i=this.feedBounds;return this.attrs.supports_manual_feed===!0&&!this.attrs.feeding_pending&&!this.attrs.pending&&(!this.hass.services||!!this.hass.services.tuya_feeder?.feed)&&!!i&&Number.isInteger(e)&&e>=i.min&&e<=i.max&&!this.busy&&!this.feedBusy&&!this.helperBusy}async selectFeed(e){let i=this.feedBounds,s=this.selectedPortions;if(!(!i||this.helperBusy||this.feedBusy||this.busy||!Number.isInteger(s)||s<i.min||s>i.max||s+e<i.min||s+e>i.max)){if(!this.config.portions_entity){this.feedPortions=s+e;return}this.helperBusy=!0;try{await this.hass.callService("input_number",e>0?"increment":"decrement",{entity_id:this.config.portions_entity})}catch(r){console.error("Tuya feeder portions selection failed",r),this.message="Couldn\u2019t change portions. Try again."}finally{this.helperBusy=!1}}}async confirmFeed(){if(!(!this.feedReady||this.view!=="list")){this.feedDose=this.selectedPortions,this.view="feed",this.message="";try{await M(),D(this)}catch(e){this.view="list",this.message="Couldn\u2019t open confirmation. Refresh Home Assistant.",console.error(e)}}}async feed(){if(!(!this.feedReady||!Number.isInteger(this.feedDose)||this.feedDose<1||this.feedDose>60)){this.feedBusy=!0,this.view="list",this.message="Feeding\u2026";try{let e=await this.hass.callService("tuya_feeder","feed",{entity_id:this.config.entity,portions:this.feedDose});if(e?.error)throw new Error(String(e.error));this.message="Feed requested"}catch(e){console.error("Tuya feeder manual feed failed",e),this.message="Couldn\u2019t feed. Try again."}finally{this.feedBusy=!1,this.feedDose=void 0}}}static getConfigElement(){return document.createElement("tuya-feeder-card-editor")}static getStubConfig(){return{entity:"",title:"Feeder",icon:"mdi:food-drumstick"}}getCardSize(){return 2+this.baseline.length}getGridOptions(){return{columns:12,min_columns:6}}mealIcon(e){if(this.config.meal_icon_mode==="fixed")return this.config.meal_icon??this.config.icon??"mdi:food-drumstick";let i=Number(e.slice(0,2));return i>=5&&i<11?"mdi:weather-sunset-up":i>=11&&i<16?"mdi:white-balance-sunny":i>=16&&i<21?"mdi:weather-sunset-down":"mdi:weather-night"}lastFeedLabel(){let e=this.attrs.last_feed_at;if(typeof e!="string"||!/(Z|[+-]\d{2}:\d{2})$/.test(e))return"No recent feeding";let i=new Date(e),s=new Date;if(!Number.isFinite(i.getTime())||i>s)return"No recent feeding";let r=this.hass?.config?.time_zone,n=m=>new Intl.DateTimeFormat("en-CA",{timeZone:r,year:"numeric",month:"2-digit",day:"2-digit"}).format(m),d=new Intl.DateTimeFormat("en-CA",{timeZone:r,year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(s),o=m=>Number(d.find(g=>g.type===m)?.value),c=new Date(Date.UTC(o("year"),o("month")-1,o("day")-1,12)),p=new Intl.DateTimeFormat("en-CA",{timeZone:"UTC",year:"numeric",month:"2-digit",day:"2-digit"}).format(c),l=new Intl.DateTimeFormat("en-GB",{timeZone:r,hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(i);return n(i)===n(s)?`Last fed ${l}`:n(i)===p?`Last fed yesterday \xB7 ${l}`:`Last fed ${new Intl.DateTimeFormat("en-US",{timeZone:r,month:"short",day:"numeric"}).format(i)} \xB7 ${l}`}render(){return this.config?u`<ha-card
      part="card outer"
      data-active=${String(this.scheduleActive)}
      @keydown=${e=>{e.key==="Escape"&&this.view!=="list"&&(e.preventDefault(),this.cancel())}}
    >
      ${u`<header
          part=${this.config.manual_feed?"header feed-container manual-feed row":"header feed-container"}
          data-active=${String(this.scheduleActive)}
          class=${this.config.manual_feed?"manual":""}
        >
          <button
            class="identity-add"
            part="add control"
            aria-label="Add meal"
            title="Add meal"
            ?disabled=${this.locked||this.failed||this.baseline.length>=Math.min(10,this.attrs.max_meals)}
            @click=${this.add}
          >
            <ha-icon
              part="header-icon"
              .icon=${this.config.icon??this.config.feed_icon??"mdi:food-drumstick"}
            ></ha-icon>
          </button>
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
          ${this.writable||this.busy||this.failed||this.conflict?this.baseline.map((e,i)=>u`<div
                      class="meal"
                      part="meal row"
                      data-enabled=${String(e.enabled)}
                    >
                      <button
                        class="meal-toggle"
                        part="enabled control"
                        role="switch"
                        aria-label=${`Enabled ${i+1}`}
                        aria-description=${`Meal ${i+1} at ${e.time}; tap to ${e.enabled?"disable":"enable"}`}
                        aria-checked=${String(e.enabled)}
                        aria-busy=${String(this.busy&&this.toggling===i)}
                        ?disabled=${this.locked||this.failed}
                        @click=${s=>{s.stopPropagation(),this.toggle(i,{target:s.currentTarget})}}
                      >
                        <ha-icon .icon=${this.mealIcon(e.time)}></ha-icon>
                      </button>
                      <button
                        part="meal-button"
                        class="open"
                        data-meal=${i}
                        aria-label=${`Edit meal ${i+1}`}
                        ?disabled=${this.locked||this.failed}
                        @click=${()=>this.openEditor(i)}
                      >
                        <span class="time" part="meal-time">${e.time}</span
                        ><span class="detail"
                          >Every day ·
                          <span aria-label=${`Portions ${i+1}`}
                            >${e.portions}</span
                          >
                          portion${e.portions===1?"":"s"}</span
                        >
                      </button>
                    </div>`):u`<div class="unavailable">Schedule unavailable</div>`}
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
      --icon-palette: var(
        --feeder-icon-color,
        var(--color-teal, var(--accent))
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
        var(--icon-palette)
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
    header .identity-add ha-icon {
      --mdc-icon-size: 25px;
      width: 45px;
      height: 45px;
      padding: 10px;
      border-radius: 50%;
      background: var(--feeder-header-icon-background, transparent);
      color: var(--feeder-header-icon-color, #9da0a2);
    }
    header:not(.edit-header):has(> .identity-add) {
      display: grid;
      grid-template-columns: 64px minmax(0, 1fr);
      gap: 0;
      margin-left: -10px;
      margin-right: -10px;
    }
    header .identity-add ha-icon {
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
    .manual > button:not(.feed):not(.identity-add) {
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
    header.manual:not(.edit-header):has(> .identity-add) {
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
    header:not(.edit-header):has(> .identity-add),
    header.manual:not(.edit-header):has(> .identity-add) {
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
    header[data-active="true"]:not(.edit-header):has(> .identity-add) {
      background: var(--feeder-active-card-background, white);
    }
    header .identity-add ha-icon {
      margin-left: 11.5px;
      background: var(--feeder-header-icon-background, transparent);
      color: var(--feeder-header-icon-color, var(--icon-palette));
    }
    .identity-add {
      width: 64px;
      min-height: 68px;
      padding: 0;
      display: flex;
      align-items: center;
      border-radius: inherit;
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
    header.manual:not(.edit-header):has(> .identity-add) {
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
      color: var(--icon-palette);
      background: transparent;
    }
    .meal[data-enabled="true"] .meal-toggle ha-icon {
      background: var(--feeder-active-icon-background, var(--icon-palette));
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
      header.manual:not(.edit-header):has(> .identity-add) {
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
  `}},ae=class extends f{static{this.properties={hass:{attribute:!1},config:{state:!0}}}setConfig(t){this.config={...t}}render(){let t={entity:"Schedule sensor",title:"Title",icon:"Identity icon (Add meal)",meal_icon_mode:"Meal icons",meal_icon:"Fixed meal icon",manual_feed:"Show manual feeding",feed_title:"Feeding title",feed_icon:"Feeding icon",portions_entity:"Portions helper (optional)",appearance:"Appearance",accent_color:"Accent color",icon_color:"Icon color",border_radius:"Corner radius",font_family:"Font family",header_font_size:"Header size",meal_time_font_size:"Meal time size",row_background:"Row color",card_background:"Card color",control_size:"Control size (minimum 44px)"};return u`<ha-form
      .hass=${this.hass}
      .data=${this.config}
      .schema=${[{name:"entity",required:!0,selector:{entity:{domain:"sensor",integration:"tuya_feeder"}}},{name:"title",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"meal_icon_mode",selector:{select:{options:[{value:"time_of_day",label:"Time of day"},{value:"fixed",label:"Fixed icon"}]}}},{name:"meal_icon",selector:{icon:{}}},{name:"manual_feed",selector:{boolean:{}}},{name:"feed_title",selector:{text:{}}},{name:"feed_icon",selector:{icon:{}}},{name:"portions_entity",selector:{entity:{domain:"input_number"}}},{name:"appearance",type:"expandable",schema:ne.map(e=>({name:e,selector:{text:{}}}))}]}
      .computeLabel=${e=>t[e.name]??e.name}
      @value-changed=${e=>{let i={...this.config,...e.detail.value};Ee(i.appearance),this.config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this.config},bubbles:!0,composed:!0}))}}
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
