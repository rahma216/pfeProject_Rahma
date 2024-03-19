sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/f/library"

    ],
    function(BaseController,fioriLibrary) {
      "use strict";
  
      return BaseController.extend("app.project1.controller.Fields", {
      
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
		}
      });
    }
  );