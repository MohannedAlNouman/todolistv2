(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{32:function(e,t,n){e.exports=n(60)},60:function(e,t,n){"use strict";n.r(t);var a=n(0),c=n.n(a),l=n(29),o=n.n(l),i=n(1),r=n(8),u=n(30);n.n(u).a.config();var s=n(4),m=n(9),b=n.n(m);function E(){var e=Object(a.useState)({}),t=Object(r.a)(e,2),n=t[0],l=t[1],o=(Object({NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0}).PORT,b.a.create({baseURL:"https://mohanned-todolistv2.herokuapp.com/auth"}));return Object(a.useEffect)((function(){o.get("/pullUser",{withCredentials:!0}).then((function(e){l(e.data)})).catch((function(e){console.log(e)}))}),[]),c.a.createElement("div",null,c.a.createElement("h1",null,"Version 0000000000001 "),c.a.createElement("h6",null,"BEFORE YOU USE THIS WEBSITE, KNOW THAT I (MOHANNED AL NOUMAN) HAVE ACCESS TO ALL OF YOUR LISTS SO PLEASE DON'T POST ANYTHING PRIVATE"),c.a.createElement("h6",null,"This website may contain a few (probably a lot) of bugs"),c.a.createElement("h2",null,"Hello ",n.name?n.name:"anonymous"," and welcome to Mohanned's List App!"),c.a.createElement("div",{className:"col-sm-4"},c.a.createElement("div",{className:"card social-block"},c.a.createElement("div",{className:"card-body"},n.name?c.a.createElement("button",{onClick:function(){o.get("/logout",{withCredentials:!0}).then((function(e){l({})})).catch((function(e){console.log(e)}))},className:"btn btn-block",type:"submit"},"Logout"):c.a.createElement("a",{className:"btn btn-block",href:"/auth/google",role:"button"},c.a.createElement("i",{className:"fab fa-google"}),"Login with Google")))),c.a.createElement("br",null),n.name?c.a.createElement(s.b,{className:n.name?"":"invis",to:"/MyLists"},c.a.createElement("button",{variant:"outlined"},"Click here to view your lists")):c.a.createElement(s.b,{to:{pathname:"/CreateList",save:!1}},c.a.createElement("button",{variant:"outlined"},"Click here to create a new list (this will not be saved unless you login PRIOR to creating your list)")))}function d(){var e=Object(a.useState)({lists:[]}),t=Object(r.a)(e,2),n=t[0],l=t[1],o=Object(a.useState)([{}]),i=Object(r.a)(o,2),u=i[0],m=i[1],E=(Object({NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0}).PORT,b.a.create({baseURL:"https://mohanned-todolistv2.herokuapp.com/auth"}));function d(e){var t=e.target.value;E.delete("/api/"+t,{withCredentials:!0}).then((function(e){m(e.data)})).catch((function(e){console.log(e)}))}return Object(a.useEffect)((function(){E.get("/auth/pullUser",{withCredentials:!0}).then((function(e){l(e.data),m(e.data.lists)})).catch((function(e){console.log(e)}))}),[]),c.a.createElement("div",null,c.a.createElement("h1",null,"Hello ",n.name?n.name:"anonymous",", here are your lists:"),u.length>0?u.map((function(e,t){return c.a.createElement("div",null,c.a.createElement("p",{className:"vis"},e.listName?e.listName+" list":"unnamed list",c.a.createElement(s.b,{className:"invis",to:{pathname:"/CreateList",listId:e.listId,save:!0}},c.a.createElement("button",{variant:"outlined"},"Click here to access this list.")),c.a.createElement("button",{className:"invis",value:e.listId,onClick:d,type:"submit",name:"deleteButton"},"Delete")))})):c.a.createElement("p",null,"You don't have any lists yet! Get started!"),c.a.createElement(s.b,{to:{pathname:"/CreateList",save:!0}},c.a.createElement("button",{variant:"outlined"},"Click here to create a new list.")),c.a.createElement("br",null),c.a.createElement("br",null),c.a.createElement(s.b,{to:"/"},c.a.createElement("button",{variant:"outlined"},"Click here to return to the homepage.")))}var v=n(11);var f=function(e){return c.a.createElement("form",{action:"",method:""},c.a.createElement("li",{className:"vis"},e.content,c.a.createElement("button",{className:"invis",onClick:function(t){e.handUpda(t,e.cumIndex)},type:"submit",name:"updateButton"},"Update"),c.a.createElement("button",{className:"invis",onClick:function(t){e.handDele(t,e.cumIndex)},type:"submit",name:"deleteButton"},"Delete"),c.a.createElement("button",{className:"invis",onClick:function(t){e.handSubI(t,e.cumIndex)},type:"submit",name:"subItemButton"},"Add to sublist")))};function h(e){var t=Object(a.useState)(""),n=Object(r.a)(t,2),l=n[0],o=n[1],i=Object(a.useState)([]),u=Object(r.a)(i,2),s=u[0],m=u[1],E=Object(a.useState)(""),d=Object(r.a)(E,2),h=d[0],p=d[1],O=Object(a.useState)(e.listId?"/"+e.listId:""),g=Object(r.a)(O,2),S=g[0],C=g[1],j=Object(a.useState)("invis"),N=Object(r.a)(j,2),T=N[0],k=N[1],I=(Object({NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0}).PORT,b.a.create({baseURL:"https://mohanned-todolistv2.herokuapp.com/api"}));var y=b.a.CancelToken.source();function L(){var e={name:h,items:s};I.post(S,e,{cancelToken:y.token,withCredentials:!0}).then((function(e){C("/"+e.data)})).catch((function(e){console.log(e)}))}var _=0;I.interceptors.request.use((function(e){return _++,e}),(function(e){return Promise.reject(e)})),I.interceptors.response.use((function(e){return _--,console.log("------------  Previous request was successful. Remaining Ajax requests: "+_),e}),(function(e){return _--,console.log("------------  Previous request was unsuccessful. Remaining Ajax requests: "+_),Promise.reject(e)}));var D=Object(a.useRef)(!S);Object(a.useEffect)((function(){D.current||I.get(S,{withCredentials:!0}).then((function(e){m(Object(v.a)(e.data.items)),p(e.data.name)})).catch((function(e){console.log(e)}))}),[]);var R=Object(a.useRef)(2);Object(a.useEffect)((function(){e.save?R.current>0?(R.current--,D.current&&R.current--,0===R.current&&k()):1===_?(console.log("cancel previous axios call"),y.cancel(),L()):L():T&&k()}),[s,h]);var P=Object(a.useRef)(null);function w(e,t){m((function(e){var n=e.map((function(e){return Object.assign({},e)}));return function e(t,n){var a=n[0];1===n.length?t[a].item=l:(n.splice(0,1),e(t[a].items,n))}(n,t),n})),e.preventDefault(),o("")}function U(e,t){m((function(e){var n=e.map((function(e){return Object.assign({},e)}));return function e(t,n){var a=n[0];1===n.length?t.splice(a,1):(n.splice(0,1),e(t[a].items,n))}(n,t),n})),e.preventDefault()}function A(e,t){m((function(e){var n=e.map((function(e){return Object.assign({},e)}));return function e(t,n){var a=n[0];1===n.length?t[a].items=t[a].items?[].concat(Object(v.a)(t[a].items),[{item:l}]):[{item:l}]:(n.splice(0,1),e(t[a].items,n))}(n,t),n})),o(""),e.preventDefault()}return Object(a.useEffect)((function(){P.current.focus()}),[s,T]),c.a.createElement("div",null,c.a.createElement("h3",{className:"vis"},h||"New"," list",c.a.createElement("button",{className:"invis",onClick:function(){p(l),o("")},type:"submit",name:"titleButton"},"Change title")),function e(t,n){var a=n||[];return c.a.createElement("ul",null,t.map((function(t,n){return c.a.createElement("div",null,c.a.createElement(f,{content:t.item,key:[].concat(Object(v.a)(a),[n]),cumIndex:[].concat(Object(v.a)(a),[n]),handUpda:w,handDele:U,handSubI:A}),t.items&&0!==t.items.length&&e(t.items,[].concat(Object(v.a)(a),[n])))})))}(s),c.a.createElement("form",null,c.a.createElement("input",{className:T,onChange:function(e){var t=e.target.value;o(t)},type:"text",name:"userInput",value:l,ref:P}),c.a.createElement("button",{className:T,onClick:function(e){var t={item:l};m((function(e){return[].concat(Object(v.a)(e),[t])})),o(""),e.preventDefault()},type:"submit",name:"submitButton"},"Submit")))}function p(e){return c.a.createElement("div",null,c.a.createElement(h,{listId:e.location.listId,save:e.location.save}),c.a.createElement("br",null),c.a.createElement(s.b,{to:"/"},c.a.createElement("button",{variant:"outlined"},"Click here to return to the homepage")),e.location.save&&c.a.createElement(s.b,{to:"/MyLists"},c.a.createElement("button",{variant:"outlined"},"Click here to return to your lists")))}var O=function(){return c.a.createElement(i.c,null,c.a.createElement(i.a,{exact:!0,path:"/",component:E}),c.a.createElement(i.a,{exact:!0,path:"/MyLists",component:d}),c.a.createElement(i.a,{exact:!0,path:"/CreateList",component:p}))};o.a.render(c.a.createElement(s.a,null,c.a.createElement(O,null)),document.getElementById("root"))}},[[32,1,2]]]);
//# sourceMappingURL=main.53b8f605.chunk.js.map