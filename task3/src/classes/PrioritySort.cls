public class PrioritySort implements Comparable{
    public ID IdRequest;
    public ID accountId;
    public ID contactId;
    public ID createdById;
    public String accountName;
    public String contactName;
    public String name;
    public String phone;
    public String priority;
    public String status;
    public Date expirationDate;
    public String description;
    public integer priorityId;
    public boolean isAvailable;
    public static boolean flag = false;
    
    public PrioritySort (){}
    
    public PrioritySort (ID IdRequest, ID createdById, ID accountId, String accountName, 
        ID contactId, String contactName, String name, String phone, String priority, 
        String status, Date expirationDate, String description, boolean isAvailable){
        if(priority == 'high')
        this.priorityId = 1;
        else if(priority == 'mid')
        this.priorityId = 2;        
        else if(priority == 'low')
        this.priorityId = 3;
        this.IdRequest = IdRequest;
        this.createdById = createdById;
        this.accountId = accountId;
        this.contactId = contactId;
        this.accountName = accountName;
        this.contactName = contactName;
        this.name = name;
        this.phone = phone;
        this.status = status;
        this.expirationDate = expirationDate;
        this.description = description;
        this.priority = priority;
        this.isAvailable = isAvailable;
    }
    
    public Integer compareTo(Object compareTo) {
        PrioritySort compareToEmp = (PrioritySort)compareTo;
        if(!flag){
            if (priorityId == compareToEmp.priorityId) return 0;
            if (priorityId > compareToEmp.priorityId) return 1;
            return -1;  
            }else{
                if (priorityId == compareToEmp.priorityId) return 0;
                if (priorityId > compareToEmp.priorityId) return -1;
                return 1;    
            }
        }
    }