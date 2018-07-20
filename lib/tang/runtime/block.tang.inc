let
/** 当前主（动）代码块的指针 */
mainPointer = 0,
/** 代码块依赖计数 */
requireCount = 0,
loadedCount = 0;

block (includes, callback, blockname) {
    return new Block(includes, callback, blockname).result;
}

/** 运行从代码块 */
fireblock (block) {
    if (block.uid) {
        // clog block;
        return;
    }
    // clog block.imports;
    each(block.imports, (id, blocks) {
        var isAlisa = (typeof blocks === 'string');
        if (isAlisa) {
            var require = storage.blocks.requires[blocks];
        } else {
            var require = storage.blocks.requires[id];
        }
        // clog require;
        if (require.status === 'loaded') {
            require.status = 'fired';
            // clog id, require.blocks;
            each(require.blocks, (i, block) {
                // clog block;
                // block.exports = require.exports;
                fireblock(block);
            });
        }
        block.imports[id] = require.exports;
    });

    block.uid = new Identifier().toString();
    storage.locales[block.uid] = block._parent;
    return block.callback(storage.pandora, root, block.imports);
};
@include 'block/BlockCore';
@include 'block/BlockClass';