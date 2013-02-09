/*global tg*/

tg.RowState = {
    INVALID: 0,
    UNCHANGED: 2,
    ADDED: 4,
    DELETED: 8,
    MODIFIED: 16
};

tg.exportSymbol('tg.RowState', tg.RowState);