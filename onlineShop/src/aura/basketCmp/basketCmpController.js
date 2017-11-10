({
	myAction : function(component, event, helper) {
		helper.getGoodsInOrder(component);
		helper.getOrder(component);
	},

	plusAmount : function(component, event, helper) {
		var amount = event.currentTarget.name;
		var id = event.currentTarget.id;
		helper.updateAmountOfGoods(component, id, true);
	},

	minusAmount : function(component, event, helper) {
		var amount = event.currentTarget.name;
		var id = event.currentTarget.id;
		helper.updateAmountOfGoods(component, id, false);
	},

	deleteProductFromOrder : function(component, event, helper) {
		var id = event.currentTarget.id;
		helper.deleteGoodsById(component, id);
		helper.getGoodsInOrder(component);
		helper.getOrder(component);
	}
})