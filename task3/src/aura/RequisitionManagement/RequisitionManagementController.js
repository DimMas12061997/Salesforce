({
    myAction : function(component, event, helper) {
        helper.getAllRequests(component);
    },
    
    navigate : function(component, event, helper) {
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef: "c:ShowAllRequests"
        });
        evt.fire();  
    },
    
    doClickCreateRecordBtn : function(component, event, helper) {
        helper.createRecord(component);
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
            revertOnSpill: true             
        });
        drake.containers.push(to.getElement());

        drake.on('drop', $A.getCallback(function(el, target, source, sibling) {
            var targetStatus = "";
            if(target.classList == 'to-draggable'){
                targetStatus = "closed";
                drake.remove();
            }
            else{
                if(sibling != null)
                    targetStatus = sibling.title;
                else
                    targetStatus =  target.getElementsByTagName("li")[0].title;
            }
            var requests = component.get("v.requests");
            var action = component.get("c.updateStatusRequest");
            action.setParams({
                "requestId": el.id,
                "newStatus": targetStatus
            });
            action.setCallback(this, function(response){ 
                var state = response.getState();
                if (state === "SUCCESS") {
                    for(var j = 0; j < requests.length; j++)
                        if(response.getReturnValue().Id == requests[j].Id){
                            requests[j] = response.getReturnValue();
                        }
                        component.set("v.requests", requests);
                    }
                });
            $A.enqueueAction(action);
        }));
    }
})