({
    
    getAllRequests: function(component){
        var action = component.get("c.getAllRequests");
        action.setCallback(this, function(response){ 
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.requests", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);    
    },
    
    createRecord : function(component) {
        var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": 'Request__c'
        });
        createRecordEvent.fire();
    }
})