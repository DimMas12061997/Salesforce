({
	onLoad: function(component, event, sortField) {
    var action = component.get('c.fetchContact');
    var requests = component.get('v.ListOfRequests');
    action.setParams({
     'sortField': sortField,
     'isAsc': component.get("v.isAsc")
   });
    action.setCallback(this, function(response) {
     var state = response.getState();
     if (state === "SUCCESS") {
      for(var i = 0; i < requests.length; i++){
       for(var j = 0; j < response.getReturnValue().length; j++){
        if(requests[i].Id == response.getReturnValue()[j].Id){
          if(sortField == 'Priority__c'){
            response.getReturnValue()[j].CreatedById = requests[i].CreatedById;
          }
        }
      }
    }
    component.set('v.ListOfRequests', response.getReturnValue());
  }
});
    $A.enqueueAction(action);
  },

  sortHelper: function(component, event, sortFieldName) {
    var currentDir = component.get("v.arrowDirection");
    if (currentDir == 'arrowdown') {
     component.set("v.arrowDirection", 'arrowup');
     component.set("v.isAsc", true);
   } else {
     component.set("v.arrowDirection", 'arrowdown');
     component.set("v.isAsc", false);
   }
   this.onLoad(component, event, sortFieldName);
 },


 showToastSuccesfully : function(component, event, message) {
  $A.get('e.force:refreshView').fire();
  var toast = $A.get("e.force:showToast");
  toast.setParams({
    "title": "Success!",
    "message": message,
    "type": 'success',
  });
  toast.fire();
},

getAllContacts: function(component, event){
 var action = component.get("c.getAllContacts");
 action.setCallback(this, function(response) {
  if (response.getState() == "SUCCESS") {
    var allValues = response.getReturnValue();
    component.set("v.contactList", allValues);
  }
});
 $A.enqueueAction(action);
},

getAllAccounts: function(component, event){
 var action = component.get("c.getAllAccounts");
 action.setCallback(this, function(response) {
  if (response.getState() == "SUCCESS") {
    var allValues = response.getReturnValue();
    component.set("v.listOfAccounts", allValues);
  }
});
 $A.enqueueAction(action);
},

addAccountToList : function(component, lookupId, selectedAccount) {
  var action = component.get("c.updateRecordAccount");
  action.setParams({
    'lookupId': lookupId,
    'selectedAccount': selectedAccount
  });
  action.setCallback(this, function(response) {
    if (response.getState() == "SUCCESS") {
      console.log('gooood!');
    }
  });
  $A.enqueueAction(action);
},

addContactToList : function(component, lookupIdContact, selectedContact) {
  var action = component.get("c.updateRecordContact");
  action.setParams({
    'lookupIdContact': lookupIdContact,
    'selectedContact': selectedContact
  });
  action.setCallback(this, function(response) {
    if (response.getState() == "SUCCESS") {
      console.log('gooood!');
    }
  });
  $A.enqueueAction(action);
},

editRequestHelper: function(component, event){
 var listRequests = component.get('v.ListOfRequests');
 var request = '';
 for(var i = 0; i < listRequests.length; i++){
  if(listRequests[i].Id == component.get("v.idForEdit")){
    console.log('listRequests[i] = ' + JSON.stringify(listRequests[i]));
    request = listRequests[i];
  }
}
var action = component.get('c.editMyRequest');
action.setParams({
  'myRequest': request
});
action.setCallback(this, function(response) {
  var state = response.getState();
  if (state === "SUCCESS") {
    for(var i = 0; i < listRequests.length; i++){
      if(listRequests[i].Id == component.get("v.idForEdit")){
        listRequests[i] = response.getReturnValue();
      }
    }
    component.set('v.ListOfRequests', listRequests);
  }
});
$A.enqueueAction(action);
},


deleteRequest: function(component, event){
  var action = component.get('c.delRequest');
  action.setParams({
    'idRequest': component.get("v.idForDelete")
  });
  action.setCallback(this, function(response) {
    var state = response.getState();
    if (state === "SUCCESS") {
     console.log('good');
   }
 });
  $A.enqueueAction(action);
  this.onLoad(component, event, 'Name');
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

getUser: function(component){
  var action = component.get("c.getUser");
  action.setCallback(this, function(response) {
    var state = response.getState();
    if (component.isValid() && state === "SUCCESS") {
      component.set("v.user", response.getReturnValue());
    } else {
      console.log('There was an error');
    }
  });
  $A.enqueueAction(action);
},

searchAccounts : function(component, getInputkeyWord, flag) {
 var action = component.get("c.fetchLookUpAccounts");
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

searchContacts : function(component, getInputkeyWord, flag) {
 var action = component.get("c.fetchLookUpContacts");
 action.setParams({
  'searchKeyWord': getInputkeyWord
});
 action.setCallback(this, function(response) {
  if (response.getState() == "SUCCESS") {
    var allValues = response.getReturnValue();
    component.set("v.contactList", allValues);
  }
});
 $A.enqueueAction(action);
},

searchHelper : function(component, getInputkeyWord, flag) {
  if(flag == 0)
    this.searchAccounts(component, getInputkeyWord, flag);
  else if(flag == 1)
    this.searchContacts(component, getInputkeyWord, flag);
},

})