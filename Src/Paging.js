/*global tg*/

// Copyright (c) Mike Griffin 2013, 2014 

tg.tgPagerFilterCriteria = function () {
	this.column = null;
	this.criteria1 = null;
	this.criteria2 = null;
	this.operation = null;
	this.conjuction = "AND";
};

tg.tgPagerSortCriteria = function () {
	this.column = null;
	this.direction = "ASC";
};

tg.tgPagerRequest = function () {
	this.getTotalRows = true;
	this.totalRows = 0;
	this.pageSize = 20;
	this.pageNumber = 1;

	this.sortCriteria = null;
	this.filterCriteria = null;
};