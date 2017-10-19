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
		var showToast = this;
		var goods = component.get("v.goods");
		var action = component.get("c.updateAmountOfGoods");
		action.setParams({
			"goodsId": idGoods,
		});
		action.setCallback(this, function(response){ 
			var state = response.getState();
			if (state === "SUCCESS") {
				for(var j = 0; j < goods.length; j++)
					if(response.getReturnValue().Id == goods[j].Id){
						if(response.getReturnValue().Amount__c != 0){
							goods[j] = response.getReturnValue();
							component.set("v.goods", goods);
							console.log('response.getReturnValue() = ' + JSON.stringify(response.getReturnValue()));
						}
						else
							showToast.showToastSuccesfully(component, event, 'Товара на складе больше нет!');
					}

				}
			});
		$A.enqueueAction(action);
	},

	showToastSuccesfully : function(component, event, message) {
		$A.get('e.force:refreshView').fire();
		var toast = $A.get("e.force:showToast");
		toast.setParams({
			"title": "Error!",
			"message": message,
			"type": 'error',
		});
		toast.fire();
	},

	getNameCategoryById: function(component, categoryId){
		var action = component.get("c.getNameCategoryById");
		action.setParams({
			"categoryId": categoryId,
		});
		action.setCallback(this, function(response){ 
			var state = response.getState();
			if (state === "SUCCESS") {
				component.set("v.currentCategory", response.getReturnValue().Name);
			}
		});
		$A.enqueueAction(action);    
	},
})