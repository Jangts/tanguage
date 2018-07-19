

class Layer extends Component {
    Element;
    pages = {};

    _init() {}

    toTop() {}

    toBottom() {}

    addPage () {

    }

    removePage () {
        
    }
}

scanLayer (app) {
    let
    layers = {},
    elem = app.Element;

    each (elem.childNodes as index, node) {
        if(dom.hasAttr(node, 'data-layer-name')){
            let layerName = dom.getAttr(node, 'data-layer-name');
            if(layers[layerName]){
                dom.remove(node, elem);
                return;
            }

            layers[layerName] = new Layer({
                uid: layerName,
                Element: node
            });
            if(index===0){
                app.defaultLayer = layers[layerName];
            }
        }else{
            dom.remove(node, elem);
        }
    }
}

let
defaultLayerOptions = {
    tagName: 'div',
    className: '',
    pages: {
        defaultPage : defaultPageOptions
    }
},
popupayerOptions = {
    tagName: 'div',
    className: 'popup-layer',
    pages: {}
};

createLayer () {

}