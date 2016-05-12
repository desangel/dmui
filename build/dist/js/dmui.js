/*!
 * =====================================================
 * dmui v0.1.0 (http://www.91holy.com)
 * =====================================================
 */
/*!
 * dmui JavaScript Library v0.1.0
 * https://dmui.com/

 * Copyright dmui Foundation and other contributors
 * Released under the MIT license
 * https://github.com/desangel/dmui/license
 *
 * Date: 2016-05-12T06:59Z
 */
( function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get dmui.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var dmui = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "dmui requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of dmui 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";


	
(function(){
"use strict";
window.URL = window.URL||window.webkitURL;	
}());
	


var util = (function(){
"use strict";
var class2type = {};
var toString = class2type.toString;
var hasOwn = class2type.hasOwnProperty;

var util = {
	isFunction: isFunction,
	isArray: Array.isArray || isArray,
	isWindow: isWindow,
	isNumeric: isNumeric,
	isEmptyObject: isEmptyObject,
	isPlainObject: isPlainObject,
	type: type,
	extend: extend
};

function isFunction( obj ) {
	return type(obj) === "function";
}
function isArray( obj ) {
	return type(obj) === "array";
}
function isWindow( obj ) {
	return obj != null && obj === obj.window;
}
function isNumeric( obj ) {
	// parseFloat NaNs numeric-cast false positives (null|true|false|"")
	// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
	// subtraction forces infinities to NaN
	// adding 1 corrects loss of precision from parseFloat (#15100)
	return !isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
}
function isEmptyObject( obj ) {
	var name;
	for ( name in obj ) {
		return false;
	}
	return true;
}
function isPlainObject( obj ) {
	var key;
	// Must be an Object.
	// Because of IE, we also have to check the presence of the constructor property.
	// Make sure that DOM nodes and window objects don't pass through, as well
	if ( !obj || type(obj) !== "object" || obj.nodeType || isWindow( obj ) ) {
		return false;
	}
	try {
		// Not own constructor property must be Object
		if ( obj.constructor &&
			!hasOwn.call(obj, "constructor") &&
			!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}
	} catch ( e ) {
		// IE8,9 Will throw exceptions on certain host objects #9897
		return false;
	}
	// Support: IE<9
	// Handle iteration over inherited properties before own properties.
	//if ( support.ownLast ) {
	//	for ( key in obj ) {
	//		return hasOwn.call( obj, key );
	//	}
	//}
	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	for ( key in obj ) {}
	return key === undefined || hasOwn.call( obj, key );
}
function type( obj ) {
	if ( obj == null ) {
		return obj + "";
	}
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call(obj) ] || "object" :
		typeof obj;
}
function extend(){
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;
		// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}
	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction(target)) {
		target = {};
	}
	// extend itself if only one argument is passed
	if ( i === length ) {
		target = {}; //this
		i--;
	}
	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];
				// do not copy prototype function
				if ( !options.hasOwnProperty(name)){
					continue;
				}
				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}
				// Recurse if we're merging plain objects or arrays

				if ( name!== 'parent' && deep && copy && !isPlainObject(copy) &&  typeof  copy.clone === "function" ){
					//remove parent for no dead loop
					//clone is for classType object
					target[ name ] = copy.clone();
					if(target[ name ] ===undefined){ target[ name ]  = copy; }
				} else if ( deep && copy && ( isPlainObject(copy) || (copyIsArray = isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && isArray(src) ? src : [];
					} else {
						clone = src && isPlainObject(src) ? src : {};
					}
					// Never move original objects, clone them
					target[ name ] = extend( deep, clone, copy );
				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}
	// Return the modified object
	return target;
}
return util;
}());
/* global xyz */

