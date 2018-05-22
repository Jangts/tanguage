/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 02:31:30 GMT
 */
;
// tang.config({});
tang.init().block([
	'$_/data/',
	'$_/async/',
	'$_/dom/Elements'
], function (pandora, root, imports, undefined) {
	var $ = _.dom.$;
	var doc = global.document;
	var body = doc.body || doc.getElementsByTagName('body')[0];
	var isSupportWebp = !![].map && doc.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0;
	var htmlBuilde = function () {
		if ($('#tang-dvcode-mask').length) {
			return;;
		}
		var html = '<div class="loading">加载中</div>';
		html += '<canvas class="dvcode-image"></canvas>';
		html += '<canvas class="dvcode-mark"></canvas>';
		html += '<div class="hgroup"></div>';
		html += '<div class="tang-dvcode-err"></div>';
		html += '<div class="tang-dvcode-ok"></div>';
		html += '<div class="tang-dvcode-slide">';
		html += '<div class="tang-dvcode-dragger"></div>';
		html += '<div class="tang-dvcode-tips">拖动左边滑块完成上方拼图</div></div>';
		html += '<div class="tang-dvcode-tools">';
		html += '<div class="dvcode-close"></div>';
		html += '<div class="dvcode-refresh"></div></div></div>';
		_.dom.create('div', body, {
			id: 'tang-dvcode-mask',
			className: 'tang-dvcode-mask'
		});
		_.dom.create('div', body, {
			id: 'tang-dvcode',
			className: 'tang-dvcode',
			html: html
		});
		return true;
	}
	var draw = {
		full: function () {
			var canvas_bg = $('.dvcode-image')[0];
			var ctx_bg = canvas_bg.getContext('2d');
			ctx_bg.drawImage(this.image, 0, this.imgHeight * 2, this.imgWidth, this.imgHeight, 0, 0, this.imgWidth, this.imgHeight);
		},
		image: function () {
			if (this.isBgDrawn) {
				return;;
			}
			this.isBgDrawn = true;
			var canvas_bg = $('.dvcode-image')[0];
			var ctx_bg = canvas_bg.getContext('2d');
			ctx_bg.drawImage(this.image, 0, 0, this.imgWidth, this.imgHeight, 0, 0, this.imgWidth, this.imgHeight);
		},
		mark: function () {
			var canvas_mark = $('.dvcode-mark')[0];
			var ctx_mark = canvas_mark.getContext('2d');
			ctx_mark.clearRect(0, 0, canvas_mark.width, canvas_mark.height);
			ctx_mark.drawImage(this.image, 0, this.imgHeight, this.markWidth, this.imgHeight, this.markOffset, 0, this.markWidth, this.imgHeight);
			var imageData = ctx_mark.getImageData(0, 0, this.imgWidth, this.imgHeight);
			var data = imageData.data;
			var x = this.imgHeight;
			var y = this.imgWidth;
			for (var j = 0;j < x;j++) {
				var ii = 1;
				var k1 =  -1;
				for (var k = 0;k < y && k >= 0 && k > k1;) {
					var i = (j * y + k) * 4;
					k += ii;
					var r = data[i];
					var g = data[i + 1];
					var b = data[i + 2];
					if(r + g + b < 200) data[i + 3] = 0
					else {
						var arr_pix = [1,  -5];
						var arr_op = [250, 0];
						for (var i = 1;i < arr_pix[0] - arr_pix[1];i++) {
							var iiii = arr_pix[0] - 1 * i;
							var op = parseInt(arr_op[0] - (arr_op[0] - arr_op[1])/(arr_pix[0] - arr_pix[1]) * i);
							var iii = (j * y + k + iiii * ii) * 4;
							data[iii + 3] = op;
						}
						if (ii ==  -1) {
							break;;
						}
						k1 = k;
						k = y - 1;
						ii =  -1;
					}
				}
			}
			ctx_mark.putImageData(imageData, 0, 0);
		}
	};
	var send = {
		result: function () {
			var that = this;
			this.result = false;
			_.async.ajax(this.url + '?m=check&token=' + this.markOffset, {
				method: 'GET',
				success: function (responseText) {
					send.success.call(that, responseText);
				},
				fail: function (responseText) {
					send.failure.call(that, responseText);
				}
			});
		},
		success: function (responseText) {
			this.isMoveStarted = false;
			if (responseText == 'ok') {
				this.msg('√验证成功', 1);
				this.result = true;
				$('.hgroup').show();
				setTimeout(this.hide, 3000);
				if (_.util.bool.isFn(this.success)) {
					this.success();
				}
			}
			else {
				var obj = $('#tang-dvcode');
				obj.addClass('dd');
				setTimeout(function () {
					obj.removeClass('dd');
				}, 200);
				this.result = false;
				this.msg('验证失败');
				this.errCount++;
				if (this.errCount > 10) {
					this.refresh();
				}
			};
		},
		failure: function (xhr, status) {
			if (_.util.bool.isFn(this.fail)) {
				this.fail();
			};
		}
	};
	pandora.declareClass('DVCode', {
		image: null,
		markWidth: 50,
		markHeight: 50,
		markOffset: 0,
		imgWidth: 240,
		imgHeight: 150,
		isImageLoaded: false,
		isBgDrawn: false,
		isMoveStarted: false,
		isMoving: false,
		startX: 0,
		startY: 0,
		success: null,
		fail: null,
		fail: null,
		cancel: null,
		result: false,
		errCount: 0,
		_init: function (options) {
			_.each(options, function (option, value) {
				this[option] = value;
			}, this);
			if (htmlBuilde()) {
				this.listenEvents();
			};
		},
		show: function () {
			$('.hgroup').hide();
			this.refresh();
			$('#tang-dvcode-mask, #tang-dvcode').show();
			return this;
		},
		hide: function () {
			$('#tang-dvcode-mask, #tang-dvcode').hide();
			if (_.util.bool.isFn(this.cancel)) {
				this.cancel();
			}
			return this;
		},
		refresh: function () {
			var that = this;
			this.errCount = 0;
			this.isBgDrawn = false;
			this.result = false;
			this.isImageLoaded = false;
			$('.dvcode-image, .dvcode-mark').hide();
			var src = this.url + "?m=make&t=" + Math.random();
			if (!isSupportWebp) {
				src += "&nowebp";
			}
			this.image = new Image();
			this.image.src = src;
			this.image.onload = function () {
				draw.full.call(that);
				var canvas_mark = $('.dvcode-mark')[0];
				var ctx_mark = canvas_mark.getContext('2d');
				ctx_mark.clearRect(0, 0, canvas_mark.width, canvas_mark.height);
				that.isImageLoaded = true;
				$('.dvcode-image, .dvcode-mark').show();
			}
			$('.tang-dvcode-dragger').css('transform', 'translate(0px, 0px)');
			$('.tang-dvcode-tips').show();
			return this;
		},
		reset: function () {
			this.markOffset = 0;
			draw.image.call(this);
			draw.mark.call(this);
			$('.tang-dvcode-dragger').css('transform', 'translate(0px, 0px)');
			return this;
		},
		msg: function (msg, status) {
			if (!status) {
				var that = this;
				status = 0;
				var elems = $('.tang-dvcode-err').html(msg).transition('opacity', 0.8, 1000, null, function () {
					setTimeout(function () {
						elems.transition('opacity', 0, 1000);
					}, 2000);
					that.reset();
				});
			}
			else {
				var elems = $('.tang-dvcode-ok').html(msg).transition('opacity', 0.8, 1000, null, function () {
					setTimeout(function () {
						elems.transition('opacity', 0, 1000);
					}, 2000);
				});
			}
			return this;
		},
		result: function () {
			return this.result;
		},
		listenEvents: function () {
			if (!this.image) {
				var that = this;
				$('#tang-dvcode')
					.on(['mousedown', 'touchstart'], '.tang-dvcode-dragger', this, function (e) {
						that.onStartMove(e);
					})
					.on(['touchstart', 'click'], '.dvcode-close', this, function (e) {
						that.hide();
					})
					.on(['mousedown', 'click'], '.dvcode-refresh', this, function (e) {
						that.refresh();
					});
				$(document)
					.on(['mousemove', 'touchmove'], null, this, function (e) {
						that.onMove(e);
					})
					.on(['mouseup', 'touchend'], null, this, function (e) {
						that.onEndMove(e);
					});
			}
			return this;
		},
		onStartMove: function (e) {
			if (this.isMoveStarted || !this.isImageLoaded) {
				return this;
			}
			e.preventDefault();
			if (e.touches) {
				e = e.touches[0];
			}
			$('.tang-dvcode-tips').hide();
			draw.image.call(this);
			this.startX = e.clientX;
			this.startY = e.clientY;
			this.isMoveStarted = true;
			this.isMoving = true;
			return this;
		},
		onMove: function (e) {
			if(!this.isMoveStarted)return true;
			if(!this.isMoving)return true;
			e.preventDefault();
			if (e.touches) {
				e = e.touches[0];
			}
			this.isMoving = true;
			var offset = e.clientX - this.startX;
			if (offset < 0) {
				offset = 0;
			}
			var max_off = this.imgWidth - this.markWidth;
			if (offset > max_off) {
				offset = max_off;
			}
			$('.tang-dvcode-dragger').css('transform', 'translate(' + offset + 'px, 0px');
			this.markOffset = offset/max_off * (this.imgWidth - this.markWidth);
			draw.image.call(this);
			draw.mark.call(this);
			return this;
		},
		onEndMove: function (e) {
			if(!this.isMoveStarted)return true;
			e.preventDefault();
			if (e.touches) {
				e = e.touches[0];
			}
			this.isMoving = false;
			send.result.call(this);
			return this;
		}
	});
	
}, true);
//# sourceMappingURL=DVCode.js.map