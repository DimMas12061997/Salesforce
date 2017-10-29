({
	myAction : function(component, event, helper) {
		helper.getGoodsByIdHelper(component, component.get("v.goodsId"));
	},

	plusAmount : function(component, event, helper) {
		var amount = component.get("v.currentAmount");
		component.set("v.currentAmount", amount + 1);
	},

	minusAmount : function(component, event, helper) {
		var amount = component.get("v.currentAmount");
		if(amount > 1)
		component.set("v.currentAmount", amount - 1);
	},

})