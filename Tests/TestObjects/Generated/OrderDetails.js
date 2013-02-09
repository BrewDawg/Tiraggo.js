(function (tg) { //myNS = "myNameSpace" ... for example purposes

	if (typeof (tg) === undefined) {
		throw "Please Load EntitySpaces.Core First";
	}

	tg.objects.OrderDetails = tg.defineEntity(function () {

		// core columns
		this.OrderID = ko.observable();
		this.ProductID = ko.observable();
		this.UnitPrice = ko.observable();
		this.Quantity = ko.observable();
		this.Discount = ko.observable();

		this.tgPrimaryKeys = function() {
			var val = {data: {}};
			val.data.orderID = this.OrderID();
			val.data.productID = this.ProductID();
			return val;
		};

		// extended columns
		this.tgExtendedData = undefined;

		// Hierarchical Properties
		this.UpToOrdersByOrderID = tg.defineLazyLoader(this, 'UpToOrdersByOrderID');
		this.UpToProductsByProductID = tg.defineLazyLoader(this, 'UpToProductsByProductID');
	});

	//#region Prototype Level Information

	tg.objects.OrderDetails.prototype.tgTypeDefs = {
		UpToOrdersByOrderID: "Orders",
		UpToProductsByProductID: "Products"
	};

	tg.objects.OrderDetails.prototype.tgRoutes = {
		commit: { method: 'PUT', url: 'OrderDetails_Save', response: 'entity' },
		loadByPrimaryKey: { method: 'GET', url: 'OrderDetails_LoadByPrimaryKey', response: 'entity' },
		UpToOrdersByOrderID: { method: 'GET', url: 'OrderDetails_UpToOrdersByOrderID', response: 'entity'},
		UpToProductsByProductID: { method: 'GET', url: 'OrderDetails_UpToProductsByProductID', response: 'entity'}
	};

	tg.objects.OrderDetails.prototype.tgColumnMap = {
		'OrderID': 1,
		'ProductID': 1,
		'UnitPrice': 1,
		'Quantity': 1,
		'Discount': 1
	};

	//#endregion

}(window.tg, window.myNS));

(function (tg) {

	tg.objects.OrderDetailsCollection = tg.defineCollection('OrderDetailsCollection', 'OrderDetails');

	//#region Prototype Level Information

	tg.objects.OrderDetailsCollection.prototype.tgRoutes = {
		commit: { method: 'PUT', url: 'OrderDetailsCollection_Save', response: 'collection' },
		loadAll: { method: 'GET', url: 'OrderDetailsCollection_LoadAll', response: 'collection' }
	};

	//#endregion

}(window.tg, window.myNS));