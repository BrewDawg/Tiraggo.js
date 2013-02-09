/*globals es */
/// <reference path="../Libs/jquery-1.7.1.js" />
/// <reference path="../Libs/json2.js" />
/// <reference path="../Libs/knockout-2.0.0.debug.js" />
/// <reference path="../Constants.js" />
/// <reference path="../Namespace.js" />
/// <reference path="../Utils.js" />


tg.TiraggoEntity = function () { //empty constructor
    var extenders = [];

    this.customize = function (extender) {
        extenders.push(extender);
        return this;
    };

    this.init = function () {
        var self = this;

        //build out the 'es' utility object
        self.tg.___TiraggoEntity___ = tg.utils.newId(); // assign a unique id so we can test objects with this key, do equality comparison, etc...
        self.tg.ignorePropertyChanged = false;
        self.tg.originalValues = {};
        self.tg.isLoading = ko.observable(false);

        //start change tracking
        tg.utils.startTracking(self);

        // before populating the data, call each extender to add the required functionality to our object        
        ko.utils.arrayForEach(extenders, function (extender) {

            if (extender) {
                //Make sure to set the 'this' properly by using 'call'
                extender.call(self);
            }
        });


        this.isDirty = ko.computed(function () {
            return (self.RowState() !== tg.RowState.UNCHANGED);
        });

        this.isDirtyGraph = function () {

            var propertyName, dirty = false;

            if (self.RowState() !== tg.RowState.UNCHANGED) {
                return true;
            }

            for (propertyName in this.tgTypeDefs) {

                if (this[propertyName] !== undefined) {
                    dirty = this[propertyName].isDirtyGraph();
                    if (dirty === true) {
                        break;
                    }
                }
            }

            return dirty;
        };
    };

    this.createObjectFromEsTypeDef = function (esTypeDef) {
        var entityProp, EntityCtor;

        if (this.tgTypeDefs && this.tgTypeDefs[esTypeDef]) {
            EntityCtor = tg.getType(this.tgTypeDefs[esTypeDef]);
            if (EntityCtor) {
                entityProp = new EntityCtor();
            }
        }

        return entityProp;
    };

    this.createObjectFromType = function (type) {
        var entityProp, EntityCtor;

        EntityCtor = tg.getType(type);
        if (EntityCtor) {
            entityProp = new EntityCtor();
        }

        return entityProp;
    };

    this.prepareForJSON = function () {

        var self = this,
            stripped = {};

        ko.utils.arrayForEach(tg.objectKeys(this), function (key) {

            var mappedName, srcValue;

            switch (key) {
                case 'tg':
                case 'tgTypeDefs':
                case 'tgRoutes':
                case 'tgColumnMap':
                case 'tgExtendedData':
                case 'tgPrimaryKeys':				
                    break;

                case 'RowState':
                    stripped['RowState'] = ko.utils.unwrapObservable(self.RowState);
                    break;

                case 'ModifiedColumns':
                    stripped['ModifiedColumns'] = ko.utils.unwrapObservable(self.ModifiedColumns);
                    break;

                default:

                    mappedName = self.tgColumnMap[key];

                    if (mappedName !== undefined) {

                        srcValue = ko.utils.unwrapObservable(self[key]);

                        if (srcValue === null || ( typeof srcValue !== "function" && srcValue !== undefined)) {

                            // This is a core column ...
                            if (srcValue !== null && srcValue instanceof Date) {
                                stripped[key] = utils.dateParser.serialize(srcValue);
                            } else {
                                stripped[key] = srcValue;
                            }
                        }
                    } else {

                        srcValue = self[key];

                        // We have an embedded EsCollection, if it's dirty lets send it up
                        if (es.isEsCollection(srcValue) && self[key].isDirty()) {

                            var arrayOfObjects = srcValue();
                            var arry = [];

                            ko.utils.arrayForEach(arrayOfObjects, function (entity) {
                                arry.push(entity.prepareForJSON());
                            });
                            stripped[key] = arry;
                        }
                    }
                    break;
            }
        });

        return stripped;
    };

    this.populateEntity = function (data) {
        var self = this,
            prop,
            EntityCtor,
            entityProp;

        self.tg.ignorePropertyChanged = true;

        try {
            //blow away ModifiedColumns && orinalValues            
            if (this.hasOwnProperty("ModifiedColumns")) {
                //overwrite existing data
                this.ModifiedColumns([]);
            } else {
                this.ModifiedColumns = ko.observableArray();
            }
            this.tg.originalValues = {};

            //populate the entity with data back from the server...
            tg.utils.copyDataIntoEntity(self, data);

            //expand the Extra Columns
            tg.utils.expandExtraColumns(self, true);

            for (prop in data) {
                if (data.hasOwnProperty(prop)) {

                    if (this.tgTypeDefs && this.tgTypeDefs[prop]) {
                        EntityCtor = tg.getType(this.tgTypeDefs[prop]);
                        if (EntityCtor) {

                            entityProp = new EntityCtor();
                            if (entityProp.tg.hasOwnProperty('___TiraggoCollection___')) { //if its a collection call 'populateCollection'
                                entityProp.populateCollection(data[prop]);
                            } else { //else call 'populateEntity'
                                entityProp.populateEntity(data[prop]);
                            }

                            if (tg.isTiraggoCollection(this[prop])) {
                                this[prop](entityProp()); // Pass the entities into the already created collection
                            } else {
                                this[prop] = entityProp;  //then set the property back to the new Entity Object
                            }
                        } else {
                            // NOTE: We have a hierarchical property but the .js file for that entity wasn't included
                            //       so we need to make these regular ol' javascript objects
                            if (tg.isArray(data[prop])) {
                                this[prop] = data[prop];
                                ko.utils.arrayForEach(this[prop], function (data) {
                                    // TODO : CONTINUE WALKING, TALK WITH ERIC
                                });
                            } else {
                                this[prop] = data[prop];
                                // TODO : CONTINUE WALKING, TALK WITH ERIC
                            }
                        }
                    }
                }
            }
        } finally {
            // We need to make sure we always turn this off ...
            self.tg.ignorePropertyChanged = false;
        }
    };

    this.applyDefaults = function () {
        //here to be overridden higher up the prototype chain
    };

    this.acceptChanges = function () {

        //clear out originalValues so it thinks all values are original
        this.tg.originalValues = {};

        //then clear out ModifiedColumns
        this.ModifiedColumns([]);

        //finally set RowState back
        this.tg.ignorePropertyChanged = true;
        this.RowState(tg.RowState.UNCHANGED);
        this.tg.ignorePropertyChanged = false;
    };

    this.rejectChanges = function () {
        var prop;

        if (this.tg.originalValues) {

            this.tg.ignorePropertyChanged = true;

            //loop through the properties and revert the values back
            for (prop in this.tg.originalValues) {

                //ideally RowState is handled by this as well
                this[prop](this.tg.originalValues[prop]); // set the observable
            }

            // reset changes
            this.ModifiedColumns([]);
            this.tg.originalValues = {};

            this.tg.ignorePropertyChanged = false;
        }
    };

    this.markAsDeleted = function () {
        var entity = this;

        if (!entity.hasOwnProperty("RowState")) {
            entity.RowState = ko.observable(tg.RowState.DELETED);
        } else if (entity.RowState() !== tg.RowState.DELETED) {
            entity.RowState(tg.RowState.DELETED);
        }

        if (entity.hasOwnProperty("ModifiedColumns")) {
            entity.ModifiedColumns.removeAll();
        }
    };

    //#region Loads
    this.load = function (options) {
        var state = {},
            self = this;

        self.tg.isLoading(true);

        state.wasLoaded = false;
        state.state = options.state;

        if (options.success !== undefined || options.error !== undefined) {
            options.async = true;
        } else {
            options.async = false;
        }

        //if a route was passed in, use that route to pull the ajax options url & type
        if (options.route) {
            options.url = options.route.url || this.tgRoutes[options.route].url;
            options.type = options.route.method || this.tgRoutes[options.route].method; //in jQuery, the HttpVerb is the 'type' param
        }

        //sprinkle in our own handlers, but make sure the original still gets called
        var successHandler = options.success;
        var errorHandler = options.error;

        //wrap the passed in success handler so that we can populate the Entity
        options.success = function (data, options) {

            if (data !== undefined && data !== null) {

                state.wasLoaded = true;

                //populate the entity with the returned data;
                self.populateEntity(data);
            }

            //fire the passed in success handler
            if (successHandler) { successHandler.call(self, data, state); }
            self.tg.isLoading(false);
        };

        options.error = function (status, responseText, options) {
            if (errorHandler) { errorHandler.call(self, status, responseText, state); }
            self.tg.isLoading(false);
        };

        tg.dataProvider.execute(options);

        if (options.async === false) {
            self.tg.isLoading(false);
        }

        return state.wasLoaded;
    };

    this.loadByPrimaryKey = function (primaryKey, success, error, state) { // or single argument of options

        var options = {
            route: this.tgRoutes['loadByPrimaryKey']
        };

        if (arguments.length === 1 && arguments[0] && typeof arguments[0] === 'object') {
            tg.utils.extend(options, arguments[0]);
        } else {
            options.data = primaryKey;
            options.success = success;
            options.error = error;
            options.state = state;
        }

        return this.load(options);
    };
    //#endregion Save

    //#region Save
    this.save = function (success, error, state) {
        var self = this;

        self.tg.isLoading(true);

        var options = { success: success, error: error, state: state, route: self.tgRoutes['commit'] };

        switch (self.RowState()) {
            case tg.RowState.ADDED:
                options.route = self.tgRoutes['create'] || options.route;
                break;
            case tg.RowState.MODIFIED:
                options.route = self.tgRoutes['update'] || options.route;
                break;
            case tg.RowState.DELETED:
                options.route = self.tgRoutes['delete'] || options.route;
                break;
        }

        if (arguments.length === 1 && arguments[0] && typeof arguments[0] === 'object') {
            tg.utils.extend(options, arguments[0]);
        }

        if (options.success !== undefined || options.error !== undefined) {
            options.async = true;
        } else {
            options.async = false;
        }

        // Get all of the dirty data in the entire object graph
        options.data = tg.utils.getDirtyGraph(self);

        if (options.data === null) {
            // there was no data to save
            if (options.async === true) {
                options.success(null, options.state);
            }

            self.tg.isLoading(false);
            return;
        }

        if (options.route) {
            options.url = options.route.url;
            options.type = options.route.method;
        }

        var successHandler = options.success,
            errorHandler = options.error;

        options.success = function (data, options) {
            self.populateEntity(data);
            if (successHandler) { successHandler.call(self, data, options.state); }
            self.tg.isLoading(false);
        };

        options.error = function (status, responseText, options) {
            if (errorHandler) { errorHandler.call(self, status, responseText, options.state); }
            self.tg.isLoading(false);
        };

        tg.dataProvider.execute(options);

        if (options.async === false) {
            self.tg.isLoading(false);
        }
    };
    //#endregion
};

tg.exportSymbol('tg.TiraggoEntity', tg.TiraggoEntity);
tg.exportSymbol('tg.TiraggoEntity.populateEntity', tg.TiraggoEntity.populateEntity);
tg.exportSymbol('tg.TiraggoEntity.markAsDeleted', tg.TiraggoEntity.markAsDeleted);
tg.exportSymbol('tg.TiraggoEntity.load', tg.TiraggoEntity.load);
tg.exportSymbol('tg.TiraggoEntity.loadByPrimaryKey', tg.TiraggoEntity.loadByPrimaryKey);
tg.exportSymbol('tg.TiraggoEntity.save', tg.TiraggoEntity.save);
