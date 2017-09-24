({
	myAction : function(component, event, helper) {
         helper.getAllContacts(component);
	},
    
    clickEdit : function(component, event, helper) {
		component.set("v.flag", true);
    },
	
    clickCancel : function(component, event, helper) {
         helper.getAllContacts(component);
         helper.setFlags(component);
    },
    
    clickSave : function(component, event, helper) {
        var validExpense = component.find('contactform').reduce(function (validSoFar, inputCmp) {
            inputCmp.showHelpMessageIfInvalid();
            return validSoFar && inputCmp.get('v.validity').valid;
        }, true);
        if(validExpense){
            helper.save(component);
            helper.addItemToList(component, component.get("v.lookupId"), component.get("v.selectedAccount"));
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
    
    onfocus : function(component, event, helper){
       var j$ = jQuery.noConflict();
       var getInputkeyWord = event.target.value;
       var searchresult = j$('#' + event.target.id).closest('.lookupInput').next('.account-name');
       searchresult.removeClass("slds-hide");
       searchresult.addClass("slds-show");
       var getInputkeyWord = '';
       helper.searchHelper(component, getInputkeyWord);
    },
    
    keyPressController : function(component, event, helper) {
        var j$ = jQuery.noConflict();
        var getInputkeyWord = event.target.value;
        if( getInputkeyWord.length > 0 ){
            var searchresult = j$('#' + event.target.id).closest('.lookupInput').next('.account-name');
            searchresult.removeClass("slds-hide");
            searchresult.addClass("slds-show");
            helper.searchHelper(component, getInputkeyWord);
        } else {  
            component.set("v.accountList", null);
            var searchresult = j$('#' + event.target.id).closest('.lookupInput').next('.account-name');
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
    }
})