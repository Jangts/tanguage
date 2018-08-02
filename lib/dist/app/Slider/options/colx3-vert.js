/*!
 * tanguage script compiled code
 *
 * Datetime: Thu, 02 Aug 2018 10:48:47 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/app/Slider/'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var app = pandora.ns('app', {});
    var _ = pandora;
    var doc = root.document;
    var location = root.location;
    var $ = _.dom.$;
    pandora.app.Slider.extend({
        name: 'colx3-vert',
        bluider: function () {},
        counter: function (num) {
            return num - 3;
        },
        layout: function () {
            var rank = this.rank(this.actorsNum);
            var power = (this.actorsNum % 2) == 0 ? this.actorsNum + 4 : this.actorsNum + 3;
            var heightTroupe = 100 * power;
            var heightAactor = 100/power;
            this.troupe.style.width = '100%';
            this.troupe.style.height = heightTroupe + '%';
            var position =  -(this.curr + 1) * 100;
            this.troupe.style.top = position + '%';
            this.troupe.style.left = 0;
            $(this.actors).each(function (i) {
                this.setAttribute('data-actor-index', rank[i]);
                this.style.width = '100%';
                this.style.height = heightAactor + '%';
            });
            if (this.renderPanel) {
                $('.panel', this.HTMLElement).each(function () {
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
            rank.push(1);
            return rank;
        },
        correcter: function (from, to) {
            if (to == this.actorsNum) {
                return to;
            }
            else if (to > this.actorsNum && to - from === 1) {
                to = to - this.actorsNum;
                from = from - this.actorsNum;
            }
            else if (to ===  -1 && from === 0) {
                to = to + this.actorsNum;
                from = from + this.actorsNum;
            }
            if (to < 0 || to > this.actorsNum) {
                _.error('You have specified a wrong pointer[' + to + '/' + this.actorsNum + ']!');
            }
            if (to == 0 && from == this.actorsNum) {
                from = 0;
            }
            if (to == 0 && from == this.actorsNum - 1) {
                to = this.actorsNum;
            }
            var position =  -(from + 1) * 100;
            this.troupe.style.top = position + '%';
            return to;
        },
        cut: function (n) {
            var to = this.correcter(this.curr, n);
            var position =  -(to + 1) * 100;
            $(this.troupe).stop(true, true).animate({top: position + '%'}, 500, 'easeInOutBack');
            this.curr = to;
        }
    });
    this.module.exports = pandora.app.Slider;
});
//# sourceMappingURL=colx3-vert.js.map