util.classExtend = (function(){
"use strict";
//inheritance
function classExtend(ChildClass, ParentClass){
	var initializing = false, fnTest = /xyz/.test(function() { xyz; }) ? /\b_super\b/ : /.*/;
	var _super = ParentClass.prototype;
	var prop = ChildClass.prototype;
	var prototype = typeof Object.create === "function" ? Object.create(ParentClass.prototype):new ParentClass();
	for (var name in prop) {
		// Check if we're overwriting an existing function
		prototype[name] = typeof prop[name] === "function" &&
			typeof _super[name] === "function" && fnTest.test(prop[name]) ?
			createCallSuperFunction(name, prop[name]) : prop[name];
	}
	initializing = true;
	ChildClass.prototype = prototype;
	ChildClass.prototype.constructor = ChildClass;
	
	function createCallSuperFunction(name, fn){
		return function() {
			var tmp = this._super;
		
			// Add a new ._super() method that is the same method
			// but on the super-class
			this._super = _super[name];
		
			// The method only need to be bound temporarily, so we
			// remove it when we're done executing
			var ret = fn.apply(this, arguments);
			this._super = tmp;
		
			return ret;
		};
	}
}
return classExtend;
}());

var document = window.document;


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


util.browser = (function(){
"use strict";	
var navigator = window.navigator;
var browser = {
	versions: (function(){
		var u = navigator.userAgent, app = navigator.appVersion;
		var vendor = navigator.vendor;
		return {
			u: u,
			app: app,
			vendor: vendor,
			windows: u.indexOf('Windows') > -1, //windows
			trident: u.indexOf('Trident') > -1, //IE内核
			presto: u.indexOf('Presto') > -1, //opera内核
			webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
			gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1,//火狐内核
			chrome: u.indexOf('Chrome') > -1 ,//chrome内核
			mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
			ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
			iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
			iPad: u.indexOf('iPad') > -1, //是否iPad
			webApp: u.indexOf('Safari') === -1, //是否web应该程序，没有头部与底部
			weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
			weibo: u.indexOf('Weibo') > -1, //是否微博
			qq: u.match(/\sQQ/i) === " qq" //是否QQ
		};
	})(),
	language:(navigator.browserLanguage || navigator.language || navigator.userLanguage).toLowerCase()
};
return browser;
}());


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


