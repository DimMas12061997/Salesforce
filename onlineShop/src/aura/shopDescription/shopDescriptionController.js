({
	myAction : function(component, event, helper) {
	},

	navigate : function(component, event, helper) {
		var event = $A.get("e.force:navigateToComponent");
		event.setParams({
			componentDef: "c:menuCmp"
		});
		event.fire();  
	},
})