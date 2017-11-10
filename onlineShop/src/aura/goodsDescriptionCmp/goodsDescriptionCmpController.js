({
	myAction : function(component, event, helper) {
		helper.getGoodsByIdHelper(component, component.get("v.goodsId"));
	},

	plusAmount : function(component, event, helper) {
		if (component.get("v.currentAmount") < component.get("v.currentGoods").Amount__c) {
			var amount = component.get("v.currentAmount");
			component.set("v.currentAmount", amount + 1);
		}
	},

	minusAmount : function(component, event, helper) {
		var amount = component.get("v.currentAmount");
		if (amount > 1) {
			component.set("v.currentAmount", amount - 1);
		}
	},

	addGoodsToBasket : function(component, event, helper) {
		console.log(component.get("v.currentAmount"));
		if (component.get("v.currentAmount") != 0) {
			helper.addGoodsToBasketHelper(component);
		}
		else {
			helper.showToastError(component, event, 'Товара нет на складе!');
		}
	}

})