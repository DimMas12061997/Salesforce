({
	showMap : function(component, event, helper) {
		var goodsId = event.currentTarget.id;
		var evt = $A.get("e.force:navigateToComponent");
		evt.setParams({
			componentDef: "c:map",
		});
		evt.fire();  
	},
})