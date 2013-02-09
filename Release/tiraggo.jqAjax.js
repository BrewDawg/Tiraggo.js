var tg=window.tg={};tg.exportSymbol=function(a,c){for(var b=a.split("."),d=window,e=0;e<b.length-1;e++)d=d[b[e]];d[b[b.length-1]]=c};var config=window.tgConfig||{},extend=function(a,c){var b;if(a&&c){for(b in c)a[b]=c[b];return a}},config=extend(config,{namespace:"tg.objects"});(function(){for(var a=config.namespace.split("."),c=window,b=0;b<a.length;b++)void 0===c[a[b]]&&(c[a[b]]={}),c=c[a[b]];tg.generatedNamespace=c})();tg.getGeneratedNamespaceObj=function(){return tg.generatedNamespace};
tg.exportSymbol("tg",tg);tg.RowState={INVALID:0,UNCHANGED:2,ADDED:4,DELETED:8,MODIFIED:16};tg.exportSymbol("tg.RowState",tg.RowState);
tg.DateParser=function(){this.deserialize=function(a){if("string"===typeof a&&0===a.indexOf("/Date(")){var c=0;-1===a.indexOf("-")&&(c=(new Date).getTimezoneOffset());a=new Date(parseInt(a.substr(6)));0<c&&a.setMinutes(a.getMinutes()+c)}return a};this.serialize=function(a){return"/Date("+Date.UTC(a.getFullYear(),a.getMonth(),a.getDate(),a.getHours(),a.getMinutes(),a.getSeconds(),0)+")/"}};tg.getType=function(a){return tg.getGeneratedNamespaceObj()[a]};
tg.clearTypes=function(){tg.generatedNamespace={}};tg.onError=ko.observable({});tg.onError.subscribe(function(a){throw JSON.stringify(a);});tg.isArray=function(a){a=ko.utils.unwrapObservable(a);return!a?!1:a.isArray||"[object Array]"===Object.prototype.toString.call(a)};tg.objectKeys=Object.keys||function(a){for(var c in a)rorm.push(c);return[]};
tg.isTiraggoCollection=function(a){var c=!1;void 0!==a&&void 0!==a.tg&&void 0!==a.tg.___TiraggoCollection___?c=!0:tg.isArray(a)&&0<a.length&&a[0].hasOwnProperty("RowState")&&(c=!0);return c};tg.isTiraggoEntity=function(a){var c=!1;void 0!==a&&(void 0!==a.tg&&void 0!==a.tg.___TiraggoEntity___)&&(c=!0);return c};tg.isTiraggoLazyLoader=function(a){var c=!1;void 0!==a&&(void 0!==a.tg&&void 0!==a.tg.___TiraggoLazyLoad___)&&(c=!0);return c};tg.exportSymbol("tg.isTiraggoCollection",tg.isTiraggoCollection);
var utils={dateParser:new tg.DateParser,copyDataIntoEntity:function(a,c){var b,d;if(a&&c){for(b in a)if(c.hasOwnProperty(b)&&(!a.tgTypeDefs||!a.tgTypeDefs[b]))if(d=c[b],"string"===typeof d&&(d=utils.dateParser.deserialize(d)),ko.isObservable(a[b])||ko.isComputed(a[b]))a[b](d);else a[b]=d;return a}},extend:function(a,c){var b;if(a&&c){for(b in c)a[b]=c[b];return a}},addPropertyChangedHandlers:function(a,c){var b=a[c];ko.isObservable(b)&&(!(b instanceof Array)&&b.__ko_proto__!==ko.dependentObservable)&&
b.subscribe(function(b){var e;!1===a.tg.ignorePropertyChanged&&(e=a.tgColumnMap[c],1===e&&(e=c),e=e||c,-1===ko.utils.arrayIndexOf(a.ModifiedColumns(),e)&&(a.tg.originalValues[c]||(a.tg.originalValues[c]=b),"RowState"!==c&&(a.ModifiedColumns.push(e),a.RowState()!==tg.RowState.MODIFIED&&a.RowState()!==tg.RowState.ADDED&&a.RowState(tg.RowState.MODIFIED))))},a,"beforeChange")},startTracking:function(a){var c;a.hasOwnProperty("RowState")?ko.isObservable(a.RowState)||(a.RowState=ko.observable(a.RowState)):
a.RowState=ko.observable(tg.RowState.ADDED);a.hasOwnProperty("ModifiedColumns")?a.ModifiedColumns([]):a.ModifiedColumns=ko.observableArray();for(c in a)if("ModifiedColumns"!==c&&"__type"!==c&&"tgExtendedData"!==c&&"tg"!==c){var b=a[c];b instanceof Array||a.hasOwnProperty(c)&&ko.isObservable(b)&&utils.addPropertyChangedHandlers(a,c)}return a},expandExtraColumns:function(a,c){var b,d,e=c||!1;if(a.tgExtendedData&&tg.isArray(a.tgExtendedData)){b=ko.isObservable(a.tgExtendedData)?a.tgExtendedData():a.tgExtendedData;
for(d=0;d<b.length;d++)if(ko.isObservable(a[b[d].Key]))a[b[d].Key](b[d].Value);else a[b[d].Key]=e?ko.observable(b[d].Value):b[d].Value;a.tgExtendedData=[]}return a},getDirtyGraph:function(a,c,b){var d,e,f,g;if(void 0===c&&!a.isDirtyGraph())return null;if(tg.isTiraggoEntity(a))for(d in tg.isArray(b)?(e=a.prepareForJSON(),b.push(e),b=e):b=a.prepareForJSON(),void 0===c&&(c=b),a.tgTypeDefs){if(void 0!==a[d]&&a[d].isDirtyGraph()){f=a[d].prepareForJSON();b[d]=[];for(g=0;g<f.length;g++)e=f[g],tg.utils.getDirtyGraph(e,
c,b[d])}}else{c=[];f=a.prepareForJSON();for(g=0;g<f.length;g++)e=f[g],tg.utils.getDirtyGraph(e,c,c)}return c}};utils.newId=function(){var a=(new Date).getTime();return function(){return++a}}();tg.utils=utils;tg.exportSymbol("tg.extend",tg.extend);tg.exportSymbol("tg.startTracking",tg.startTracking);tg.exportSymbol("tg.getDirtyGraph",tg.getDirtyGraph);tg.PagerFilterCriteria=function(){this.operation=this.criteria2=this.criteria1=this.column=null;this.conjuction="AND"};
tg.PagerSortCriteria=function(){this.column=null;this.direction="ASC"};tg.PagerRequest=function(){this.getTotalRows=!0;this.totalRows=0;this.pageSize=20;this.pageNumber=1;this.filterCriteria=this.sortCriteria=null};
tg.tgLazyLoader=function(a,c){return function(){var b;if(0===arguments.length){if(void 0===b){b=a.createObjectFromType(a.tgTypeDefs[c]);if(void 0===b)throw"Please include the JavaScript class file for the '"+type+"'";b.load({route:a.tgRoutes[c],data:a.tgPrimaryKeys()})}a[c]=b;return"collection"===a.tgRoutes[c].response?b():b}}};tg.tgLazyLoader.fn={__ko_proto__:ko.observable,isDirty:function(){return!1},isDirtyGraph:function(){return!1},subscribe:function(){}};
tg.defineLazyLoader=function(a,c){var b=function(){return(new tg.tgLazyLoader(a,c))()};ko.utils.extend(b,tg.tgLazyLoader.fn);b.tg={};b.tg.___TiraggoLazyLoader___=!0;return b};
tg.TiraggoEntity=function(){var a=[];this.customize=function(c){a.push(c);return this};this.init=function(){var c=this;c.tg.___TiraggoEntity___=tg.utils.newId();c.tg.ignorePropertyChanged=!1;c.tg.originalValues={};c.tg.isLoading=ko.observable(!1);tg.utils.startTracking(c);ko.utils.arrayForEach(a,function(a){a&&a.call(c)});this.isDirty=ko.computed(function(){return c.RowState()!==tg.RowState.UNCHANGED});this.isDirtyGraph=function(){var a,d=!1;if(c.RowState()!==tg.RowState.UNCHANGED)return!0;for(a in this.tgTypeDefs)if(void 0!==
this[a]&&(d=this[a].isDirtyGraph(),!0===d))break;return d}};this.createObjectFromEsTypeDef=function(a){var b;this.tgTypeDefs&&this.tgTypeDefs[a]&&(a=tg.getType(this.tgTypeDefs[a]))&&(b=new a);return b};this.createObjectFromType=function(a){var b;(a=tg.getType(a))&&(b=new a);return b};this.prepareForJSON=function(){var a=this,b={};ko.utils.arrayForEach(tg.objectKeys(this),function(d){var e;switch(d){case "tg":case "tgTypeDefs":case "tgRoutes":case "tgColumnMap":case "tgExtendedData":case "tgPrimaryKeys":break;
case "RowState":b.RowState=ko.utils.unwrapObservable(a.RowState);break;case "ModifiedColumns":b.ModifiedColumns=ko.utils.unwrapObservable(a.ModifiedColumns);break;default:if(void 0!==a.tgColumnMap[d]){if(e=ko.utils.unwrapObservable(a[d]),null===e||"function"!==typeof e&&void 0!==e)b[d]=null!==e&&e instanceof Date?utils.dateParser.serialize(e):e}else if(e=a[d],tg.isTiraggoCollection(e)&&a[d].isDirty()){e=e();var f=[];ko.utils.arrayForEach(e,function(a){f.push(a.prepareForJSON())});b[d]=f}}});return b};
this.populateEntity=function(a){var b,d,e;this.tg.ignorePropertyChanged=!0;try{for(b in this.hasOwnProperty("ModifiedColumns")?this.ModifiedColumns([]):this.ModifiedColumns=ko.observableArray(),this.tg.originalValues={},tg.utils.copyDataIntoEntity(this,a),tg.utils.expandExtraColumns(this,!0),a)if(a.hasOwnProperty(b)&&this.tgTypeDefs&&this.tgTypeDefs[b])if(d=tg.getType(this.tgTypeDefs[b]))if(e=new d,e.tg.hasOwnProperty("___TiraggoCollection___")?e.populateCollection(a[b]):e.populateEntity(a[b]),tg.isTiraggoCollection(this[b]))this[b](e());
else this[b]=e;else tg.isArray(a[b])?(this[b]=a[b],ko.utils.arrayForEach(this[b],function(){})):this[b]=a[b]}finally{this.tg.ignorePropertyChanged=!1}};this.applyDefaults=function(){};this.acceptChanges=function(){this.tg.originalValues={};this.ModifiedColumns([]);this.tg.ignorePropertyChanged=!0;this.RowState(tg.RowState.UNCHANGED);this.tg.ignorePropertyChanged=!1};this.rejectChanges=function(){var a;if(this.tg.originalValues){this.tg.ignorePropertyChanged=!0;for(a in this.tg.originalValues)this[a](this.tg.originalValues[a]);
this.ModifiedColumns([]);this.tg.originalValues={};this.tg.ignorePropertyChanged=!1}};this.markAsDeleted=function(){this.hasOwnProperty("RowState")?this.RowState()!==tg.RowState.DELETED&&this.RowState(tg.RowState.DELETED):this.RowState=ko.observable(tg.RowState.DELETED);this.hasOwnProperty("ModifiedColumns")&&this.ModifiedColumns.removeAll()};this.load=function(a){var b={},d=this;d.tg.isLoading(!0);b.wasLoaded=!1;b.state=a.state;a.async=void 0!==a.success||void 0!==a.error?!0:!1;a.route&&(a.url=a.route.url||
this.tgRoutes[a.route].url,a.type=a.route.method||this.tgRoutes[a.route].method);var e=a.success,f=a.error;a.success=function(a){void 0!==a&&null!==a&&(b.wasLoaded=!0,d.populateEntity(a));e&&e.call(d,a,b);d.tg.isLoading(!1)};a.error=function(a,c){f&&f.call(d,a,c,b);d.tg.isLoading(!1)};tg.dataProvider.execute(a);!1===a.async&&d.tg.isLoading(!1);return b.wasLoaded};this.loadByPrimaryKey=function(a,b,d,e){var f={route:this.tgRoutes.loadByPrimaryKey};1===arguments.length&&arguments[0]&&"object"===typeof arguments[0]?
tg.utils.extend(f,arguments[0]):(f.data=a,f.success=b,f.error=d,f.state=e);return this.load(f)};this.save=function(a,b,d){var e=this;e.tg.isLoading(!0);var f={success:a,error:b,state:d,route:e.tgRoutes.commit};switch(e.RowState()){case tg.RowState.ADDED:f.route=e.tgRoutes.create||f.route;break;case tg.RowState.MODIFIED:f.route=e.tgRoutes.update||f.route;break;case tg.RowState.DELETED:f.route=e.tgRoutes["delete"]||f.route}1===arguments.length&&(arguments[0]&&"object"===typeof arguments[0])&&tg.utils.extend(f,
arguments[0]);f.async=void 0!==f.success||void 0!==f.error?!0:!1;f.data=tg.utils.getDirtyGraph(e);if(null===f.data)!0===f.async&&f.success(null,f.state),e.tg.isLoading(!1);else{f.route&&(f.url=f.route.url,f.type=f.route.method);var g=f.success,h=f.error;f.success=function(a,b){e.populateEntity(a);g&&g.call(e,a,b.state);e.tg.isLoading(!1)};f.error=function(a,b,c){h&&h.call(e,a,b,c.state);e.tg.isLoading(!1)};tg.dataProvider.execute(f);!1===f.async&&e.tg.isLoading(!1)}}};
tg.exportSymbol("tg.TiraggoEntity",tg.TiraggoEntity);tg.exportSymbol("tg.TiraggoEntity.populateEntity",tg.TiraggoEntity.populateEntity);tg.exportSymbol("tg.TiraggoEntity.markAsDeleted",tg.TiraggoEntity.markAsDeleted);tg.exportSymbol("tg.TiraggoEntity.load",tg.TiraggoEntity.load);tg.exportSymbol("tg.TiraggoEntity.loadByPrimaryKey",tg.TiraggoEntity.loadByPrimaryKey);tg.exportSymbol("tg.TiraggoEntity.save",tg.TiraggoEntity.save);
tg.TiraggoEntityCollection=function(){var a=ko.observableArray([]);a.tg={};ko.utils.extend(a,tg.TiraggoEntityCollection.fn);a.tg.___TiraggoCollection___=tg.utils.newId();a.tg.deletedEntities=new ko.observableArray;a.tg.deletedEntities([]);a.tg.isLoading=ko.observable(!1);return a};
tg.TiraggoEntityCollection.fn={filter:function(a){var c=this();return ko.utils.arrayFilter(c,a)},prepareForJSON:function(){var a=[];ko.utils.arrayForEach(this(),function(c){c.isDirtyGraph()&&a.push(c)});ko.utils.arrayForEach(this.tg.deletedEntities(),function(c){c.RowState()!==tg.RowState.ADDED&&a.push(c)});return a},acceptChanges:function(){ko.utils.arrayForEach(this(),function(a){a.RowState()!==tg.RowState.UNCHANGED&&a.acceptChanges()});this.tg.deletedEntities([])},rejectChanges:function(){var a=
[],c=0,b=0,d;ko.utils.arrayForEach(this.tg.deletedEntities(),function(e){e.RowState()===tg.RowState.ADDED?(a[c]=b,c+=1):e.rejectChanges();b+=1});if(0<a.length)for(b=a.length-1;0<=b;b--)this.tg.deletedEntities.splice(a[b],1);a=[];ko.utils.arrayForEach(this(),function(b){switch(b.RowState()){case tg.RowState.MODIFIED:b.rejectChanges();break;case tg.RowState.ADDED:a.push(b)}});if(0<a.length)for(d=0;d<a.length;d++)b=ko.utils.arrayIndexOf(this(),a[d]),0<=b&&this.splice(b,1);0<this.tg.deletedEntities().length&&
(d=this().concat(this.tg.deletedEntities()),this(d));this.tg.deletedEntities([])},markAllAsDeleted:function(){var a,c,b,d;this.tg.deletedEntities(this.splice(0,this().length));b=this.tg.deletedEntities;d=b().length;for(a=0;a<d;a+=1)c=b()[a],c.RowState()===tg.RowState.UNCHANGED&&(c.hasOwnProperty("RowState")?c.RowState()!==tg.RowState.DELETED&&c.RowState(tg.RowState.DELETED):c.RowState=ko.observable(tg.RowState.DELETED),c.hasOwnProperty("ModifiedColumns")&&c.ModifiedColumns.removeAll())},markAsDeleted:function(a){var c,
b,d,e;b=[];if(!arguments)throw Error("The entitiesOrEntityToDelete cannot be null or undefined.");if(tg.isArray(a)){if(b=ko.utils.unwrapObservable(a),0===b.length)throw Error("The array passed in to markAsDeleted.markAsDeleted() cannot be empty.");}else for(c=0;c<arguments.length;c++)if(tg.isTiraggoEntity(arguments[c]))b.push(arguments[c]);else throw Error("Invalid type passed in to markAsDeleted.markAsDeleted()");c=this.tg.deletedEntities().concat(b);this.tg.deletedEntities(c);this.removeAll(b);
d=this.tg.deletedEntities;e=d().length;for(c=0;c<e;c+=1)b=d()[c],b.RowState()===tg.RowState.UNCHANGED&&(b.hasOwnProperty("RowState")?b.RowState()!==tg.RowState.DELETED&&b.RowState(tg.RowState.DELETED):b.RowState=ko.observable(tg.RowState.DELETED),b.hasOwnProperty("ModifiedColumns")&&b.ModifiedColumns.removeAll())},populateCollection:function(a){var c=this.tg.entityTypeName,b,d=[],e=this.createEntity,f;c&&(b=tg.getType(c));a&&tg.isArray(a)&&(ko.utils.arrayForEach(a,function(a){f=e(a,b);void 0!==f&&
null!==f&&d.push(f)}),this(d))},createEntity:function(a,c){var b;b=c;c||(b=this.tg.entityTypeName,b=tg.getType(b));b?(b=new b,b.populateEntity(a)):b=a;return b},addNew:function(){var a=null,c=this.tg.entityTypeName;c&&(a=tg.getType(c),a=new a,this.push(a));return a},load:function(a){var c=this;c.tg.isLoading(!0);a.async=void 0!==a.success||void 0!==a.error?!0:!1;a.route&&(a.url=a.route.url||this.tgRoutes[a.route].url,a.type=a.route.method||this.tgRoutes[a.route].method);var b=a.success,d=a.error;
a.success=function(a,d){c.populateCollection(a);b&&b.call(c,a,d.state);c.tg.isLoading(!1)};a.error=function(a,b,g){d&&d.call(c,a,b,g.state);c.tg.isLoading(!1)};tg.dataProvider.execute(a);!1===a.async&&c.tg.isLoading(!1)},loadAll:function(a,c,b){var d={route:this.tgRoutes.loadAll};1===arguments.length&&arguments[0]&&"object"===typeof arguments[0]?tg.utils.extend(d,arguments[0]):(d.success=a,d.error=c,d.state=b);this.load(d)},save:function(a,c,b){var d=this;d.tg.isLoading(!0);var e={success:a,error:c,
state:b,route:d.tgRoutes.commit};1===arguments.length&&(arguments[0]&&"object"===typeof arguments[0])&&tg.utils.extend(e,arguments[0]);e.async=void 0!==e.success||void 0!==e.error?!0:!1;e.data=tg.utils.getDirtyGraph(d);if(null===e.data){if(!1===e.async){d.tg.isLoading(!1);return}e.success(null,e)}e.route&&(e.url=e.route.url,e.type=e.route.method);var f=e.success,g=e.error;e.success=function(a,b){d.tg.deletedEntities([]);d.populateCollection(a);f&&f.call(d,a,b.state);d.tg.isLoading(!1)};e.error=function(a,
b,c){g&&g.call(d,a,b,c.state);d.tg.isLoading(!1)};tg.dataProvider.execute(e);!1===e.async&&d.tg.isLoading(!1)}};tg.exportSymbol("tg.TiraggoEntityCollection",tg.TiraggoEntityCollection);tg.exportSymbol("tg.TiraggoEntityCollection.markAllAsDeleted",tg.TiraggoEntityCollection.markAllAsDeleted);tg.exportSymbol("tg.TiraggoEntityCollection.loadAll",tg.TiraggoEntityCollection.loadAll);tg.exportSymbol("tg.TiraggoEntityCollection.load",tg.TiraggoEntityCollection.load);
tg.exportSymbol("tg.TiraggoEntityCollection.save",tg.TiraggoEntityCollection.save);tg.defineEntity=function(a,c){var b="string"!==typeof a,d=b?a:c,e=function(a){this.tg={};d.call(this);this.applyDefaults();this.init();a&&this.populateEntity(a)};e.prototype=new tg.TiraggoEntity;b||(tg.generatedNamespace[a]=e);return e};tg.exportSymbol("tg.defineEntity",tg.defineEntity);
tg.defineCollection=function(a,c){var b="string"!==typeof a,d=b?a:c,e=function(a){var b=new tg.TiraggoEntityCollection;b.tg.entityTypeName=d;this.init.call(b);a&&b.populateCollection(a);return b};e.prototype=new function(){var a=this,b=[];this.init=function(){var c=this;ko.utils.arrayForEach(b,function(a){a.call(c)});for(var d in a)a.hasOwnProperty(d)&&("init"!==d&&"customize"!==d)&&(c[d]=a[d]);this.isDirty=function(){var a,b,d=c(),e=!1;if(0<this.tg.deletedEntities().length)e=!0;else if(0<d.length&&
d[d.length-1].isDirty())e=!0;else for(a=0;a<d.length;a++)if(b=d[a],b.RowState()!==tg.RowState.UNCHANGED){e=!0;break}return e};this.isDirtyGraph=function(){var a,b,d=c();b=!1;if(0<this.tg.deletedEntities().length)b=!0;else if(0<d.length&&d[d.length-1].isDirty())b=!0;else for(a=0;a<d.length;a++)if(b=d[a],b.RowState()!==tg.RowState.UNCHANGED){b=!0;break}else if(b=b.isDirtyGraph(),!0===b)break;return b}};this.customize=function(a){b.push(a)}};b||(tg.generatedNamespace[a]=e);return e};
tg.exportSymbol("tg.defineCollection",tg.defineCollection);
tg.AjaxProvider=function(){var a=function(){};this.execute=function(c){var b=c.success||a,d=c.error||a;c=$.extend({cache:!1,contentType:"application/json; charset=utf-8;",dataType:"json",type:"GET"},c);c.success=function(a){b(a,c)};c.error=function(a){if(d)d(a.status,a.responseText,c);else tg.onError({code:a.status,message:a.responseText})};var e=c,f;var g=c.data;f=/\{([^\}]+)\}/g;f="string"===typeof g?void 0:c.url.replace(f,function(a,b){if(b in g)return ko.utils.unwrapObservable(g[b])});e.url=f;
c.data&&"GET"!==c.type&&(c.data=ko.toJSON(c.data));$.ajax(c)}};tg.dataProvider=new tg.AjaxProvider;
