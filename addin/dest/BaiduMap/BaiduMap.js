/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 02:31:30 GMT
 */
;
// tang.config({});
tang.init().block([
	'$_/dom/',
	'//api.map.baidu.com/getscript?v=1.1&ak=&services=true&t=20130716024058',
	'//api.map.baidu.com/res/11/bmap.css'
], function (pandora, root, imports, undefined) {
	var doc = global.document;
	var BMap = global.BMap;
	var BMAP_NAVIGATION_CONTROL_LARGE = global.BMAP_NAVIGATION_CONTROL_LARGE;
	var BMAP_ANCHOR_BOTTOM_RIGHT = global.BMAP_ANCHOR_BOTTOM_RIGHT;
	var BMAP_ANCHOR_BOTTOM_LEFT = global.BMAP_ANCHOR_BOTTOM_LEFT;
	var addNavigationControl = function (map) {
		var ctrl_nav = new BMap.NavigationControl({
			anchor: BMAP_ANCHOR_TOP_LEFT,
			type: BMAP_NAVIGATION_CONTROL_LARGE
		});
		map.addControl(ctrl_nav);
	}
	var addOverviewControl = function (map) {
		var ctrl_ove = new BMap.OverviewMapControl({
			anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
			isOpen: 1
		});
		map.addControl(ctrl_ove);
	}
	var addScaleControl = function (map) {
		var ctrl_sca = new BMap.ScaleControl({
			anchor: BMAP_ANCHOR_BOTTOM_LEFT
		});
		map.addControl(ctrl_sca);
	}
	var createInfoWindow = function (mark) {
		return new BMap.InfoWindow("<b class='iw_poi_title' title='" + mark.title + "'>" + mark.title + "</b><div class='iw_poi_content'>" + mark.content + "</div>");
	}
	var createIcon = function (icon) {
		return new BMap.Icon(icon.png || _.core.url() + '../addins/BaiduMap/icon.png', new BMap.Size(icon.w, icon.h), {
			imageOffset: new BMap.Size( -icon.l,  -icon.t),
			infoWindowOffset: new BMap.Size(icon.lb + 5, 1),
			offset: new BMap.Size(icon.x, icon.h)
		});
	}
	pandora.declareClass('BaiduMap', {
		map: null,
		_init: function (elem, options) {
			if (options && options.coords) {
				elem = _.util.type.isElement(elem) ? elem : doc.getElementById(elem);
				_.dom.addClass(elem, 'tang-addin-map');
				var id = _.dom.getAttr(elem, 'id') || _.dom.setAttr(elem, 'id', (new _.Identifier()).toString());
				var map = new BMap.Map(id);
				var point = new BMap.Point(options.coords[0], options.coords[1]);
				map.centerAndZoom(point, options.zoom || 18);
				this.map = map;
				this.listenEvents();
				if (options.navigation !== null && options.navigation !== false) {
					addNavigationControl(map);
				}
				if (options.overview !== null && options.overview !== false) {
					addOverviewControl(map);
				}
				if (options.scale !== null && options.scale !== false) {
					addScaleControl(map);
				}
				if (options.title) {
					this.addMarker({
						title: options.title,
						content: options.desc || options.title,
						point: options.coords,
						isOpen: options.isOpen || 0,
						icon: options.icon || {
							img: _.core.url() + '../addins/BaiduMap/icon.png',
							w: 21,
							h: 21,
							l: 0,
							t: 0,
							x: 6,
							lb: 5
						}
					});
				}
				if (options.marks) {
					for (var i = 0;i < options.marks.length;i++) {
						this.addMarker(options.marks[i]);
					}
				}
			}
			else {
				_.error('coordsinates of central location must be given');
			};
		},
		addMarker: function (mark) {
			var point = new BMap.Point(mark.point[0], mark.point[1]);
			var marker = new BMap.Marker(point, {
				icon: createIcon(mark.icon)
			});
			var info = createInfoWindow(mark);
			var label = new BMap.Label(mark.title, {
				"offset": new BMap.Size(mark.icon.lb - mark.icon.x + 15,  -20)
			});
			marker.setLabel(label);
			this.map.addOverlay(marker);
			label.setStyle({
				borderColor: "#808080",
				color: "#333",
				cursor: "pointer"
			});
			marker.addEventListener("click", function () {
				this.openInfoWindow(info);
			});
			info.addEventListener("open", function () {
				marker.getLabel().hide();
			});
			info.addEventListener("close", function () {
				marker.getLabel().show();
			});
			label.addEventListener("click", function () {
				marker.openInfoWindow(info);
			});
			if (!!mark.isOpen) {
				label.hide();
				marker.openInfoWindow(info);
			};
		},
		listenEvents: function () {
			this.map.enableDragging();
			this.map.enableScrollWheelZoom();
			this.map.enableDoubleClickZoom();
			this.map.enableKeyboard();
		}
	});
	
}, true);
//# sourceMappingURL=BaiduMap.js.map