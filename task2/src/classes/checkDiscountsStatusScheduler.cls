global class checkDiscountsStatusScheduler implements Schedulable {

    global void execute(SchedulableContext ctx) {
        RSS myBatch = new RSS();
     	Database.executeBatch(myBatch);
 	} 
}