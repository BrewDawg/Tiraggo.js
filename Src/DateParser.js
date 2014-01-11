/*global tg*/

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