
//override the standard Ajax Provider
//all you need to do is overwrite the 'execute' function in your test!
tg.testDataProvider = {

    execute: function (options) {

    }

};

tg.dataProvider = tg.testDataProvider;

