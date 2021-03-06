//-------------------------------------------------------------------- 
// The Tiraggo.js JavaScript library v2.1.5 
// Copyright 2013, 2014 (c) Mike Griffin 
// 
// Built on Sat 04/19/2014 at 14:16:14.93   
// https://github.com/BrewDawg/Tiraggo.js 
// 
// License: MIT 
//-------------------------------------------------------------------- 
 
(function(window) { 
 
 
/*********************************************** 
* FILE: ..\Src\Namespace.js 
***********************************************/ 
﻿/*global window*/

// Copyright (c) Mike Griffin 2013, 2014 

var tg = window['tg'] = {}; //define root namespace

// Google Closure Compiler helpers (used only to make the minified file smaller)
tg.exportSymbol = function (publicPath, object) {
	var tokens = publicPath.split("."), target = window, i;

	for (i = 0; i < tokens.length - 1; i = i + 1) {
		target = target[tokens[i]];
	}
	target[tokens[tokens.length - 1]] = object;
};

var config = window.tgConfig || {};

var extend = function (target, source) {
	var prop;

	if (!target || !source) {
		return;
	}

	for (prop in source) {
		target[prop] = source[prop];
	}

	return target;
};

config = extend(config, {
	//defines the namespace where the Business Objects will be stored
	namespace: 'tg'
});

//ensure the namespace is built out...
(function () {
	
	var path = config.namespace.split('.'), target = window, i;

	for (i = 0; i < path.length; i = i + 1) {
		if (target[path[i]] === undefined) {
			target[path[i]] = {};
		}
		target = target[path[i]];
	}

	tg.generatedNamespace = target;

}());

tg.getGeneratedNamespaceObj = function () {
	return tg.generatedNamespace;
};

tg.exportSymbol('tg', tg); 
 
 
/*********************************************** 
* FILE: ..\Src\Constants.js 
***********************************************/ 
﻿/*global tg*/

// Copyright (c) Mike Griffin 2013, 2014 

tg.RowState = {
	INVALID: 0,
	UNCHANGED: 2,
	ADDED: 4,
	DELETED: 8,
	MODIFIED: 16
};

tg.exportSymbol('tg.RowState', tg.RowState); 
 
 
/*********************************************** 
* FILE: ..\Src\DateParser.js 
***********************************************/ 
﻿/*global tg*/

// Copyright (c) Mike Griffin 2013, 2014 

tg.tgDateParser = function () {

	// From the Server
	this.deserialize = function (date) {

		var offsetMinutes, timeOffset, newDate = date;

		//deserialize weird .NET Date strings
		if (typeof newDate === "string") {
			if (newDate.indexOf('/Date(') === 0) {
				
				offsetMinutes = 0;

				if (newDate.indexOf('-') === -1) {
					timeOffset = new Date();
					offsetMinutes = timeOffset.getTimezoneOffset();
				}

				newDate = new Date(parseInt(newDate.substr(6)));
				
				if (offsetMinutes > 0) {
					newDate.setMinutes(newDate.getMinutes() + offsetMinutes);
				}
			}
		}

		return newDate;
	};

	// To the Server
	this.serialize = function (date) {
		return "\/Date(" + Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0)  + ")\/";
	};
};  
 
 
/*********************************************** 
* FILE: ..\Src\Core.js 
***********************************************/ 
﻿/*global tg*/

// Copyright (c) Mike Griffin 2013, 2014 

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
		res.push(key);
	}
	return res;
};

