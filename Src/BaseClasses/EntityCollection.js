/*global tg */

//
//    Copyright (c) Mike Griffin, 2013 
//


tg.TiraggoEntityCollection = function () {
    var obs = ko.observableArray([]);

    //define the 'tg' utility object
    obs.tg = {};

    //add all of our extra methods to the array
    ko.utils.extend(obs, tg.TiraggoEntityCollection.fn);

    obs.tg['___tgCollection___'] = tg.utils.newId(); // assign a unique id so we can test objects with this key, do equality comparison, etc...
    obs.tg.deletedEntities = new ko.observableArray();
    obs.tg.deletedEntities([]);
    obs.tg.isLoading = ko.observable(false);

    return obs;
};

tg.TiraggoEntityCollection.fn = { //can't do prototype on this one bc its a function

    filter: function (predicate) {
        var array = this();

        return ko.utils.arrayFilter(array, predicate);
    },

    prepareForJSON: function () {

        var stripped = [];

        ko.utils.arrayForEach(this(), function (entity) {
            if (entity.isDirtyGraph()) {
                stripped.push(entity);
            }
        });

        ko.utils.arrayForEach(this.tg.deletedEntities(), function (entity) {
            if (entity.RowState() !== tg.RowState.ADDED) {
                stripped.push(entity);
            }
        });

        return stripped;
    },

    acceptChanges: function () {

        ko.utils.arrayForEach(this(), function (entity) {
            if (entity.RowState() !== tg.RowState.UNCHANGED) {
                entity.acceptChanges();
            }
        });

        this.tg.deletedEntities([]);
    },

    rejectChanges: function () {
        var self = this,
            addedEntities = [],
            slot = 0,
            index = 0,
            newArr,
            i;

        ko.utils.arrayForEach(self.tg.deletedEntities(), function (entity) {
            if (entity.RowState() === tg.RowState.ADDED) {
                addedEntities[slot] = index;
                slot += 1;
            } else {
                entity.rejectChanges();
            }
            index += 1;
        });


        if (addedEntities.length > 0) {
            for (index = addedEntities.length - 1; index >= 0; index = index - 1) {
                this.tg.deletedEntities.splice(addedEntities[index], 1);
            }
        }

        addedEntities = [];
        ko.utils.arrayForEach(this(), function (entity) {

            switch (entity.RowState()) {
                case tg.RowState.MODIFIED:
                    entity.rejectChanges();
                    break;

                case tg.RowState.ADDED:
                    addedEntities.push(entity);
                    break;
            }
        });

        if (addedEntities.length > 0) {
            for (i = 0; i < addedEntities.length; i = i + 1) {
                index = ko.utils.arrayIndexOf(self(), addedEntities[i]);
                if (index >= 0) {
                    self.splice(index, 1);
                }
            }
        }

        if (this.tg.deletedEntities().length > 0) {
            newArr = self().concat(this.tg.deletedEntities());
            self(newArr);
        }

        this.tg.deletedEntities([]);
    },

    markAllAsDeleted: function () {

        var i, entity, coll, len, self = this;

        self.tg.deletedEntities(self.splice(0, self().length));
        coll = self.tg.deletedEntities;
        len = coll().length;

        // NOTE: Added ones are moved into the tg.deletedEntities area incase reject changes is called
        //       in which case they are restored, however, during a save they are simply discarded.
        for (i = 0; i < len; i += 1) {
            entity = coll()[i];

            if (entity.RowState() === tg.RowState.UNCHANGED) {

                if (!entity.hasOwnProperty("RowState")) {
                    entity.RowState = ko.observable(tg.RowState.DELETED);
                } else if (entity.RowState() !== tg.RowState.DELETED) {
                    entity.RowState(tg.RowState.DELETED);
                }

                if (entity.hasOwnProperty("ModifiedColumns")) {
                    entity.ModifiedColumns.removeAll();
                }
            }
        }
    },

    // Can be a single entity or an array of entities
    markAsDeleted: function (entitiesOrEntityToDelete) {

        var i, entity, coll, len, arr, tempArr = [];

        if (!arguments) {
            throw new Error("The entitiesOrEntityToDelete cannot be null or undefined.");
        }

        if (tg.isArray(entitiesOrEntityToDelete)) {

            tempArr = ko.utils.unwrapObservable(entitiesOrEntityToDelete);

            if (tempArr.length === 0) {
                throw new Error("The array passed in to markAsDeleted.markAsDeleted() cannot be empty.");
            }
        } else {
            for (i = 0; i < arguments.length; i = i + 1) {
                if (tg.isTiraggoEntity(arguments[i])) {
                    tempArr.push(arguments[i]);
                } else {
                    throw new Error("Invalid type passed in to markAsDeleted.markAsDeleted()");
                }
            }
        }

        arr = this.tg.deletedEntities().concat(tempArr);
        this.tg.deletedEntities(arr);
        this.removeAll(tempArr);

        coll = this.tg.deletedEntities;
        len = coll().length;

        // NOTE: Added ones are moved into the tg.deletedEntities area incase reject changes is called
        //       in which case they are restored, however, during a save they are simply discarded.
        for (i = 0; i < len; i += 1) {
            entity = coll()[i];

            if (entity.RowState() === tg.RowState.UNCHANGED) {

                if (!entity.hasOwnProperty("RowState")) {
                    entity.RowState = ko.observable(tg.RowState.DELETED);
                } else if (entity.RowState() !== tg.RowState.DELETED) {
                    entity.RowState(tg.RowState.DELETED);
                }

                if (entity.hasOwnProperty("ModifiedColumns")) {
                    entity.ModifiedColumns.removeAll();
                }
            }
        }
    },

    //call this when walking the returned server data to populate collection
    populateCollection: function (dataArray) {
        var entityTypeName = this.tg.entityTypeName, // this should be set in the 'DefineCollection' call, unless it was an anonymous definition
            EntityCtor,
            finalColl = [],
            create = this.createEntity,
            entity;

        if (entityTypeName) {
            EntityCtor = tg.getType(entityTypeName); //might return undefined
        }

        if (dataArray && tg.isArray(dataArray)) {

            ko.utils.arrayForEach(dataArray, function (data) {

                //call 'createEntity' for each item in the data array
                entity = create(data, EntityCtor); //ok to pass an undefined Ctor

                if (entity !== undefined && entity !== null) { //could be zeros or empty strings legitimately
                    finalColl.push(entity);
                }
            });

            //now set the observableArray that we inherit off of
            this(finalColl);
        }
    },

    createEntity: function (entityData, Ctor) {
        var entityTypeName, // this should be set in the 'DefineCollection' call 
            EntityCtor = Ctor,
            entity;

        if (!Ctor) { //undefined Ctor was passed in
            entityTypeName = this.tg.entityTypeName;
            EntityCtor = tg.getType(entityTypeName); //could return undefined
        }

        if (EntityCtor) { //if we have a constructor, new it up
            entity = new EntityCtor();
            entity.populateEntity(entityData);
        } else { //else just set the entity to the passed in data
            entity = entityData;
        }

        return entity;
    },

    addNew: function () {

        var entity = null,
            EntityCtor,
            entityTypeName = this.tg.entityTypeName; // this should be set in the 'DefineCollection' call, unless it was an anonymous definition

        if (entityTypeName) {
            EntityCtor = tg.getType(entityTypeName);
            entity = new EntityCtor();
            this.push(entity);
        }

        return entity;
    },

    //#region Loads
    load: function (options) {
        var self = this, successHandler, errorHandler;

        self.tg.isLoading(true);

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
        successHandler = options.success;
        errorHandler = options.error;

        //wrap the passed in success handler so that we can populate the Entity
        options.success = function (data, options) {

            //populate the entity with the returned data;
            self.populateCollection(data);

            //fire the passed in success handler
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
    },

    loadAll: function (success, error, state) {

        var options = {
            route: this.tgRoutes['loadAll']
        };

        if (arguments.length === 1 && arguments[0] && typeof arguments[0] === 'object') {
            tg.utils.extend(options, arguments[0]);
        } else {
            options.success = success;
            options.error = error;
            options.state = state;
        }

        this.load(options);
    },
    //#endregion Loads

    //#region Save
    save: function (success, error, state) {
        var self = this, options, successHandler, errorHandler;

        self.tg.isLoading(true);

        options = { success: success, error: error, state: state, route: self.tgRoutes['commit'] };

        if (arguments.length === 1 && arguments[0] && typeof arguments[0] === 'object') {
            tg.utils.extend(options, arguments[0]);
        }

        if (options.success !== undefined || options.error !== undefined) {
            options.async = true;
        } else {
            options.async = false;
        }

        options.data = tg.utils.getDirtyGraph(self);

        if (options.data === null) {
            // there was no data to save
            if (options.async === false) {
                self.tg.isLoading(false);
                return;
            } else {
                options.success(null, options);
            }
        }

        if (options.route) {
            options.url = options.route.url;
            options.type = options.route.method;
        }

        successHandler = options.success;
        errorHandler = options.error;

        options.success = function (data, options) {
            self.tg.deletedEntities([]);
            self.populateCollection(data);
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
    }
    //#endregion
};

tg.exportSymbol('tg.TiraggoEntityCollection', tg.TiraggoEntityCollection);
tg.exportSymbol('tg.TiraggoEntityCollection.markAllAsDeleted', tg.TiraggoEntityCollection.markAllAsDeleted);
tg.exportSymbol('tg.TiraggoEntityCollection.loadAll', tg.TiraggoEntityCollection.loadAll);
tg.exportSymbol('tg.TiraggoEntityCollection.load', tg.TiraggoEntityCollection.load);
tg.exportSymbol('tg.TiraggoEntityCollection.save', tg.TiraggoEntityCollection.save);