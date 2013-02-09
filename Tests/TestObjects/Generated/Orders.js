(function (tg) { //myNS = "myNameSpace" ... for example purposes

    if (typeof (tg) === undefined) {
		throw "Please Load Tiraggo.Core First";
    }

    tg.objects.Orders = tg.defineEntity(function () {

        // core columns
        this.OrderID = ko.observable();
        this.CustomerID = ko.observable();
        this.EmployeeID = ko.observable();
        this.OrderDate = ko.observable();
        this.RequiredDate = ko.observable();
        this.ShippedDate = ko.observable();
        this.ShipVia = ko.observable();
        this.Freight = ko.observable();
        this.ShipName = ko.observable();
        this.ShipAddress = ko.observable();
        this.ShipCity = ko.observable();
        this.ShipRegion = ko.observable();
        this.ShipPostalCode = ko.observable();
        this.ShipCountry = ko.observable();

        // Primary Key(s)
        this.tgPrimaryKeys = function () {
            return this.OrderID();
        }

        // extended columns
        this.tgExtendedData = undefined;

        // Hierarchical Properties
        this.UpToProductsCollection = tg.defineLazyLoader(this, 'UpToProductsCollection');
        this.OrderDetailsCollectionByOrderID = tg.defineLazyLoader(this, 'OrderDetailsCollectionByOrderID');
        this.UpToCustomersByCustomerID = tg.defineLazyLoader(this, 'UpToCustomersByCustomerID');
        this.UpToEmployeesByEmployeeID = tg.defineLazyLoader(this, 'UpToEmployeesByEmployeeID');
        this.UpToShippersByShipVia = tg.defineLazyLoader(this, 'UpToShippersByShipVia');
    });

    //#region Prototype Level Information

    tg.objects.Orders.prototype.tgTypeDefs = {
        UpToProductsCollection: "ProductsCollection",
        OrderDetailsCollectionByOrderID: "OrderDetailsCollection",
        UpToCustomersByCustomerID: "Customers",
        UpToEmployeesByEmployeeID: "Employees",
        UpToShippersByShipVia: "Shippers"
    };

    tg.objects.Orders.prototype.tgRoutes = {
        commit: { method: 'PUT', url: 'Orders_Save', response: 'entity' },
        loadByPrimaryKey: { method: 'GET', url: 'Orders_LoadByPrimaryKey', response: 'entity' },
        UpToProductsCollection: { method: 'GET', url: 'Orders_UpToProductsCollection', response: 'collection' },
        OrderDetailsCollectionByOrderID: { method: 'GET', url: 'Orders_OrderDetailsCollectionByOrderID', response: 'collection' },
        UpToCustomersByCustomerID: { method: 'GET', url: 'Orders_UpToCustomersByCustomerID', response: 'entity' },
        UpToEmployeesByEmployeeID: { method: 'GET', url: 'Orders_UpToEmployeesByEmployeeID', response: 'entity' },
        UpToShippersByShipVia: { method: 'GET', url: 'Orders_UpToShippersByShipVia', response: 'entity' }
    };

    tg.objects.Orders.prototype.tgColumnMap = {
        'OrderID': 1,
        'CustomerID': 1,
        'EmployeeID': 1,
        'OrderDate': 1,
        'RequiredDate': 1,
        'ShippedDate': 1,
        'ShipVia': 1,
        'Freight': 1,
        'ShipName': 1,
        'ShipAddress': 1,
        'ShipCity': 1,
        'ShipRegion': 1,
        'ShipPostalCode': 1,
        'ShipCountry': 1
    };

    //#endregion

} (window.tg, window.myNS));

(function (tg) {

	tg.objects.OrdersCollection = tg.defineCollection('OrdersCollection', 'Orders');

	//#region Prototype Level Information

	tg.objects.OrdersCollection.prototype.tgRoutes = {
		commit: { method: 'PUT', url: 'OrdersCollection_Save', response: 'collection' },
		loadAll: { method: 'GET', url: 'OrdersCollection_LoadAll', response: 'collection' }
	};

	//#endregion

}(window.tg, window.myNS));