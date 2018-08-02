class Layer extends Component {
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
    elem = app.HTMLElement;

    each (elem.childNodes as index, node) {
        if(dom.hasAttr(node, 'data-layer-name')){
            let layerName = dom.getAttr(node, 'data-layer-name');
            if(layers[layerName]){
                dom.remove(node, elem);
                return;
            }

            layers[layerName] = new Layer({
                uid: layerName,
                HTMLElement: node
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
emptyLayerOptions = {
    tagName: 'div',
    className: '',
    pages: {}
};

createLayer () {

}