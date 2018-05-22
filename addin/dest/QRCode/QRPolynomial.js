/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 08:28:53 GMT
 */
;
// tang.config({});
tang.init().block([
	'$_/math/qrcode'
], function (pandora, root, imports, undefined) {
	var module = this.module;
	var _ = pandora;
	var declare = pandora.declareClass;
	var QRMath = _.QRCode.math;
	declare('QRCode.QRPolynomial', {
		_init: function (num, shift) {
			if (num.length == undefined) {
				throw new Error(num.length + "/" + shift);
			}
			var offset = 0;
			while (offset < num.length && num[offset] == 0) {
				offset++;
			}
			this.num = new Array(num.length - offset + shift);
			for (var i = 0;i < num.length - offset;i++) {
				this.num[i] = num[i + offset];
			};
		},
		get: function (index) {
			return this.num[index];
		},
		getLength: function () {
			return this.num.length;
		},
		multiply: function (e) {
			var num = new Array(this.getLength() + e.getLength() - 1);
			for (var i = 0;i < this.getLength();i++) {
				for (var j = 0;j < e.getLength();j++) {
					num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));
				}
			}
			return new _.QRCode.QRPolynomial(num, 0);
		},
		mod: function (e) {
			if (this.getLength() - e.getLength() < 0) {
				return this;
			}
			var ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
			var num = new Array(this.getLength());
			for (var i = 0;i < this.getLength();i++) {
				num[i] = this.get(i);
			}
			for (var i = 0;i < e.getLength();i++) {
				num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
			}
			return new _.QRCode.QRPolynomial(num,0).mod(e);
		}
	});
});
//# sourceMappingURL=QRPolynomial.js.map