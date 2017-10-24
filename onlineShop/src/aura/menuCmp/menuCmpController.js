({
	myAction : function(component, event, helper) {
		helper.getAllGoodsHelper(component);
		helper.getAllCategoriesHelper(component);
	},

	addGoodsToBasket : function(component, event, helper) {
		var goods = component.get("v.goods");
		var goodsId = event.currentTarget.id;
		var action = component.get("c.updateAmountOfGoods");
		action.setParams({
			"goodsId": goodsId,
		});
		action.setCallback(this, function(response){
			if (response.getState() === "SUCCESS") {
				for(var j = 0; j < goods.length; j++)
					if(response.getReturnValue().Id == goods[j].Id) {
						if(response.getReturnValue().Amount__c != 0) {
							goods[j] = response.getReturnValue();
							component.set("v.goods", goods);
							helper.showToastBasket(component, event, 'Товар "' + goods[j].Name + '" успешно добавлен в корзину');
						}
						else {
							showToast.showToastError(component, event, 'Товара на складе больше нет!');
						}
					}
				}
			});
		$A.enqueueAction(action);
	},

	selectCategory : function(component, event, helper) {
		var categoryId = event.target.name;
		if(categoryId == 1) {
			component.set("v.currentCategory", 'Все категории');
			component.set("v.flag", false);			
		}
		else {
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