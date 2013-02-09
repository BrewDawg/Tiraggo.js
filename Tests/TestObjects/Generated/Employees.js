(function (tg) { //myNS = "myNameSpace" ... for example purposes

    if (typeof (tg) === undefined) {
        throw "Please Load EntitySpaces.Core First";
    }

    tg.objects.Employees = tg.defineEntity(function () {

        // core columns
        this.EmployeeID = ko.observable();
        this.LastName = ko.observable();
        this.FirstName = ko.observable();
        this.Title = ko.observable();
        this.TitleOfCourtesy = ko.observable();
        this.BirthDate = ko.observable();
        this.HireDate = ko.observable();
        this.Address = ko.observable();
        this.City = ko.observable();
        this.Region = ko.observable();
        this.PostalCode = ko.observable();
        this.Country = ko.observable();
        this.HomePhone = ko.observable();
        this.Extension = ko.observable();
        this.Photo = ko.observable();
        this.Notes = ko.observable();
        this.ReportsTo = ko.observable();
        this.PhotoPath = ko.observable();

        // Primary Key(s)
        this.tgPrimaryKeys = function () {
            return this.EmployeeID();
        }

        // extended columns
        this.tgExtendedData = undefined;

        // Hierarchical Properties
        this.EmployeesCollectionByReportsTo = tg.defineLazyLoader(this, 'EmployeesCollectionByReportsTo');
        this.UpToEmployeesByReportsTo = tg.defineLazyLoader(this, 'UpToEmployeesByReportsTo');
        this.OrdersCollectionByEmployeeID = tg.defineLazyLoader(this, 'OrdersCollectionByEmployeeID');
    });

    //#region Prototype Level Information

    tg.objects.Employees.prototype.tgTypeDefs = {
        EmployeesCollectionByReportsTo: "EmployeesCollection",
        UpToEmployeesByReportsTo: "Employees",
        OrdersCollectionByEmployeeID: "OrdersCollection"
    };

    tg.objects.Employees.prototype.tgRoutes = {
        commit: { method: 'PUT', url: 'Employees_Save', response: 'entity' },
        loadByPrimaryKey: { method: 'GET', url: 'Employees_LoadByPrimaryKey', response: 'entity' },
        EmployeesCollectionByReportsTo: { method: 'GET', url: 'Employees_EmployeesCollectionByReportsTo', response: 'collection' },
        UpToEmployeesByReportsTo: { method: 'GET', url: 'Employees_UpToEmployeesByReportsTo', response: 'entity' },
        OrdersCollectionByEmployeeID: { method: 'GET', url: 'Employees_OrdersCollectionByEmployeeID', response: 'collection' }
    };

    tg.objects.Employees.prototype.tgColumnMap = {
        'EmployeeID': 1,
        'LastName': 1,
        'FirstName': 1,
        'Title': 1,
        'TitleOfCourtesy': 1,
        'BirthDate': 1,
        'HireDate': 1,
        'Address': 1,
        'City': 1,
        'Region': 1,
        'PostalCode': 1,
        'Country': 1,
        'HomePhone': 1,
        'Extension': 1,
        'Photo': 1,
        'Notes': 1,
        'ReportsTo': 1,
        'PhotoPath': 1
    };

    //#endregion

} (window.tg, window.myNS));

(function (tg) {

	tg.objects.EmployeesCollection = tg.defineCollection('EmployeesCollection', 'Employees');

	//#region Prototype Level Information

	tg.objects.EmployeesCollection.prototype.tgRoutes = {
		commit: { method: 'PUT', url: 'EmployeesCollection_Save', response: 'collection' },
		loadAll: { method: 'GET', url: 'EmployeesCollection_LoadAll', response: 'collection' }
	};

	//#endregion

}(window.tg, window.myNS));