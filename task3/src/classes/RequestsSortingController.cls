public class RequestsSortingController {

    @AuraEnabled
    public static List <Request__c> fetchContact(String sortField, boolean isAsc) {
        List <Request__c> returnConList = new List <Request__c> ();
        if(sortField != 'Priority__c'){
            String sSoql = 'SELECT Id, CreatedById, Account__c, Account__r.Name, ' + 
            'Contact__c, Contact__r.Name, Name, Phone__c, Priority__c, Status__c, ' +
            'Expiration_date__c, Description__c, IsAvailable__c FROM Request__c';
            if (sortField != '') {
                sSoql += ' ORDER BY ' + sortField;
                if (isAsc) {
                    sSoql += ' ASC';
                    } else {
                        sSoql += ' DESC';
                    }
                }
                sSoql += ' LIMIT 20';
                returnConList = Database.query(sSoql);
                for(integer i = 0; i < returnConList.size(); i++){
                    if(returnConList[i].Account__r.Name != '')
                    returnConList[i].AccountName__c = returnConList[i].Account__r.Name;
                    if(returnConList[i].Contact__r.Name != '')
                    returnConList[i].ContactName__c = returnConList[i].Contact__r.Name;
                }
            }
            if(sortField == 'Priority__c'){
                returnConList = [
                SELECT  Name, CreatedById, Name__c, Account__c, Account__r.Name, Contact__c, Contact__r.Name, 
                Phone__c, Priority__c, Status__c, Expiration_date__c, Description__c, IsAvailable__c
                FROM Request__c
                ];
                List <PrioritySort> listPriorities = new List <PrioritySort> ();
                for (Request__c request : returnConList) {
                    PrioritySort ob = new PrioritySort(request.Id, request.CreatedById, request.Account__c, 
                        request.Account__r.Name, request.Contact__c, request.Contact__r.Name, request.Name, 
                        request.Phone__c, request.Priority__c, request.Status__c, request.Expiration_date__c, 
                        request.Description__c, request.IsAvailable__c);
                    listPriorities.add(ob);
                }
                if(!isAsc)
                PrioritySort.flag = true;
                listPriorities.sort();
                returnConList.clear();
                for (PrioritySort req : listPriorities){
                    returnConList.add(new Request__c(Id = req.IdRequest, Account__c = req.AccountId, 
                        AccountName__c = req.accountName, Contact__c = req.ContactId, ContactName__c = req.contactName, 
                        Name = req.name, Phone__c = req.phone, Priority__c = req.priority, 
                        Status__c = req.status, Expiration_date__c = req.expirationDate, 
                        Description__c = req.description, IsAvailable__c = req.isAvailable ));
                }
            }
            return returnConList;
        }


        @AuraEnabled
        public static void updateRecordAccount(ID lookupId, String selectedAccount) { 
            Request__c request = [
            SELECT Name, CreatedById, Name__c, Account__c, AccountName__c, Contact__c, ContactName__c,
            Phone__c, Priority__c, Status__c, EditStatus__c, Expiration_date__c, Description__c,
            NewName__c, NewAccountName__c, NewContactName__c, NewPhone__c, NewPriority__c, 
            NewStatus__c, NewExpirationDate__c, NewDescription__c, IsAvailable__c
            FROM Request__c WHERE Id = :lookupId LIMIT 1
            ];
            List<Account> newAccountId = [
            SELECT Id FROM Account WHERE Name = :selectedAccount
            ];
            request.Account__c = newAccountId[0].Id;
            update request;
        }

        @AuraEnabled
        public static void updateRecordContact(ID lookupIdContact, String selectedContact) { 
            Request__c request = [
            SELECT Name, CreatedById, Name__c, Account__c, AccountName__c, Contact__c, ContactName__c,
            Phone__c, Priority__c, Status__c, EditStatus__c, Expiration_date__c, Description__c,
            NewName__c, NewAccountName__c, NewContactName__c, NewPhone__c, NewPriority__c, 
            NewStatus__c, NewExpirationDate__c, NewDescription__c, IsAvailable__c
            FROM Request__c WHERE Id = :lookupIdContact LIMIT 1
            ];
            List<Contact> newContactId = [
            SELECT Id FROM Contact WHERE Name = :selectedContact
            ];
            request.Contact__c = newContactId[0].Id;
            update request;
        }

        @AuraEnabled
        public static Request__c editMyRequest(Request__c myRequest) {
            Request__c request = [
            SELECT Name, CreatedById, Name__c, Account__c, AccountName__c, Contact__c, ContactName__c,
            Phone__c, Priority__c, Status__c, EditStatus__c, Expiration_date__c, Description__c,
            NewName__c, NewAccountName__c, NewContactName__c, NewPhone__c, NewPriority__c, 
            NewStatus__c, NewExpirationDate__c, NewDescription__c, IsAvailable__c
            FROM Request__c WHERE Id = :myRequest.Id LIMIT 1
            ];
            Profile loggedinUser = [SELECT Name FROM Profile WHERE Id = :UserInfo.getProfileId() LIMIT 1];
            Account acc = [
            SELECT Id FROM Account WHERE Name = : myRequest.AccountName__c LIMIT 1
            ];
            Contact con = [
            SELECT Id FROM Contact WHERE Name = : myRequest.ContactName__c LIMIT 1
            ];
            if(loggedinUser.Name == 'Clone Standart User'){
                request.EditStatus__c = true;
                request.NewName__c = myRequest.Name;
                request.NewStatus__c = myRequest.Status__c;
                request.NewPriority__c = myRequest.Priority__c;
                request.NewPhone__c = myRequest.Phone__c;
                request.NewExpirationDate__c = myRequest.Expiration_date__c;
                request.NewDescription__c = myRequest.Description__c;
                request.NewContactName__c = myRequest.ContactName__c;
                request.NewAccountName__c = myRequest.AccountName__c;
                request.NewAccount__c = acc.Id;
                request.NewContact__c = con.Id;
                request.IsAvailable__c = true;
                update(request);
            }
            else{
                myRequest.Account__c = acc.Id;
                myRequest.Contact__c = con.Id;
                update(myRequest);
            }
            request = [
            SELECT Name, CreatedById, Name__c, Account__c, AccountName__c, Contact__c, ContactName__c,
            Phone__c, Priority__c, Status__c, EditStatus__c, Expiration_date__c, Description__c,
            NewName__c, NewAccountName__c, NewContactName__c, NewPhone__c, NewPriority__c, 
            NewStatus__c, NewExpirationDate__c, NewDescription__c, IsAvailable__c
            FROM Request__c WHERE Id = :myRequest.Id LIMIT 1
            ];

            system.debug('NewContactName__c = ' + request.ContactName__c);
            return request;
        }

        @AuraEnabled
        public static List <Account> fetchLookUpAccounts(String searchKeyWord) {
            String searchKey = searchKeyWord + '%';
            List <Account> returnList = new List <Account> ();
            String sQuery =  'SELECT Id, Name FROM Account WHERE Name LIKE: searchKey ORDER BY CreatedDate DESC LIMIT 5';
            List <Account> lstOfRecords = Database.query(sQuery);
            for (Account obj: lstOfRecords) {
                returnList.add(obj);
            }
            return returnList;
        }

        @AuraEnabled
        public static List <Contact> fetchLookUpContacts(String searchKeyWord) {
            String searchKey = searchKeyWord + '%';
            List <Contact> returnList = new List <Contact> ();
            String sQuery =  'SELECT Id, Name FROM Contact WHERE Name LIKE: searchKey ORDER BY CreatedDate DESC LIMIT 5';
            List <Contact> lstOfRecords = Database.query(sQuery);
            for (Contact obj: lstOfRecords) {
                returnList.add(obj);
            }
            return returnList;
        }

        @AuraEnabled
        public static List <Contact> getAllContacts() {
            List <Contact> returnList = [
            SELECT Id, Name FROM Contact ORDER BY CreatedDate DESC LIMIT 5
            ];
            return returnList;
        }

        @AuraEnabled
        public static List <Account> getAllAccounts() {
            List <Account> returnList = [
            SELECT Id, Name FROM Account ORDER BY CreatedDate DESC LIMIT 5
            ];
            return returnList;
        }

        @AuraEnabled
        public static List <Request__c> delRequest(ID idRequest) {
            Request__c req = [
            SELECT Id, DeleteStatus__c, IsAvailable__c FROM Request__c WHERE Id = :idRequest LIMIT 1
            ];
            Profile loggedinUser = [SELECT Name FROM Profile WHERE Id = :UserInfo.getProfileId() LIMIT 1];
            if(loggedinUser.Name == 'Clone Standart User'){
                req.DeleteStatus__c = true;
                req.IsAvailable__c = true;
                update(req);
            }
            else
            delete [SELECT Id FROM Request__c WHERE Id = :idRequest];
            List<Request__c> requests = [
            SELECT Name, CreatedById, Name__c, Account__c, AccountName__c, Contact__c, ContactName__c,
            Phone__c, Priority__c, Status__c, Expiration_date__c, Description__c, IsAvailable__c FROM Request__c
            ];
            return requests;
        }

        @future
        public static void delRequestOnTrigger(List<ID> requests){
            delete[SELECT Id FROM Request__c WHERE Id = :requests[0]];
        }

        @future
        public static void editRequestOnTrigger(List<ID> requests){
          list<Request__c> req = [SELECT Id FROM Request__c WHERE Id = :requests[0]];
          update req;
      }

      @AuraEnabled
      public static User getUser(){
        return [SELECT Id, FirstName, LastName FROM User WHERE Id = :UserInfo.getUserId()];
    }

    @AuraEnabled
    public static Profile getLoggedInProfile() {
      Profile loggedinUser = [SELECT Name FROM Profile WHERE Id = :UserInfo.getProfileId() LIMIT 1];
      return loggedinUser;
  }

}