util.date = (function(){
"use strict";
var getDateHelper = function(){
	return {
		date : getDate(),
		duration : getDurationHelper(),
		dateDiff : dateDiff,
		dateDiffResult : dateDiffResult,
		dateDiffResultFull : dateDiffResultFull,
		dateToStr : dateToStr,
		datetimeToStr : datetimeToStr,
		getOffsetDate : getOffsetDate,
		paramToDate : paramToDate,
		strToDate : strToDate,
		timeToStr : timeToStr,
		durationToStr : durationToStr,
		durationToObj : durationToObj,
		typeToStr : typeToStr,
		weekdayToStr : weekdayToStr,
		zhDateToStr : zhDateToStr,
		zhDatetimeToStr : zhDatetimeToStr,
		fillZero : fillZero
	};
	
	function getDate(){
		return {
			monthFirstDay : monthFirstDay,
			monthLastDay : monthLastDay
		};
		
		function monthFirstDay(date){
			return paramToDate(date.getFullYear(), date.getMonth());
		}
		function monthLastDay(date){
			var result = monthFirstDay(date);
			result = getOffsetDate('month', result, 1);
			result = getOffsetDate('date', result, -1);
			return result;
		}
	}

	function getDurationHelper() {
		return {
			today : today,
			yestoday : yestoday,
			date: day,
			currentWeek : currentWeek,
			lastWeek : lastWeek,
			currentMonth : currentMonth,
			currentYear : currentYear,
			calendarMonth : calendarMonth,
			month : month,
			year : year
		};

		function today() {
			return getDurationStr('date', new Date());
		}
		function yestoday() {
			return getDurationStr('date', getOffsetDate('date', new Date(), -1));
		}
		function day(date){
			return getDurationStr('date', date);
		}
		function currentWeek(){
			return getDurationStr('day', new Date());
		}
		function lastWeek(){
			return getDurationStr('day', getOffsetDate('date', new Date(), -7));
		}
		function currentMonth(){
			return getDurationStr('month', new Date());
		}
		function currentYear(){
			return getDurationStr('year', new Date());
		}
		function calendarMonth(year, month){
			var now = new Date();
			year = year || now.getFullYear();
			month = month || now.getMonth()+1;
			return getDurationStr('calendarMonth', paramToDate(year, month-1));
		}
		function month(year, month){
			var now = new Date();
			year = year || now.getFullYear();
			month = month || now.getMonth()+1;
			return getDurationStr('month', paramToDate(year, month-1));
		}
		function year(year){
			return getDurationStr('year', paramToDate(year));
		}
	}
	
	function getDurationStr(type, startTime) {
		var result = getDuration(type, startTime);
		return {
			startTime : datetimeToStr(result['startTime']),
			endTime : datetimeToStr(result['endTime'])
		};
	}
	
	function getDuration(type, startTime) {
		var year, month, date, hour, minute, second;
		var day;
		var startTimeDate, endTimeDate;
		switch (type) {
		case 'calendarMonth':
			year = startTime.getFullYear();
			month = startTime.getMonth();
			startTimeDate = paramToDate(year, month, date, hour, minute, second);
			endTimeDate = getOffsetDate('month', startTimeDate, 1);
			var startTimeWeekDay = startTimeDate.getDay();
			var endTimeWeekDay = endTimeDate.getDay();
			startTimeDate = getOffsetDate('date', startTimeDate, - startTimeWeekDay%7);
			endTimeDate = getOffsetDate('date', endTimeDate, (7-endTimeWeekDay)%7);
			break;
		case 'year':
			year = startTime.getFullYear();
			startTimeDate = paramToDate(year, month, date, hour, minute, second);
			endTimeDate = getOffsetDate(type, startTimeDate, 1);
			break;
		case 'month':
			year = startTime.getFullYear();
			month = startTime.getMonth();
			startTimeDate = paramToDate(year, month, date, hour, minute, second);
			endTimeDate = getOffsetDate(type, startTimeDate, 1);
			break;
		case 'date':
			year = startTime.getFullYear();
			month = startTime.getMonth();
			date = startTime.getDate();
			startTimeDate = paramToDate(year, month, date, hour, minute, second);
			endTimeDate = getOffsetDate(type, startTimeDate, 1);
			break;
		case 'day':
			year = startTime.getFullYear();
			month = startTime.getMonth();
			date = startTime.getDate();
			day = startTime.getDay();
			date = date - (day+6)%7;
			startTimeDate = paramToDate(year, month, date, hour, minute, second);
			endTimeDate = getOffsetDate('date', startTimeDate, 7);
			break;
		}
	
		return {
			startTime : startTimeDate,
			endTime : endTimeDate
		};
	}
	
	function dateDiff(type, date1, date2){
		var result = 0;
		switch (type) {
		case 'year':
			result = Math.floor(((date1.getFullYear() - date2.getFullYear())*12+ date1.getMonth() - date2.getMonth())/12);break;
		case 'month':
			result = (date1.getFullYear() - date2.getFullYear())*12 + date1.getMonth() - date2.getMonth() + (((date1.getDate()-date2.getDate())>=0?1:-1) +  (date1>=date2?-1: 1))/2;break;
		case 'date':
			result = Math.floor(date1.getTime()/(1000*60*60*24))-Math.floor(date2.getTime()/(1000*60*60*24)); break;
		case 'hour':
			result = Math.floor(date1.getTime()/(1000*60*60))-Math.floor(date2.getTime()/(1000*60*60)); break;
		case 'minute':
			result = Math.floor(date1.getTime()/(1000*60))-Math.floor(date2.getTime()/(1000*60)); break;
		case 'second':
			result = Math.floor(date1.getTime()/(1000))-Math.floor(date2.getTime()/(1000)); break;
		default:
			result = (date1.getTime()-date2.getTime());
		}
		return result;
	}
	
	function dateDiffResult(date1, date2){
		var offset, type;
		type = 'year';
		offset = dateDiff(type, date1, date2);
		if(offset!==0)return {offset: offset, type: type};
		type = 'month';
		offset = dateDiff(type, date1, date2);
		if(offset!==0)return {offset: offset, type: type};
		type = 'date';
		offset = dateDiff(type, date1, date2);
		if(offset!==0)return {offset: offset, type: type};
		type = 'hour';
		offset = dateDiff(type, date1, date2);
		if(offset!==0)return {offset: offset, type: type};
		type = 'minute';
		offset = dateDiff(type, date1, date2);
		if(offset!==0)return {offset: offset, type: type};
		type = 'second';
		offset = dateDiff(type, date1, date2);
		return {offset: offset, type: type};
	}
	
	function dateDiffResultFull(type, date1, date2){
		var result = {};
		var delta = date1.getTime()-date2.getTime();
		var rest = delta;
		switch(type){
		case 'year': 
			result['year'] = dateDiff('year', date1, date2);
			break;
		case 'date': 
			result['date'] = Math.floor(rest / (1000*60*60*24) );
			rest = rest % (1000*60*60*24);
			result['hour'] = Math.floor(rest / (1000*60*60) );
			rest = rest % (1000*60*60);
			result['minute'] = Math.floor(rest / (1000*60) );
			rest = rest % (1000*60);
			result['second'] = Math.floor(rest / (1000) );
			rest = rest % (1000);
			break;
		}
		return result;
	}
	
	function getOffsetDate(type, date, offset) {
		var year = date.getFullYear();
		var month = date.getMonth();
		var day = date.getDate();
		var hour = date.getHours();
		var minute = date.getMinutes();
		var second = date.getSeconds();
		switch (type) {
		case 'year':year+=offset;break;
		case 'month':month+=offset;break;
		case 'date':day+=offset;break;
		case 'hour':hour+=offset;break;
		case 'minute':minute+=offset;break;
		case 'second':second+=offset;break;
		}
		return paramToDate(year, month, day, hour, minute, second);
	}

	function fillZero(input, num) {
		var result = '' + input;
		for (var i = 0; i < (num - result.length); i++) {
			result = '0' + result;
		}
		return result;
	}
	
	function datetimeToStr(date, fmt) {
		if(typeof date==='string')date = strToDate(date);
		fmt = fmt||'yyyy-MM-dd hh:mm:ss';
		var year = date.getFullYear();
		var month = fillZero(date.getMonth() + 1, 2);
		var dateString = fillZero(date.getDate(), 2);
		var hour = fillZero(date.getHours() ,2);
		var minute = fillZero(date.getMinutes(), 2);
		var second = fillZero(date.getSeconds(), 2);
		return fmt.replace('yyyy',year).replace('MM',month).replace('dd', dateString).replace('hh',hour).replace('mm',minute).replace('ss', second);
	}
	
	function dateToStr(date, fmt) {
		if(typeof date==='string')date = strToDate(date);
		fmt = fmt||'yyyy-MM-dd';
		var year = date.getFullYear();
		var month = fillZero(date.getMonth() + 1, 2);
		var dateString = fillZero(date.getDate(), 2);
		return fmt.replace('yyyy',year).replace('MM',month).replace('dd', dateString);
	}
	
	function timeToStr(date, fmt){
		if(typeof date==='string')date = strToDate(date);
		fmt = fmt||'hh:mm:ss';
		var hour = fillZero(date.getHours() ,2);
		var minute = fillZero(date.getMinutes(), 2);
		var second = fillZero(date.getSeconds(), 2);
		return fmt.replace('hh',hour).replace('mm',minute).replace('ss', second);
	}
	
	function durationToStr(millisecond, fmt, fillType){
		fmt = fmt||'hh:mm:ss.ms';
		fillType = fillType||'hh';
		var obj = durationToObj(millisecond);
		var hour = fillZero(obj['hour'] ,2);
		var minute = fillZero(obj['minute'], 2);
		var second = fillZero(obj['second'], 2);
		if(fillType==='hh'||fillType==='mm'&&obj['hour']===0){
			fmt = fmt.replace('hh:', '');
			if(fillType==='mm'&&obj['minute']===0){
				fmt = fmt.replace('mm:', '');
			}
		}
		return fmt.replace('hh', hour).replace('mm', minute).replace('ss', second).replace('ms', obj['millisecond']);
	}
	
	function durationToObj(millisecond){
		var result = {};
		var rest = millisecond;
		result['hour'] = Math.floor(rest / (1000*60*60) );
		rest = rest % (1000*60*60);
		result['minute'] = Math.floor(rest / (1000*60) );
		rest = rest % (1000*60);
		result['second'] = Math.floor(rest / (1000) );
		rest = rest % (1000);
		result['millisecond'] = rest;
		return result;
	}

	function zhDateToStr(date, fmt){
		if(typeof date==='string')date = strToDate(date);
		fmt = fmt||'yyyyMMdd';
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var dateString = date.getDate();
		return fmt.replace('yyyy',year+'年').replace('MM',month+'月').replace('dd', dateString+'日');
	}
	function zhDatetimeToStr(date){
		var now = new Date();
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var dateString = date.getDate();
		var hour = fillZero(date.getHours() ,2);
		var minute = fillZero(date.getMinutes(), 2);
		var result = '';
		if(now.getFullYear()===year&&now.getMonth()+1===month){
			if(now.getDate()-dateString===0){
				
			}else if(now.getDate()-dateString===1){
				result += '昨天';
			}else if(now.getDate()-dateString===2){
				result += '前天';
			}else{
				result += zhDateToStr(date);
			}
			if(now.getDate()-dateString!==0)result += ' ';
		}
		result += hour+':'+minute;
		return result;
	}
	
	// 微信客户端不支持new Date("2015-07-04 12:00:00")
	function strToDate(dateTimeStr) {
		if(!dateTimeStr)return null;
		var date = new Date(0);
		var dateTimeArray = dateTimeStr.split(' ');
		var dateStr = dateTimeArray[0];
		var dateArray = dateStr.split('-');
		date.setFullYear(parseInt(dateArray[0], 0));
		date.setMonth(parseInt(dateArray[1], 0) - 1);
		date.setDate(parseInt(dateArray[2], 0));
		if (dateTimeArray.length > 1) {
			var timeStr = dateTimeArray[1];
			var timeArray = timeStr.split(':');
			date.setHours(parseInt(timeArray[0], 0));
			date.setMinutes(parseInt(timeArray[1], 0));
			date.setSeconds(parseInt(timeArray[2], 0));
		}
		return date;
	}

	function paramToDate(year, month, date, hour, minute, second) {
		month =month || 0;
		date = date!==undefined? date : 1;
		hour = hour || 0;
		minute = minute || 0;
		second = second || 0;
		var result = new Date(0);
		result.setFullYear(year);
		result.setMonth(month);
		result.setDate(date);
		result.setHours(hour);
		result.setMinutes(minute);
		result.setSeconds(second);
		return result;
	}
	
	function weekdayToStr(weekday){
		var result = '';
		switch(weekday){
		case 0:result='日';break;
		case 1:result='一';break;
		case 2:result='二';break;
		case 3:result='三';break;
		case 4:result='四';break;
		case 5:result='五';break;
		case 6:result='六';break;
		}
		return result;
	}
	
	function typeToStr(type){
		var result = '';
		switch(type){
		case 'year':result='年';break;
		case 'month':result='月';break;
		case 'day':
		case 'date':result='天';break;
		case 'hour':result='小时';break;
		case 'minute':result='分钟';break;
		case 'second':result='秒';break;
		}
		return result;
	}
};

return getDateHelper();
}());


