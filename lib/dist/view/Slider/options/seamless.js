/*!
 * tanguage framework sugar compiled code
 *
 * Datetime: Thu, 17 May 2018 14:55:38 GMT
 */
;
// tang.config({});
tang.init().block([
	'$_/view/Slider/'
], function (pandora, root, imports, undefined) {
	var module = this.module;
	var view = pandora.ns('view', {});
	var _ = pandora;
	var doc = root.document;
	var location = root.location;
	var $ = _.dom.select;
	pandora.view.Slider.extend({
		name: 'seamless',
		easing: "linear",
		bluider: function () {},
		counter: function (num) {
			return num - 2;
		},
		layout: function () {
			var rank = this.rank(this.actorsNum);
			var power = (this.actorsNum % 2) == 0 ? this.actorsNum + 2 : this.actorsNum + 3;
			var widthTroupe = 100 * power;
			var widthAactor = 100/power;
			this.troupe.style.width = widthTroupe + '%';
			this.troupe.style.height = '100%';
			var position =  -(this.curr + 1) * 100;
			this.troupe.style.top = 0;
			this.troupe.style.left = position + '%';
			$(this.actors).each(function (i) {
				this.setAttribute('data-actor-index', rank[i]);
				this.style.width = widthAactor + '%';
				this.style.height = '100%';
			});
			if (this.renderPanel) {
				$('.panel', this.Element).each(function () {
					$('.slider-anchor', this).each(function (i) {
						this.setAttribute('data-actor-index', rank[i]);
					});
				});
			}
			if (this.renderPanel) {
				$('.panel', this.Element).each(function () {
					$('.slider-anchor', this).each(function (i) {
						this.setAttribute('data-actor-index', rank[i + 1]);
					});
				});
			};
		},
		rank: function (num) {
			var rank = [];
			rank.push(num - 1);
			for (var i = 0;i < num;i++) {
				rank.push(i);
			}
			rank.push(0);
			return rank;
		},
		correcter: function (from, to) {
			if (to === this.actorsNum && to - from === 1) {
				to = 0;
				from =  -1;
				var position =  -(from + 1) * 100;
				this.troupe.style.left = position + '%';
			}
			else if (to ===  -1 && from === 0) {
				to = this.actorsNum - 1;
				from = this.actorsNum;
				var position =  -(from + 1) * 100;
				this.troupe.style.left = position + '%';
			}
			if (to < 0 || to >= this.actorsNum) {
				_.error('You have specified a wrong pointer[' + to + '/' + this.actorsNum + ']!');
			}
			return to;
		},
		cut: function (n) {
			var to = this.correcter(this.curr, n);
			var position =  -(to + 1) * 100;
			$(this.troupe).stop(true, true).animate({left: position + '%'}, this.duration, this.easing);
			this.curr = to;
		}
	});
	this.module.exports = pandora.view.Slider;
});
//# sourceMappingURL=seamless.js.map