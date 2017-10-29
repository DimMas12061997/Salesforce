({
	myAction : function(component, event, helper) {
		helper.getAllCategoriesHelper(component);
	},

	selectCategory : function(component, event, helper) {
		helper.getSelectedCategory(component, event);
		helper.fireComponentEvent(component, event);
	},
})