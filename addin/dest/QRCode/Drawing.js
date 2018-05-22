/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 02:18:04 GMT
 */
;
// tang.config({});
tang.init().block([
	'$_/util/bool',
	'~SVGDrawing'
], function (pandora, root, imports, undefined) {
	var _ = pandora;
	var declare = pandora.declareClass;
	var doc = global.document;
	var useSVG = doc.documentElement.tagName.toLowerCase() === "svg";
	if (useSVG) {
		_.QRCode.Drawing = _.QRCode.SVGDrawing;
	}
	else {
		if (_.util.bool.isSupportCanvas()) {
			var _onMakeImage = function () {
				this.ElementImage.src = this.ElementCanvas.toDataURL("image/png");
				this.ElementImage.style.display = "block";
				this.ElementCanvas.style.display = "none";
			}
			if (this.isAndroid && this.isAndroid <= 2.1) {
				var factor = 1/window.devicePixelRatio;
				var drawImage = CanvasRenderingContext2D.prototype.drawImage;
				CanvasRenderingContext2D.prototype.drawImage = function (image, sx, sy, sw, sh, dx, dy, dw, dh) {
					if (("nodeName" in image) && /img/i.test(image.nodeName)) {
						for (var i = arguments.length - 1;i >= 1;i--) {
							arguments[i] = arguments[i] * factor;
						}
					}
					else if (typeof dw == "undefined") {
						arguments[1] *= factor;
						arguments[2] *= factor;
						arguments[3] *= factor;
						arguments[4] *= factor;
					}
					drawImage.apply(this, arguments);
				}
			}
			var setSafeDataURI = function (successCallback, failCallback) {
				var that = this;
				that.fail = failCallback;
				that.success = successCallback;
				if (that.isSupportDataURI === null) {
					var el = doc.createElement("img");
					var error = function () {
						that.isSupportDataURI = false;
						if (that.fail) {
							that.fail.call(that);
						};
					}
					var success = function () {
						that.isSupportDataURI = true;
						if (that.success) {
							that.success.call(that);
						};
					}
					el.onabort = error;
					el.onerror = error;
					el.onload = success;
					el.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDtanguageE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
					return;;
				}
				else if (that.isSupportDataURI === true && that.success) {
					that.success.call(that);
				}
				else if (that.isSupportDataURI === false && that.fail) {
					that.fail.call(that);
				};
			}
			declare('QRCode.Drawing', {
				_init: function (elem, options) {
					this.isPainted = false;
					this.isAndroid = _.util.bool.isAndroid();
					this.options = options;
					this.ElementCanvas = doc.createElement("canvas");
					this.ElementCanvas.width = options.width;
					this.ElementCanvas.height = options.height;
					elem.appendChild(this.ElementCanvas);
					this.Element = elem;
					this.context = this.ElementCanvas.getContext("2d");
					this.isPainted = false;
					this.ElementImage = doc.createElement("img");
					this.ElementImage.alt = "Scan me!";
					this.ElementImage.style.display = "none";
					this.Element.appendChild(this.ElementImage);
					this.isSupportDataURI = null;
				},
				draw: function (QRCode) {
					var elemImage = this.ElementImage;
					var context = this.context;
					var options = this.options;
					var nCount = QRCode.getModuleCount();
					var nWidth = options.width/nCount;
					var nHeight = options.height/nCount;
					var nRoundedWidth = Math.round(nWidth);
					var nRoundedHeight = Math.round(nHeight);
					elemImage.style.display = "none";
					this.clear();
					for (var row = 0;row < nCount;row++) {
						for (var col = 0;col < nCount;col++) {
							var bIsDark = QRCode.isDark(row, col);
							var nLeft = col * nWidth;
							var nTop = row * nHeight;
							context.strokeStyle = bIsDark ? options.colorDark : options.colorLight;
							context.lineWidth = 1;
							context.fillStyle = bIsDark ? options.colorDark : options.colorLight;
							context.fillRect(nLeft, nTop, nWidth, nHeight);
							context.strokeRect(
								Math.floor(nLeft) + 0.5,
								Math.floor(nTop) + 0.5,
								nRoundedWidth,
								nRoundedHeight);
							context.strokeRect(
								Math.ceil(nLeft) - 0.5,
								Math.ceil(nTop) - 0.5,
								nRoundedWidth,
								nRoundedHeight);
						}
					}
					this.isPainted = true;
				},
				makeImage: function () {
					if (this.isPainted) {
						setSafeDataURI.call(this, _onMakeImage);
					};
				},
				isPainted: function () {
					return this.isPainted;
				},
				clear: function () {
					this.context.clearRect(0, 0, this.ElementCanvas.width, this.ElementCanvas.height);
					this.isPainted = false;
				},
				round: function (nNumber) {
					if (!nNumber) {
						return nNumber;
					}
					return Math.floor(nNumber * 1000)/1000;
				}
			});
		}
		else {
			declare('QRCode.Drawing', {
				_init: function (el, options) {
					this.Element = el;
					this.options = options;
				},
				draw: function (QRCode) {
					var options = this.options;
					var elem = this.Element;
					var nCount = QRCode.getModuleCount();
					var nWidth = Math.floor(options.width/nCount);
					var nHeight = Math.floor(options.height/nCount);
					var aHTML = ['<table style="border:0;border-collapse:collapse;">'];
					for (var row = 0;row < nCount;row++) {
						aHTML.push('<tr>');
						for (var col = 0;col < nCount;col++) {
							aHTML.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + nWidth + 'px;height:' + nHeight + 'px;background-color:' + (QRCode.isDark(row, col) ? options.colorDark:options.colorLight) + ';"></td>');
						}
						aHTML.push('</tr>');
					}
					aHTML.push('</table>');
					elem.innerHTML = aHTML.join('');
					var elTable = elem.childNodes[0];
					var nLeftMarginTable = (options.width - elTable.offsetWidth)/2;
					var nTopMarginTable = (options.height - elTable.offsetHeight)/2;
					if (nLeftMarginTable > 0 && nTopMarginTable > 0) {
						elTable.style.margin = nTopMarginTable + "px " + nLeftMarginTable + "px";
					};
				},
				clear: function () {
					this.Element.innerHTML = '';
				}
			});
		}
	}
}, true);
//# sourceMappingURL=Drawing.js.map