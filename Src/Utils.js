/*globals tg, ko*/

/// <reference path="../Libs/jquery-1.9.0.min.js" />
/// <reference path="../Libs/knockout-2.0.0.debug.js" />

var utils = {

    dateParser: new tg.DateParser(),

    copyDataIntoEntity: function (target, source) {
        var prop, srcProp;

        if (!target || !source) {
            return;
        }

        for (prop in target) {

            if (source.hasOwnProperty(prop)) {

                if (target.tgTypeDefs && target.tgTypeDefs[prop]) continue; // skip heirarchtical

                srcProp = source[prop];

                if (typeof srcProp === "string") {
                    srcProp = utils.dateParser.deserialize(srcProp);
                }

                if (ko.isObservable(target[prop]) || ko.isComputed(target[prop])) { //set the observable property
                    target[prop](srcProp); // set the observable
                } else {
                    target[prop] = srcProp;
                }
            }
        }

        return target;
    },

    extend: function (target, source) {
        var prop;

        if (!target || !source) {
            return;
        }

        for (prop in source) {
            target[prop] = source[prop];
        }

        return target;
    },

    addPropertyChangedHandlers: function (obj, propertyName) {

        var property = obj[propertyName];

        //only subscribe to property changes if its a ko.observable... not an ObservableArray, or a Computed
        if (ko.isObservable(property) && !(property instanceof Array) && property.__ko_proto__ !== ko.dependentObservable) {

            // This is the actual PropertyChanged event
            property.subscribe(function (originalValue) {

                var mappedName;

                if (obj.tg.ignorePropertyChanged === false) {

                    mappedName = obj.tgColumnMap[propertyName];

                    if (mappedName === 1) {
                        mappedName = propertyName;
                    }

                    mappedName = mappedName || propertyName;

                    if (ko.utils.arrayIndexOf(obj.ModifiedColumns(), mappedName) === -1) {

                        if (!obj.tg.originalValues[propertyName]) {
                            obj.tg.originalValues[propertyName] = originalValue;
                        }

                        if (propertyName !== "RowState") {

                            obj.ModifiedColumns.push(mappedName);

                            if (obj.RowState() !== tg.RowState.MODIFIED && obj.RowState() !== tg.RowState.ADDED) {
                                obj.RowState(tg.RowState.MODIFIED);
                            }
                        }
                    }
                }
            }, obj, "beforeChange"); //subscribe to 'beforeChange' so we can be notified of the current value and not the new value!
        }
    },

    startTracking: function (entity) {

        var propertyName;

        if (!entity.hasOwnProperty("RowState")) {
            entity.RowState = ko.observable(tg.RowState.ADDED);
        } else {
            if (!ko.isObservable(entity.RowState)) {
                entity.RowState = ko.observable(entity.RowState);
            }
        }

        if (entity.hasOwnProperty("ModifiedColumns")) {
            //overwrite existing data
            entity.ModifiedColumns([]);
        } else {
            entity.ModifiedColumns = ko.observableArray();
        }


        for (propertyName in entity) {
            if (propertyName !== "ModifiedColumns" &&
                propertyName !== '__type' &&
                propertyName !== 'tgExtendedData' &&
                propertyName !== 'tg') {

                var property = entity[propertyName];

                if (property instanceof Array) {
                    continue;
                }

                if (entity.hasOwnProperty(propertyName) && ko.isObservable(property)) {
                    utils.addPropertyChangedHandlers(entity, propertyName);
                }
            }
        }

        return entity;
    },

    expandExtraColumns: function (entity, shouldMakeObservable) {

        var data,
            i,
            ext,
            makeObservable = arguments[1] || false;

        if (entity.tgExtendedData && tg.isArray(entity.tgExtendedData)) {

            data = ko.isObservable(entity.tgExtendedData) ? entity.tgExtendedData() : entity.tgExtendedData;

            for (i = 0; i < data.length; i++) {

                if (ko.isObservable(entity[data[i].Key])) { //set the observable property
                    entity[data[i].Key](data[i].Value); // set the observable
                } else {
                    if (makeObservable) {
                        entity[data[i].Key] = ko.observable(data[i].Value);
                    } else {
                        entity[data[i].Key] = data[i].Value;
                    }
                }
            }

            entity.tgExtendedData = [];
        }

        return entity;
    },

    getDirtyGraph: function (obj, root, dirtyGraph) {

        var propertyName, entity, arr, temp, index;

        // Check and see if we have anything dirty at all?
        if (root === undefined) {
            if (!obj.isDirtyGraph()) {
                return null;
            }
        }

        if (tg.isTiraggoEntity(obj)) {

            if (tg.isArray(dirtyGraph)) {
                temp = obj.prepareForJSON();
                dirtyGraph.push(temp);
                dirtyGraph = temp;
            } else {
                dirtyGraph = obj.prepareForJSON();
            }

            if (root === undefined) {
                root = dirtyGraph;
            }

            for (propertyName in obj.tgTypeDefs) {

                if (obj[propertyName] !== undefined) {

                    if (obj[propertyName].isDirtyGraph()) {

                        arr = obj[propertyName].prepareForJSON();
                        dirtyGraph[propertyName] = [];

                        for (index = 0; index < arr.length; index++) {
                            entity = arr[index];
                            tg.utils.getDirtyGraph(entity, root, dirtyGraph[propertyName]);
                        }
                    }
                }
            }
        } else {

            // They passed in a collection 
            root = [];

            arr = obj.prepareForJSON();

            for (index = 0; index < arr.length; index++) {
                entity = arr[index];
                tg.utils.getDirtyGraph(entity, root, root);
            }
        }

        return root;
    }
};

utils.newId = (function () {
    var seedId = new Date().getTime();

    return function () {
        return ++seedId;
    };

} ());

tg.utils = utils;

tg.exportSymbol('tg.extend', tg.extend);
tg.exportSymbol('tg.startTracking', tg.startTracking);
tg.exportSymbol('tg.getDirtyGraph', tg.getDirtyGraph);