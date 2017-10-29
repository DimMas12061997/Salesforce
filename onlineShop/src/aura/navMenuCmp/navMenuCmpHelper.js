({
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

	getSelectedCategory : function(component, event) {
		var categoryId = event.target.id;
		var categoryName = event.target.name;
		component.set("v.categoryId", categoryId);	
		component.set("v.currentCategory", categoryName);
		if(categoryId == 1 && categoryName == 1) {
			component.set("v.currentCategory", 'Все категории');
			component.set("v.flag", false);			
		}
		else {
			component.set("v.flag", true);			
		}
	},

	fireComponentEvent : function(component, event) {
		var currentCategory = component.get("v.currentCategory");
		var flag = component.get("v.flag");
		var categoryId = component.get("v.categoryId");
		var compEvents = component.getEvent("componentEventFired");
		compEvents.setParams({ 
			"currentCategory" : currentCategory,
			"flag" : flag,
			"categoryId" : categoryId
		});
		compEvents.fire();
	},
})