sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/f/library"

    ],
    function (BaseController, fioriLibrary) {
        "use strict";

        return BaseController.extend("app.project1.controller.Fields", {
            onInit: function () {
                var actions = {
                    "Actions": [
                        { key: 0, type: "String" },
                        { key: 1, type: "int" },
                        { key: 2, type: "boolean" },
                        { key: 3, type: "float" }
                    ]
                };
                var oViewModel = new sap.ui.model.json.JSONModel({
                    showTable: false // Initially set to false to hide the table
                });
                this.getView().setModel(oViewModel, "viewModel");
              
                var oModel = new sap.ui.model.json.JSONModel(actions);
                this.getView().setModel(oModel, "actions");
                var oModel = this.getView().getModel("selectedEntityModel");
                this.getView().setModel(oModel, "selectedEntityModel");

                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("Details").attachPatternMatched(this._onFieldsMatched, this);

            },
            _onFieldsMatched: function (oEvent) {
                this.index = oEvent.getParameter("arguments").index || "0";
                this.getView().bindElement({
                    path: "/Entity/" + this.index,
                    model: "mainModel"
                });
            },

            onEditToggleButtonPress: function () {

                var oObjectPage = this.getView().byId("ObjectPageLayout"),
                    bCurrentShowFooterState = oObjectPage.getShowFooter();

                oObjectPage.setShowFooter(!bCurrentShowFooterState);
            },
            onSupplierPress: function () {
                var Model = this.getOwnerComponent().getModel("localModel");
                Model.setProperty("/layout", "ThreeColumnsMidExpanded");

            },
            onCloneInputField: function (event) {
                var button = event.getSource();
                var parentContainer = button.getParent();
                console.log(parentContainer.getMetadata())

                var originalInputField = this.getView().byId("fields"); // Assuming the input field has an ID "field"
                var clonedInputField = originalInputField.clone();
                var parentVBox = this.getView().byId("parentvbox")



                parentVBox.addItem(clonedInputField);



            },



            onCreate2: function () {
                var sID = this.byId("fldd").getText();


                var oModel = this.getView().getModel("mainModel");
                var sUrl = oModel.sServiceUrl + "/Entity";
                /*  var oViewModel = this.getView().getModel("viewModel");
               
                 // Toggle the showTable property
                 var bShowTable = oViewModel.getProperty("/showTable");
                 oViewModel.setProperty("/showTable", !bShowTable);
                */


                if (oModel) {
                    console.log("Main model found");
                    fetch(sUrl)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            console.log("Data:", data);
                            if (data && data.value && Array.isArray(data.value)) {

                                const entities = data.value;


                                const entityWithID = entities.find(entity => entity.ID === sID);
                                if (entityWithID) {
                                    console.log("Entity with ID :", entityWithID);

                                    const oEntity = entityWithID;
                                    console.log("aaaaa", oEntity)
                                    const oList2 = this.getView().byId("table1");
                                    const oBinding2 = oList2.getBinding("items");


                                    const oContext = oBinding2.create({
                                        "ID": this.byId("fieldid").getValue(),
                                        "value": this.byId("field").getValue(),
                                        "type": this.byId("idComboBoxSuccess").getValue(),
                                        "fld": oEntity
                                    });


                                    /* 
                                            var oFilter = new sap.ui.model.Filter({
                                                path: "fld_ID", // Le chemin du champ à filtrer
                                                operator: sap.ui.model.FilterOperator.EQ, // Opérateur de comparaison
                                                value1: sID // La valeur de filtrage
                                            });
                                    
                                            oBinding2.filter(oFilter); */


                                } else {
                                    console.log("Entity with ID " + sID + " not found");
                                }
                            } else {
                                console.error("Invalid data format:", data);
                            }
                        })
                        .catch(error => {
                            console.error("Error:", error);
                        });
                } else {


                    console.error("Main model not found");
                }


            },
            onShowTablePress: function () {
                // Get the view model
                var oViewModel = this.getView().getModel("viewModel");

                // Toggle the showTable property
                var bShowTable = oViewModel.getProperty("/showTable");
                oViewModel.setProperty("/showTable", !bShowTable);

                var oModel = this.getView().getModel("mainModel");
                var sUrl1 = oModel.sServiceUrl + "/Entity";
                var sUrl2 = oModel.sServiceUrl + "/Field";

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
                                    const oView0 = this.getView();
                                    const oModel0 = new sap.ui.model.json.JSONModel();
                                    oModel0.setData({ entityData: entityDataa });
                                    oView0.setModel(oModel0);

                                    // Fetch association data
                                    /*  fetch(sUrl3)
                                         .then(response => {
                                             if (!response.ok) {
                                                 throw new Error('Network response was not ok');
                                             }
                                             return response.json();
                                         })
                                         .then(associations => {
                                             console.log("Associations:", associations);
               
               
                                             // Set the generated CDS entities to the view model or do other operations
                                             const oView0 = this.getView();
                                             const oModel0 = new sap.ui.model.json.JSONModel();
                                             oModel0.setData({ entityData: entityDataa });
                                             oView0.setModel(oModel0);
                                             const fileName = 'entityData.json';
                                             const filePath = './controller/' + fileName;
                                             // Call generateCDSEntities here
                                             const cdsEntities = this.generateCDSEntities(entityData.value, fields.value, associations.value);
                                             console.log(cdsEntities);
                                         })
                                         .catch(error => {
                                             console.error("Error retrieving associations:", error);
                                         });  */

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

            onOpenAddDialog2: function () {
                this.getView().byId("OpenDialog2").open();

            },
            formatFieldsValue: function (fields) {
                if (Array.isArray(fields)) {
                    return fields.map(field => field.value).join(', '); // Concatenate values with comma separator
                } else {
                    return '';
                }
            },

            handleClose: function () {
                var Model = this.getOwnerComponent().getModel("localModel");
                Model.setProperty("/layout", "OneColumn");
                this.getOwnerComponent().getRouter().navTo("Listview");
            },
        });
    },




);