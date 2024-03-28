sap.ui.define(
  [
      "sap/ui/core/mvc/Controller",
      "sap/f/library"

  ],
  function(BaseController,fioriLibrary) {
    "use strict";

    return BaseController.extend("app.project1.controller.Fields", {
      onInit :function()
      {
        var actions = {"Actions" : [
          {key: 0, type: "String"},
          {key: 1, type: "int"},
          {key: 2, type: "boolean"},
          {key: 3, type: "float"}
        ]};
        
        var oModel = new sap.ui.model.json.JSONModel(actions);
        this.getView().setModel(oModel, "actions");
        var oModel = this.getView().getModel("selectedEntityModel");
        this.getView().setModel(oModel, "selectedEntityModel");
      
      },
    
      onEditToggleButtonPress: function() {

    var oObjectPage = this.getView().byId("ObjectPageLayout"),
      bCurrentShowFooterState = oObjectPage.getShowFooter();

    oObjectPage.setShowFooter(!bCurrentShowFooterState);
  },
      onSupplierPress: function () {
    var oFCL = this.oView.getParent().getParent();

    oFCL.setLayout(fioriLibrary.LayoutType.ThreeColumnsMidExpanded);
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
handleClose: function () {
  var Model = this.getOwnerComponent().getModel("localModel");
  Model.setProperty("/layout", "OneColumn");
this.oRouter.navTo("RouteList");
},
















    });
  }
);