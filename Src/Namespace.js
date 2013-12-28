/*global window*/

//
//    Copyright (c) Mike Griffin, 2013 
//

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
	namespace: 'tg.objects'
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