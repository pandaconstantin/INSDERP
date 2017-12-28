/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define([],function(){"use strict";function a(a){return a.headers.has("x-oracle-jscpt-cache-expiration-date")}function b(a){return a.headers.has("x-oracle-jscpt-etag-generated")}function c(a){var b=a.get("Content-Type");return!(!b||-1===b.indexOf("text/")&&-1===b.indexOf("application/json"))}function d(a){var b=a.get("Content-Type");return b&&-1!==b.indexOf("multipart/")}function e(a,b){b&&b._noClone||(a=a.clone());var c={};return f(a,c,["body","headers","signal"]),c.headers=h(a.headers),j(a,c)}function f(a,b,c){for(var d in a)"function"==typeof a[d]||g(d)||-1!==c.indexOf(d)||(b[d]=a[d])}function g(a){return 0===a.indexOf("_")}function h(a){var b={};if(a.entries){var c,d,e,f=a.entries();do{c=f.next(),c.value&&(d=c.value[0],e=c.value[1],b[d]=e)}while(!c.done)}else a.forEach&&a.forEach(function(a,c){b[c]=a});return i(b),b}function i(a){var b=a.date;b||(b=(new Date).toUTCString(),a.date=b)}function j(a,b){return b.body={},a instanceof Request&&d(a.headers)?k(a,b):a instanceof Request||c(a.headers)?new Promise(function(c,d){a.text().then(function(a){b.body.text=a,c(b)})}):a instanceof Request||"function"!=typeof a.arrayBuffer?Promise.reject(new Error({message:"payload body type is not supported"})):new Promise(function(c,d){a.arrayBuffer().then(function(a){a.length>0&&(b.body.arrayBuffer=a),c(b)}).catch(function(a){d(a)})})}function k(a,b){if("function"==typeof a.formData)return new Promise(function(c,d){a.formData().then(function(a){var d,e,f,g,h={},i=a.entries();do{d=i.next(),(e=d.value)&&(f=e[0],g=e[1],h[f]=g)}while(!d.done);b.body.formData=h,c(b)}).catch(function(a){d(a)})});var c=a.headers.get("Content-Type");return new Promise(function(d,e){a.text().then(function(a){for(var e=t(a,c),f={},g=0;g<e.length;g++)f[e[g].headers.name]=e[g].data;b.body.formData=f,d(b)}).catch(function(a){e(a)})})}function l(a,b){b&&b._noClone||(a=a.clone());var c={};return f(a,c,["body","headers"]),c.headers=h(a.headers),b&&b.excludeBody?Promise.resolve(c):j(a,c)}function m(a){var b={};f(a,b,["headers","body","signal"]);var c=n(a,b);return b.headers=o(a,c),p(a,b)}function n(a,b){var c=!1,d=a.body;if(d.text&&d.text.length>0)b.body=d.text;else if(d.arrayBuffer)b.body=d.arrayBuffer;else if(d.formData){c=!0;var e=new FormData,f=d.formData;Object.keys(f).forEach(function(a){e.append(a,f[a])}),b.body=e}return c}function o(a,b){var c=new Headers;return Object.keys(a.headers).forEach(function(d){("content-type"!==d||!b&&"content-type"===d)&&c.append(d,a.headers[d])}),c}function p(a,b){return Promise.resolve(new Request(a.url,b))}function q(a){var b={};return f(a,b,["headers","body"]),b.headers=o(a,!1),r(a,b)}function r(a,b){var c,d=a.body;return d&&d.text?c=new Response(d.text,b):d&&d.arrayBuffer?(b.responseType="blob",c=new Response(d.arrayBuffer,b)):c=new Response(null,b),Promise.resolve(c)}function s(a,b){return l(a).then(function(a){var c=a.body;if(c.arrayBuffer){if(!(b instanceof ArrayBuffer))throw new Error({message:"unexpected payload"});c.arrayBuffer=b}else c.text=JSON.stringify(b);return q(a)})}function t(a,b){var c=b.match(/boundary=(?:"([^"]+)"|([^;]+))/i);if(!c)throw new Error("not a valid multipart form data value.");var d,e=function(a,b){for(var c=new ArrayBuffer(a.length),d=new Uint8Array(c),e=0;e<a.length;e++)d[e]=a.charCodeAt(e);return new Blob([c],{type:b})},f=c[1]||c[2],g="string"==typeof a;if(g)d=a;else{var h=new Uint8Array(a);d=String.fromCharCode.apply(null,h)}for(var i=d.split(new RegExp(f)),j=[],k=1;k<i.length-1;k++){var l={},m=i[k],n=m.split("\r\n\r\n"),o=n[0],p=n[1],q=function(a){for(var b={},c={},d=a.split("\r\n"),e=0;e<d.length;e++){var f=d[e];if(0!==f.length){var g=f.split(";");if(1===g.length&&0===g[0].indexOf("Content-Type"))b.contentType=g[0].split(":")[1].trim();else for(var h=0;h<g.length;h++)if(-1!==g[h].indexOf("=")){var i=g[h].split("=");c[i[0].trim()]=i[1].substring(1,i[1].length-1)}}}return b.headers=c,b}(o);l.headers=q.headers,l.data=function(a,b){var c=a.split("\r\n");return b&&b.indexOf("image")>=0?e([c[0],c[1]].join("\r\n"),b):c[0]}(p,q.contentType),j.push(l)}return j}function u(a){var b={url:a.url,id:Math.random().toString(36).replace(/[^a-z]+/g,"")};return JSON.stringify(b)}function v(a){return e(a,{_noClone:!0}).then(function(a){return m(a).then(function(a){return a})})}function w(a){return l(a,{_noClone:!0}).then(function(a){return q(a).then(function(a){return a})})}return{requestToJSON:e,requestFromJSON:m,responseToJSON:l,responseFromJSON:q,setResponsePayload:s,parseMultipartFormData:t,isCachedResponse:a,isGeneratedEtagResponse:b,_isTextPayload:c,buildEndpointKey:u,_cloneRequest:v,_cloneResponse:w}});
//# sourceMappingURL=persistenceUtils.js.map