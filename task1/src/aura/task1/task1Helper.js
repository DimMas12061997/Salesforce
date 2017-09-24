({
	setFlags : function(component) {
		component.set("v.flag", false);
	},
    
    save : function(component) {
		 var action = component.get("c.saveContact");
         action.setParams({
       	 'contacts': component.get("v.contacts")
   		 });
          action.setCallback(this, function(response){
          if (component.isValid() && response.getState() === 'SUCCESS'){
              component.set("v.contacts", response.getReturnValue());
              component.set("v.flag", false);
          }
          var resultsToast = $A.get("e.force:showToast");
          resultsToast.setParams({
             "title": "Success",
             "message": "Contacts Saved!",
             "type": "success"
          });
          resultsToast.fire();
        });
        $A.enqueueAction(action);
	},
    
    getAllContacts : function(component) {
		var action = component.get("c.getAllContacts");
         action.setParams({
       	"accountId": component.get("v.recordId")
   		 });
         action.setCallback(this, function(response){ 
         var state = response.getState();
         if (state === "SUCCESS") {
         component.set("v.contacts", response.getReturnValue());
         }
        });
        $A.enqueueAction(action);
	},
    
     searchHelper : function(component, getInputkeyWord) {
        var action = component.get("c.fetchLookUpValues");
        action.setParams({
            'searchKeyWord': getInputkeyWord
        });
        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                var allValues = response.getReturnValue();
                component.set("v.accountList", allValues);
            }
        });
        $A.enqueueAction(action);
    },

    addItemToList : function(component, lookupId, selectedAccount) {
        var action = component.get("c.updateRecord");
        action.setParams({
            'lookupId': lookupId,
            'selectedAccount': selectedAccount,
            "accountId": component.get("v.recordId")
        });
        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                var allValues = response.getReturnValue();
                component.set("v.contacts", allValues);
            }
        });
        $A.enqueueAction(action);
    }
     
})