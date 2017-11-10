({
	myAction : function(component, event, helper) {
		helper.getAllGoodsHelper(component);
	},

	handleNavMenuEvent : function(component, event) {
		var currentCategory = event.getParam("currentCategory");
		var flag = event.getParam("flag");
		var categoryId = event.getParam("categoryId");
		component.set("v.currentCategory", currentCategory);
		component.set("v.flag", flag);
		component.set("v.categoryId", categoryId);
	},

	afterDragulaLoaded: function(component, event, helper) {
		var container = component.find('container');
		var from = component.find('from-draggable');
		var to = component.find('to-draggable');
		var dragulaConteiners = new Array();
		for(var i = 0; i < from.length; i++) {
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
	},

	addGoodsToBasket : function(component, event, helper) {
		helper.updateAmountOfGoodsHelper(component, event.currentTarget.id);
	},

	showDescriptionProduct : function(component, event, helper) {
		var goodsId = event.currentTarget.id;
		var evt = $A.get("e.force:navigateToComponent");
		evt.setParams({
			componentDef: "c:goodsDescriptionCmp",
			componentAttributes: {
				goodsId : goodsId
			}
		});
		evt.fire();  
	},

	sortName: function(component, event, helper) {   
		component.set("v.selectedTabsoft", 'Name');
		helper.sortHelper(component, event, 'Name');
	},

	sortPrice: function(component, event, helper) {   
		component.set("v.selectedTabsoft", 'UnitPrice__c');
		helper.sortHelper(component, event, 'UnitPrice__c');
	},

	sortProducer: function(component, event, helper) {   
		component.set("v.selectedTabsoft", 'Producer__c');
		helper.sortHelper(component, event, 'Producer__c');
	},

})