public class GoodsController {

	@AuraEnabled
	public static List <Goods__c> getAllGoods(){
		List<Goods__c> goods = [
		SELECT Id, Name, Amount__c, UnitPrice__c, Producer__c, Description__c, Category__c FROM Goods__c
		];
		return goods;
	}

	@AuraEnabled
	public static List <Category__c> getAllCategories(){
		List<Category__c> categories = [
		SELECT Id, Name FROM Category__c
		];
		return categories;
	}

	@AuraEnabled
	public static Goods__c updateAmountOfGoods(Id goodsId){
		Goods__c goods = [
		SELECT Id, Name, Amount__c, UnitPrice__c, Producer__c, Description__c, Category__c 
		FROM Goods__c WHERE Id = :goodsId LIMIT 1
		];
		if(goods.Amount__c > 0){
			goods.Amount__c = goods.Amount__c - 1;
			update(goods);
		}
		return goods;
	}

	@AuraEnabled
	public static Category__c getNameCategoryById(Id categoryId){
		Category__c category = [
		SELECT Id, Name FROM Category__c WHERE Id = : categoryId LIMIT 1
		];
		return category;
	}

}