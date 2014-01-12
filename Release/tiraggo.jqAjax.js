var tg=window.tg={};tg.exportSymbol=function(a,b){var c=a.split("."),d=window,e;for(e=0;e<c.length-1;e+=1)d=d[c[e]];d[c[c.length-1]]=b};var config=window.tgConfig||{},extend=function(a,b){var c;if(a&&b){for(c in b)a[c]=b[c];return a}},config=extend(config,{namespace:"tg"});(function(){var a=config.namespace.split("."),b=window,c;for(c=0;c<a.length;c+=1)void 0===b[a[c]]&&(b[a[c]]={}),b=b[a[c]];tg.generatedNamespace=b})();tg.getGeneratedNamespaceObj=function(){return tg.generatedNamespace};
tg.exportSymbol("tg",tg);tg.RowState={INVALID:0,UNCHANGED:2,ADDED:4,DELETED:8,MODIFIED:16};tg.exportSymbol("tg.RowState",tg.RowState);
tg.tgDateParser=function(){this.deserialize=function(a){var b;"string"===typeof a&&0===a.indexOf("/Date(")&&(b=0,-1===a.indexOf("-")&&(b=new Date,b=b.getTimezoneOffset()),a=new Date(parseInt(a.substr(6))),0<b&&a.setMinutes(a.getMinutes()+b));return a};this.serialize=function(a){return"/Date("+Date.UTC(a.getFullYear(),a.getMonth(),a.getDate(),a.getHours(),a.getMinutes(),a.getSeconds(),0)+")/"}};tg.getType=function(a){return tg.getGeneratedNamespaceObj()[a]};
tg.clearTypes=function(){tg.generatedNamespace={}};tg.onError=ko.observable({});tg.onError.subscribe(function(a){throw JSON.stringify(a);});tg.isArray=function(a){return(a=ko.utils.unwrapObservable(a))?a.isArray||"[object Array]"===Object.prototype.toString.call(a):!1};tg.objectKeys=Object.keys||function(a){var b,c=[];for(b in a)c.push(b);return c};
tg.isTiraggoCollection=function(a){var b=!1;void 0!==a&&void 0!==a.tg?void 0!==a.tg.___TiraggoCollection___&&(b=!0):tg.isArray(a)&&0<a.length&&a[0].hasOwnProperty("RowState")&&(b=!0);return b};tg.isTiraggoEntity=function(a){var b=!1;void 0!==a&&void 0!==a.tg&&void 0!==a.tg.___TiraggoEntity___&&(b=!0);return b};tg.isTiraggoLazyLoader=function(a){var b=!1;void 0!==a&&void 0!==a.tg&&void 0!==a.tg.___TiraggoLazyLoad___&&(b=!0);return b};tg.exportSymbol("tg.isTiraggoCollection",tg.isTiraggoCollection);
var tgUtils={dateParser:new tg.tgDateParser,copyDataIntoEntity:function(a,b,c){var d;if(a&&b){for(d in a)if(b.hasOwnProperty(d)&&(!a.tgTypeDefs||!a.tgTypeDefs[d]))if(c=b[d],"string"===typeof c&&(c=tgUtils.dateParser.deserialize(c)),ko.isObservable(a[d])||ko.isComputed(a[d]))a[d](c);else a[d]=c;return a}},observable:function(a){var b=a;return function(){return 0<arguments.length?(b=arguments[0],this):b}},extend:function(a,b){var c;if(a&&b){for(c in b)a[c]=b[c];return a}},addPropertyChangedHandlers:function(a,
b){var c=a[b];!ko.isObservable(c)||c instanceof Array||c.__ko_proto__===ko.dependentObservable||c.subscribe(function(c){var e;!1===a.tg.ignorePropertyChanged&&(e=a.tgColumnMap[b],void 0!==e&&(e=b),e=e||b,-1===ko.utils.arrayIndexOf(a.ModifiedColumns(),e)&&(a.tg.originalValues[b]||(a.tg.originalValues[b]=c),"RowState"!==b&&(a.ModifiedColumns.push(e),a.RowState()!==tg.RowState.MODIFIED&&a.RowState()!==tg.RowState.ADDED&&a.RowState(tg.RowState.MODIFIED))))},a,"beforeChange")},startTracking:function(a){var b,
c;a.hasOwnProperty("RowState")?ko.isObservable(a.RowState)||(a.RowState=ko.observable(a.RowState)):a.RowState=ko.observable(tg.RowState.ADDED);a.hasOwnProperty("ModifiedColumns")?a.ModifiedColumns([]):a.ModifiedColumns=ko.observableArray();for(b in a)"ModifiedColumns"!==b&&"__type"!==b&&"tgExtendedData"!==b&&"tg"!==b&&(c=a[b],c instanceof Array||a.hasOwnProperty(b)&&ko.isObservable(c)&&tgUtils.addPropertyChangedHandlers(a,b));return a},expandExtraColumns:function(a,b){var c,d,e=b||!1;if(a.tgExtendedData&&
tg.isArray(a.tgExtendedData)){c=ko.isObservable(a.tgExtendedData)?a.tgExtendedData():a.tgExtendedData;for(d=0;d<c.length;d+=1)if("tgRowId"!==c[d].Key)if(ko.isObservable(a[c[d].Key]))a[c[d].Key](c[d].Value);else a[c[d].Key]=e?ko.observable(c[d].Value):c[d].Value;a.tgExtendedData=[]}return a},getDirtyGraph:function(a,b,c,d){if(void 0===d)var e=d||0;var f=function(a,b,c,d){var k,l,h;if(void 0===b&&!a.isDirtyGraph())return null;if(tg.isTiraggoEntity(a))for(k in tg.isArray(c)?(d=a.prepareForJSON(),c.push(d),
void 0===d.tgExtendedData&&(d.tgExtendedData=[]),void 0===a.tgExtendedData&&(a.tgExtendedData=[]),a.tgExtendedData.push({Key:"tgRowId",Value:e}),d.tgExtendedData.push({Key:"tgRowId",Value:e}),e+=1,c=d):c=a.prepareForJSON(),void 0===b&&(b=c),a.tgTypeDefs){if(void 0!==a[k]&&a[k].isDirtyGraph())for(l=a[k].prepareForJSON(),c[k]=[],h=0;h<l.length;h+=1)d=l[h],f(d,b,c[k],e)}else for(b=[],l=a.prepareForJSON(),h=0;h<l.length;h+=1)d=l[h],f(d,b,b,e);return b};return f(a,b,c,e)}};tg.tgUtils=tgUtils;
tg.exportSymbol("tg.extend",tg.extend);tg.exportSymbol("tg.startTracking",tg.startTracking);tg.exportSymbol("tg.getDirtyGraph",tg.getDirtyGraph);tg.PagerFilterCriteria=function(){this.operation=this.criteria2=this.criteria1=this.column=null;this.conjuction="AND"};tg.PagerSortCriteria=function(){this.column=null;this.direction="ASC"};tg.PagerRequest=function(){this.getTotalRows=!0;this.totalRows=0;this.pageSize=20;this.pageNumber=1;this.filterCriteria=this.sortCriteria=null};
tg.tgLazyLoader=function(a,b){return function(){var c;if(0===arguments.length){if(void 0===c){c=a.createObjectFromType(a.tgTypeDefs[b]);if(void 0===c)throw"Please include the JavaScript class file for the '"+b+"'";c.load({route:a.tgRoutes[b],data:a.tgPrimaryKeys()})}a[b]=c;return"collection"===a.tgRoutes[b].response?c():c}}};tg.tgLazyLoader.fn={__ko_proto__:ko.observable,isDirty:function(){return!1},isDirtyGraph:function(){return!1},subscribe:function(){}};
tg.defineLazyLoader=function(a,b){var c=function(){return(new tg.tgLazyLoader(a,b))()};ko.utils.extend(c,tg.tgLazyLoader.fn);c.tg={};c.tg.___TiraggoLazyLoader___=!0;return c};
tg.TiraggoEntity=function(){var a=[];this.customize=function(b){a.push(b);return this};this.init=function(){var b=this;b.tg.___TiraggoEntity___=!0;b.tg.ignorePropertyChanged=!1;b.tg.originalValues={};b.tg.isLoading=ko.observable(!1);tg.tgUtils.startTracking(b);ko.utils.arrayForEach(a,function(a){a&&a.call(b)});this.isDirty=ko.computed(function(){return b.RowState()!==tg.RowState.UNCHANGED});this.isDirtyGraph=function(){var a,d=!1;if(b.RowState()!==tg.RowState.UNCHANGED)return!0;for(a in this.tgTypeDefs)if(void 0!==
this[a]&&(d=this[a].isDirtyGraph(),!0===d))break;return d}};this.createObjectFromEsTypeDef=function(a){var c;this.tgTypeDefs&&this.tgTypeDefs[a]&&(a=tg.getType(this.tgTypeDefs[a]))&&(c=new a);return c};this.createObjectFromType=function(a){var c;(a=tg.getType(a))&&(c=new a);return c};this.applyDefaults=function(){};this.markAsDeleted=function(){tg.TiraggoEntity.prototype._markAsDeleted(this)};this.acceptChanges=function(){tg.TiraggoEntity.prototype._acceptChanges(this)};this.rejectChanges=function(){tg.TiraggoEntity.prototype._rejectChanges(this)};
this.prepareForJSON=function(){return tg.TiraggoEntity.prototype._prepareForJSON(this)};this.populateEntity=function(a){tg.TiraggoEntity.prototype._populateEntity(this,a)};this.loadByPrimaryKey=function(a,c,d,e){return tg.TiraggoEntity.prototype._loadByPrimaryKey(this,a,c,d,e)};this.save=function(a,c,d){tg.TiraggoEntity.prototype._save(this,a,c,d)}};
tg.TiraggoEntity._mergeEntity=function(a,b){tg.tgUtils.copyDataIntoEntity(a,b,!0);a.ModifiedColumns([]);a.RowState(tg.RowState.UNCHANGED);a.tgExtendedData=[];a.tg.originalValues={}};tg.TiraggoEntity.prototype._markAsDeleted=function(a){a.hasOwnProperty("RowState")?a.RowState()!==tg.RowState.DELETED&&a.RowState(tg.RowState.DELETED):a.RowState=ko.observable(tg.RowState.DELETED);a.hasOwnProperty("ModifiedColumns")&&a.ModifiedColumns.removeAll()};
tg.TiraggoEntity.prototype._acceptChanges=function(a){a.tg.originalValues={};a.ModifiedColumns([]);a.tg.ignorePropertyChanged=!0;a.RowState(tg.RowState.UNCHANGED);a.tg.ignorePropertyChanged=!1};tg.TiraggoEntity.prototype._rejectChanges=function(a){var b;if(a.tg.originalValues){a.tg.ignorePropertyChanged=!0;for(b in a.tg.originalValues)a[b](a.tg.originalValues[b]);a.ModifiedColumns([]);a.tg.originalValues={};a.tg.ignorePropertyChanged=!1}};
tg.TiraggoEntity.prototype._save=function(a,b,c,d){a.tg.isLoading(!0);var e={success:b,error:c,state:d,route:a.tgRoutes.save};switch(a.RowState()){case tg.RowState.ADDED:e.route=a.tgRoutes.create||e.route;break;case tg.RowState.MODIFIED:e.route=a.tgRoutes.update||e.route;break;case tg.RowState.DELETED:e.route=a.tgRoutes["delete"]||e.route}1===arguments.length&&arguments[0]&&"object"===typeof arguments[0]&&tg.tgUtils.extend(e,arguments[0]);e.async=void 0!==e.success||void 0!==e.error?!0:!1;e.data=
tg.tgUtils.getDirtyGraph(a);if(null===e.data)!0===e.async&&e.success(null,e.state),a.tg.isLoading(!1);else{e.route&&(e.url=e.route.url,e.type=e.route.method);var f=e.success,g=e.error;e.success=function(b,c){tg.TiraggoEntity._mergeEntity(a,b);f&&f.call(a,b,c.state);a.tg.isLoading(!1)};e.error=function(b,c,d){g&&g.call(a,b,c,d.state);a.tg.isLoading(!1)};tg.dataProvider.execute(e);!1===e.async&&a.tg.isLoading(!1)}};
tg.TiraggoEntity.prototype._isDirtyGraph=function(a){var b,c=!1;if(a.RowState()!==tg.RowState.UNCHANGED)return!0;for(b in a.tgTypeDefs)if(void 0!==a[b]&&(c=a[b].isDirtyGraph(),!0===c))break;return c};
tg.TiraggoEntity.prototype._prepareForJSON=function(a){var b={};ko.utils.arrayForEach(tg.objectKeys(a),function(c){var d;switch(c){case "tg":case "tgTypeDefs":case "tgRoutes":case "tgColumnMap":case "tgExtendedData":case "tgPrimaryKeys":break;case "RowState":b.RowState=ko.utils.unwrapObservable(a.RowState);break;case "ModifiedColumns":b.ModifiedColumns=ko.utils.unwrapObservable(a.ModifiedColumns);break;default:if(void 0!==a.tgColumnMap[c]){if(d=ko.utils.unwrapObservable(a[c]),null===d||"function"!==
typeof d&&void 0!==d)b[c]=null!==d&&d instanceof Date?tgUtils.dateParser.serialize(d):d}else if(d=a[c],tg.isTiraggoCollection(d)&&a[c].isDirty()){d=d();var e=[];ko.utils.arrayForEach(d,function(a){e.push(a.prepareForJSON())});b[c]=e}}});return b};
tg.TiraggoEntity.prototype._populateEntity=function(a,b){var c,d,e;a.tg.ignorePropertyChanged=!0;try{for(c in a.hasOwnProperty("ModifiedColumns")?a.ModifiedColumns([]):a.ModifiedColumns=ko.observableArray(),a.tg.originalValues={},tg.tgUtils.copyDataIntoEntity(a,b,!1),tg.tgUtils.expandExtraColumns(a,!0),b)if(b.hasOwnProperty(c)&&a.tgTypeDefs&&a.tgTypeDefs[c])if(d=tg.getType(a.tgTypeDefs[c]))if(e=new d,e.tg.hasOwnProperty("___TiraggoCollection___")?e.populateCollection(b[c]):e.populateEntity(b[c]),
tg.isTiraggoCollection(this[c]))a[c](e());else a[c]=e;else tg.isArray(b[c])?(a[c]=b[c],ko.utils.arrayForEach(a[c],function(a){})):this[c]=b[c]}finally{a.tg.ignorePropertyChanged=!1}};
tg.TiraggoEntity.prototype._load=function(a,b){var c,d,e;a.tg.isLoading(!0);c=!1;b.async=void 0!==b.success||void 0!==b.error?!0:!1;b.route&&(b.url=b.route.url||a.tgRoutes[b.route].url,b.type=b.route.method||a.tgRoutes[b.route].method);d=b.success;e=b.error;b.success=function(b,e){void 0!==b&&null!==b&&(c=!0,a.populateEntity(b));d&&d.call(a,b,e.state);a.tg.isLoading(!1)};b.error=function(b,c,d){e&&e.call(a,b,c,d.state);a.tg.isLoading(!1)};tg.dataProvider.execute(b);!1===b.async&&a.tg.isLoading(!1);
return c};tg.TiraggoEntity.prototype._loadByPrimaryKey=function(a,b,c,d,e){var f={route:a.tgRoutes.loadByPrimaryKey};1===arguments.length&&arguments[0]&&"object"===typeof arguments[0]?tg.tgUtils.extend(f,arguments[0]):(f.data=b,f.success=c,f.error=d,f.state=e);return tg.TiraggoEntity.prototype._load(a,f)};tg.exportSymbol("tg.TiraggoEntity",tg.TiraggoEntity);tg.exportSymbol("tg.TiraggoEntity.populateEntity",tg.TiraggoEntity.populateEntity);tg.exportSymbol("tg.TiraggoEntity.markAsDeleted",tg.TiraggoEntity.markAsDeleted);
tg.exportSymbol("tg.TiraggoEntity.load",tg.TiraggoEntity.load);tg.exportSymbol("tg.TiraggoEntity.loadByPrimaryKey",tg.TiraggoEntity.loadByPrimaryKey);tg.exportSymbol("tg.TiraggoEntity.save",tg.TiraggoEntity.save);tg.exportSymbol("tg.TiraggoEntity.mergeEntity",tg.TiraggoEntity.mergeEntity);
tg.TiraggoEntityCollection=function(a){var b=ko.observableArray([]);b.tg={};b.tg.___TiraggoCollection___=!0;b.tg.createOptions=a;ko.utils.extend(b,tg.TiraggoEntityCollection.fn);b.tg.deletedEntities=new ko.observableArray;b.tg.deletedEntities([]);b.tg.isLoading=ko.observable(!1);return b};
tg.TiraggoEntityCollection.fn={filter:function(a){var b=this();return ko.utils.arrayFilter(b,a)},prepareForJSON:function(){var a=[];ko.utils.arrayForEach(this(),function(b){b.isDirtyGraph()&&a.push(b)});ko.utils.arrayForEach(this.tg.deletedEntities(),function(b){b.RowState()!==tg.RowState.ADDED&&a.push(b)});return a},acceptChanges:function(){ko.utils.arrayForEach(this(),function(a){a.RowState()!==tg.RowState.UNCHANGED&&tg.TiraggoEntity.acceptChanges(a)});this.tg.deletedEntities([])},rejectChanges:function(){var a=
[],b=0,c=0,d;ko.utils.arrayForEach(this.tg.deletedEntities(),function(d){d.RowState()===tg.RowState.ADDED?(a[b]=c,b+=1):d.rejectChanges();c+=1});if(0<a.length)for(c=a.length-1;0<=c;c-=1)this.tg.deletedEntities.splice(a[c],1);a=[];ko.utils.arrayForEach(this(),function(b){switch(b.RowState()){case tg.RowState.MODIFIED:b.rejectChanges();break;case tg.RowState.ADDED:a.push(b)}});if(0<a.length)for(d=0;d<a.length;d+=1)c=ko.utils.arrayIndexOf(this(),a[d]),0<=c&&this.splice(c,1);0<this.tg.deletedEntities().length&&
(d=this().concat(this.tg.deletedEntities()),this(d));this.tg.deletedEntities([])},markAllAsDeleted:function(){var a,b,c,d;this.tg.deletedEntities(this.splice(0,this().length));c=this.tg.deletedEntities;d=c().length;for(a=0;a<d;a+=1)b=c()[a],b.RowState()===tg.RowState.UNCHANGED&&(b.hasOwnProperty("RowState")?b.RowState()!==tg.RowState.DELETED&&b.RowState(tg.RowState.DELETED):b.RowState=ko.observable(tg.RowState.DELETED),b.hasOwnProperty("ModifiedColumns")&&b.ModifiedColumns.removeAll())},markAsDeleted:function(a){var b,
c,d,e;c=[];if(!arguments)throw Error("The entitiesOrEntityToDelete cannot be null or undefined.");if(tg.isArray(a)){if(c=ko.utils.unwrapObservable(a),0===c.length)throw Error("The array passed in to markAsDeleted.markAsDeleted() cannot be empty.");}else for(b=0;b<arguments.length;b+=1)if(tg.isTiraggoEntity(arguments[b]))c.push(arguments[b]);else throw Error("Invalid type passed in to markAsDeleted.markAsDeleted()");b=this.tg.deletedEntities().concat(c);this.tg.deletedEntities(b);this.removeAll(c);
d=this.tg.deletedEntities;e=d().length;for(b=0;b<e;b+=1)c=d()[b],c.RowState()===tg.RowState.UNCHANGED&&(c.hasOwnProperty("RowState")?c.RowState()!==tg.RowState.DELETED&&c.RowState(tg.RowState.DELETED):c.RowState=ko.observable(tg.RowState.DELETED),c.hasOwnProperty("ModifiedColumns")&&c.ModifiedColumns.removeAll())},populateCollection:function(a){var b=this,c=this.tg.entityTypeName,d,e=[],f=this.createEntity,g;c&&(d=tg.getType(c));a&&tg.isArray(a)&&(ko.utils.arrayForEach(a,function(a){g=f(a,d,b.tg.createOptions);
void 0!==g&&null!==g&&e.push(g)}),this(e))},mergeCollection:function(a){var b,c;if(a&&tg.isArray(a))for(b=0;b<a.length;b+=1){c=a[b];var d=ko.utils.arrayFirst(this(),function(a){if(void 0!==a.tgExtendedData&&0<a.tgExtendedData.length&&"tgRowId"===c.tgExtendedData[0].Key&&"tgRowId"===a.tgExtendedData[0].Key&&c.tgExtendedData[0].Value===a.tgExtendedData[0].Value)return tg.TiraggoEntity._mergeEntity(a,c),a});void 0!==d&&tg.TiraggoEntity._mergeEntity(d,c)}},createEntity:function(a,b,c){var d=b;b||(b=this.tg.entityTypeName,
d=tg.getType(b));d?(c=new d(c),c.populateEntity(a)):c=a;return c},addNew:function(){var a=null,b=this.tg.entityTypeName;b&&(a=tg.getType(b),a=new a,this.push(a));return a},load:function(a){var b,c=this,d,e;c.tg.isLoading(!0);b=!1;a.async=void 0!==a.success||void 0!==a.error?!0:!1;a.route&&(a.url=a.route.url||this.tgRoutes[a.route].url,a.type=a.route.method||this.tgRoutes[a.route].method);d=a.success;e=a.error;a.success=function(a,e){void 0!==a&&null!==a&&(b=!0,c.populateCollection(a));d&&d.call(c,
a,e.state);c.tg.isLoading(!1)};a.error=function(a,b,d){e&&e.call(c,a,b,d.state);c.tg.isLoading(!1)};tg.dataProvider.execute(a);!1===a.async&&c.tg.isLoading(!1);return b},loadAll:function(a,b,c){var d={route:this.tgRoutes.loadAll};1===arguments.length&&arguments[0]&&"object"===typeof arguments[0]?tg.tgUtils.extend(d,arguments[0]):(d.success=a,d.error=b,d.state=c);return this.load(d)},save:function(a,b,c){var d=this,e,f,g;d.tg.isLoading(!0);e={success:a,error:b,state:c,route:d.tgRoutes.save};1===arguments.length&&
arguments[0]&&"object"===typeof arguments[0]&&tg.tgUtils.extend(e,arguments[0]);e.async=void 0!==e.success||void 0!==e.error?!0:!1;e.data=tg.tgUtils.getDirtyGraph(d);if(null===e.data){if(!1===e.async){d.tg.isLoading(!1);return}e.success(null,e)}e.route&&(e.url=e.route.url,e.type=e.route.method);f=e.success;g=e.error;e.success=function(a,b){d.tg.deletedEntities([]);d.mergeCollection(a);f&&f.call(d,a,b.state);d.tg.isLoading(!1)};e.error=function(a,b,c){g&&g.call(d,a,b,c.state);d.tg.isLoading(!1)};tg.dataProvider.execute(e);
!1===e.async&&d.tg.isLoading(!1)}};tg.exportSymbol("tg.TiraggoEntityCollection",tg.TiraggoEntityCollection);tg.exportSymbol("tg.TiraggoEntityCollection.markAllAsDeleted",tg.TiraggoEntityCollection.markAllAsDeleted);tg.exportSymbol("tg.TiraggoEntityCollection.loadAll",tg.TiraggoEntityCollection.loadAll);tg.exportSymbol("tg.TiraggoEntityCollection.load",tg.TiraggoEntityCollection.load);tg.exportSymbol("tg.TiraggoEntityCollection.save",tg.TiraggoEntityCollection.save);
tg.defineEntity=function(a,b){var c="string"!==typeof a,d,e=c?a:b;d=function(a){this.tg={};e.call(this,a);this.applyDefaults();this.init()};d.prototype=new tg.TiraggoEntity;c||(tg.generatedNamespace[a]=d);return d};tg.exportSymbol("tg.defineEntity",tg.defineEntity);
tg.defineCollection=function(a,b){var c="string"!==typeof a,d,e=c?a:b;d=function(a){a=new tg.TiraggoEntityCollection(a);a.tg.entityTypeName=e;this.init.call(a);return a};d.prototype=new function(){var a=this,b=[];this.init=function(){var c=this;ko.utils.arrayForEach(b,function(a){a.call(c)});for(var d in a)a.hasOwnProperty(d)&&"init"!==d&&"customize"!==d&&(c[d]=a[d]);this.isDirty=function(){var a,b,d=c(),e=!1;if(0<this.tg.deletedEntities().length)e=!0;else if(0<d.length&&d[d.length-1].isDirty())e=
!0;else for(a=0;a<d.length;a+=1)if(b=d[a],b.RowState()!==tg.RowState.UNCHANGED){e=!0;break}return e};this.isDirtyGraph=function(){var a,b,d=c();b=!1;if(0<this.tg.deletedEntities().length)b=!0;else if(0<d.length&&d[d.length-1].isDirty())b=!0;else for(a=0;a<d.length;a+=1)if(b=d[a],b.RowState()!==tg.RowState.UNCHANGED){b=!0;break}else if(b=b.isDirtyGraph(),!0===b)break;return b}};this.customize=function(a){b.push(a)}};c||(tg.generatedNamespace[a]=d);return d};tg.exportSymbol("tg.defineCollection",tg.defineCollection);
tg.AjaxProvider=function(){var a=function(){},b=function(a,b){var e;e=/\{([^\}]+)\}/g;if("string"!==typeof b)return e=a.replace(e,function(a,c){if(c in b)return ko.utils.unwrapObservable(b[c])})};this.execute=function(c){var d=c.success||a,e=c.error||a;c=$.extend({cache:!1,contentType:"application/json; charset=utf-8;",dataType:"json",type:"GET"},c);c.success=function(a){d(a,c)};c.error=function(a,b,d){if(e)e(a.status,a.responseText,c);else tg.onError({code:a.status,message:a.responseText})};c.url=
b(c.url,c.data);c.data&&"GET"!==c.type&&(c.data=ko.toJSON(c.data));$.ajax(c)}};tg.dataProvider=new tg.AjaxProvider;
