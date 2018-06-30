/*!
 * tanguage script compiled code
 *
 * Datetime: Sat, 30 Jun 2018 18:32:21 GMT
 */
;
// tang.config({});
tang.init().block([
	'~Range'
], function (pandora, root, imports, undefined) {
	var module = this.module;
	var _ = pandora;
	var doc = root.document;
	var console = root.console;
	pandora.declareClass('form.Selection', {
		editor: null,
		range: null,
		_init: function (editor) {
			this.editor = editor;
		},
		restoreSelection: function () {
			if (this.range) {
				this.range = new _.form.Range(this.range);
			}
			else {
				this.createEmptyRange();
			};
		},
		getRange: function () {
			this.restoreSelection();
			return this.range;
		},
		saveRange: function (range) {
			if (!range) {
				range = new _.form.Range();
			}
			else {
				new _.form.Range(range);
			}
			var i = 0;
			var richareas = this.editor.richareas;
			for (i;i < richareas.length;i++) {
				if (range.isBelongTo(richareas[i])) {
					this.range = range;
					break;;
				}
			}
			return this.range;
		},
		collapseRange: function (toStart) {
			if (this.range) {
				this.range.collapse(toStart);
			}
			return this;
		},
		getSelectionText: function () {
			if (this.range) {
				return this.range.text;
			}
			return '';
		},
		getSelectionContainerElem: function (range) {
			range = range || this.range;
			if (range) {
				var elem = range.commonNode;
				return (elem != null) && (elem.nodeType === 1 ? elem:elem.parentNode);
			};
		},
		getSelectionStartElem: function (range) {
			range = range || this.range;
			if (range) {
				var elem = range.startNode;
				return (elem != null) && (elem.nodeType === 1 ? elem:elem.parentNode);
			};
		},
		getSelectionEndElem: function (range) {
			range = range || this.range;
			if (range) {
				var elem = range.endNode;
				return (elem != null) && (elem.nodeType === 1 ? elem:elem.parentNode);
			};
		},
		isSelectionEmpty: function () {
			if (this.range) {
				return this.range.isEmpty();
			}
			return false;
		},
		createEmptyRange: function (index) {
			var editor = this.editor;
			var range = new _.form.Range();
			var elem = void 0;
			index = parseInt(index) || 0;
			range.selectInput(this.editor.richareas[index], false);
			this.collapseRange().saveRange(range);
			if (!this.isSelectionEmpty()) {
				return;;
			}
			try {
				if (_.util.bool.isWebkit()) {
					range.insertHTML('&#8203;');
					range.setEnd(range.endNode, range.endOffset + 1);
					range.collapse(false);
				}
				else {
					var elem = _.dom.createByString('<strong>&#8203;</strong>');
					range.insertElem(elem);
					this.range.selectElem(elem, false);
				}
			}
			catch (ex) {};
		},
		createRangeByElem: function (elem, toStart, isContent) {
			if (!elem) {
				return ;
			}
			this.saveRange(this.range.selectElem(elem, toStart, isContent));
		}
	});
	
});
//# sourceMappingURL=Selection.js.map