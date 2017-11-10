({
	getGoodsByIdHelper: function(component, goodsId){
		var action = component.get("c.getGoodsById");
		action.setParams({
			"goodsId": goodsId,
		});
		action.setCallback(this, function(response){ 
			var state = response.getState();
			if (state === "SUCCESS") {
				component.set("v.currentGoods", response.getReturnValue()[0]);
				if (response.getReturnValue()[0].Amount__c == 0) {
					component.set("v.currentAmount", 0);
				}
			}
		});
		$A.enqueueAction(action);    
	},

	addGoodsToBasketHelper: function(component){
		var currentHelper = this;
		var amount = component.get("v.currentAmount");
		var goods = component.get("v.currentGoods");
		var action = component.get("c.addGoodsToBasket1");
		action.setParams({
			"goodsId": goods.Id,
			"kol" : amount
		});
		action.setCallback(this, function(response){ 
			var state = response.getState();
			console.log(response.getState());
			if (state === "SUCCESS") {
				goods = response.getReturnValue()[0];
				component.set("v.currentGoods", goods);
				currentHelper.showToastBasket(component, event, 'Товар "' + goods.Name + '" успешно добавлен в корзину!');
			}
		});
		$A.enqueueAction(action);
	},

	showToastError : function(component, event, message) {
		$A.get('e.force:refreshView').fire();
		var toast = $A.get("e.force:showToast");
		toast.setParams({
			"title": "Error!",
			"message": message,
			"type": 'error',
		});
		toast.fire();
	},

	showToastBasket : function(component, event, message) {
		var toast = $A.get("e.force:showToast");
		toast.setParams({
			"title": "Success!",
			"message": message,
			"type": 'success',
		});
		toast.fire();
	}
})