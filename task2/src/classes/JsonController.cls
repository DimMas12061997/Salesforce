public class JsonController {
    
    List<BlogEntry__c> resultEntries = new List<BlogEntry__c>();
    public List<BlogEntry__c> BlogEntriesToShow{get; set;}
    
    Integer counter = 0;
    Integer limitSize = 10;
    Integer totalSize = 0;
    
    public JsonController(){
        BlogEntriesToShow = new List<BlogEntry__c>();
        resultEntries = [
            SELECT title__c, link__c, published__c, description__c FROM BlogEntry__c ORDER BY published__c DESC
        ];
        totalSize = resultEntries.size();
        if((counter + limitSize) <= totalSize){
            for(Integer i = 0; i < limitSize; i++){
                BlogEntriesToShow.add(resultEntries.get(i));
            }
        } else {
            for(Integer i = 0; i < totalSize; i++){
                BlogEntriesToShow.add(resultEntries.get(i));
            }
        }
        
    }

    public void beginning(){
        BlogEntriesToShow.clear();
        counter = 0;
        if((counter + limitSize) <= totalSize){
            for(Integer i = 0; i < limitSize; i++){
                BlogEntriesToShow.add(resultEntries.get(i));
            }   
        }else{
            for(Integer i = 0; i < totalSize; i++){
                BlogEntriesToShow.add(resultEntries.get(i));
            }       
        }
    }
    
    public void next(){
        BlogEntriesToShow.clear();
        counter = counter + limitSize;
        if((counter + limitSize) <= totalSize){
            for(Integer i = counter-1; i<(counter+limitSize); i++){
                BlogEntriesToShow.add(resultEntries.get(i));
            }
        } else{
            for(Integer i = counter; i<totalSize; i++){
                BlogEntriesToShow.add(resultEntries.get(i));
            }
        }
    }
    
    public void previous(){
        BlogEntriesToShow.clear();
        counter=counter-limitSize;       
        for(Integer i=counter;i<(counter+limitSize); i++){
            BlogEntriesToShow.add(resultEntries.get(i));
        }
    }
    
    public void last (){
        BlogEntriesToShow.clear();
        if(math.mod(totalSize , limitSize) == 0){
            counter = limitSize * ((totalSize/limitSize)-1);
        } else if (math.mod(totalSize , limitSize) != 0){
            counter = limitSize * ((totalSize/limitSize));
        }
        for(Integer i=counter-1;i<totalSize-1;i++){
            BlogEntriesToShow.add(resultEntries.get(i));
        }
        
    }
    
    public Boolean getDisableNext(){
        if((counter + limitSize) >= totalSize )
            return true;
        else
            return false;
    }
    
    public Boolean getDisablePrevious(){
        if(counter == 0)
            return true;
        else
            return false;
    } 
    
}