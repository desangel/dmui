define( [
	'./core'
], function( util ) {
util.extend(util, (function(){
"use strict";
//ECMA SCRIPT 5
var object = {
	defineProperty: defineProperty,
	defineProperties: defineProperties
};

function defineProperty(obj, name, prop){
	if(typeof Object.defineProperty ==='function'){
		Object.defineProperty(obj, name, prop);
	}
	else{
		obj[name] = prop['value'];
	}
}

function defineProperties(obj, props){
	if(typeof Object.defineProperties ==='function'){
		Object.defineProperties(obj, props);
	}
	else{
		for(var i in props){
			var prop = props[i];
			obj[i] = prop['value'];
		}
	}
}
return object;
}())
);
} );