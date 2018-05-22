/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 08:28:53 GMT
 */
;
// tang.config({});
tang.init().block([], function (pandora, root, imports, undefined) {
	var module = this.module;
	var _ = pandora;
	var declare = pandora.declareClass;
	declare('QRCode.QRBitBuffer', {
		_init: function () {
			this.buffer = [];
			this.length = 0;
		},
		get: function (index) {
			var bufIndex = Math.floor(index/8);
			return ((this.buffer[bufIndex] >>> (7 - index % 8)) & 1) == 1;
		},
		put: function (num, length) {
			for (var i = 0;i < length;i++) {
				this.putBit(((num >>> (length - i - 1)) & 1) == 1);
			};
		},
		getLengthInBits: function () {
			return this.length;
		},
		putBit: function (bit) {
			var bufIndex = Math.floor(this.length/8);
			if (this.buffer.length <= bufIndex) {
				this.buffer.push(0);
			}
			if (bit) {
				this.buffer[bufIndex] |= (0x80 >>> (this.length % 8));
			}
			this.length++;
		}
	});
});
//# sourceMappingURL=QRBitBuffer.js.map