public class GoodsController {

	@AuraEnabled
	public static List <Goods__c> getAllGoods(){
		List<Goods__c> goods = [
		SELECT Id, Name, Amount__c, UnitPrice__c, Producer__c, SmallImage__c, Image__c, 
		Description__c, Category__c 
		FROM Goods__c ORDER BY Name
		];
		return goods;
	}

	@AuraEnabled
	public static List <Goods__c> sortGoods(String sortField, boolean isAsc){
		List<Goods__c> goods = new List<Goods__c>();
		String sSoql = 'SELECT Id, Name, Amount__c, UnitPrice__c, ' +
		'Producer__c, Image__c, SmallImage__c, Description__c, Category__c FROM Goods__c';
		if (sortField != '') {
			sSoql += ' ORDER BY ' + sortField;
			if (isAsc) {
				sSoql += ' ASC';
			} 
			else {
				sSoql += ' DESC';
			}
		}
		sSoql += ' LIMIT 20';
		goods = Database.query(sSoql);
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
	public static List<Goods__c> updateAmountOfGoods(Id goodsId){
		List<Order__c> orders = new List<Order__c>();
		List<GoodsOrder__c> goodsOrders = new List<GoodsOrder__c>();
		List<Goods__c> goods = [
		SELECT Id, Name, Amount__c, UnitPrice__c, Description__c, Producer__c, SmallImage__c, 
		Image__c, Category__c 
		FROM Goods__c WHERE Id = :goodsId LIMIT 1
		];
		if (goods.get(0).Amount__c > 0) {
			goods.get(0).Amount__c = goods.get(0).Amount__c - 1;
			update(goods.get(0));
			orders = [
			SELECT Id, OrderCost__c, UserId__c
			FROM Order__c WHERE UserId__c = :UserInfo.getUserId()
			];
			if (orders.size() == 0) {
				Order__c order = new Order__c(
					OrderCost__c = 0,
					UserId__c = UserInfo.getUserId()
					);
				insert order;
				orders.add(order);
			}
			goodsOrders = [
			SELECT Id, GoodsId__c, CustomOrderId__c, GoodsAmount__c
			FROM GoodsOrder__c WHERE GoodsId__c = :goodsId AND CustomOrderId__c = :orders.get(0).Id
			];
			if (goodsOrders.size() != 0){
				goodsOrders.get(0).GoodsAmount__c += 1;
				update(goodsOrders.get(0));	
				orders.get(0).OrderCost__c += goods.get(0).UnitPrice__c;
				update(orders.get(0));
			}
			else {
				if (orders.get(0).OrderCost__c == 0) {
					orders.get(0).OrderCost__c = goods.get(0).UnitPrice__c;
					update(orders.get(0));
					GoodsOrder__c goodsOrder = new GoodsOrder__c(
						GoodsAmount__c = 1,
						CustomOrderId__c = orders.get(0).Id,
						GoodsId__c = goods.get(0).Id
						);
					insert goodsOrder;	
				}
				else {
					orders.get(0).OrderCost__c += goods.get(0).UnitPrice__c;
					update(orders.get(0));
					GoodsOrder__c goodsOrder = new GoodsOrder__c(
						GoodsAmount__c = 1,
						CustomOrderId__c = orders.get(0).Id,
						GoodsId__c = goods.get(0).Id
						);
					insert goodsOrder;		
				}
			}
		}
		return goods;
	}

	@AuraEnabled
	public static List<Goods__c> addGoodsToBasket1(Id goodsId, decimal kol){
		Integer amount = kol.intValue();
		List<Order__c> orders = new List<Order__c>();
		List<GoodsOrder__c> goodsOrders = new List<GoodsOrder__c>();
		List<Goods__c> goods = [
		SELECT Id, Name, Amount__c, UnitPrice__c, Description__c, Producer__c, SmallImage__c, 
		Image__c, Category__c 
		FROM Goods__c WHERE Id = :goodsId LIMIT 1
		];
		if (goods.get(0).Amount__c > 0) {
			goods.get(0).Amount__c -= amount;
			update(goods.get(0));
			orders = [
			SELECT Id, OrderCost__c, UserId__c
			FROM Order__c WHERE UserId__c = :UserInfo.getUserId()
			];
			if (orders.size() == 0) {
				Order__c order = new Order__c(
					OrderCost__c = 0,
					UserId__c = UserInfo.getUserId()
					);
				insert order;
				orders.add(order);
			}
			goodsOrders = [
			SELECT Id, GoodsId__c, CustomOrderId__c, GoodsAmount__c
			FROM GoodsOrder__c WHERE GoodsId__c = :goodsId AND CustomOrderId__c = :orders.get(0).Id
			];
			if (goodsOrders.size() != 0){
				goodsOrders.get(0).GoodsAmount__c += amount;
				update(goodsOrders.get(0));							
				orders.get(0).OrderCost__c += goods.get(0).UnitPrice__c * amount;
				update(orders.get(0));
			}
			else {
				if (orders.get(0).OrderCost__c == 0) {
					orders.get(0).OrderCost__c = goods.get(0).UnitPrice__c*amount;
					update(orders.get(0));
					GoodsOrder__c goodsOrder = new GoodsOrder__c(
						GoodsAmount__c = amount,
						CustomOrderId__c = orders.get(0).Id,
						GoodsId__c = goods.get(0).Id
						);
					insert goodsOrder;	
				}
				else {
					orders.get(0).OrderCost__c += goods.get(0).UnitPrice__c*amount;
					update(orders.get(0));
					GoodsOrder__c goodsOrder = new GoodsOrder__c(
						GoodsAmount__c = amount,
						CustomOrderId__c = orders.get(0).Id,
						GoodsId__c = goods.get(0).Id
						);
					insert goodsOrder;		
				}
			}
		}
		return goods;
	}

	@AuraEnabled
	public static List<Goods__c> getGoodsById(Id goodsId){
		List<Goods__c> goods = [
		SELECT Id, Name, Amount__c, UnitPrice__c, Producer__c, Description__c, Image__c, 
		SmallImage__c, Category__c, Category__r.Name 
		FROM Goods__c WHERE Id = :goodsId LIMIT 1
		];
		return goods;
	}


	@AuraEnabled
	public static Category__c getNameCategoryById(Id categoryId){
		Category__c category = [
		SELECT Id, Name FROM Category__c WHERE Id = : categoryId LIMIT 1
		];
		return category;
	}


	@AuraEnabled
	public static void deleteGoodsById(Id goodsId){
		List<Order__c> order = [
		SELECT Id, OrderCost__c
		FROM Order__c WHERE UserId__c = :UserInfo.getUserId() LIMIT 1
		];
		List<GoodsOrder__c> goodsOrders = [
		SELECT Id, GoodsAmount__c, GoodsId__c, CustomOrderId__c
		FROM GoodsOrder__c WHERE GoodsId__c = :goodsId AND CustomOrderId__c = :order.get(0).Id
		];
		if (goodsOrders.size() > 0) {
			delete goodsOrders.get(0);
		}
		List<Goods__c> goods = [
		SELECT Id, Amount__c, UnitPrice__c
		FROM Goods__c WHERE Id = :goodsOrders.get(0).GoodsId__c LIMIT 1
		];
		order.get(0).OrderCost__c -= goods.get(0).UnitPrice__c*goodsOrders.get(0).GoodsAmount__c;
		update order;
		goods.get(0).Amount__c += goodsOrders.get(0).GoodsAmount__c;
		update goods;
	}


	@AuraEnabled
	public static integer updateAmountOfGoodsInBasket(Id goodsId, boolean sign){
		integer flag = 0;
		List<Order__c> order = [
		SELECT Id, OrderCost__c
		FROM Order__c WHERE UserId__c = :UserInfo.getUserId() LIMIT 1
		];
		List<GoodsOrder__c> goodsOrders = [
		SELECT Id, GoodsAmount__c, GoodsId__c, CustomOrderId__c
		FROM GoodsOrder__c WHERE GoodsId__c = :goodsId AND CustomOrderId__c = :order.get(0).Id
		];
		List<Goods__c> goods = [
		SELECT Id, Amount__c, UnitPrice__c
		FROM Goods__c WHERE Id = :goodsOrders.get(0).GoodsId__c LIMIT 1
		];
		
		if (sign) {
			if (goods.get(0).Amount__c != 0) {
				goodsOrders.get(0).GoodsAmount__c += 1;
				goods.get(0).Amount__c -= 1;
				order.get(0).OrderCost__c += goods.get(0).UnitPrice__c;
				update order;
				update goodsOrders;
				update goods;
			}
			else {
				flag = 1;
			}
		}
		else {
			if (goodsOrders.get(0).GoodsAmount__c != 1) {
				goodsOrders.get(0).GoodsAmount__c -= 1;
				goods.get(0).Amount__c += 1;
				order.get(0).OrderCost__c -= goods.get(0).UnitPrice__c;
				update order;
				update goodsOrders;
				update goods;
			}
			else {
				goodsOrders.get(0).GoodsAmount__c -= 1;
				goods.get(0).Amount__c += 1;
				order.get(0).OrderCost__c -= goods.get(0).UnitPrice__c;
				update order;
				update goodsOrders;
				update goods;
				GoodsController.deleteGoodsById(goodsId);
				flag = -1;
			}
		}
		return flag;
	}

	@AuraEnabled
	public static List<Goods__c> getGoodsInOrderByUserId(){
		List<Order__c> order = [
		SELECT Id, OrderCost__c, UserId__c
		FROM Order__c WHERE UserId__c = :UserInfo.getUserId()
		];
		List<GoodsOrder__c> goodsOrders = [
		SELECT Id, GoodsId__c, CustomOrderId__c, GoodsAmount__c
		FROM GoodsOrder__c WHERE CustomOrderId__c = :order.get(0).Id 
		];
		List<Goods__c> goodsResult = new List<Goods__c>();
		for(GoodsOrder__c goodsOrder : goodsOrders){
			List<Goods__c> goods = [
			SELECT Id, Name, Amount__c, UnitPrice__c, Producer__c, Description__c, Image__c, 
			SmallImage__c, Category__c, Category__r.Name 
			FROM Goods__c WHERE Id = :goodsOrder.GoodsId__c LIMIT 1
			];
			goods.get(0).Amount__c = goodsOrder.GoodsAmount__c;
			goodsResult.add(goods.get(0));
		}
		return goodsResult;
	}

	@AuraEnabled
	public static List<Order__c> getOrderByUserId(){
		List<Order__c> order = new List<Order__c>();
		order = [
		SELECT Id, OrderCost__c, UserId__c
		FROM Order__c WHERE UserId__c = :UserInfo.getUserId()
		];
		return order;
	}

	@AuraEnabled
	public static List<GoodsOrder__c> buyGoods(Id orderId){
		List<Order__c> order = [
		SELECT Id
		FROM Order__c WHERE Id = :orderId LIMIT 1
		];
		delete order;
		List<GoodsOrder__c> goodsOrders = [
		SELECT Id, GoodsAmount__c, GoodsId__c, CustomOrderId__c
		FROM GoodsOrder__c WHERE  CustomOrderId__c = :orderId
		];
		delete goodsOrders;
		//List<Order__c> orders = [
		//SELECT Id, OrderCost__c
		//FROM Order__c WHERE UserId__c = :UserInfo.getUserId() LIMIT 1
		//];
		List<GoodsOrder__c> goodsOrders = GoodsController.getGoodsInOrderByUserId();
		return goodsOrders;
	}


	@AuraEnabled
	public static Boolean sendEmailForUser(String name, String email, String phone, String comment, String address, Decimal orderCost){
		Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
		mail.setCharset('UTF-8');
		String[] toAddresses = new String[] {email};
		mail.setToAddresses(toAddresses);
		mail.setReplyTo('info@prosport.by');
		mail.setSenderDisplayName('PROSPORT');
		mail.setSubject('Интернет-магазин PROSPORT');
		if (address != null) {
			mail.setPlainTextBody('Здравствуйте, уважаемый ' + name + '! Вы заказали у нас товар на сумму = ' + 
				orderCost + 'р. Курьер в течение дня доставит заказ по адресу ' + address + '. Как прибудет, позвонит вам на номер: ' + phone);
		}
		else {
			mail.setPlainTextBody('Здравствуйте, уважаемый ' + name + '! Вы заказали у нас товар на сумму = ' + 
				orderCost + ' р. Чтобы забрать товар, приезжайте в наш магазин.');
		}
		Messaging.SendEmailResult[] results = Messaging.sendEmail(
			new Messaging.SingleEmailMessage[] { mail });
		Boolean sendResult = true;
		for (Messaging.SendEmailResult res : results) {
			if (res.isSuccess()) {
				System.debug('Email sent successfully');
			}
			else {
				sendResult = false;
				System.debug('The following errors occurred: ' + res.getErrors());                 
			}
		}
		return sendResult;
	}
}