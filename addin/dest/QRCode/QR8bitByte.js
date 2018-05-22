/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 02:31:34 GMT
 */
;
// tang.config({});
tang.init().block([], function (pandora, root, imports, undefined) {
	var _ = pandora;
	var declare = pandora.declareClass;
	var QRMode = {
		MODE_NUMBER: 1 << 0,
		MODE_ALPHA_NUM: 1 << 1,
		MODE_8BIT_BYTE: 1 << 2,
		MODE_KANJI: 1 << 3
	};
	declare('QRCode.QR8bitByte', {
		_init: function (data) {
			this.mode = QRMode.MODE_8BIT_BYTE;
			this.data = data;
			this.parsedData = [];
			for (var i = 0, l = this.data.length;i < l;i++) {
				var byteArray = [];
				var code = this.data.charCodeAt(i);
				if (code > 0x10000) {
					byteArray[0] = 0xF0 |((code & 0x1C0000) >>> 18);
					byteArray[1] = 0x80 |((code & 0x3F000) >>> 12);
					byteArray[2] = 0x80 |((code & 0xFC0) >>> 6);
					byteArray[3] = 0x80 |(code & 0x3F);
				}
				else if (code > 0x800) {
					byteArray[0] = 0xE0 |((code & 0xF000) >>> 12);
					byteArray[1] = 0x80 |((code & 0xFC0) >>> 6);
					byteArray[2] = 0x80 |(code & 0x3F);
				}
				else if (code > 0x80) {
					byteArray[0] = 0xC0 |((code & 0x7C0) >>> 6);
					byteArray[1] = 0x80 |(code & 0x3F);
				}
				else {
					byteArray[0] = code;
				}
				this.parsedData.push(byteArray);
			}
			this.parsedData = Array.prototype.concat.apply([], this.parsedData);
			if (this.parsedData.length != this.data.length) {
				this.parsedData.unshift(191);
				this.parsedData.unshift(187);
				this.parsedData.unshift(239);
			};
		},
		getLength: function (buffer) {
			return this.data.length;
		},
		write: function (buffer) {
			for (var i = 0;i < this.data.length;i++) {
				buffer.put(this.data.charCodeAt(i), 8);
			};
		}
	});
	_('QRCode.QR8bitByte.QRMode', QRMode);
}, true);
//# sourceMappingURL=QR8bitByte.js.map