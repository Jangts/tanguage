/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 08:41:47 GMT
 */
;
// tang.config({});
tang.init().block([
	'$_/dom/',
	'$_/obj/',
	'$_/util/type'
], function (pandora, root, imports, undefined) {
	var module = this.module;
	var util = pandora.ns('util', {});
	var _ = pandora;
	var doc = root.document;
	var console = root.console, File = root.File, FileList = root.FileList, FormData = root.FormData;root;
	pandora.ns('util.bool', {
		truthy: function (value) {
			return !!value;
		},
		is: function (file, __class) {
			return _.util.bool.isObj(file) && file instanceof __class;
		},
		isScala: function (vari) {
			return typeof vari === 'boolean'|| typeof vari === 'string'|| typeof vari === 'number';
		},
		isBool: function (vari) {
			return typeof vari === 'boolean';
		},
		isObj: function (obj) {
			return typeof obj === 'object' && obj;
		},
		hasProp: _.obj.hasProp,
		isWin: _.util.type.isGlobal,
		isDoc: _.util.type.isDoc,
		isEl: _.util.type.isElement,
		isVisi: function (elem) {
			return _.dom.getStyle(elem, 'display') != 'none';
		},
		isHide: function (elem) {
			return _.dom.getStyle(elem, 'display') === 'none';
		},
		isEls: _.util.type.isElements,
		isArr: _.util.type.isArray,
		inArr: function (elem, array, ignoreType) {
			if (ignoreType) {
				for (var i = 0;i < array.length;i++) {
					if (array[i] == elem) {
						return true;
					}
				}
				return false;
			}
			return _.arr.has(array, elem);
		},
		in: function (elem, object) {
			if (_.util.type.isArray(object)) {
				return _.arr.has(object, elem);
			}
			if (_.util.bool.isObj(object)) {
				return _.obj.has(object, elem);
			}
			return false;
		},
		isReg: _.util.type.isRegExp,
		isFile: function (file) {
			return _.util.bool.isObj(file) && file instanceof File;
		},
		isFiles: function (files) {
			return _.util.bool.isObj(files) && files instanceof FileList;
		},
		isForm: function (data) {
			return _.util.bool.isObj(data) && data instanceof FormData;
		},
		isFn: function (obj) {
			return typeof obj === 'function';
		},
		isStr: function (str) {
			return typeof str === 'string';
		},
		isOuterHTML: function (str) {
			return /^<(\w+)[\s\S]+<\/\1>$/.test(str) || /^<(\w+)[^>]*\/\s*>$/.test(str);
		},
		isIntStr: _.util.type.isIntStr,
		isFloatStr: _.util.type.isFloatStr,
		isPercent: function (str) {
			return (typeof str === 'string') && (/^[-\+]{0,1}(\d+(\.\d+){0,1}|\.\d+)\%$/.test(str));
		},
		hasStr: _.hasString,
		isInt: function (num) {
			return _.util.type.isInteger(num) || _.util.type.isIntStr(num);
		},
		isNum: function (num) {
			return typeof num === 'number';
		},
		isNumber: function (num) {
			return !isNaN(parseFloat(num)) && isFinite(num);
		},
		isFinite: function (num) {
			return isFinite(num);
		},
		isNumeric: function (num) {
			return typeof num === 'number' || _.util.type.isIntStr(num) || _.util.type.isFloatStr(num);
		},
		isNul: function (obj) {
			if (obj) {
				return false;
			}
			else {
				return true;
			};
		},
		isUrl: function (str) {
			var strRegex = "^((https|http|ftp|rtsp|mms|wss|ws)?://)"
			    + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?"
			    + "(([0-9]{1,3}\.){3}[0-9]{1,3}"
			    + "|"
			    + "([0-9a-z_!~*'()-]+\.)*"
			    + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\."
			    + "[a-z]{2,6})"
			    + "(:[0-9]{1,4})?"
			    + "((/?)|"
			    + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
			var re = new RegExp(strRegex);
			if (re.test(str)) {
				return true;
			}
			else {
				return false;
			};
		},
		isHttpMethod: function (method) {
			if (typeof method !== 'string') {
				return false;
			}
			method = method.toUpperCase();
			return _.util.bool.inArr(method, ['GET', 'CONNECT', 'COPY', 'DELETE', 'HEAD', 'LINK', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'TRACE', 'UNLINK', 'UPDATE', 'WRAPPED']) && method;
		},
		isSupportCanvas: function () {
			return typeof CanvasRenderingContext2D != "undefined";
		},
		isWebkit: function () {
			var reg = /webkit/i;
			return reg.test(this._ua);
		},
		isIE: function () {
			return 'ActiveXObject' in window;
		},
		isAndroid: function () {
			var android = false;
			var sAgent = navigator.userAgent;
			if (/android/i.test(sAgent)) {
				android = true;
				var aMat = sAgent.toString().match(/android ([0-9]\.[0-9])/i);
				if (aMat && aMat[1]) {
					android = parseFloat(aMat[1]);
				}
			}
			return android;
		}
	});
	_.extend(root, _.util.bool);
	this.module.exports = _.util.bool;
});
//# sourceMappingURL=bool.js.map