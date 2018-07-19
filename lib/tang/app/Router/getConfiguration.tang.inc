const
replaceSpecialSymbols = /(\/|\.|\?)/g,
replaceSlashes = /[\\\/]+/g,
matchREST = replaceREST = /\/:[$_A-Za-z][\w_]*\//g,
matchQS = replaceQS = /\=:[$_A-Za-z][\w_]*(&|$)/g,
matchAsterisk = /[^\*:]+\/\*$/,
replaceAsterisk = /\/\*$/;

let configurations = {};

formatPath (path) {
    return path.replace(replaceSlashes, '/').replace(/\/$/, '');
}
getConfiguration (path) {
    path = formatPath(path);

    if(configurations[path];) return configurations[path];

    let match;
    if(match = path.match(matchREST)){
        let
        params = ['$path'],
        pattern = new RegExp('^' + path.replace(replaceREST, '/([^/]+)/').replace(replaceSpecialSymbols, "\\$1").replace(replaceAsterisk, '\/.*') + '$');

        each (match as element) {
            params.push(element.replace(/(\/|:)/g, ''));
        }
        configurations[path] = {
            uid: path,
            type: 'pattern',
            params: params,
            pattern: pattern
        }
    }
    else if(match = path.match(matchQS)){
        let
        params = ['$path'],
        pattern = new RegExp('^' + path.replace(replaceQS, '/([^&]+)/').replace(replaceSpecialSymbols, "\\$1") + '$');

        each (match as element) {
            params.push(element.replace(/(\/|:)/g, ''));
        }
        configurations[path] = {
            uid: path,
            type: 'pattern',
            params: params,
            pattern: pattern
        }
    }
    else if(path.match(matchAsterisk)){
        let pattern = new RegExp('^' + path.replace('*', '.*$').replace('/', '\/'));

        configurations[path] =  {
            uid: path,
            type: 'pattern',
            params: ['$path'],
            pattern: pattern
        }
    }
    else{
        configurations[path] = {
            uid: path,
            type: 'path'
        }
    }

    return configurations[path];
}