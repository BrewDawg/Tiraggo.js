/*global tg, utils */

// Copyright (c) Mike Griffin 2013, 2014 

tg.TiraggoEntity = function () { //empty constructor
	var extenders = [];

	this.customize = function (extender) {
		extenders.push(extender);
		return this;
	};

	this.init = function () {
		var self = this;

	    //build out the 'es' utility object
		self.tg.___TiraggoEntity___ = true;
		self.tg.ignorePropertyChanged = false;
		self.tg.originalValues = {};
		self.tg.isLoading = ko.observable(false);

		//start change tracking
		tg.tgUtils.startTracking(self);

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

	this.applyDefaults = function () {
	    //here to be overridden higher up the prototype chain
	};

	this.markAsDeleted = function () {
	    var entity = this;
	    tg.TiraggoEntity.prototype._markAsDeleted(entity);
	};

	this.acceptChanges = function () {
	    var entity = this;
	    tg.TiraggoEntity.prototype._acceptChanges(entity);
	};

	this.rejectChanges = function () {
	    var entity = this;
	    tg.TiraggoEntity.prototype._rejectChanges(entity);
	};

	this.prepareForJSON = function () {
	    var entity = this;
	    return tg.TiraggoEntity.prototype._prepareForJSON(entity);
	};

	this.populateEntity = function (data) {
	    var entity = this;
	    tg.TiraggoEntity.prototype._populateEntity(entity, data);
	};

	this.loadByPrimaryKey = function (primaryKey, success, error, state) { // or single argument of options
	    var entity = this;
	    return tg.TiraggoEntity.prototype._loadByPrimaryKey(entity, primaryKey, success, error, state);
	};

	this.save = function (success, error, state) {
	    var entity = this;
	    tg.TiraggoEntity.prototype._save(entity, success, error, state);
	};
};

//-----------------------------------------------------------
// Prototypes to keep memory usage small
//-----------------------------------------------------------
tg.TiraggoEntity._mergeEntity = function (entity, data) {
    tg.tgUtils.copyDataIntoEntity(entity, data, true);
    entity.ModifiedColumns([]);
    entity.RowState(tg.RowState.UNCHANGED);
    entity.tgExtendedData = [];
    entity.tg.originalValues = {};
};

tg.TiraggoEntity.prototype._markAsDeleted = function (entity) {

    if (!entity.hasOwnProperty("RowState")) {
        entity.RowState = ko.observable(tg.RowState.DELETED);
    } else if (entity.RowState() !== tg.RowState.DELETED) {
        entity.RowState(tg.RowState.DELETED);
    }

    if (entity.hasOwnProperty("ModifiedColumns")) {
        entity.ModifiedColumns.removeAll();
    }
};

tg.TiraggoEntity.prototype._acceptChanges = function (entity) {

    //clear out originalValues so it thinks all values are original
    entity.tg.originalValues = {};

    //then clear out ModifiedColumns
    entity.ModifiedColumns([]);

    //finally set RowState back
    entity.tg.ignorePropertyChanged = true;
    entity.RowState(tg.RowState.UNCHANGED);
    entity.tg.ignorePropertyChanged = false;
};

tg.TiraggoEntity.prototype._rejectChanges = function (entity) {
    var prop;

    if (entity.tg.originalValues) {

        entity.tg.ignorePropertyChanged = true;

        //loop through the properties and revert the values back
        for (prop in entity.tg.originalValues) {

            //ideally RowState is handled by this as well
            entity[prop](entity.tg.originalValues[prop]); // set the observable
        }

        // reset changes
        entity.ModifiedColumns([]);
        entity.tg.originalValues = {};

        entity.tg.ignorePropertyChanged = false;
    }
};

tg.TiraggoEntity.prototype._save = function (entity, success, error, state) {

    entity.tg.isLoading(true);

    var options = { success: success, error: error, state: state, route: entity.tgRoutes['save'] };

    switch (entity.RowState()) {
        case tg.RowState.ADDED:
            options.route = entity.tgRoutes['create'] || options.route;
            break;
        case tg.RowState.MODIFIED:
            options.route = entity.tgRoutes['update'] || options.route;
            break;
        case tg.RowState.DELETED:
            options.route = entity.tgRoutes['delete'] || options.route;
            break;
    }

    if (arguments.length === 1 && arguments[0] && typeof arguments[0] === 'object') {
        tg.tgUtils.extend(options, arguments[0]);
    }

    if (options.success !== undefined || options.error !== undefined) {
        options.async = true;
    } else {
        options.async = false;
    }

    // Get all of the dirty data in the entire object graph
    options.data = tg.tgUtils.getDirtyGraph(entity);

    if (options.data === null) {
        // there was no data to save
        if (options.async === true) {
            options.success(null, options.state);
        }

        entity.tg.isLoading(false);
        return;
    }

    if (options.route) {
        options.url = options.route.url;
        options.type = options.route.method;
    }

    var successHandler = options.success,
        errorHandler = options.error;

    options.success = function (data, options) {
        tg.TiraggoEntity._mergeEntity(entity, data);
        if (successHandler) { successHandler.call(entity, data, options.state); }
        entity.tg.isLoading(false);
    };

    options.error = function (status, responseText, options) {
        if (errorHandler) { errorHandler.call(entity, status, responseText, options.state); }
        entity.tg.isLoading(false);
    };

    tg.dataProvider.execute(options);

    if (options.async === false) {
        entity.tg.isLoading(false);
    }
};

tg.TiraggoEntity.prototype._isDirtyGraph = function (entity) {

    var propertyName, dirty = false;

    if (entity.RowState() !== tg.RowState.UNCHANGED) {
        return true;
    }

    for (propertyName in entity.tgTypeDefs) {

        if (entity[propertyName] !== undefined) {
            dirty = entity[propertyName].isDirtyGraph();
            if (dirty === true) {
                break;
            }
        }
    }

    return dirty;
};

tg.TiraggoEntity.prototype._prepareForJSON = function (entity) {

    var stripped = {};

    ko.utils.arrayForEach(tg.objectKeys(entity), function (key) {

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
                stripped['RowState'] = ko.utils.unwrapObservable(entity.RowState);
                break;

            case 'ModifiedColumns':
                stripped['ModifiedColumns'] = ko.utils.unwrapObservable(entity.ModifiedColumns);
                break;

            default:

                mappedName = entity.tgColumnMap[key];

                if (mappedName !== undefined) {

                    srcValue = ko.utils.unwrapObservable(entity[key]);

                    if (srcValue === null || (typeof srcValue !== "function" && srcValue !== undefined)) {

                        // This is a core column ...
                        if (srcValue !== null && srcValue instanceof Date) {
                            stripped[key] = tgUtils.dateParser.serialize(srcValue);
                        } else {
                            stripped[key] = srcValue;
                        }
                    }
                } else {

                    srcValue = entity[key];

                    // We have an embedded EsCollection, if it's dirty lets send it up
                    if (tg.isTiraggoCollection(srcValue) && entity[key].isDirty()) {

                        var arrayOfObjects = srcValue();
                        var arry = [];

                        ko.utils.arrayForEach(arrayOfObjects, function (obj) {
                            arry.push(obj.prepareForJSON());
                        });
                        stripped[key] = arry;
                    }
                }
                break;
        }
    });

    return stripped;
};

