global class RequestSheduler implements Schedulable {
	global void execute(SchedulableContext sc) {
		EditingRequestBatch editingRequest = new EditingRequestBatch();
		database.executebatch(editingRequest);
	}
}