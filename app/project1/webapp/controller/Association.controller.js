sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/dnd/DragInfo",
    "sap/ui/core/dnd/DropInfo",
    "sap/f/dnd/GridDropInfo",
    "./../RevealGrid/RevealGrid",
    "sap/ui/core/library",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"


  ],
  function (Controller, JSONModel, DragInfo, DropInfo, GridDropInfo, RevealGrid, coreLibrary, Fragment, Filter, FilterOperator,MessageBox) {
    "use strict";
    var DropLayout = coreLibrary.dnd.DropLayout;

    // shortcut for sap.ui.core.dnd.DropPosition
    var DropPosition = coreLibrary.dnd.DropPosition;

    return Controller.extend("app.project1.controller.Association", {

      onInit: function () {
        this.base = this.getOwnerComponent();
       


        // Assurez-vous que this.base et this.base.getEditFlow sont définis
        if (!this.base || !this.base.getEditFlow) {
            console.error("Base or getEditFlow is undefined.");
        }
        this.initData();
        this.attachDragAndDrop();
        var AssociationType = {
          "Type": [
            { key: 0, type: "ManyToMany " },
            { key: 1, type: "ManyToOne " },
            { key: 2, type: "OneToOne" },
          ]
        };
        var oModel = new sap.ui.model.json.JSONModel(AssociationType);
        this.getView().setModel(oModel, "AssociationType");
      },

      initData: function () {
        var oModel = this.getOwnerComponent().getModel("mainModel");

        var oJSONModel = new sap.ui.model.json.JSONModel();
        oJSONModel.setData({
          "id": "",
          "name": ""
        });
        this.byId("grid1").setModel(oJSONModel);



        console.log(oModel)

        var sUrl1 = oModel.sServiceUrl + "/Entity";

        if (oModel) {
          console.log("Main model found");

          // Fetch entity data
          fetch(sUrl1)
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(data => {
              // Create a JSON model containing the fetched data
              var oODataJSONModel = new sap.ui.model.json.JSONModel();
              oODataJSONModel.setData(data.value);

              console.log("patron", oODataJSONModel);

              // Set the JSON model on the controls
              this.byId("list1").setModel(oODataJSONModel);
              console.log("aaaaaaaaaa", oODataJSONModel);

            })
            .catch(error => {
              // Handle errors in fetching data
              console.error('Error fetching data:', error);
            });
        }
      },



      onRevealGrid: function () {
        RevealGrid.toggle("grid1", this.getView());
      },

      onExit: function () {
        RevealGrid.destroy("grid1", this.getView());
      },

      attachDragAndDrop: function () {
        var oList = this.byId("list1");
        oList.addDragDropConfig(new DragInfo({
          sourceAggregation: "items"
        }));

        oList.addDragDropConfig(new DropInfo({
          targetAggregation: "items",
          dropPosition: DropPosition.Between,
          dropLayout: DropLayout.Vertical,
          drop: this.onDrop.bind(this)
        }));

        var oGrid = this.byId("grid1");
        oGrid.addDragDropConfig(new DragInfo({
          sourceAggregation: "items"
        }));

        oGrid.addDragDropConfig(new GridDropInfo({
          targetAggregation: "items",
          dropPosition: DropPosition.Between,
          dropLayout: DropLayout.Horizontal,
          dropIndicatorSize: this.onDropIndicatorSize.bind(this),
          drop: this.onDrop.bind(this)
        }));
      },

      onDropIndicatorSize: function (oDraggedControl) {
        var oBindingContext = oDraggedControl.getBindingContext();
        console.log("aaa", oBindingContext);
        var oData = oBindingContext.getModel().getProperty(oBindingContext.getPath());
        console.log("oData", oData);

        // Check if the dragged control is a StandardListItem
        if (oDraggedControl.isA("sap.m.StandardListItem")) {
          // Check if the oData object contains rows and columns properties
          if (oData) {
            return {
              rows: 2,
              columns: 3
            };
          } else {
            // Handle the case when rows and columns properties are not found
            console.error("Rows and/or columns properties not found in the data object.");
          }
        }
      },


      onDrop: function (oInfo) {
        var oDragged = oInfo.getParameter("draggedControl");
        var oDropped = oInfo.getParameter("droppedControl");
        var sInsertPosition = oInfo.getParameter("dropPosition");

        var oDragContainer = oDragged.getParent();
        var oDropContainer = oInfo.getSource().getParent();

        var oDragModel = oDragContainer.getModel();
        var oDropModel = oDropContainer.getModel();

        var oDragModelData = oDragModel.getData();
        var oDropModelData = oDropModel.getData();

        var iDragPosition = oDragContainer.indexOfItem(oDragged);
        var iDropPosition = oDropContainer.indexOfItem(oDropped);

        console.log("drag model", oDragModelData);
        console.log("drop model", oDropModelData);

        // remove the item
        var oItem = oDragModelData[iDragPosition];
        oDragModelData.splice(iDragPosition, 1);

        /*  if (oDragModel === oDropModel && iDragPosition < iDropPosition) {
             iDropPosition--;
         }
     
         if (sInsertPosition === "After") {
             iDropPosition++;
         } */

        // Ensure oDropModelData is an array
        if (!Array.isArray(oDropModelData)) {
          oDropModelData = [];
        }

        // insert the control in target aggregation
        oDropModelData.splice(iDropPosition, 0, oItem);

        if (oDragModel !== oDropModel) {
          oDragModel.setData(oDragModelData);
          oDropModel.setData(oDropModelData);
        } else {
          oDropModel.setData(oDropModelData);
        }

        this.byId("grid1").focusItem(iDropPosition);
        var grid = this.getView().byId("grid1");
        this.logGridContent(grid);
      },
      logGridContent: function(grid) {
        this.table=[];
        var items = grid.getItems();
        items.forEach(function(item) {
          var title = item.getHeader().getTitle();
   
          this.table.push(title);
        }.bind(this));
      },
      generateCDSModel: function() {
        var cdsModel = "service modelsService {\n";
        this.table.forEach(function(entity) {
            cdsModel += "\n\tentity models_" + entity + " as projection on models." + entity + ";";
        });
      
      
        cdsModel += "\n}";
      
      
        console.log("Generated CDS Model:", cdsModel);
        this.onAppendTextToFilePress(cdsModel) ;  
      },
      onOpenAddDialog: function () {
        this.getView().byId("OpenDialog").open();
      },
      onCancelDialog: function (oEvent) {
        oEvent.getSource().getParent().close();
      },
      onValueHelpRequest: function (oEvent) {
        var sInput = oEvent.getSource();
        var sInputValue = oEvent.getSource().getValue(),
          oView = this.getView();

        if (!this._pValueHelpDialog) {
          this._pValueHelpDialog = Fragment.load({
            id: oView.getId(),
            name: "app.project1.view.ValueHelpDialog",
            controller: this
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }
        this._pValueHelpDialog.then(function (oDialog) {
          // Create a filter for the binding
          oDialog.getBinding("items").filter([new Filter("name", FilterOperator.Contains, sInputValue)]);
          // Open ValueHelpDialog filtered by the input's value
          oDialog.open(sInputValue);
        });
      },

      onValueHelpDialogSearch: function (oEvent) {
        var sValue = oEvent.getParameter("value");
        var oFilter = new Filter("name", FilterOperator.Contains, sValue);

        oEvent.getSource().getBinding("items").filter([oFilter]);
      },

      onValueHelpDialogClose: function (oEvent) {
        var sDescription,
          oSelectedItem = oEvent.getParameter("selectedItem");
        oEvent.getSource().getBinding("items").filter([]);

        if (!oSelectedItem) {
          return;
        }


        sDescription = oSelectedItem.getDescription();
        this.byId("sourceInput").setValue(sDescription);







      },

      onSuggestionItemSelected: function (oEvent) {
        var oItem = oEvent.getParameter("selectedItem");
        var oText = oItem ? oItem.getKey() : "";


        this.byId("selectedKeyIndicator").setText(oText);
      },
      onValueHelpRequest1: function (oEvent) {
        var sInputValue = oEvent.getSource().getValue(),
          oView = this.getView();

        if (!this._pValueHelpDialog1) {
          this._pValueHelpDialog1 = Fragment.load({
            id: oView.getId(),
            name: "app.project1.view.ValueHelp",
            controller: this
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }
        this._pValueHelpDialog1.then(function (oDialog) {
          // Create a filter for the binding
          oDialog.getBinding("items").filter([new Filter("name", FilterOperator.Contains, sInputValue)]);
          // Open ValueHelpDialog filtered by the input's value
          oDialog.open(sInputValue);
        });
      },

      onValueHelpDialogSearch1: function (oEvent) {
        var sValue = oEvent.getParameter("value");
        var oFilter = new Filter("name", FilterOperator.Contains, sValue);

        oEvent.getSource().getBinding("items").filter([oFilter]);
      },

      onValueHelpDialogClose1: function (oEvent) {
        var sDescription,
          oSelectedItem = oEvent.getParameter("selectedItem");
        oEvent.getSource().getBinding("items").filter([]);

        if (!oSelectedItem) {
          return;
        }


        sDescription = oSelectedItem.getDescription();
        this.byId("targetInput").setValue(sDescription);








      },

      onSuggestionItemSelected1: function (oEvent) {
        var oItem = oEvent.getParameter("selectedItem");
        var oText = oItem ? oItem.getKey() : "";


        this.byId("selectedKeyIndicator").setText(oText);
      },
      onCreate: function() {
        var oModel = this.getView().getModel("mainModel");
        var input1 = this.getView().byId("sourceInput").getValue();
        var input2 = this.getView().byId("targetInput").getValue();
        var type = this.getView().byId("associationtype").getValue();
        var sUrl1 = oModel.sServiceUrl + "/Entity";
        var entity1 = {};
        var entity2 = {};
        if (oModel) {
            fetch(sUrl1)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(entityData => {
                    console.log("Entity Data:", entityData);
                    const entities = entityData.value;
                    entities.forEach(element => {
                        console.log("aaaaaaaaaaaaaaaaaaaaaaa", element.name)
                        if (element.name == input1) {
                            entity1 = element;
                        }
                        if (element.name == input2) {
                            entity2 = element;
                        }
                        
                    } );
                    // Vérifier si les entités source et cible sont identiques
                    if (entity1 === entity2) {
                        this.showSameEntityConfirmationPopup();
                    } else {
                        var oBindList = oModel.bindList("/Association");
                        oBindList.create({
                            entitySource: entity1,
                            entityTarget: entity2,
                            type: type
                        });
                    }
                })
                .catch(error => {
                    console.error("Error retrieving entities:", error);
                });
        } else {
            console.error("Model 'mainModel' is not defined or accessible in the view.");
        }
    },
    
    showSameEntityConfirmationPopup: function() {
      var that = this;
      var dialog = sap.m.MessageBox.show(
          "You have selected the same entity for both the source and target entities. Please select different entities",
          {
              icon: sap.m.MessageBox.Icon.WARNING,
              title: "Confirmation",
              actions: [sap.m.MessageBox.Action.OK],
              onClose: function(oAction) {
                  if (oAction === sap.m.MessageBox.Action.OK) {
                      // L'utilisateur a choisi de continuer, rien à faire ici
                  }
              }
          }
      );
  
      // Désactiver le bouton "OK" après l'affichage de la boîte de dialogue
      dialog.getBeginButton().setEnabled(false);
  },
  OnCdsgen: function () {
   
    var oModel = this.getView().getModel("mainModel");
    var sUrl1 = oModel.sServiceUrl + "/Entity";
    var sUrl2 = oModel.sServiceUrl + "/Field";
    var sUrl3 = oModel.sServiceUrl + "/Association"; // URL to fetch associations
    
    if (oModel) {
    console.log("Main model found");
    
    // Fetch entity data
    fetch(sUrl1)
    .then(response => {
    if (!response.ok) {
    throw new Error('Network response was not ok');
    }
    return response.json();
    })
    .then(entityData => {
    console.log("Entity Data:", entityData);
    
    const entities = entityData.value;
    // Fetch field data
    fetch(sUrl2)
    .then(response => {
    if (!response.ok) {
    throw new Error('Network response was not ok');
    }
    return response.json();
    })
    .then(fields => {
    console.log("Fields:", fields);
    const entityDataa = [];
    
    // Associez les champs aux entités
    entities.forEach(entity => {
    const entityFields = fields.value.filter(field => field.fld_ID === entity.ID);
    
    // Ajoutez les données de l'entité avec ses champs associés au tableau
    entityDataa.push({
    ID: entity.ID,
    name: entity.name,
    fields: entityFields
    });
    });
    
    // Fetch association data
    fetch(sUrl3)
    .then(response => {
    if (!response.ok) {
    throw new Error('Network response was not ok');
    }
    return response.json();
    
    })
    .then(associations => {
    console.log("Associations:", associations);
    
   

    const cdsEntities = this.generateCDSEntities(entityData.value, fields.value,
    
    associations.value);

    
    })
    .catch(error => {
    console.error("Error retrieving associations:", error);
    });
    
    // Process entity and field data
    // Set the entity data to the view model or do other operations
    })
    .catch(error => {
    console.error("Error retrieving fields:", error);
    });
    })
    .catch(error => {
    console.error("Error retrieving entities:", error);
    });
    } else {
    console.error("Main model not found");
    }
    
    },
    generateCDSEntities: function (entityData, fieldsData, associationsData) {
      const cdsEntities = [];
      
      for (const entity of entityData) {
      const entityName = entity.name;
      const entityFields = fieldsData.filter(field => field.fld_ID === entity.ID);
      
      let cdsEntity = `entity ${entityName} {`;
      
      // Process fields
      for (const field of entityFields) {
        if(field.annotations== null)
        {
          let fieldString = `\n\t${field.value}: ${field.type} `;
          if (field.iskey) {
          fieldString = `\n\tkey ${field.value}: ${field.type} `;
          }
          cdsEntity += fieldString + ';';
        }
        else {
          let fieldString = `\n\t${field.value}: ${field.type} ${field.annotations}`;
      if (field.iskey) {
      fieldString = `\n\tkey ${field.value}: ${field.type} ${field.annotations}`;
      }
      cdsEntity += fieldString + ';';
        }
      
      }
      
      const entityAssociations = associationsData.filter(association =>
      association.entitySource_ID === entity.ID || association.entityTarget_ID === entity.ID
      );
      var ismanytomany = false;
      
      for (const association of entityAssociations) {
      const isManyToOne = association.type === 'ManyToOne';
      const isOneToOne = association.type === 'OneToOne';
      const isManyToMany = association.type === 'ManyToMany';
      const isSourceEntity = association.entitySource_ID === entity.ID;
      const isTargetEntity = association.entityTarget_ID === entity.ID;
      
      if (isManyToOne && isTargetEntity) {
      const sourceEntity = entityData.find(e => e.ID === association.entitySource_ID);
      if (sourceEntity) {
      cdsEntity += `\n\tfld : Association to ${sourceEntity.name};`;
      }
      }
      
      if (isManyToOne && isSourceEntity) {
      const targetEntity = entityData.find(e => e.ID === association.entityTarget_ID);
      if (targetEntity) {
      cdsEntity += `\n\t${targetEntity.name}s : Association to many ${targetEntity.name}`;
      
      cdsEntity += `\n\t on ${targetEntity.name}s.fld = $self;`;
      }
      }
      if (isOneToOne && isSourceEntity) {
      const targetEntity = entityData.find(e => e.ID === association.entityTarget_ID);
      if (targetEntity) {
      var st= targetEntity.name;
      cdsEntity += `\n\t${st.substring(0, 4)} : Association to many ${targetEntity.name}`;
      
      }
      }
      
      if (isManyToMany && isSourceEntity) {
      ismanytomany = true;
      const sourceEntity = entityData.find(e => e.ID === association.entitySource_ID);
      const targetEntity = entityData.find(e => e.ID === association.entityTarget_ID);
      
      var str1 = sourceEntity.name;
      var str2 = targetEntity.name;
      var ch1 = str1.substring(0, 3);
      var ch2 = str2.substring(0, 3);
      var newname =ch1 + "2" + ch2;
      
      if (targetEntity) {
      cdsEntity += `\n\t${targetEntity.name}s : Association to many ${newname}`;
      cdsEntity += `\n\t on ${targetEntity.name}s.${ch1} = $self;`;
      }
      }
      }
      
      if (ismanytomany === true) {
      
      cdsEntity += `\n}\n`;
      cdsEntity += `entity ${newname} {
      \n\tkey ${ch1} : Association to ${str1};
      \n\tkey ${ch2} : Association to ${str2};
      \n}\n`;
      
      }
      else {
      cdsEntity += `\n}\n`;
      }
      cdsEntities.push(cdsEntity);
      }
      this.onAppendTextToFilePress(cdsEntities.join(''))

      
      return cdsEntities.join('');
      },
      onAppendTextToFilePress: function(data) {
     
       
        fetch("/odata/v4/models/appendTextToFile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content:  data }) // Pass the variable in the request body
        })
        .then(response => response.json())
        .then(data1 => {
            console.log("Action invoked successfully:", data1);
        })
        .catch(error => {
            console.error("Error invoking action:", error);
        });
        
    }
,

    
     

 


  




  });
  }
  

);
