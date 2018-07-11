/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 08:28:53 GMT
 */
;
// tang.config({});
tang.init().block([
	'~Model',
	'~Drawing'
], function (pandora, root, imports, undefined) {
	var module = this.module;
	var _ = pandora;
	var declare = pandora.declareClass;
	var doc = global.document;
	var QRCode = _.draw.QRCode;
	var QRErrorCorrectLevel = QRCode.Model.CorrectLevel;
	var QRCodeLimitLength = [
		[17, 14, 11, 7],
		[32, 26, 20, 14],
		[53, 42, 32, 24],
		[78, 62, 46, 34],
		[106, 84, 60, 44],
		[134, 106, 74, 58],
		[154, 122, 86, 64],
		[192, 152, 108, 84],
		[230, 180, 130, 98],
		[271, 213, 151, 119],
		[321, 251, 177, 137],
		[367, 287, 203, 155],
		[425, 331, 241, 177],
		[458, 362, 258, 194],
		[520, 412, 292, 220],
		[586, 450, 322, 250],
		[644, 504, 364, 280],
		[718, 560, 394, 310],
		[792, 624, 442, 338],
		[858, 666, 482, 382],
		[929, 711, 509, 403],
		[1003, 779, 565, 439],
		[1091, 857, 611, 461],
		[1171, 911, 661, 511],
		[1273, 997, 715, 535],
		[1367, 1059, 751, 593],
		[1465, 1125, 805, 625],
		[1528, 1190, 868, 658],
		[1628, 1264, 908, 698],
		[1732, 1370, 982, 742],
		[1840, 1452, 1030, 790],
		[1952, 1538, 1112, 842],
		[2068, 1628, 1168, 898],
		[2188, 1722, 1228, 958],
		[2303, 1809, 1283, 983],
		[2431, 1911, 1351, 1051],
		[2563, 1989, 1423, 1093],
		[2699, 2099, 1499, 1139],
		[2809, 2213, 1579, 1219],
		[2953, 2331, 1663, 1273]
	];
	var _getUTF8Length = function (sText) {
		var replacedText = encodeURI(sText).toString().replace(/\%[0-9a-fA-F]{2}/g, 'a');
		return replacedText.length + (replacedText.length != sText ? 3:0);
	}
	var _getTypeNumber = function (sText, nCorrectLevel) {
		var nType = 1;
		var length = _getUTF8Length(sText);
		for (var i = 0, len = QRCodeLimitLength.length;i <= len;i++) {
			var nLimit = 0;
			switch (nCorrectLevel) {
				case QRErrorCorrectLevel.L:
				nLimit = QRCodeLimitLength[i][0];
				break;;
				case QRErrorCorrectLevel.M:
				nLimit = QRCodeLimitLength[i][1];
				break;;
				case QRErrorCorrectLevel.Q:
				nLimit = QRCodeLimitLength[i][2];
				break;;
				case QRErrorCorrectLevel.H:
				nLimit = QRCodeLimitLength[i][3];
				break;;
			}
			if (length <= nLimit) {
				break;;
			}
			else {
				nType++;
			}
		}
		if (nType > QRCodeLimitLength.length) {
			throw new Error("Too long data");
		}
		return nType;
	}
	declare('draw.QRCode', {
		_init: function (el, options) {
			this.options = {
				width: 256,
				height: 256,
				typeNumber: 4,
				colorDark: "#000000",
				colorLight: "#ffffff",
				correctLevel: QRErrorCorrectLevel.H
			};
			if (typeof options === 'string') {
				options = {
					text: options
				};
			}
			if (options) {
				for (var i in options) {
					this.options[i] = options[i];
				}
			}
			if (typeof el == "string") {
				el = doc.getElementById(el);
			}
			if (this.options.useSVG) {
				Drawing = svgDrawer;
			}
			this._android = _.util.isAndroid();
			this.Element = el;
			this.Code = null;
			console.log(this.Element);
			this._oDrawing = new _.draw.QRCode.Drawing(this.Element, this.options);
			if (this.options.text) {
				this.makeCode(this.options.text);
			};
		},
		makeCode: function (sText) {
			this.Code = new _.draw.QRCode.Model(_getTypeNumber(sText, this.options.correctLevel), this.options.correctLevel);
			this.Code.addData(sText);
			this.Code.make();
			this.Element.title = sText;
			this._oDrawing.draw(this.Code);
			this.makeImage();
		},
		makeImage: function () {
			if (typeof this._oDrawing.makeImage == "function" && (!this._android || this._android >= 3)) {
				this._oDrawing.makeImage();
			};
		},
		clear: function () {
			this._oDrawing.clear();
		}
	});
	_.extend(_.draw.QRCode, QRCode, {CorrectLevel: QRErrorCorrectLevel});
});
//# sourceMappingURL=QRCode.js.map