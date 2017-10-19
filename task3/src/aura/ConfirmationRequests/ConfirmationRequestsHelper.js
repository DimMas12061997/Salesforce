({
	getAllRequests : function(component) {
		var action = component.get("c.getAllRequests");
		action.setCallback(this, function(response){ 
			var state = response.getState();
			if (state === "SUCCESS") {
				component.set("v.ListOfRequests", response.getReturnValue());
			}
		});
		$A.enqueueAction(action);    
	},

	getProfile: function(component){
		var action = component.get("c.getLoggedInProfile");
		action.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS") {
				component.set("v.profile", response.getReturnValue());
			} else {
				console.log('There was an error');
			}
		});
		$A.enqueueAction(action);
	},
})