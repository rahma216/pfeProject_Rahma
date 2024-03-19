namespace models;


using {
        managed,
        cuid,


} from '@sap/cds/common';


type FieldType : String enum {
  boolean;
  int;
  float;
  string
}


entity Field : cuid, managed {
   key ID       : Integer;
    value : String;
    fld : Association to many Entity;
    type: FieldType;
}


entity Entity : cuid, managed {
    key ID       : Integer;
    name : String;
    fields : Association to many Field
                     on fields.fld = $self;


}
 
/*entity Association : cuid, managed{
  key ID       : Integer;
  name: String(255);


  sourceEntity: Association to Entity;
  targetEntity: Association to Entity;


  multiplicity: Int16;
}*/