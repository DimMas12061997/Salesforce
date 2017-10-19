global class EditingRequestBatch implements Database.Batchable<sObject> {
	
	global EditingRequestBatch() {
		
	}
	
	global Database.QueryLocator start(Database.BatchableContext BC) {
		return Database.getQueryLocator('SELECT  Name, Owner.Email, LastModifiedDate, CreatedById, Name__c, Account__c, Contact__c, ' +
			'Phone__c, Priority__c, Status__c, Expiration_date__c, Description__c FROM Request__c WHERE LastModifiedDate > LAST_N_DAYS:1');
	}

	global void execute(Database.BatchableContext BC, List<Request__c> scope) {
		List<Request__c> requestsList = new List<Request__c>();
		String message = '';
		for(Request__c request : scope){
			if(request.Priority__c != 'high' && request.Priority__c != 'closed'){
				if(request.Priority__c == 'low')
				request.Priority__c = 'mid';
				else if(request.Priority__c == 'mid')
				request.Priority__c = 'high';
			}
			message = 'Request: ' + request.Name + ', ' + request.Name__c + ', ' + 
			request.Account__c + ', ' + request.Contact__c + ', ' + request.Phone__c + ', ' + request.Status__c + ', ' +
			request.Priority__c + ', ' + request.Description__c;
			Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
			String[] toAddresses = new String[] {request.Owner.Email};
			mail.setToAddresses(toAddresses);
			mail.setSubject('Priority was edit');
			mail.setPlainTextBody(message);
			Messaging.SendEmailResult[] results = Messaging.sendEmail(
				new Messaging.SingleEmailMessage[] { mail });
		}
		upsert(scope);
	}
	
	global void finish(Database.BatchableContext BC) {
		
	}
	
}