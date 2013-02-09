
tg.defineEntity = function (typeName, constrctor) {
    var isAnonymous = (typeof (typeName) !== 'string'),
        Ctor = isAnonymous ? arguments[0] : arguments[1];

    var tgCtor = function (data) {
        this.tg = {};

        //MUST do this here so that obj.hasOwnProperty actually returns the keys in the object!
        Ctor.call(this);

        //call apply defaults here before change tracking is enabled
        this.applyDefaults();

        //call the init method on the base prototype
        this.init();

        // finally, if we were given data, populate it
        if (data) {
            this.populateEntity(data);
        }
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