define( [
	'./core'
], function( util ) {
util.collection = (function(){
"use strict";
var collection = {
	is: is
};

function is(arr, element){
	for(var i = 0; i<arr.length; i++){
		if(typeof element === 'function'){
			if(element(i, arr[i])){return true;}
		}else{
			if(arr[i]===element){return true;}
		}
	}
	return false;
}

return collection;
}());
} );