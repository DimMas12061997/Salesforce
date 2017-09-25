public class TutByNewsController implements Database.Batchable<BlogEntry__c>, Database.AllowsCallouts{
 
    public Iterable<BlogEntry__c> start(Database.BatchableContext BC){
        List<BlogEntry__c> scope = getNewsFromTutBy();
        return scope;
    }
    
    public void execute(Database.BatchableContext BC, List<BlogEntry__c> scope){
        List<BlogEntry__c> resultEntries = [
            SELECT title__c, published__c, description__c FROM BlogEntry__c
        ];
        Database.upsert(scope, BlogEntry__c.externalId__c);
         resultEntries = [
            SELECT title__c, published__c, description__c FROM BlogEntry__c
        ];
        DateTime dt = DateTime.now();
        DateTime dt1 = dt.addDays(-3);
        List<BlogEntry__c> oldEntries = [
            SELECT title__c, published__c FROM BlogEntry__c WHERE published__c < :dt1
        ];
        delete oldEntries;
    }
    
        public static List<BlogEntry__c> getNewsFromTutBy(){
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.tut.by%2Frss%2Feconomics.rss');
        req.setmethod('GET');
        HttpResponse res = http.send(req);
        String str = res.getbody();
        Map<String, Object> cObjMap = (Map<String, Object>) JSON.deserializeUntyped(str);
        List<Object> lstObject = (List<Object>)cObjMap.get('items');
        List<BlogEntry__c> resultEntries = new  List<BlogEntry__c>();
        for(Object result : lstObject) {
            Map<String,Object> mpParsed = (Map<String,Object>)result;
            BlogEntry__c entry = new BlogEntry__c();
            for (String attributeName : mpParsed.keyset()) {
                if(attributeName == 'title')
                    entry.title__c =  String.valueOf(mpParsed.get(attributeName));
                else if(attributeName == 'pubDate')
                    entry.published__c = DateTime.valueof(String.valueOf(mpParsed.get(attributeName)));
                else if(attributeName == 'link'){
                    entry.link__c = String.valueOf(mpParsed.get(attributeName));
                    entry.externalId__c = String.valueOf(mpParsed.get(attributeName)).substring(30,36);
                }
                else if(attributeName == 'description')
                    entry.description__c =  String.valueOf(mpParsed.get(attributeName));
                else if(attributeName == 'categories')
                    entry.category__c =  String.valueOf(mpParsed.get(attributeName));
                else if(attributeName == 'author')
                    entry.authorName__c =  String.valueOf(mpParsed.get(attributeName));
            }
            resultEntries.add(entry);
        }
        return resultEntries;
    }
    
    public void finish(Database.BatchableContext bc){}
}