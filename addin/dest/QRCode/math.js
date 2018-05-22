/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 02:31:33 GMT
 */
;
// tang.config({});
tang.init().block([], function (pandora, root, imports, undefined) {
	var _ = pandora;
	var declare = pandora.declareClass;
	var doc = global.document;
	var console = global.console;
	_('QRCode.math', {
		glog: function (n) {
			if (n < 1) {
				throw new Error("glog(" + n + ")");
			}
			return _.QRCode.math.LOG_TABLE[n];
		},
		gexp: function (n) {
			while (n < 0) {
				n += 255;
			}
			while (n >= 256) {
				n -= 255;
			}
			return _.QRCode.math.EXP_TABLE[n];
		},
		EXP_TABLE: new Array(256),
		LOG_TABLE: new Array(256)
	});
	for (var i = 0;i < 8;i++) {
		_.QRCode.math.EXP_TABLE[i] = 1 << i;
	}
	for (var i = 8;i < 256;i++) {
		_.QRCode.math.EXP_TABLE[i] = _.QRCode.math.EXP_TABLE[i - 4]^;
		_.QRCode.math.EXP_TABLE[i - 5]^;
		_.QRCode.math.EXP_TABLE[i - 6]^;
		_.QRCode.math.EXP_TABLE[i - 8];
	}
	for (var i = 0;i < 255;i++) {
		_.QRCode.math.LOG_TABLE[_.QRCode.math.EXP_TABLE[i]] = i;
	}
}, true);
//# sourceMappingURL=math.js.map