define( [
	'./core',
	"../var/document",
	window
], function( util, document, window ) {
util.cookie = (function(){
"use strict";
var cookie = {
	addCookie: addCookie,
	deleteCookie: deleteCookie,
	getCookie: getCookie,
	getDocumentCookie: getDocumentCookie
};

function addCookie(name, value, attr){
	var str = "";
	if(attr){
		for(var prop in attr){
			str+=";"+prop+"="+attr[prop];
		}
	}
	document.cookie = name + "=" + window.escape(value) + str;
}
function deleteCookie(name){
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	if (cval != null){
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
	}
}
function getCookie(name){
	var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
	if (arr != null){
		return (arr[2]);
	}
	return null;
}
function getDocumentCookie(){
	return document.cookie;
}
return cookie;
}());
} );