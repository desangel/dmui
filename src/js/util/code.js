define( [
	'./core',
	"../var/document"
], function( util, document ) {
util.extend( util, (function(){
"use strict";
var code = {
	htmlEncode: htmlEncode,
	htmlDecode: htmlDecode
};

function htmlEncode(value){
	var temp = document.createElement('div');
	(temp.textContent!=null)?(temp.textContent=value) : (temp.innerText=value);
	var result = temp.html.innerHTML;
	temp = null;
	return result;
}
	
function htmlDecode(value){
	var temp = document.createElement('div');
	temp.innerHTML = value;
	var result = temp.innerText || temp.textContent;
	temp = null;
	return result;
}

return code;
}())
);
} );