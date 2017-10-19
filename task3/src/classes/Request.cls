public class Request {

    @AuraEnabled
    public static List <Request__c> getAllRequests(){
        List<Request__c> requests = [
        SELECT  Name, CreatedById, Name__c, Account__c, Account__r.Name, Contact__c, 
        Contact__r.Name, Phone__c, Priority__c, Status__c, Expiration_date__c, Description__c, IsAvailable__c
        FROM Request__c
        ];

        List <PrioritySort> listPriorities = new List <PrioritySort> ();
        for (Request__c request : requests) {
            PrioritySort ob = new PrioritySort(request.Id, request.CreatedById, request.Account__c, 
                request.Account__r.Name, request.Contact__c, request.Contact__r.Name, request.Name, 
                request.Phone__c, request.Priority__c, request.Status__c, request.Expiration_date__c, 
                request.Description__c, request.IsAvailable__c);
            listPriorities.add(ob);
        }
        listPriorities.sort();
        requests.clear();
        for (PrioritySort req : listPriorities)
        requests.add(new Request__c(Id = req.Idrequest, Account__c = req.AccountId, AccountName__c = req.accountName,
            Contact__c = req.ContactId, ContactName__c = req.contactName, Name = req.name, Phone__c = req.phone, 
            Priority__c = req.priority, Status__c = req.status, Expiration_date__c = req.expirationDate, 
            Description__c = req.description));

        return requests;
    }

    @AuraEnabled
    public static Request__c updateStatusRequest(Id requestId, String newStatus){
        List<Request__c> request = [
        SELECT  Status__c
        FROM Request__c WHERE Id = :requestId
        ];
        request[0].Status__c = newStatus;
        update(request);
        Request__c requestNew = [
        SELECT  Name, CreatedById, Name__c, Account__c, AccountName__c, Contact__c, ContactName__c, Phone__c, 
        Priority__c, Status__c, Expiration_date__c, Description__c
        FROM Request__c WHERE Id = :requestId LIMIT 1
        ];
        return requestNew;
    }

}