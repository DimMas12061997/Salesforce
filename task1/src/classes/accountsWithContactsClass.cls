public class accountsWithContactsClass {
    
	@AuraEnabled
	public static list <Contact> getAllContacts(ID accountId){
        list<Contact> contacts = [
            SELECT FirstName, LastName, Phone, Email, Birthdate, AccountId, Account.Name
            FROM Contact 
            WHERE AccountId = :accountId
        ];
    	return contacts;
    }
    
    @AuraEnabled
    public static Contact[] saveContact(Contact[] contacts) {
        update contacts;
        return contacts;
    }
    
    @AuraEnabled
    public static List <Account> fetchLookUpValues(String searchKeyWord) {
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
    public static Contact[] updateRecord(ID lookupId, String selectedAccount, ID accountId) { 
        Contact contact = [
            SELECT FirstName, LastName, Phone, Email, Birthdate, AccountId, Account.Name
            FROM Contact 
            WHERE Id = :lookupId
        ];
        List<Account> newAccountId = [
            SELECT Id FROM Account WHERE Name = :selectedAccount
        ];
        contact.AccountId = newAccountId[0].Id;
        update contact;
        List<Contact> contacts = [
            SELECT FirstName, LastName, Phone, Email, Birthdate, Account.Name
            FROM Contact 
            WHERE AccountId = :accountId
        ];
        return contacts;
    }
}