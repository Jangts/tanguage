/*!
 * tanguage script compiled code
 *
 * Datetime: Thu, 02 Aug 2018 07:22:58 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/util/',
    '$_/dom/',
    '$_/draw/SVG/Element'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var draw = pandora.ns('draw', {});
    var SVGElement = imports['$_/draw/svg/element'];
    var _ = pandora;
    var doc = root.document;
    var console = root.console, location = root.location;
    function getGeoPathStr (coordinate, i, svg, type) {
        coordinate = svg.coordinateSwitch(coordinate, type);
        if (i == 0) {
            return 'M' + coordinate[0] + ',' + coordinate[1];
        }
        else {
            return 'L' + coordinate[0] + ',' + coordinate[1];
        };
    }
    var types = {
        Long: function (coordinate, mapCenter, scale, center) {
            return (coordinate[0] - mapCenter) * scale + center;
        },
        CosLat: function (coordinate, mapCenter, scale, center) {
            return Math.cos(2 * Math.PI/360 * coordinate[1]) * (coordinate[0] - mapCenter) * scale + center;
        },
        World: function (coordinate, mapCenter, scale, center) {
            return (1 - Math.sin(2 * Math.PI/360 * Math.abs(coordinate[1])) * Math.abs(coordinate[1])/180 * Math.abs(coordinate[1])/90) * (coordinate[0] - mapCenter) * scale + center;
        }
    };
    pandora.declareClass('draw.SVG', {
        Element: undefined,
        _init: function (rootnode, width, height) {
            var _arguments = arguments;
            if (_.util.isEl(rootnode)) {
                this.HTMLElement = rootnode;
                this.width = width || 800;
                this.height = height || 600;
                var SVG = new SVGElement('svg', {
                    width: width,
                    height: height
                }, rootnode);
                pandora.each(SVG, function (index, value) {
                    this[index] = value;
                }, this);
            };
        },
        rect: function (x, y, width, height, data) {
            var _arguments = arguments;
            var rect = new SVGElement('rect', {
                x: x,
                y: y,
                width: width,
                height: height
            }, this.HTMLElement);
            if (data) {
                pandora.each(data, function (attr) {
                    rect.attr(attr, this);
                }, this);
            }
            return rect;
        },
        circle: function (cx, cy, r, data) {
            var _arguments = arguments;
            var circle = new SVGElement('circle', {
                cx: cx,
                cy: cy,
                r: r
            }, this.HTMLElement);
            if (data) {
                pandora.each(data, function (attr) {
                    circle.attr(attr, this);
                }, this);
            }
            return circle;
        },
        eliipse: function (cx, cy, rx, ry, data) {
            var _arguments = arguments;
            var eliipse = new SVGElement('eliipse', {
                cx: cx,
                cy: cy,
                rx: rx,
                ry: ry
            }, this.HTMLElement);
            if (data) {
                pandora.each(data, function (attr) {
                    eliipse.attr(attr, this);
                }, this);
            }
            return eliipse;
        },
        line: function (x1, y1, x2, y2, data) {
            var _arguments = arguments;
            var line = new SVGElement('line', {
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2
            }, this.HTMLElement);
            if (data) {
                pandora.each(data, function (attr) {
                    line.attr(attr, this);
                }, this);
            }
            return line;
        },
        path: function (pathString, data) {
            var _arguments = arguments;
            var path = new SVGElement('path', {
                d: pathString
            }, this.HTMLElement);
            if (data) {
                pandora.each(data, function (attr) {
                    path.attr(attr, this);
                }, this);
            }
            return path;
        },
        text: function (x, y, textContent, data) {
            var _arguments = arguments;
            var text = new SVGElement('text', {
                x: x,
                y: y
            }, this.HTMLElement);
            text.HTMLElement.textContent = textContent;
            if (data) {
                pandora.each(data, function (attr) {
                    text.attr(attr, this);
                }, this);
            }
            text.span = function (x, y, textContent, data) {
                var _arguments = arguments;
                var tspan = new SVGElement('tspan', {
                    x: x,
                    y: y
                }, text.HTMLElement);
                tspan.HTMLElement.textContent = textContent;
                if (data) {
                    pandora.each(data, function (attr) {
                        tspan.attr(attr, this);
                    }, this);
                };
            }
            return text;
        },
        sharp: function () {}
    });
    var geo = function (rootnode, width, height, data, range, after, type) {
        var _arguments = arguments;
        var svg = new _.draw.SVG(rootnode, width, height);
        var svgRate = width/height;
        var mapRate = (range.rb[0] - range.lt[0])/(range.lt[1] - range.rb[1]);
        var center = width/2;
        if (svgRate > mapRate) {
            var mapWidth = height * mapRate;
            var mapHeight = height;
            var top = 0;
        }
        else {
            var mapWidth = width;
            var mapHeight = width/mapRate;
            var top = (height - mapHeight)/2;
        }
        var scale = mapWidth/(range.rb[0] - range.lt[0]);
        var mapCenter = (range.rb[0] + range.lt[0])/2;
        svg.coordinateSwitch = function (coordinate, type) {
            type = type || 'CosLat';
            var x = types[type] ? types[type](coordinate, mapCenter, scale, center): types.CosLat(coordinate, mapCenter, scale, center);
            var y = (range.lt[1] - coordinate[1]) * scale + top;
            return [x, y];
        }
        pandora.each(data, function (i, place) {
            var pathStr = '';
            var coordinates = place["geometry"]["coordinates"];
            pandora.each(coordinates, function (i, coordinate) {
                if (_.util.isNum(coordinate[0][0])) {
                    pandora.each(coordinates[i], function (n, array) {
                        pathStr += getGeoPathStr(array, n, svg, type);
                    }, this);
                }
                else if (_.util.isNum(coordinate[0][0][0])) {
                    pandora.each(coordinates[i][0], function (n, array) {
                        pathStr += getGeoPathStr(array, n, svg, type);
                    }, this);
                };
            }, this);
            var path = svg.path(pathStr);
            after.call(svg, i, path, place["type"], place["properties"]);
        }, this);
        return svg;
    }
    this.module.exports = draw.SVG;
    pandora('draw.geo', geo);
});
//# sourceMappingURL=SVG.js.map