tg.TiraggoEntity.prototype._populateEntity = function (entity, data) {
    var prop,
        EntityCtor,
        entityProp;

    entity.tg.ignorePropertyChanged = true;

    try {
        //blow away ModifiedColumns && orinalValues            
        if (entity.hasOwnProperty("ModifiedColumns")) {
            //overwrite existing data
            entity.ModifiedColumns([]);
        } else {
            entity.ModifiedColumns = ko.observableArray();
        }
        entity.tg.originalValues = {};

        //populate the entity with data back from the server...
        tg.tgUtils.copyDataIntoEntity(entity, data, false);

        //expand the Extra Columns
        tg.tgUtils.expandExtraColumns(entity, true);

        for (prop in data) {
            if (data.hasOwnProperty(prop)) {

                if (entity.tgTypeDefs && entity.tgTypeDefs[prop]) {
                    EntityCtor = tg.getType(entity.tgTypeDefs[prop]);
                    if (EntityCtor) {

                        entityProp = new EntityCtor();
                        if (entityProp.tg.hasOwnProperty('___TiraggoCollection___')) { //if its a collection call 'populateCollection'
                            entityProp.populateCollection(data[prop]);
                        } else { //else call 'populateEntity'
                            entityProp.populateEntity(data[prop]);
                        }

                        if (tg.isTiraggoCollection(this[prop])) {
                            entity[prop](entityProp()); // Pass the entities into the already created collection
                        } else {
                            entity[prop] = entityProp;  //then set the property back to the new Entity Object
                        }
                    } else {
                        // NOTE: We have a hierarchical property but the .js file for that entity wasn't included
                        //       so we need to make these regular ol' javascript objects
                        if (tg.isArray(data[prop])) {
                            entity[prop] = data[prop];
                            ko.utils.arrayForEach(entity[prop], function (data) {
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
        entity.tg.ignorePropertyChanged = false;
    }
};

tg.TiraggoEntity.prototype._load = function (entity, options) {

    var state = {}, successHandler, errorHandler;

    entity.tg.isLoading(true);

    state.wasLoaded = false;
    state.state = options.state;

    if (options.success !== undefined || options.error !== undefined) {
        options.async = true;
    } else {
        options.async = false;
    }

    //if a route was passed in, use that route to pull the ajax options url & type
    if (options.route) {
        options.url = options.route.url || entity.tgRoutes[options.route].url;
        options.type = options.route.method || entity.tgRoutes[options.route].method; //in jQuery, the HttpVerb is the 'type' param
    }

    //sprinkle in our own handlers, but make sure the original still gets called
    successHandler = options.success;
    errorHandler = options.error;

    //wrap the passed in success handler so that we can populate the Entity
    options.success = function (data, options) {

        if (data !== undefined && data !== null) {

            state.wasLoaded = true;

            //populate the entity with the returned data;
            entity.populateEntity(data);
        }

        //fire the passed in success handler
        if (successHandler) { successHandler.call(entity, data, options.state); }
        entity.tg.isLoading(false);
    };

    options.error = function (status, responseText, options) {
        if (errorHandler) { errorHandler.call(entity, status, responseText, options.state); }
        entity.tg.isLoading(false);
    };

    tg.dataProvider.execute(options);

    if (options.async === false) {
        entity.tg.isLoading(false);
    }

    return state.wasLoaded;
};

tg.TiraggoEntity.prototype._loadByPrimaryKey = function (entity, primaryKey, success, error, state) {

    var options = {
        route: entity.tgRoutes['loadByPrimaryKey']
    };

    if (arguments.length === 1 && arguments[0] && typeof arguments[0] === 'object') {
        tg.tgUtils.extend(options, arguments[0]);
    } else {
        options.data = primaryKey;
        options.success = success;
        options.error = error;
        options.state = state;
    }

    return tg.TiraggoEntity.prototype._load(entity, options);
};

tg.exportSymbol('tg.TiraggoEntity', tg.TiraggoEntity);
tg.exportSymbol('tg.TiraggoEntity.populateEntity', tg.TiraggoEntity.populateEntity);
tg.exportSymbol('tg.TiraggoEntity.markAsDeleted', tg.TiraggoEntity.markAsDeleted);
tg.exportSymbol('tg.TiraggoEntity.load', tg.TiraggoEntity.load);
tg.exportSymbol('tg.TiraggoEntity.loadByPrimaryKey', tg.TiraggoEntity.loadByPrimaryKey);
tg.exportSymbol('tg.TiraggoEntity.save', tg.TiraggoEntity.save);
tg.exportSymbol('tg.TiraggoEntity.mergeEntity', tg.TiraggoEntity.mergeEntity);
