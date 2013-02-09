/*global tg*/

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