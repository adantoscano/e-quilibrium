(this.webpackJsonpfront=this.webpackJsonpfront||[]).push([[0],{179:function(e,t,n){e.exports=n(400)},208:function(e,t){},210:function(e,t){},397:function(e,t,n){},400:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(28),i=n.n(o),s=n(168),c=n(22),u=n.n(c),l=n(44),d=n(156),h=n(157),p=n(170),f=n(169),m=n(93),S=n.n(m),v=n(401),w=n(410),C=n(158),g=n.n(C),E=n(160),k=n.n(E),b=n(45),y=n.n(b),O=n(19);function x(e){var t=e.size,n=e.points,a=e.pointerX,o=e.pointerY,i=t||window.innerWidth,s=i/2;function c(e){return parseInt(function(e){return e>90?90:e<-90?-90:e}(e)*(i/180)+i/2)}return r.a.createElement(O.Stage,{height:i,width:i},r.a.createElement(O.Layer,null,r.a.createElement(O.Line,{points:n.map(c),stroke:"#df4b26",strokeWidth:5,tension:.5,lineCap:"round"}),r.a.createElement(O.Circle,{x:c(a),y:c(o),stroke:"green",radius:s/25}),r.a.createElement(O.Circle,{x:i/2,y:i/2,stroke:"black",radius:s}),r.a.createElement(O.Circle,{x:i/2,y:i/2,stroke:"black",radius:s/4*3}),r.a.createElement(O.Circle,{x:i/2,y:i/2,stroke:"black",radius:s/2}),r.a.createElement(O.Circle,{x:i/2,y:i/2,stroke:"black",radius:s/4}),r.a.createElement(O.Circle,{x:i/2,y:i/2,stroke:"black",radius:1})))}var T=Object({NODE_ENV:"production",PUBLIC_URL:"/e-quilibrium",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0}).REACT_APP_API_URL||"http://localhost:3000",D=function(e){Object(p.a)(n,e);var t=Object(f.a)(n);function n(){var e;return Object(d.a)(this,n),(e=t.call(this)).handleScan=function(){var t=Object(l.a)(u.a.mark((function t(n){var a;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(e.state.qrData||!n){t.next=6;break}return e.setState({qrData:n,showQRScanner:!1}),t.next=4,y()(n);case 4:a=t.sent,e.peer.signal(a.data.offer);case 6:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),e.handleStartMeasure=function(){if(e.state.isConnectedToDevice&&e.peer.send(JSON.stringify({startMeasure:!0})),parseInt(e.state.timerCount)>0)var t=e.state.timerCount,n=setInterval((function(){e.setState({timerCount:e.state.timerCount-1}),e.state.timerCount<=0&&(e.handleStopMeasure(),e.setState({timerCount:t}),clearInterval(n))}),1e3);window.addEventListener("deviceorientation",e.startMeasure,!0)},e.handleStopMeasure=function(){window.removeEventListener("deviceorientation",e.startMeasure,!0),e.setState({startMeasure:!1})},e.handleShowQRScanner=function(){e.peer=new S.a({trickle:!1}),e.peer.on("error",(function(e){return console.log("error",e)})),e.peer.on("signal",function(){var t=Object(l.a)(u.a.mark((function t(n){var a;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return console.log("SIGNAL",JSON.stringify(n)),t.next=3,y.a.post(e.state.qrData,n);case 3:a=t.sent,e.setState({answer:a.data});case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()),e.peer.on("connect",(function(){console.log("CONNECT"),e.setState({isConnectedToHUD:!0})})),e.peer.on("data",(function(t){JSON.parse(t.toString()).startMeasure&&e.handleStartMeasure()})),e.setState({showQRScanner:!0})},e.handleConnectToDevice=function(){e.peer=new S.a({initiator:!0,trickle:!1}),e.peer.on("error",(function(e){return console.log("error",e)})),e.peer.on("signal",function(){var t=Object(l.a)(u.a.mark((function t(n){var a;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return console.log("SIGNAL",JSON.stringify(n)),t.next=3,y.a.post(T,n);case 3:a=t.sent,console.log("SIGNAL",JSON.stringify(a)),e.setState({offer:a.data}),e.getServerAnswer();case 7:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()),e.peer.on("connect",(function(){console.log("CONNECT"),e.setState({isConnectedToDevice:!0})})),e.peer.on("data",(function(t){e.setState(JSON.parse(t.toString()))}))},e.getServerAnswer=Object(l.a)(u.a.mark((function t(){var n;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return console.log("Getting"),t.next=3,y()(e.state.offer);case 3:(n=t.sent).data&&n.data.answer?e.peer.signal(n.data.answer):setTimeout((function(){return e.getServerAnswer()}),1e3);case 5:case"end":return t.stop()}}),t)}))),e.startMeasure=function(t){var n=t.beta,a=t.gamma,r=parseFloat(a).toPrecision(5),o=parseFloat(n).toPrecision(5);r&&o&&e.setState({points:[].concat(Object(s.a)(e.state.points),[parseInt(r),parseInt(o)])})},e.state={answer:"",offer:"",data:"",dataToSend:"",qrData:"",orientation:{x:0,y:0},points:[],timerCount:0,showQRScanner:!1,isConnectedToDevice:!1,isConnectedToHUD:!1},e.radarSize=Math.min(window.innerHeight,window.innerWidth),e.getPointer=function(t){var n=t.beta,a=t.gamma,r=parseFloat(a).toPrecision(5),o=parseFloat(n).toPrecision(5);r&&o&&e.setState({orientation:{x:r,y:o}})},e.handleError=function(e){console.error(e)},e.sendOrientation=function(t){var n=t.beta,a=t.gamma;e.peer.send([a,n])},e}return Object(h.a)(n,[{key:"componentDidMount",value:function(){window.addEventListener("deviceorientation",this.getPointer,!0)}},{key:"componentDidUpdate",value:function(){this.state.isConnectedToHUD&&this.peer.send(JSON.stringify({orientation:this.state.orientation,points:this.state.points,timerCount:this.state.timerCount}))}},{key:"render",value:function(){var e=this;return r.a.createElement("div",null,this.state.showQRScanner&&r.a.createElement(g.a,{delay:300,onError:this.handleError,onScan:this.handleScan,style:{width:"100%"}}),r.a.createElement(x,{pointerX:this.state.orientation.x,pointerY:this.state.orientation.y,points:this.state.points,size:this.radarSize}),this.state.offer&&r.a.createElement(k.a,{value:this.state.offer,includeMargin:!0}),r.a.createElement(v.a,{onClick:this.handleStartMeasure},"Start measure"),r.a.createElement(v.a,{onClick:this.handleStopMeasure},"Stop measure"),r.a.createElement(v.a,{onClick:function(){return e.setState({points:[]})}},"Clear measure"),r.a.createElement(v.a,{onClick:this.handleShowQRScanner},"Connect with screen"),r.a.createElement(v.a,{onClick:this.handleConnectToDevice},"Connect with device"),r.a.createElement(w.a,{placeholder:"Time in seconds",onChange:function(t){return e.setState({timerCount:t.target.value})}}),this.state.timerCount," ",r.a.createElement("br",null),this.state.orientation.x," ",r.a.createElement("br",null),this.state.orientation.y," ",r.a.createElement("br",null),this.state.qrData," ",r.a.createElement("br",null))}}]),n}(r.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));n(397),n(398);var M=document.getElementById("root");i.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(D,null)),M),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[179,1,2]]]);
//# sourceMappingURL=main.5144d49a.chunk.js.map