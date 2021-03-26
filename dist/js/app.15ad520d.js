(function(t){function e(e){for(var i,s,r=e[0],l=e[1],d=e[2],h=0,u=[];h<r.length;h++)s=r[h],Object.prototype.hasOwnProperty.call(o,s)&&o[s]&&u.push(o[s][0]),o[s]=0;for(i in l)Object.prototype.hasOwnProperty.call(l,i)&&(t[i]=l[i]);c&&c(e);while(u.length)u.shift()();return a.push.apply(a,d||[]),n()}function n(){for(var t,e=0;e<a.length;e++){for(var n=a[e],i=!0,r=1;r<n.length;r++){var l=n[r];0!==o[l]&&(i=!1)}i&&(a.splice(e--,1),t=s(s.s=n[0]))}return t}var i={},o={app:0},a=[];function s(e){if(i[e])return i[e].exports;var n=i[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=t,s.c=i,s.d=function(t,e,n){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},s.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)s.d(n,i,function(e){return t[e]}.bind(null,i));return n},s.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="/";var r=window["webpackJsonp"]=window["webpackJsonp"]||[],l=r.push.bind(r);r.push=e,r=r.slice();for(var d=0;d<r.length;d++)e(r[d]);var c=l;a.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"034f":function(t,e,n){"use strict";n("85ec")},3531:function(t,e,n){},"3b26":function(t,e,n){},"56d7":function(t,e,n){"use strict";n.r(e);n("e260"),n("e6cf"),n("cca6"),n("a79d");var i=n("2b0e"),o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("Tree")],1)},a=[],s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"wrapper"},[n("modal",{attrs:{name:"info-modal",adaptive:!0,height:"auto",width:"500px"}},[n("div",{attrs:{id:"modal"}},[n("table",{staticClass:"info-table"},t._l(t.info,(function(e,i){return n("tr",{key:i,staticClass:"info-row"},[n("td",{staticClass:"info-col-action"},[t._v(" "+t._s(e.action)+" ")]),n("td",{staticClass:"info-col-hotkey"},[t._v(" "+t._s(e.hotkey)+" ")])])})),0)])]),n("button",{attrs:{id:"modal-button"},on:{click:function(e){return t.$modal.show("info-modal")}}},[t._v("Help")]),n("vue-tree",{key:t.counter,staticStyle:{width:"100%",height:"100%"},attrs:{dataset:t.tree,config:t.treeConfig,direction:"horizontal"},scopedSlots:t._u([{key:"node",fn:function(e){var i=e.node;return[n("div",{class:{highlighted:i._gid===t.tree.lastNode._gid,stack:i.childrenLength&&i.collapsed},staticStyle:{padding:"1rem","border-radius":"0.2rem","background-color":"grey",color:"white","user-select":"none"},on:{click:function(e){return t.setLastNode(i)}}},[i.editing?n("input",{directives:[{name:"model",rawName:"v-model",value:i._nameEdit,expression:"node._nameEdit"}],ref:"node-#"+i._gid,domProps:{value:i._nameEdit},on:{blur:t.blurLastNode,input:function(e){e.target.composing||t.$set(i,"_nameEdit",e.target.value)}}}):n("span",{staticClass:"tree-node"},[t._v(t._s(i.value)+" ")])])]}}])})],1)},r=[],l=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{ref:"container",staticClass:"tree-container"},[n("svg",{ref:"svg",staticClass:"svg vue-tree",style:t.initialTransformStyle}),n("div",{ref:"domContainer",staticClass:"dom-container",style:t.initialTransformStyle},t._l(t.nodeDataList,(function(e){return n("div",{key:e.data._key,staticClass:"node-slot",style:{left:t.formatDimension(t.direction===t.DIRECTION.VERTICAL?e.x:e.y),top:t.formatDimension(t.direction===t.DIRECTION.VERTICAL?e.y:e.x),width:t.formatDimension(t.config.nodeWidth),height:t.formatDimension(t.config.nodeHeight)}},[t._t("node",[n("span",[t._v(t._s(e.data.value))])],{node:e.data,collapsed:e.data._collapsed})],2)})),0)])},d=[],c=n("3835"),h=n("2909"),u=(n("a15b"),n("99af"),n("466d"),n("ac1f"),n("d3b7"),n("25f0"),n("fb6a"),n("5319"),n("5698")),f=/translate\((-?\d+)px, ?(-?\d+)px\)/i,g=/scale\((\S*)\)/i,p={CURVE:"curve",STRAIGHT:"straight"},v={VERTICAL:"vertical",HORIZONTAL:"horizontal"},y=100,N=100,_=200,m=0;function k(){for(var t=[],e="0123456789abcdef",n=0;n<36;n++)t[n]=e.substr(Math.floor(16*Math.random()),1);return t[14]="4",t[19]=e.substr(3&t[19]|8,1),t[8]=t[13]=t[18]=t[23]="-",t.join("")}function b(t){var e=t.x,n=t.y;return{x:n,y:e}}var w={name:"vue-tree",props:{config:{type:Object,default:function(){return{nodeWidth:y,nodeHeight:N,levelHeight:_}}},linkStyle:{type:String,default:p.CURVE},direction:{type:String,default:v.VERTICAL},dataset:{type:Object,required:!0}},data:function(){return{d3:u,colors:"568FE1",nodeDataList:[],linkDataList:[],initTransformX:0,initTransformY:0,DIRECTION:v,currentScale:1}},computed:{initialTransformStyle:function(){return{transform:"scale(1) translate(".concat(this.initTransformX,"px, ").concat(this.initTransformY,"px)"),transformOrigin:"center"}}},created:function(){this.addUniqueKey(this.dataset),window.addEventListener("wheel",this.handleZoom),window.addEventListener("auxclick",this.handleZoom)},mounted:function(){this.init()},beforeDestroyed:function(){window.removeEventListener("wheel",this.handleZoom),window.removeEventListener("auxclick",this.handleZoom)},methods:{handleZoom:function(t){if(2===t.which)return this.restoreScale();((t.deltaY||-t.wheelDelta||t.detail)>>10||1)<0?this.zoomIn():this.zoomOut()},init:function(){this.draw(),this.enableDrag(),this.initTransform()},zoomIn:function(){var t,e,n=null===(t=this.$refs.domContainer)||void 0===t||null===(e=t.style)||void 0===e?void 0:e.transform;if(n){var i=1.2,o=n.match(g);if(o&&o.length>0){var a=parseFloat(o[1]);i*=a}this.setScale(i)}},zoomOut:function(){var t,e,n=null===(t=this.$refs.domContainer)||void 0===t||null===(e=t.style)||void 0===e?void 0:e.transform;if(n){var i=1/1.2,o=n.match(g);if(o&&o.length>0){var a=parseFloat(o[1]);i=a/1.2}this.setScale(i)}},restoreScale:function(){this.setScale(1)},setScale:function(t){var e,n;if("number"===typeof t){var i=this.getTranslate();if(i){var o="translate(".concat(i[0],"px, ").concat(i[1],"px)");null!==(e=this.$refs.domContainer)&&void 0!==e&&null!==(n=e.style)&&void 0!==n&&n.transform&&(this.$refs.svg.style.transform="scale(".concat(t,") ")+o,this.$refs.domContainer.style.transform="scale(".concat(t,") ")+o,this.currentScale=t)}}},getTranslate:function(){var t,e=null===(t=this.$refs.svg)||void 0===t?void 0:t.style.transform;if(e){var n=e.match(f);if(null===n)return[null,null];var i=parseInt(n[1]),o=parseInt(n[2]);return[i,o]}},isVertical:function(){return this.direction===v.VERTICAL},addUniqueKey:function(t){var e=[t];while(0!==e.length){var n=e.pop();n._key=k(),n.children&&e.push.apply(e,Object(h["a"])(n.children))}return t},initTransform:function(){var t=this.$refs.container.offsetWidth,e=this.$refs.container.offsetHeight;this.isVertical()?(this.initTransformX=Math.floor(t/2),this.initTransformY=Math.floor(this.config.nodeHeight)):(this.initTransformX=Math.floor(this.config.nodeWidth),this.initTransformY=Math.floor(e/2))},generateLinkPath:function(t){var e=this;if(this.linkStyle===p.CURVE){var n=this.isVertical()?u["linkVertical"]():u["linkHorizontal"]();return n.x((function(t){return t.x})).y((function(t){return t.y})).source((function(t){var n={x:t.source.x,y:t.source.y};return e.direction===e.DIRECTION.VERTICAL?n:b(n)})).target((function(t){var n={x:t.target.x,y:t.target.y};return e.direction===e.DIRECTION.VERTICAL?n:b(n)})),n(t)}if(this.linkStyle===p.STRAIGHT){var i=u["path"](),o={x:t.source.x,y:t.source.y},a={x:t.target.x,y:t.target.y};this.isVertical()||(o=b(o),a=b(a));var s=a.x-o.x,r=a.y-o.y,l=this.isVertical()?{x:o.x,y:o.y+r/2}:{x:o.x+s/2,y:o.y},d=this.isVertical()?{x:a.x,y:o.y+r/2}:{x:o.x+s/2,y:a.y};return i.moveTo(o.x,o.y),i.lineTo(l.x,l.y),i.lineTo(d.x,d.y),i.lineTo(a.x,a.y),i.toString()}},draw:function(){var t=this.buildTree(this.dataset),e=Object(c["a"])(t,2),n=e[0],i=e[1];this.linkDataList=i,this.svg=this.d3.select(this.$refs.svg);var o=this,a=this.svg.selectAll(".link").data(i,(function(t){return"".concat(t.source.data._key,"-").concat(t.target.data._key)}));a.enter().append("path").style("opacity",0).transition().duration(m).ease(u["easeCubicInOut"]).style("opacity",1).attr("class","link").attr("d",(function(t){return o.generateLinkPath(t)})),a.transition().duration(m).ease(u["easeCubicInOut"]).attr("d",(function(t){return o.generateLinkPath(t)})),a.exit().transition().duration(m/2).ease(u["easeCubicInOut"]).style("opacity",0).remove(),this.nodeDataList=n},buildTree:function(t){var e=this.d3.tree().nodeSize([this.config.nodeWidth,this.config.levelHeight]),n=e(this.d3.hierarchy(t));return[n.descendants(),n.links()]},enableDrag:function(){var t=this,e=this.$refs.svg,n=this.$refs.container,i=0,o=0,a=!1,s="";n.onmousedown=function(t){s=e.style.transform,i=t.clientX,o=t.clientY,a=!0},n.onmousemove=function(n){if(a){var r=s,l=0,d=0;if(r){var h=r.match(f);if(null!==h&&0!==h.length){var u=h.slice(1),g=Object(c["a"])(u,2),p=g[0],v=g[1];l=parseInt(p),d=parseInt(v)}}var y=Math.floor((n.clientX-i)/t.currentScale)+l,N=Math.floor((n.clientY-o)/t.currentScale)+d,_="translate(".concat(y,"px, ").concat(N,"px)");r&&(_=r.replace(f,_)),e.style.transform=_,t.$refs.domContainer.style.transform=_}},n.onmouseup=function(){i=0,o=0,a=!1}},onClickNode:function(t){var e=this.nodeDataList[t];e.data.children?(e.data._children=e.data.children,e.data.children=null,e.data._collapsed=!0):(e.data.children=e.data._children,e.data._children=null,e.data._collapsed=!1),this.draw()},formatDimension:function(t){return"number"===typeof t?"".concat(t,"px"):-1!==t.indexOf("px")?t:"".concat(t,"px")},parseDimensionNumber:function(t){return"number"===typeof t?t:parseInt(t.replace("px",""))}},watch:{dataset:function(){this.draw()}}},L=w,x=(n("fb21"),n("ffe4"),n("2877")),T=Object(x["a"])(L,l,d,!1,null,"47f63b8c",null),C=T.exports,E=new i["a"];function P(){window.addEventListener("keydown",O)}function O(t){var e=S(t);switch(e){case"tab":n("tree-add-child",null,{prevent:!0});break;case"enter":n("tree-add-sibling");break;case"c":n("tree-node-collapse");break;case"e":n("tree-node-edit",t);break;case"d":case"delete":n("tree-delete-last-node");break;case"arrowup":n("tree-go-up");break;case"arrowdown":n("tree-go-down");break;case"arrowleft":n("tree-go-left");break;case"arrowright":n("tree-go-right");break;default:break}function n(e,n){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{prevent:!1};i.prevent&&t.preventDefault(),E.$emit(e,n)}}function S(t){var e=[];return t.ctrlKey&&"Control"!==t.key&&e.push("ctrl"),t.altKey&&"Alt"!==t.key&&e.push("alt"),t.shiftKey&&"Shift"!==t.key&&e.push("shift"),e.push(t.key.toLowerCase()),e.join("+")}var $=n("d4ec"),D=n("bee2"),I=(n("a434"),n("b0c0"),function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;Object($["a"])(this,t),this._gid=e,this._id=n,this._name="",this._nameEdit="",this._parentNode=i,this._children=[],this._collapsed=!1,this._depth=o,this._el=null,this._editing=null!==i,this._firstEdit=!0}return Object(D["a"])(t,[{key:"addChild",value:function(e){e instanceof t&&this._children.push(e)}},{key:"setEditing",value:function(t){this.editing=t}},{key:"id",get:function(){return this._id}},{key:"parent",get:function(){return this._parentNode}},{key:"children",get:function(){return this.collapsed?[]:this._children}},{key:"collapsed",get:function(){return this._collapsed},set:function(t){this._children.length&&(this._collapsed=t)}},{key:"name",get:function(){return this._name||"node #".concat(this._gid)},set:function(t){this._name=t,this.setEditing(!1)}},{key:"nameEdit",get:function(){return this._nameEdit}},{key:"editing",get:function(){return this._editing},set:function(t){this._editing=t,this._firstEdit=!1}},{key:"depth",get:function(){return this._depth}},{key:"childrenLength",get:function(){return this._children.length}},{key:"value",get:function(){return this._name||"node #".concat(this._gid)}},{key:"el",get:function(){return this._el},set:function(t){this._el=t}}]),t}()),j=function(){function t(){Object($["a"])(this,t),this._root=new I(this.counter,0,null,0),this._connections=[],this.lastNode=this._root,this._counter=0}return Object(D["a"])(t,[{key:"addSibling",value:function(){if(this._lastNode.editing)return this.setLastNodeName();var t=this.createNode(this.lastNodeID,this.lastNodeParent?this.lastNodeParent:this._root,this._lastNode.depth||1);this.lastNodeParent?this.pushNode(this.lastNodeParent.children,t):this.pushNode(this._root.children,t),this.lastNode=t}},{key:"addChild",value:function(){if(this._lastNode.editing){if(!this._lastNode._firstEdit)return;this.deleteLastNode()}var t=this._lastNode?this._lastNode.children.length:this.lastNodeID,e=this.createNode(t,this._lastNode,(this._lastNode.depth||0)+1);this._lastNode?this.pushNode(this._lastNode.children,e):this.pushNode(this._root,e),this.lastNode=e,this.lastNodeParent.collapsed=!1}},{key:"pushNode",value:function(t,e){t.push(e)}},{key:"createNode",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,n=arguments.length>2?arguments[2]:void 0;return new I(this.counter,t,e,n)}},{key:"deleteLastNode",value:function(){var t,e;if((!this._lastNode.editing||this._lastNode._firstEdit)&&this.lastNodeParent){var n=null;n=this._lastNode.id-1>=0?this.lastNodeParent.children[this._lastNode.id-1]:null!==(t=this.lastNodeParent)&&void 0!==t&&null!==(e=t.parent)&&void 0!==e&&e.children?this.lastNodeParent.parent.children[this.lastNodeParent.parent.children.length-1]:this.lastNodeParent,this.lastNodeParent.children.splice(this._lastNode.id,1),this.lastNode=n}}},{key:"collapseLastNode",value:function(){this._lastNode.collapsed=!this._lastNode.collapsed}},{key:"editLastNode",value:function(){this._lastNode.setEditing(!0)}},{key:"blurLastNode",value:function(){this._lastNode._firstEdit?this.deleteLastNode():this._lastNode.editing=!1}},{key:"setLastNodeName",value:function(){this._lastNode.name=this._lastNode.nameEdit,this._lastNode.editing=!1}},{key:"goUp",value:function(){var t;if(!this._lastNode.editing)if(this._lastNode.id-1>=0)this.lastNode=this.lastNodeParent.children[this._lastNode.id-1];else if((null===(t=this.lastNodeParent)||void 0===t?void 0:t.id)>0&&this.lastNodeParent.parent){for(var e,n=this.lastNodeParent.id-1;n>=0;n--)if(this.lastNodeParent.parent.children[n].children.length){e=this.lastNodeParent.parent.children[n];break}e&&(this.lastNode=e.children[e.children.length-1])}}},{key:"goDown",value:function(){if(!this._lastNode.editing)if(this._lastNode.id+1<this.lastNodeParent.children.length)this.lastNode=this.lastNodeParent.children[this._lastNode.id+1];else if(this.lastNodeParent.parent&&this.lastNodeParent.id<this.lastNodeParent.parent.children.length){for(var t,e=this.lastNodeParent.id+1;e<this.lastNodeParent.parent.children.length;e++)if(this.lastNodeParent.parent.children[e].children.length){t=this.lastNodeParent.parent.children[e];break}t&&(this.lastNode=t.children[0])}}},{key:"goLeft",value:function(){var t,e;this._lastNode.editing||null!==(t=this._lastNode)&&void 0!==t&&null!==(e=t.parent)&&void 0!==e&&e.parent&&(this.lastNode=this._lastNode.parent)}},{key:"goRight",value:function(){if(!this._lastNode.editing&&this._lastNode&&this._lastNode.children.length){var t=Math.floor(this._lastNode.children.length/2);this.lastNode=this._lastNode.children[t]}}},{key:"children",get:function(){return this._root.children}},{key:"name",get:function(){return"root"}},{key:"connections",get:function(){return this._connections}},{key:"lastNodeID",get:function(){return this.lastNodeParent?this.lastNodeParent.children.length:this._root.children.length}},{key:"lastNode",get:function(){return this._lastNode},set:function(t){var e;if(!(t instanceof I))return null!==t&&void 0!==t&&t._root?null:console.error("".concat(t," is not instance of Node"));null===(e=this._lastNode)||void 0===e||e.setEditing(!1),this._lastNode=t}},{key:"value",get:function(){return"root"}},{key:"lastNodeParent",get:function(){var t;return(null===(t=this._lastNode)||void 0===t?void 0:t.parent)||null}},{key:"counter",get:function(){return this._counter++}},{key:"canvas",get:function(){return this._canvas}},{key:"arrows",get:function(){return this._arrows}}]),t}(),R=new j,V={components:{VueTree:C},data:function(){return{tree:R,counter:0,info:[{action:"Add sibling",hotkey:"Enter"},{action:"Add child",hotkey:"Tab"},{action:"Edit selected node",hotkey:"E"},{action:"Collapse selected node",hotkey:"C"},{action:"Delete selected node",hotkey:"D / Delete"}],treeConfig:{nodeWidth:120,nodeHeight:80,levelHeight:200}}},created:function(){var t=this;E.$on("tree-add-sibling",this.addSibling),E.$on("tree-add-child",this.addChild),E.$on("tree-set-last-node",(function(e){e&&e[0]&&t.setLastNode(e[0])})),E.$on("tree-node-collapse",this.collapseLastNode),E.$on("tree-node-edit",(function(e){return t.editLastNode(e)})),E.$on("tree-delete-last-node",this.deleteLastNode),E.$on("tree-delete-last-level",this.deleteLastLevel),E.$on("tree-go-up",this.goUp),E.$on("tree-go-down",this.goDown),E.$on("tree-go-left",this.goLeft),E.$on("tree-go-right",this.goRight)},methods:{addSibling:function(){var t=this;R.addSibling(),this.updateKey(),this.$nextTick((function(){var e;null===(e=t.$refs["node-#".concat(R.lastNode._gid)])||void 0===e||e.focus()}))},addChild:function(){var t=this;R.addChild(),this.updateKey(),this.$nextTick((function(){var e;null===(e=t.$refs["node-#".concat(R.lastNode._gid)])||void 0===e||e.focus()}))},setLastNodeName:function(){R.setLastNodeName(),this.updateKey()},setLastNode:function(t){if(R.lastNode._gid===t._gid)return this.collapseLastNode();R.lastNode=t},editLastNode:function(t){var e=this;R.lastNode.editing||null===t||void 0===t||t.preventDefault(),R.editLastNode(),this.$nextTick((function(){var t;null===(t=e.$refs["node-#".concat(R.lastNode._gid)])||void 0===t||t.focus()}))},blurLastNode:function(){R.blurLastNode(),this.updateKey()},collapseLastNode:function(){R.collapseLastNode(),this.updateKey()},deleteLastNode:function(){R.deleteLastNode(),this.updateKey()},goUp:function(){R.goUp()},goDown:function(){R.goDown()},goLeft:function(){R.goLeft()},goRight:function(){R.goRight()},getID:function(t){return t._gid},clickedText:function(t){this.setLastNode(t.data)},clickedNode:function(t){this.setLastNode(t.data),R.collapseLastNode()},updateKey:function(){this.counter++}}},A=V,M=(n("6d36"),Object(x["a"])(A,s,r,!1,null,"cfd88a92",null)),H=M.exports,K={name:"App",components:{Tree:H}},U=K,z=(n("034f"),Object(x["a"])(U,o,a,!1,null,null,null)),Y=z.exports,W=n("1881"),X=n.n(W);P(),i["a"].use(X.a,{componentName:"Modal"}),i["a"].config.productionTip=!1,new i["a"]({render:function(t){return t(Y)}}).$mount("#app")},"6d36":function(t,e,n){"use strict";n("3b26")},"85ec":function(t,e,n){},b358:function(t,e,n){},fb21:function(t,e,n){"use strict";n("3531")},ffe4:function(t,e,n){"use strict";n("b358")}});
//# sourceMappingURL=app.15ad520d.js.map