public class ControllerForRequestManagement {


	@AuraEnabled
	public static List <Request__c> getAllRequests(){
		List<Request__c> requests = [
		SELECT Name, CreatedById, Name__c, Account__c, AccountName__c, Contact__c, ContactName__c,
		Phone__c, Priority__c, Status__c, DeleteStatus__c, EditStatus__c, Expiration_date__c, Description__c,
		NewName__c, NewAccountName__c, NewContactName__c, NewPhone__c, NewPriority__c, 
		NewStatus__c, NewExpirationDate__c, NewDescription__c FROM Request__c
		];
		return requests;
	}

	@AuraEnabled
	public static Profile getLoggedInProfile() {
		Profile loggedinUser = [SELECT Name FROM Profile WHERE Id = :UserInfo.getProfileId() LIMIT 1];
		return loggedinUser;
	}

	@AuraEnabled
	public static Request__c approveChange(Id requestId) {
		Request__c request = [
		SELECT Name, CreatedById, Name__c, Account__c, AccountName__c, Contact__c, ContactName__c,
		Phone__c, Priority__c, Status__c, EditStatus__c, Expiration_date__c, Description__c,
		NewName__c, NewAccountName__c, NewContactName__c, NewPhone__c, NewPriority__c, 
		NewStatus__c, NewExpirationDate__c, NewDescription__c, IsAvailable__c
		FROM Request__c WHERE Id = :requestId LIMIT 1
		];
		if(request.NewName__c != null){
			request.EditStatus__c = false;
			request.Name = request.NewName__c;
			request.Status__c = request.NewStatus__c;
			request.Priority__c = request.NewPriority__c;
			request.Phone__c = request.NewPhone__c;
			request.Expiration_date__c = request.NewExpirationDate__c;
			request.Description__c = request.NewDescription__c;
			request.ContactName__c = request.NewContactName__c;
			request.AccountName__c = request.NewAccountName__c;
			request.IsAvailable__c = false;
			update(request);
		}
		else{
			delete(request);
		}
		request = [
		SELECT Name, CreatedById, Name__c, Account__c, AccountName__c, Contact__c, ContactName__c,
		Phone__c, Priority__c, Status__c, EditStatus__c, Expiration_date__c, Description__c,
		NewName__c, NewAccountName__c, NewContactName__c, NewPhone__c, NewPriority__c, 
		NewStatus__c, NewExpirationDate__c, NewDescription__c, IsAvailable__c
		FROM Request__c WHERE Id = :requestId LIMIT 1
		];
		return request;
	}


	@AuraEnabled
	public static Request__c rejectChange(Id requestId) {
		Request__c request = [
		SELECT Name, CreatedById, Name__c, Account__c, AccountName__c, Contact__c, ContactName__c,
		Phone__c, Priority__c, Status__c, EditStatus__c, DeleteStatus__c, Expiration_date__c, Description__c,
		NewName__c, NewAccountName__c, NewContactName__c, NewPhone__c, NewPriority__c, 
		NewStatus__c, NewExpirationDate__c, NewDescription__c, IsAvailable__c
		FROM Request__c WHERE Id = :requestId LIMIT 1
		];
		if(request.EditStatus__c == true)
		request.EditStatus__c = false;
		if(request.DeleteStatus__c == true)
		request.DeleteStatus__c = false;
		request.IsAvailable__c = false;
		update(request);
		request = [
		SELECT Name, CreatedById, Name__c, Account__c, AccountName__c, Contact__c, ContactName__c,
		Phone__c, Priority__c, Status__c, EditStatus__c, DeleteStatus__c, Expiration_date__c, Description__c,
		NewName__c, NewAccountName__c, NewContactName__c, NewPhone__c, NewPriority__c, 
		NewStatus__c, NewExpirationDate__c, NewDescription__c, IsAvailable__c
		FROM Request__c WHERE Id = :requestId LIMIT 1
		];
		return request;
	}
}