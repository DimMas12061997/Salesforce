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
			}
		});
		$A.enqueueAction(action);    
	},

	// getNameCategoryByIdHelper: function(component, categoryId){
	// 	var help = this;
	// 	var action = component.get("c.getNameCategoryById");
	// 	action.setParams({
	// 		"categoryId": categoryId,
	// 	});
	// 	action.setCallback(this, function(response){ 
	// 		var state = response.getState();
	// 		if (state === "SUCCESS") {
	// 			component.set("v.currentCategory", response.getReturnValue().Name);
	// 		}
	// 	});
	// 	$A.enqueueAction(action);	
	// },
})