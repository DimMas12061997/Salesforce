({
	getGoodsInOrder: function(component){
		var action = component.get("c.getGoodsInOrderByUserId");
		action.setCallback(this, function(response){ 
			var state = response.getState();
			if (state === "SUCCESS") {
				component.set("v.goods", response.getReturnValue());
			}
		});
		$A.enqueueAction(action);    
	},

	getOrder: function(component){
		var action = component.get("c.getOrderByUserId");
		action.setCallback(this, function(response){ 
			var state = response.getState();
			if (state === "SUCCESS") {
				component.set("v.order", response.getReturnValue()[0]);
				if(response.getReturnValue()[0] != null) {
					if (component.get("v.delivery") == 'Самовывоз из магазина 0.00 руб.') {
						component.set("v.summaryCost", response.getReturnValue()[0].OrderCost__c);
					}
					else if (component.get("v.delivery") == 'Стоимость доставки по Минску 5.00 руб.') {
						component.set("v.summaryCost", (response.getReturnValue()[0].OrderCost__c + 5));
					}
				}
			}
		});
		$A.enqueueAction(action);    
	},

	deleteGoodsById : function(component, goodsId){
		var help = this;
		var action = component.get("c.deleteGoodsById");
		action.setParams({
			"goodsId": goodsId,
		});
		action.setCallback(this, function(response){ 
			var state = response.getState();
			help.showToastBasket(component, event, "Товар успешно удален из корзины.");
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
	},

	updateAmountOfGoods : function(component, goodsId, sign){
		var help = this;
		var action = component.get("c.updateAmountOfGoodsInBasket");
		action.setParams({
			"goodsId": goodsId,
			"sign": sign,
		});
		action.setCallback(this, function(response){ 
			var state = response.getState();
			if (response.getReturnValue() == 1) {
				help.showToastError(component, event, "Товара больше нет на складе.");
			}
			else if (response.getReturnValue() == -1) {
				help.getGoodsInOrder(component);
				help.getOrder(component);
				help.showToastBasket(component, event, "Товар успешно удален из корзины.");
			} 
			else {
				help.getGoodsInOrder(component);
				help.getOrder(component);
			}
		});
		$A.enqueueAction(action);	
	},

	buyGoods: function(component){
		help = this;
		var orderId =  component.get("v.order").Id;
		var action = component.get("c.buyGoods");
		action.setParams({
			"orderId": orderId
		});
		action.setCallback(this, function(response){ 
			var state = response.getState();
			if (state === "SUCCESS") {
				component.set("v.goods", response.getReturnValue()[0]);
				// help.getGoodsInOrder(component);
				component.set("v.order", null);
				component.set("v.summaryCost", null);

			}
		});
		$A.enqueueAction(action);	
	}
})