util.path = (function(){
"use strict";
function findCurrentPath(){
	return document.currentScript&&document.currentScript.src||(function(){
		//for IE10+ Safari Opera9
		var a = {}, stack;
		try{
			a.b();
		}catch(e){
			stack = e.stack || e.sourceURL || e.stacktrace;
		}
		var rExtractUri = /(?:http|https|file):\/\/.*?\/.+?.js/, 
		absPath = rExtractUri.exec(stack);
		return absPath[0] || '';
	})()||(function(){
		// IE5.5 - 9
		var scripts = document.scripts;
		var isLt8 = ('' + document.querySelector).indexOf('[native code]') === -1;
		for (var i = scripts.length - 1, script; script = scripts[i--];){
		   if (script.readyState === 'interative'){
			  return isLt8 ? script.getAttribute('src', 4) : script.src;   
		   }
		}
	})();
}
return {
	findCurrentPath: findCurrentPath
};
}());


	


	
var version = "0.1.0";

var dmui = function(){
	this.init();
};
dmui.fn = dmui.prototype = {
	version: version,
	constructor: dmui,
	init: function(){
		window.console.log(util);
	}
};
	


var

	// Map over dmui in case of overwrite
	_dmui = window.dmui;

dmui.noConflict = function( deep ) {
	if ( deep && window.dmui === dmui ) {
		window.dmui = _dmui;
	}

	return dmui;
};

// Expose dmui and $ identifiers, even in AMD
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.dmui = dmui;
}


return dmui;
} ) );
