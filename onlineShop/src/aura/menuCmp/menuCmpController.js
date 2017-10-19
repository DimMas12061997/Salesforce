({
	myAction : function(component, event, helper) {
		helper.getAllGoodsHelper(component);
		helper.getAllCategoriesHelper(component);
	},

	selectCategory : function(component, event, helper) {
		var categoryId = event.target.name;
		if(categoryId == 1){
			component.set("v.currentCategory", 'Все категории');
			component.set("v.flag", false);			
		}else{
			helper.getNameCategoryById(component, categoryId);
			component.set("v.flag", true);			
		}
		component.set("v.categoryId", categoryId);		
	},

	afterDragulaLoaded: function(component, event, helper) {
		var container = component.find('container');
		var from = component.find('from-draggable');
		var to = component.find('to-draggable');
		var dragulaConteiners = new Array();
		for(var i = 0; i < from.length; i++){
			dragulaConteiners.push(from[i].getElement());
		}
		var drake = dragula(dragulaConteiners, {
			mirrorContainer: container.getElement(),
			revertOnSpill: true,
			// copy: true
		});

		drake.containers.push(to.getElement());

		drake.on('drop', $A.getCallback(function(el, target, source, sibling) {
			if(target.classList == 'to-draggable'){
				drake.remove();
				helper.updateAmountOfGoodsHelper(component, el.id);
			}
		}));
	}
})