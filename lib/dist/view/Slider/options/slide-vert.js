/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 03 Jul 2018 15:51:18 GMT
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
	var $ = _.dom.$;
	pandora.view.Slider.extend({
		name: 'slide-vert',
		easing: "linear",
		duration: 400,
		bluider: function () {},
		layout: function () {
			var power = (this.actorsNum % 2) == 0 ? this.actorsNum : this.actorsNum + 1;
			var heightTroupe = 100 * power;
			var heightAactor = 100/power;
			this.troupe.style.width = '100%';
			this.troupe.style.height = heightTroupe + '%';
			this.troupe.style.top = 0;
			this.troupe.style.left = 0;
			$(this.actors).each(function (i) {
				this.setAttribute('data-actor-index', i);
				this.style.width = '100%';
				this.style.height = heightAactor + '%';
			});
			if (this.renderPanel) {
				$('.panel', this.Element).each(function () {
					$('.slider-anchor', this).each(function (i) {
						this.setAttribute('data-actor-index', i);
					});
				});
			};
		},
		correcter: function (to) {
			to = (to < this.actorsNum) ? to : 0;
			to = (to >= 0) ? to : this.actorsNum - 1;
			return to;
		},
		cut: function (n) {
			var to = this.correcter(n);
			var position = to *  -100;
			$(this.troupe).stop(true, true).animate({top: position + '%'}, this.duration, this.easing);
			this.curr = to;
		}
	});
	this.module.exports = pandora.view.Slider;
});
//# sourceMappingURL=slide-vert.js.map