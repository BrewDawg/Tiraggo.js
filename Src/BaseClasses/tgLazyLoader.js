/*global tg */

//
//    Copyright (c) Mike Griffin, 2013 
//

tg.tgLazyLoader = function (entity, propName) {

    var self = entity;

    var tgLazyLoader = function () {

        var val;

        if (arguments.length === 0) {

            if (val === undefined) {

                val = self.createObjectFromType(self.tgTypeDefs[propName]);

                if (val === undefined) {
                    throw "Please include the JavaScript class file for the '" + propName + "'";
                }

                val.load({
                    route: self.tgRoutes[propName],
                    data: self.tgPrimaryKeys()
                });
            }

            self[propName] = val;

            if (self.tgRoutes[propName].response === 'collection') {
                return val();
            } else {
                return val;
            }
        }
    };

    return tgLazyLoader;
};

tg.tgLazyLoader.fn = { //can't do prototype on this one bc its a function

    __ko_proto__: ko.observable,

    isDirty: function () {
        return false;
    },

    isDirtyGraph: function () {
        return false;
    },

    subscribe: function () {

    }
};

tg.defineLazyLoader = function (entity, propName) {

    var tgWhatever = function () {
        var lazy = new tg.tgLazyLoader(entity, propName);
        return lazy();
    };

    ko.utils.extend(tgWhatever, tg.tgLazyLoader.fn);
    tgWhatever.tg = {};
    tgWhatever.tg.___TiraggoLazyLoader___ = true;
    return tgWhatever;
};