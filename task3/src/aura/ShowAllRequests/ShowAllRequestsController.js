({
  navigate : function(component, event, helper) {
    var evt = $A.get("e.force:navigateToComponent");
    evt.setParams({
      componentDef: "c:RequisitionManagement"
    });
    evt.fire();  
  },
  
  loadRequestsList: function(component, event, helper) {
    helper.onLoad(component, event, 'Name');
    helper.getProfile(component);
    helper.getUser(component);
    helper.getAllContacts(component, event);
    helper.getAllAccounts(component, event);
  },
  
  sortName: function(component, event, helper) {   
    component.set("v.selectedTabsoft", 'Name');
    helper.sortHelper(component, event, 'Name');
  },
  
  sortDate: function(component, event, helper) {   
    component.set("v.selectedTabsoft", 'Expiration_date__c');
    helper.sortHelper(component, event, 'Expiration_date__c');
  },
  
  sortStatus: function(component, event, helper) {
    component.set("v.selectedTabsoft", 'Status__c');
    helper.sortHelper(component, event, 'Status__c');
  },
  
  sortPriority: function(component, event, helper) {       
    component.set("v.selectedTabsoft", 'Priority__c');  
    helper.sortHelper(component, event, 'Priority__c');
  },

  editRequest : function(component, event, helper) {
    var validExpense = component.find('requestform').reduce(function (validSoFar, inputCmp) {
      inputCmp.showHelpMessageIfInvalid();
      return validSoFar && inputCmp.get('v.validity').valid;
    }, true);
    if(validExpense){
      component.set("v.isOpenEdit", false);
      helper.editRequestHelper(component, event);
      helper.addAccountToList(component, component.get("v.lookupId"), component.get("v.selectedAccount"));
      // helper.getAllContacts(component, event);
      // helper.addContactToList(component, component.get("v.lookupIdContact"), component.get("v.selectedContact"));
      helper.showToastSuccesfully(component, event, "Request was saved!");
    }
    else{
      var resultsToast = $A.get("e.force:showToast");
      resultsToast.setParams({
        "title": "Error",
        "message": "Sorry, it failed",
        "type": "error"
      });
      resultsToast.fire();
    }
  },

  deleteRequest : function(component, event, helper) {
    helper.deleteRequest(component, event);   
    component.set("v.isOpen", false);
  },

  openModel: function(component, event, helper) {
   component.set("v.idForDelete", event.target.id);
   var requests = component.get('v.ListOfRequests');
   for(var j = 0; j < requests.length; j++){
    if(event.target.id == requests[j].Id){
      if(requests[j].IsAvailable__c == true){
        var resultsToast = $A.get("e.force:showToast");
        resultsToast.setParams({
          "title": "Error",
          "message": "Sorry, this request is on check",
          "type": "error"
        });
        resultsToast.fire();
        break;
      }
      else
        component.set("v.isOpen", true);
    }
  }
},

openModelEdit: function(component, event, helper) {
  component.set("v.idForEdit", event.target.id);
  var requests = component.get('v.ListOfRequests');
  for(var j = 0; j < requests.length; j++){
    if(event.target.id == requests[j].Id){
      if(requests[j].IsAvailable__c == true){
        var resultsToast = $A.get("e.force:showToast");
        resultsToast.setParams({
          "title": "Error",
          "message": "Sorry, this request is on check",
          "type": "error"
        });
        resultsToast.fire();
        break;
      }
      else{
        component.set("v.isOpenEdit", true);
      }
    }
  }
},


closeModelEdit: function(component, event, helper) {
  component.set("v.isOpenEdit", false);
},

closeModel: function(component, event, helper) {
 component.set("v.isOpen", false);
},

onfocus : function(component, event, helper){
 console.log('onfocus');
 var j$ = jQuery.noConflict();
 var getInputkeyWord = event.target.value;
 var searchresult = j$('#' + event.target.id).closest('.lookupInput').next('.account-name');
 searchresult.removeClass("slds-hide");
 searchresult.addClass("slds-show");
 var getInputkeyWord = '';
 var flag = 0;
 helper.searchHelper(component, getInputkeyWord, flag);
},

onfocusContact : function(component, event, helper){
  console.log('onfocusContact');
  var j$ = jQuery.noConflict();
  var getInputkeyWord = event.target.value;
  var searchresult = j$('#' + event.target.id).closest('.lookupInputContact').next('.contact-name');
  searchresult.removeClass("slds-hide");
  searchresult.addClass("slds-show");
  var getInputkeyWord = '';
  var flag = 1;
  helper.searchHelper(component, getInputkeyWord, flag);
},

keyPressController : function(component, event, helper) {
  var j$ = jQuery.noConflict();
  var getInputkeyWord = event.target.value;
  var flag = 0;
  if( getInputkeyWord.length > 0 ){
   var searchresult = j$('#' + event.target.id).closest('.lookupInput').next('.account-name');
   searchresult.removeClass("slds-hide");
   searchresult.addClass("slds-show");
   helper.searchHelper(component, getInputkeyWord, flag);
 } else {  
  component.set("v.accountList", null);
  var searchresult = j$('#' + event.target.id).closest('.lookupInput').next('.account-name');
  searchresult.removeClass("slds-show");
  searchresult.addClass("slds-hide");
}
},

keyPressControllerContact : function(component, event, helper) {
  var j$ = jQuery.noConflict();
  var getInputkeyWord = event.target.value;
  var flag = 1;
  if( getInputkeyWord.length > 0 ){
   var searchresult = j$('#' + event.target.id).closest('.lookupInputContact').next('.contact-name');
   searchresult.removeClass("slds-hide");
   searchresult.addClass("slds-show");
   helper.searchHelper(component, getInputkeyWord, flag);
 } else {  
  component.set("v.contactList", null);
  var searchresult = j$('#' + event.target.id).closest('.lookupInputContact').next('.contact-name');
  searchresult.removeClass("slds-show");
  searchresult.addClass("slds-hide");
}
},

populateValue : function(component, event, helper) {
  var j$ = jQuery.noConflict();
  var selectedAccount = j$(event.target).text();
  var inputLookup = j$(event.target).closest('.account-name').siblings('.lookupInput').find('.accountInputClass');
  j$(inputLookup).val(selectedAccount);
  var lookupId = j$(inputLookup).attr('id');
  component.set("v.lookupId", lookupId);
  component.set("v.selectedAccount", selectedAccount);
  var searchresult = j$(event.target).closest('.account-name');
  searchresult.removeClass("slds-show");
  searchresult.addClass("slds-hide");
},

populateValueContact : function(component, event, helper) {
  var j$ = jQuery.noConflict();
  var selectedContact = j$(event.target).text();
  var inputLookup = j$(event.target).closest('.contact-name').siblings('.lookupInputContact').find('.contactInputClass');
  j$(inputLookup).val(selectedContact);
  var lookupId = j$(inputLookup).attr('id');
  component.set("v.lookupIdContact", lookupId);
  component.set("v.selectedContact", selectedContact);
  console.log('lookupIdContact = ' + lookupIdContact);
  console.log('selectedContact = ' + selectedContact);
  var searchresult = j$(event.target).closest('.contact-name');
  searchresult.removeClass("slds-show");
  searchresult.addClass("slds-hide");
}
})