onOpenAddDialog: function () {
    var oModel = this.getView().getModel("mainModel");
    var oDialog = this.getView().byId("mainDialog").open();
    var oModela = new sap.ui.model.json.JSONModel();
    var aTableData = this.table;
    console.log(this.table)
    var sUrl1 = oModel.sServiceUrl + "/Entity";
    var sUrl2 = oModel.sServiceUrl + "/Association";

    var entity1 = {};
    var entity2 = {};
    var table4=[];
    if (oModel) {
        fetch(sUrl1)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(entityData => {
                const entities = entityData.value;
                var table3=[];
                i=0;
                entities.forEach(elm=>{
                    if (elm.name==this.table[i] && i<this.table.length){
                        table3.push(elm);
                        i=i+1;

                    }


                });
               
                    fetch(sUrl2)  // Ensure sUrl2 is correctly formatted to access the Association entity set
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            const associations = data.value;
                            associations.forEach(element => {
                                table3.forEach(t=>{
                                    if (element.entityTarget_ID === t.ID) {
                                        table4.push(elment.name)
                               
                                    }

                                }


                                )
                          
                             

                         
                               

                            });
                            var aEntityData = table4.map(function(sItem) {
                                return {
                                  name: sItem,
                            
                            
                                };
                              });
                            
                            
                              // Set the data to the model
                              oModela.setData({ Entity: aEntityData });
                              console.log(oModela)
                              oDialog.setModel(oModela, "rahmaModel");
                            

               
                        })
                        .catch(error => {
                            console.error("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj", error);
                        });



                
            })
            .catch(error => {
                console.error("Error retrieving entities:", error);
            });
    } else {
        console.error("Model 'mainModel' is not defined or accessible in the view.");
    }
},



onOpenAddDialog: function () {
    var oDialog = this.getView().byId("mainDialog").open();
    var oModela = new sap.ui.model.json.JSONModel();
    var aTableData = this.table;
    console.log(this.table)
  
    var aEntityData = table4.map(function(sItem) {
      return {
        name: sItem,
  
  
      };
    });
  
  
    // Set the data to the model
    oModela.setData({ Entity: aEntityData });
    console.log(oModela)
    oDialog.setModel(oModela, "rahmaModel");
  
  
  
  },