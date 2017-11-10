({
	getAllGoodsHelper: function(component){
		var action = component.get("c.getAllGoods");
		action.setCallback(this, function(response){ 
			var state = response.getState();
			if (state === "SUCCESS") {
				component.set("v.goods", response.getReturnValue());
			}
		});
		$A.enqueueAction(action);    
	},

	getAllCategoriesHelper: function(component){
		var action = component.get("c.getAllCategories");
		action.setCallback(this, function(response){ 
			var state = response.getState();
			if (state === "SUCCESS") {
				component.set("v.categories", response.getReturnValue());
			}
		});
		$A.enqueueAction(action);    
	},

	updateAmountOfGoodsHelper: function(component, idGoods){
		var currentHelper = this;
		var goods = component.get("v.goods");
		var action = component.get("c.updateAmountOfGoods");
		action.setParams({
			"goodsId": idGoods,
		});
		action.setCallback(this, function(response){ 
			var state = response.getState();
			console.log(response.getState());
			if (state === "SUCCESS") {
				for(var j = 0; j < goods.length; j++)
					if(response.getReturnValue()[0].Id == goods[j].Id) { 
						if(response.getReturnValue()[0].Amount__c != goods[j].Amount__c){
							goods[j] = response.getReturnValue()[0];
							component.set("v.goods", goods);
							currentHelper.showToastBasket(component, event, 'Товар "' + goods[j].Name + '" успешно добавлен в корзину!');
						}
						else{
							currentHelper.showToastError(component, event, 'Товара на складе больше нет!');
						}
					}

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
	},

	sortHelper: function(component, event, sortFieldName) {
		var currentDir = component.get("v.arrowDirection");
		if (currentDir == 'arrowdown') {
			component.set("v.arrowDirection", 'arrowup');
			component.set("v.isAsc", true);
		} else {
			component.set("v.arrowDirection", 'arrowdown');
			component.set("v.isAsc", false);
		}
		this.sortAllGoods(component, event, sortFieldName);
	},

	sortAllGoods: function(component, event, sortField) {
		var action = component.get('c.sortGoods');
		action.setParams({
			'sortField': sortField,
			'isAsc': component.get("v.isAsc")
		});
		action.setCallback(this, function(response) {
			if (response.getState() === "SUCCESS") {
				component.set('v.goods', response.getReturnValue());
			}
		});
		$A.enqueueAction(action);
	},
})