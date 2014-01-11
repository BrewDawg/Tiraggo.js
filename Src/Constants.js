/*global tg*/

// Copyright (c) Mike Griffin 2013, 2014 

tg.RowState = {
	INVALID: 0,
	UNCHANGED: 2,
	ADDED: 4,
	DELETED: 8,
	MODIFIED: 16
};

tg.exportSymbol('tg.RowState', tg.RowState);