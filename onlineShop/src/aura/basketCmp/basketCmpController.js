({
	myAction : function(component, event, helper) {
		helper.getGoodsInOrder(component);
		helper.getOrder(component);
	},

	plusAmount : function(component, event, helper) {
		var amount = event.currentTarget.name;
		var id = event.currentTarget.id;
		helper.updateAmountOfGoods(component, id, true);
	},

	minusAmount : function(component, event, helper) {
		var amount = event.currentTarget.name;
		var id = event.currentTarget.id;
		helper.updateAmountOfGoods(component, id, false);
	},

	deleteProductFromOrder : function(component, event, helper) {
		var id = event.currentTarget.id;
		helper.deleteGoodsById(component, id);
		helper.getGoodsInOrder(component);
		helper.getOrder(component);
	},

	sendEmail : function(component, event, helper) {
		var isValidEmail = false;
		var isError = false;
		var isAddress = false;
		var name = component.find("name").get("v.value");
		var email = component.find("email").get("v.value");
		var phone = component.find("phone").get("v.value");
		var comment = component.find("comment").get("v.value");
		var address = null;
		if (component.get("v.delivery") == 'Стоимость доставки по Минску 5.00 руб.') {
			address = component.find("address").get("v.value");
			isAddress = true;
		}
		var regExpPhoneFormat = /^[0-9]+$/;
		var regExpEmailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;  
		if(name == null) {
			component.find("outName").set("v.value", 'The field is required.');
			isError = true;
		}
		else {
			component.find("outName").set("v.value", '');
		}
		if(email == null || email == "") {
			component.find("outEmail").set("v.value", 'The field is required.');
			isError = true;
		}
		else {
			if(email.match(regExpEmailformat)) {
				component.find("outEmail").set("v.value", '');
			} else {
				component.find("outEmail").set("v.value", 'The e-mail address entered is invalid.');
				isValidEmail = true;
			}
		}
		if(phone == null || phone == "") {
			component.find("outPhone").set("v.value", 'The field is required.');
			isError = true;
		}
		else {
			if(phone.match(regExpPhoneFormat)) {
				component.find("outPhone").set("v.value", '');
			} else {
				component.find("outPhone").set("v.value", 'The telephone number is invalid.');
				isValidEmail = true;
			}
		}
		if (isAddress) {
			if(address == null || address == '') {
				component.find("outAddress").set("v.value", 'The field is required.');
				isError = true;
			}
			else {
				component.find("outAddress").set("v.value", '');
			}
		}
		if(isError || isValidEmail){
			component.set("v.formResult", "У вас есть ошибки в заполнении форм. Попробуйте еще раз.");
		}
		else {
			component.find("outName").set("v.value", '');
			component.find("outEmail").set("v.value", '');
			component.find("outPhone").set("v.value", '');
			component.find("outAddress").set("v.value", '');
			var action = component.get("c.sendEmailForUser");
			action.setParams({
				"name":  name,
				"email":  email,
				"phone":  phone,
				"comment": comment,
				"address": address,
				"orderCost" : component.get('v.summaryCost')
			});
			action.setCallback(this, function(response){ 
				var state = response.getState();
				if (state === "SUCCESS") {
					component.find("name").set("v.value", null);
					component.find("email").set("v.value", null);
					component.find("phone").set("v.value", null);
					component.find("comment").set("v.value", null);
					component.find("address").set("v.value", null);
					if (response.getReturnValue()) {
						helper.buyGoods(component);
						helper.showToastBasket(component, event, "Спасибо за заказ. Вам на email выслано письмо.");
					}
					else {
						component.set("v.formResult", "Что-то пошло не так. Сообщение на email не выслано.");
					}
				}
			});
			$A.enqueueAction(action);
		}
	},

	selectOwn : function(component, event, helper) {
		$('.hideAddress').removeClass("slds-show");
		$('.hideAddress').addClass("slds-hide");
		component.set("v.delivery", "Самовывоз из магазина 0.00 руб.");
		var orderCost = component.get("v.order");
		component.set("v.summaryCost", orderCost.OrderCost__c);
	},

	selectDeliveryMinsk : function(component, event, helper) {
		$('.hideAddress').removeClass("slds-hide");
		$('.hideAddress').addClass("slds-show");
		component.set("v.delivery", "Стоимость доставки по Минску 5.00 руб.");
		var orderCost = component.get("v.order");
		component.set("v.summaryCost", (orderCost.OrderCost__c + 5));
	}
})