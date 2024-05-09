using models from '../db/models.cds'; 
service modelsService {

	entity Customer as projection on models.Customer;
	entity Product as projection on models.Product;
	entity Order as projection on models.Order;
}
