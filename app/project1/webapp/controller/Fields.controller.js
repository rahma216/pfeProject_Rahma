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
      
      },
    
      onEditToggleButtonPress: function() {

          console.log("en mode edit ")
    var oObjectPage = this.getView().byId("ObjectPageLayout"),
      bCurrentShowFooterState = oObjectPage.getShowFooter();

    oObjectPage.setShowFooter(!bCurrentShowFooterState);
  },
      onSupplierPress: function () {
          console.log("chay mafama")
    var oFCL = this.oView.getParent().getParent();

    oFCL.setLayout(fioriLibrary.LayoutType.ThreeColumnsMidExpanded);
  },
  onCloneInputField: function (event) {
    // 1. Get the button that triggered the event and its parent container
    var button = event.getSource();
    var parentContainer = button.getParent();
    console.log(parentContainer.getMetadata())

    // 2. Clone the input field
    var originalInputField = this.getView().byId("fields"); // Assuming the input field has an ID "field"
    var clonedInputField = originalInputField.clone();
    var parentVBox = this.getView().byId("parentvbox")



    // 3. Optionally reset the value of the cloned input field
    // clonedInputField.setValue("");

    // 4. Add the cloned input field to the parent container
    parentVBox.addItem(clonedInputField);



},
















    });
  }
);