({
	loadRequestsList: function(component, event, helper) {
		helper.getAllRequests(component);
		helper.getProfile(component);
	},

	approveAction: function(component, event, helper) {
		var requestId = event.target.id;
		var listRequests = component.get('v.ListOfRequests');
		var action = component.get('c.approveChange');
		action.setParams({
			'requestId': requestId
		});
		action.setCallback(this, function(response) {
			var state = response.getState();
			if (state === "SUCCESS") {
				for(var i = 0; i < listRequests.length; i++){
					if(listRequests[i].Id == requestId){
						listRequests[i] = response.getReturnValue();
					}
				}
				component.set('v.ListOfRequests', listRequests);
			}
		});
		$A.enqueueAction(action);
	},

	rejectAction: function(component, event, helper) {
		var requestId = event.target.id;
		var listRequests = component.get('v.ListOfRequests');
		var action = component.get('c.rejectChange');
		action.setParams({
			'requestId': requestId
		});
		action.setCallback(this, function(response) {
			var state = response.getState();
			if (state === "SUCCESS") {
				for(var i = 0; i < listRequests.length; i++){
					if(listRequests[i].Id == requestId){
						listRequests[i] = response.getReturnValue();
					}
				}
				component.set('v.ListOfRequests', listRequests);
			}
		});
		$A.enqueueAction(action);
	},

})