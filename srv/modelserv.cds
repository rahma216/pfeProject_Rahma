using models from '../db/src/schema.cds';
service modelsService{


  entity Entity as projection on models.Entity;
    

    entity Field as projection on models.Field;





}