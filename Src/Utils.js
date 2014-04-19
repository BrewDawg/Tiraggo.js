/*global tg, ko*/

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