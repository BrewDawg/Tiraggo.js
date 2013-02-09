
//#region TypeCache Methods
tg.getType = function (typeName) {
    var ns = tg.getGeneratedNamespaceObj();
    return ns[typeName];
};

tg.clearTypes = function () {
    tg.generatedNamespace = {};
};

//#endregion

tg.onError = ko.observable({});
tg.onError.subscribe(function (error) {
    throw JSON.stringify(error);
});

tg.isArray = function (array) {
    var arr = ko.utils.unwrapObservable(array);
    if (!arr) { return false; }
    return arr.isArray || Object.prototype.toString.call(arr) === '[object Array]';
};

tg.objectKeys = Object.keys || function (obj) {
    var key, res = [];
    for (key in obj) {
        rorm.push(key);
    }
    return res;
};

tg.isTiraggoCollection = function (coll) {
    var isColl = false;
    if (coll !== undefined && coll.tg !== undefined) {
		if(coll.tg.___TiraggoCollection___ !== undefined) {
			isColl = true;
		}
    } else {
        if (tg.isArray(coll)) {
            if (coll.length > 0) {
                if (coll[0].hasOwnProperty("RowState")) {
                    isColl = true;
                }
            }
        }
    }
    return isColl;
};

tg.isTiraggoEntity = function (entity) {
    var isEnt = false;
    if (entity !== undefined && entity.tg !== undefined && entity.tg.___TiraggoEntity___ !== undefined) {
        isEnt = true;
    }
    return isEnt;
};

tg.isTiraggoLazyLoader = function (obj) {
    var isLaz = false;
    if (obj !== undefined && obj.tg !== undefined && obj.tg.___TiraggoLazyLoad___ !== undefined) {
        isLaz = true;
    }
    return isLaz;
};

tg.exportSymbol('tg.isTiraggoCollection', tg.isTiraggoCollection);