tg.isTiraggoCollection = function (coll) {
	var isColl = false;
	if (coll !== undefined && coll.tg !== undefined) {
		if (coll.tg.___TiraggoCollection___ !== undefined) {
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
 
 
/*********************************************** 
* FILE: ..\Src\utils.js 
***********************************************/ 
﻿/*global tg, ko*/

// Copyright (c) Mike Griffin 2013, 2014 

var tgUtils = {

	dateParser: new tg.tgDateParser(),

	copyDataIntoEntity: function (target, source, tgColumnMapOnly) {
		var prop, srcProp;

		if (!target || !source) {
			return;
		}

		for (prop in target) {

			if (source.hasOwnProperty(prop)) {

				if (target.tgTypeDefs && target.tgTypeDefs[prop]) { continue; } // skip heirarchtical
				/*
				if (tgColumnMapOnly === true) {
					// After Save we execute this logic
					mappedName = target.tgColumnMap[prop];
					if (mappedName === undefined) {
						continue;
					}
				}
				*/
				srcProp = source[prop];

				if (typeof srcProp === "string") {
					srcProp = tgUtils.dateParser.deserialize(srcProp);
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

	observable: function (value) {
	    var self = this;
	    var _prop = value;

	    // self.__ko_proto__ = '';

	    function observableValue() {

	        // self.__ko_proto__ = '';

	        if (arguments.length > 0) {
	            _prop = arguments[0];
	            return this;
	        } else {
	            return _prop;
	        }
	    }

	    return observableValue;
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
					
					if(mappedName === undefined) {
						return;
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

		var propertyName, property;

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

				property = entity[propertyName];

				if (property instanceof Array) {
					continue;
				}

				if (entity.hasOwnProperty(propertyName) && ko.isObservable(property)) {
					tgUtils.addPropertyChangedHandlers(entity, propertyName);
				}
			}
		}

		return entity;
	},

	expandExtraColumns: function (entity, shouldMakeObservable) {

		var data,
			i,
			makeObservable = arguments[1] || false;

		if (entity.tgExtendedData && tg.isArray(entity.tgExtendedData)) {

			data = ko.isObservable(entity.tgExtendedData) ? entity.tgExtendedData() : entity.tgExtendedData;

			for (i = 0; i < data.length; i = i + 1) {

				if (data[i].Key === "tgRowId") continue;

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

	getDirtyGraph: function (obj, root, dirtyGraph, objId) {

		if (objId === undefined) {
			var id = objId || 0;
		}

		var walkGraph = function (obj, root, dirtyGraph, objId) {

			var propertyName, entity, arr, tmp, index;

			// Check and see if we have anything dirty at all?
			if (root === undefined) {
				if (!obj.isDirtyGraph()) {
					return null;
				}
			}

			if (tg.isTiraggoEntity(obj)) {

				if (tg.isArray(dirtyGraph)) {
					tmp = obj.prepareForJSON();
					dirtyGraph.push(tmp);
					if (tmp.tgExtendedData === undefined) {
						tmp.tgExtendedData = [];
					}
					if (obj.tgExtendedData === undefined) {
						obj.tgExtendedData = [];
					}
					obj.tgExtendedData.push({ 'Key': 'tgRowId', 'Value': id });
					tmp.tgExtendedData.push({ 'Key': 'tgRowId', 'Value': id });
					id = id + 1;
					dirtyGraph = tmp;
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

							for (index = 0; index < arr.length; index = index + 1) {
								entity = arr[index];
								walkGraph(entity, root, dirtyGraph[propertyName], id);
							}
						}
					}
				}
			} else {

				// They passed in a collection 
				root = [];

				arr = obj.prepareForJSON();

				for (index = 0; index < arr.length; index = index + 1) {
					entity = arr[index];
					walkGraph(entity, root, root, id);
				}
			}

			return root;
		};

		return walkGraph(obj, root, dirtyGraph, id);
	}
};

tg.tgUtils = tgUtils;

tg.exportSymbol('tg.extend', tg.extend);
tg.exportSymbol('tg.startTracking', tg.startTracking);
tg.exportSymbol('tg.getDirtyGraph', tg.getDirtyGraph); 
 
 
/*********************************************** 
* FILE: ..\Src\Paging.js 
***********************************************/ 
/*global tg*/

// Copyright (c) Mike Griffin 2013, 2014 

tg.PagerFilterCriteria = function () {
	this.column = null;
	this.criteria1 = null;
	this.criteria2 = null;
	this.operation = null;
	this.conjuction = "AND";
};

tg.PagerSortCriteria = function () {
	this.column = null;
	this.direction = "ASC";
};

tg.PagerRequest = function () {
	this.getTotalRows = true;
	this.totalRows = 0;
	this.pageSize = 20;
	this.pageNumber = 1;

	this.sortCriteria = null;
	this.filterCriteria = null;
}; 
 
 
/*********************************************** 
* FILE: ..\Src\BaseClasses\tgLazyLoader.js 
***********************************************/ 
﻿/*global tg */

// Copyright (c) Mike Griffin 2013, 2014 

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
 
 
/*********************************************** 
* FILE: ..\Src\BaseClasses\tgEntity.js 
***********************************************/ 
﻿
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
	
	this.load = function (options) {
	    var entity = this;
	    return tg.TiraggoEntity.prototype._load(entity, options);
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
 
 
 
/*********************************************** 
* FILE: ..\Src\BaseClasses\tgEntityCollection.js 
***********************************************/ 
﻿/*global tg*/

// Copyright (c) Mike Griffin 2013, 2014 

tg.TiraggoEntityCollection = function (createOptions) {
	var obs = ko.observableArray([]);

	//define the 'tg' utility object
	obs.tg = {};
	obs.tg.___TiraggoCollection___ = true;
	obs.tg.createOptions = createOptions;

	//add all of our extra methods to the array
	ko.utils.extend(obs, tg.TiraggoEntityCollection.fn);

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
			    tg.TiraggoEntity.acceptChanges(entity);
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

	    var self = this,
            entityTypeName = this.tg.entityTypeName, // this should be set in the 'DefineCollection' call, unless it was an anonymous definition
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
			    entity = create(data, EntityCtor, self.tg.createOptions); //ok to pass an undefined Ctor

				if (entity !== undefined && entity !== null) { //could be zeros or empty strings legitimately
					finalColl.push(entity);
				}
			});

			//now set the observableArray that we inherit off of
			this(finalColl);
		}
	},

	//call this when walking the returned server data to populate collection
	mergeCollection: function (dataArray) {

		var i, data, thisArray, self = this;

		if (dataArray && tg.isArray(dataArray)) {

			for (i = 0; i < dataArray.length; i = i + 1) {

				data = dataArray[i];

				var match = ko.utils.arrayFirst(self(), function (item) {

					if (item.tgExtendedData !== undefined && item.tgExtendedData.length > 0) {

						if ((data.tgExtendedData[0].Key === 'tgRowId' && item.tgExtendedData[0].Key === 'tgRowId') &&
						   (data.tgExtendedData[0].Value === item.tgExtendedData[0].Value)) {

						    tg.TiraggoEntity._mergeEntity(item, data);
						    return item;
						}
					}
				});

				if (match !== undefined) {

				    tg.TiraggoEntity._mergeEntity(match, data);
				}
			}
		}
	},

	createEntity: function (entityData, Ctor, createOptions) {
		var entityTypeName, // this should be set in the 'DefineCollection' call 
			EntityCtor = Ctor,
			entity;

		if (!Ctor) { //undefined Ctor was passed in
			entityTypeName = this.tg.entityTypeName;
			EntityCtor = tg.getType(entityTypeName); //could return undefined
		}

		if (EntityCtor) { //if we have a constructor, new it up
		    entity = new EntityCtor(createOptions);
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
		var state = {},
			self = this, successHandler, errorHandler;

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
		successHandler = options.success;
		errorHandler = options.error;

		//wrap the passed in success handler so that we can populate the Entity
		options.success = function (data, options) {

			if (data !== undefined && data !== null) {

				state.wasLoaded = true;

				//populate the entity with the returned data;
				self.populateCollection(data);
			}

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

		return state.wasLoaded;
	},

	loadAll: function (success, error, state) {

		var options = {
			route: this.tgRoutes['loadAll']
		};

		if (arguments.length === 1 && arguments[0] && typeof arguments[0] === 'object') {
			tg.tgUtils.extend(options, arguments[0]);
		} else {
			options.success = success;
			options.error = error;
			options.state = state;
		}

		return this.load(options);
	},
	//#endregion Loads

	//#region Save
	save: function (success, error, state) {
		var self = this, options, successHandler, errorHandler;

		self.tg.isLoading(true);

		options = { success: success, error: error, state: state, route: self.tgRoutes['save'] };

		if (arguments.length === 1 && arguments[0] && typeof arguments[0] === 'object') {
			tg.tgUtils.extend(options, arguments[0]);
		}

		if (options.success !== undefined || options.error !== undefined) {
			options.async = true;
		} else {
			options.async = false;
		}

		//TODO: potentially the most inefficient call in the whole lib
		options.data = tg.tgUtils.getDirtyGraph(self);

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
			self.mergeCollection(data);
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
 
 
/*********************************************** 
* FILE: ..\Src\BaseClasses\DefineEntity.js 
***********************************************/ 
﻿/*global tg */

// Copyright (c) Mike Griffin 2013, 2014 

tg.defineEntity = function (typeName, constrctor) {
	var isAnonymous = (typeof (typeName) !== 'string'), tgCtor, Ctor = isAnonymous ? arguments[0] : arguments[1];

	tgCtor = function (createOptions) {
		this.tg = {};

		//MUST do this here so that obj.hasOwnProperty actually returns the keys in the object!
		Ctor.call(this, createOptions);

		//call apply defaults here before change tracking is enabled
		this.applyDefaults();

		//call the init method on the base prototype
		this.init();
	};

	//Setup the prototype chain correctly
	tgCtor.prototype = new tg.TiraggoEntity();

	//add it to the correct namespace if it isn't an anonymous type
	if (!isAnonymous) {
		tg.generatedNamespace[typeName] = tgCtor;
	}

	return tgCtor;
};

tg.exportSymbol('tg.defineEntity', tg.defineEntity); 
 
 
/*********************************************** 
* FILE: ..\Src\BaseClasses\DefineCollection.js 
***********************************************/ 
﻿/*global tg */ 

// Copyright (c) Mike Griffin 2013, 2014 

tg.defineCollection = function (typeName, entityName) {
	var isAnonymous = (typeof (typeName) !== 'string'), tgCollCtor, ctorName = isAnonymous ? arguments[0] : arguments[1];

	tgCollCtor = function (createOptions) {

	    var coll = new tg.TiraggoEntityCollection(createOptions);

		//add the type definition;
		coll.tg.entityTypeName = ctorName;

		this.init.call(coll); //Trickery and sorcery on the prototype

		return coll;
	};

	var F = function () {
		var base = this,
			extenders = [];

		this.init = function () {
			var self = this;

			//loop through the extenders and call each one
			ko.utils.arrayForEach(extenders, function (ext) {

				//make sure to set 'this' properly
				ext.call(self);
			});

			//loop through all the PROTOTYPE methods/properties and tack them on
			for (var prop in base) {
				if (base.hasOwnProperty(prop) && prop !== "init" && prop !== "customize") {

					self[prop] = base[prop];

				}
			}

			this.isDirty = function () {
				var i,
				entity,
				arr = self(),
				dirty = false;

				if (this.tg.deletedEntities().length > 0) {
					dirty = true;
				} else if (arr.length > 0 && arr[arr.length - 1].isDirty()) {
					dirty = true;
				} else {
					for (i = 0; i < arr.length; i = i + 1) {

						entity = arr[i];

						if (entity.RowState() !== tg.RowState.UNCHANGED) {
							dirty = true;
							break;
						}
					}
				}

				return dirty;
			};


			this.isDirtyGraph = function () {

				// Rather than just call isDirty() above we dup the logic here
				// for performance so we do not have to walk all of the entities twice
				var i,
					entity,
					arr = self(),
					dirty = false;

				if (this.tg.deletedEntities().length > 0) {
					dirty = true;
				} else if (arr.length > 0 && arr[arr.length - 1].isDirty()) {
					dirty = true;
				} else {
					for (i = 0; i < arr.length; i = i + 1) {

						entity = arr[i];

						if (entity.RowState() !== tg.RowState.UNCHANGED) {
							dirty = true;
							break;
						} else {
							dirty = entity.isDirtyGraph();
							if (dirty === true) {
								break;
							}
						}
					}
				}

				return dirty;
			};
		};

		this.customize = function (customizer) {

			extenders.push(customizer);

		};
	};

	tgCollCtor.prototype = new F();

	//add it to the correct namespace if it isn't an anonymous type
	if (!isAnonymous) {
		tg.generatedNamespace[typeName] = tgCollCtor;
	}

	return tgCollCtor;
};

tg.exportSymbol('tg.defineCollection', tg.defineCollection);

 
 
 
/*********************************************** 
* FILE: ..\Src\Providers\AjaxProvider.js 
***********************************************/ 
﻿/*global tg*/

//
//    Copyright (c) Mike Griffin, 2013 
//

//set this up so we match jQuery's api style... if we want to rip it out later, we can...
tg.AjaxProvider = function () {
	var noop = function () { };
	var parameterizeUrl = function (url, data) {
		var newUrl, rurlDataExpr = /\{([^\}]+)\}/g;

		if (typeof data === "string") {
			return;
		}

		//thanks AmplifyJS for this little tidbit
		// url = "/Product/{id}" => "/Product/57966910-C5EF-400A-8FC4-615159D95C2D
		newUrl = url.replace(rurlDataExpr, function (m, key) {
			if (key in data) {
				return ko.utils.unwrapObservable(data[key]);
			}
		});

		return newUrl;
	};


	this.execute = function (options) {
		var origSuccess = options.success || noop,
			origError = options.error || noop,
			defaults = {
				cache: false,
				contentType: 'application/json; charset=utf-8;',
				dataType: 'json',
				type: 'GET'
			};

		//extend the defaults with our options
		options = $.extend(defaults, options);

		// override the passed in successHandler so we can add global processing if needed
		options.success = function (data) {
			origSuccess(data, options);
		};

		// override the passed in errorHandler so we can add global processing if needed
		options.error = function (xhr, textStatus, errorThrown) {
			if (origError) {
				origError(xhr.status, xhr.responseText, options);
			} else {
				tg.onError({ code: xhr.status, message: xhr.responseText });
			}
		};

		// parameterize the Url
		// url = "/Product/{id}" => "/Product/57966910-C5EF-400A-8FC4-615159D95C2D
		options.url = parameterizeUrl(options.url, options.data);

		// don't json-ize a 'GET's data object bc jQuery $.param will do this automatically
		if (options.data && options.type !== 'GET') {
			options.data = ko.toJSON(options.data);
		}

		$.ajax(options);
	};
};
	

tg.dataProvider = new tg.AjaxProvider(); //assign default data provider 
}(window)); 
