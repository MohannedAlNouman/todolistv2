(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{30:function(e,t,n){e.exports=n(57)},57:function(e,t,n){"use strict";n.r(t);var a=n(0),c=n.n(a),l=n(28),o=n.n(l),i=n(1),r=n(8),s=n(4),u=n(9),m=n.n(u);function b(){var e=Object(a.useState)({}),t=Object(r.a)(e,2),n=t[0],l=t[1],o=m.a.create({baseURL:"http://localhost:3000/auth"});return Object(a.useEffect)((function(){o.get("/pullUser",{withCredentials:!0}).then((function(e){l(e.data)})).catch((function(e){console.log(e)}))}),[]),c.a.createElement("div",null,c.a.createElement("h1",null,"Version 0000000000004 "),c.a.createElement("h6",null,"BEFORE YOU USE THIS WEBSITE, KNOW THAT I (MOHANNED AL NOUMAN) HAVE ACCESS TO ALL OF YOUR LISTS SO PLEASE DON'T POST ANYTHING PRIVATE"),c.a.createElement("h6",null,"This website may contain a few (probably a lot) of bugs"),c.a.createElement("h2",null,"Hello ",n.name?n.name:"anonymous"," and welcome to Mohanned's List App!"),c.a.createElement("div",{className:"col-sm-4"},c.a.createElement("div",{className:"card social-block"},c.a.createElement("div",{className:"card-body"},n.name?c.a.createElement("button",{onClick:function(){o.get("/logout",{withCredentials:!0}).then((function(e){l({})})).catch((function(e){console.log(e)}))},className:"btn btn-block",type:"submit"},"Logout"):c.a.createElement("a",{className:"btn btn-block",href:"/auth/google",role:"button"},c.a.createElement("i",{className:"fab fa-google"}),"Login with Google")))),c.a.createElement("br",null),n.name?c.a.createElement(s.b,{className:n.name?"":"invis",to:"/MyLists"},c.a.createElement("button",{variant:"outlined"},"Click here to view your lists")):c.a.createElement(s.b,{to:{pathname:"/CreateList",save:!1}},c.a.createElement("button",{variant:"outlined"},"Click here to create a new list (this will not be saved unless you login PRIOR to creating your list)")))}function f(){var e=Object(a.useState)({lists:[]}),t=Object(r.a)(e,2),n=t[0],l=t[1],o=Object(a.useState)([{}]),i=Object(r.a)(o,2),u=i[0],b=i[1],f=m.a.create({baseURL:"https://mohanned-todolistv2.herokuapp.com"});function h(e){var t=e.target.value;f.delete("/api/"+t,{withCredentials:!0}).then((function(e){b(e.data)})).catch((function(e){console.log(e)}))}return Object(a.useEffect)((function(){f.get("/auth/pullUser",{withCredentials:!0}).then((function(e){l(e.data),b(e.data.lists)})).catch((function(e){console.log(e)}))}),[]),c.a.createElement("div",null,c.a.createElement("h1",null,"Hello ",n.name?n.name:"anonymous",", here are your lists:"),u.length>0?u.map((function(e,t){return c.a.createElement("div",null,c.a.createElement("p",{className:"vis"},e.listName?e.listName+" list":"unnamed list",c.a.createElement(s.b,{className:"invis",to:{pathname:"/CreateList",listId:e.listId,save:!0}},c.a.createElement("button",{variant:"outlined"},"Click here to access this list.")),c.a.createElement("button",{className:"invis",value:e.listId,onClick:h,type:"submit",name:"deleteButton"},"Delete")))})):c.a.createElement("p",null,"You don't have any lists yet! Get started!"),c.a.createElement(s.b,{to:{pathname:"/CreateList",save:!0}},c.a.createElement("button",{variant:"outlined"},"Click here to create a new list.")),c.a.createElement("br",null),c.a.createElement("br",null),c.a.createElement(s.b,{to:"/"},c.a.createElement("button",{variant:"outlined"},"Click here to return to the homepage.")))}var h=n(11);var E=function(e){return c.a.createElement("form",{action:"",method:""},c.a.createElement("li",{className:"vis"},e.content,c.a.createElement("button",{className:"invis",onClick:function(t){e.handUpda(t,e.cumIndex)},type:"submit",name:"updateButton"},"Update"),c.a.createElement("button",{className:"invis",onClick:function(t){e.handDele(t,e.cumIndex)},type:"submit",name:"deleteButton"},"Delete"),c.a.createElement("button",{className:"invis",onClick:function(t){e.handSubI(t,e.cumIndex)},type:"submit",name:"subItemButton"},"Add to sublist")))};function v(e){var t=Object(a.useState)(""),n=Object(r.a)(t,2),l=n[0],o=n[1],i=Object(a.useState)([]),s=Object(r.a)(i,2),u=s[0],b=s[1],f=Object(a.useState)(""),v=Object(r.a)(f,2),d=v[0],p=v[1],O=Object(a.useState)(e.listId?"/"+e.listId:""),g=Object(r.a)(O,2),j=g[0],C=g[1],N=Object(a.useState)("invis"),k=Object(r.a)(N,2),y=k[0],I=k[1],S=m.a.create({baseURL:"https://mohanned-todolistv2.herokuapp.com/api"});var w=m.a.CancelToken.source();function L(){var e={name:d,items:u};S.post(j,e,{cancelToken:w.token,withCredentials:!0}).then((function(e){C("/"+e.data)})).catch((function(e){console.log(e)}))}var A=0;S.interceptors.request.use((function(e){return A++,e}),(function(e){return Promise.reject(e)})),S.interceptors.response.use((function(e){return A--,console.log("------------  Previous request was successful. Remaining Ajax requests: "+A),e}),(function(e){return A--,console.log("------------  Previous request was unsuccessful. Remaining Ajax requests: "+A),Promise.reject(e)}));var R=Object(a.useRef)(!j);Object(a.useEffect)((function(){R.current||S.get(j,{withCredentials:!0}).then((function(e){b(Object(h.a)(e.data.items)),p(e.data.name)})).catch((function(e){console.log(e)}))}),[]);var T=Object(a.useRef)(2);Object(a.useEffect)((function(){e.save?T.current>0?(T.current--,R.current&&T.current--,0===T.current&&I()):1===A?(console.log("cancel previous axios call"),w.cancel(),L()):L():y&&I()}),[u,d]);var x=Object(a.useRef)(null);function U(e,t){b((function(e){var n=e.map((function(e){return Object.assign({},e)}));return function e(t,n){var a=n[0];1===n.length?t[a].item=l:(n.splice(0,1),e(t[a].items,n))}(n,t),n})),e.preventDefault(),o("")}function D(e,t){b((function(e){var n=e.map((function(e){return Object.assign({},e)}));return function e(t,n){var a=n[0];1===n.length?t.splice(a,1):(n.splice(0,1),e(t[a].items,n))}(n,t),n})),e.preventDefault()}function B(e,t){b((function(e){var n=e.map((function(e){return Object.assign({},e)}));return function e(t,n){var a=n[0];1===n.length?t[a].items=t[a].items?[].concat(Object(h.a)(t[a].items),[{item:l}]):[{item:l}]:(n.splice(0,1),e(t[a].items,n))}(n,t),n})),o(""),e.preventDefault()}return Object(a.useEffect)((function(){x.current.focus()}),[u,y]),c.a.createElement("div",null,c.a.createElement("h3",{className:"vis"},d||"New"," list",c.a.createElement("button",{className:"invis",onClick:function(){p(l),o("")},type:"submit",name:"titleButton"},"Change title")),function e(t,n){var a=n||[];return c.a.createElement("ul",null,t.map((function(t,n){return c.a.createElement("div",null,c.a.createElement(E,{content:t.item,key:[].concat(Object(h.a)(a),[n]),cumIndex:[].concat(Object(h.a)(a),[n]),handUpda:U,handDele:D,handSubI:B}),t.items&&0!==t.items.length&&e(t.items,[].concat(Object(h.a)(a),[n])))})))}(u),c.a.createElement("form",null,c.a.createElement("input",{className:y,onChange:function(e){var t=e.target.value;o(t)},type:"text",name:"userInput",value:l,ref:x}),c.a.createElement("button",{className:y,onClick:function(e){var t={item:l};b((function(e){return[].concat(Object(h.a)(e),[t])})),o(""),e.preventDefault()},type:"submit",name:"submitButton"},"Submit")))}function d(e){return c.a.createElement("div",null,c.a.createElement(v,{listId:e.location.listId,save:e.location.save}),c.a.createElement("br",null),c.a.createElement(s.b,{to:"/"},c.a.createElement("button",{variant:"outlined"},"Click here to return to the homepage")),e.location.save&&c.a.createElement(s.b,{to:"/MyLists"},c.a.createElement("button",{variant:"outlined"},"Click here to return to your lists")))}var p=function(){return c.a.createElement(i.c,null,c.a.createElement(i.a,{exact:!0,path:"/",component:b}),c.a.createElement(i.a,{exact:!0,path:"/MyLists",component:f}),c.a.createElement(i.a,{exact:!0,path:"/CreateList",component:d}))};o.a.render(c.a.createElement(s.a,null,c.a.createElement(p,null)),document.getElementById("root"))}},[[30,1,2]]]);
//# sourceMappingURL=main.f070c6e6.chunk.js.map