sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/ui/model/json/JSONModel",
      "sap/ui/core/dnd/DragInfo",
      "sap/ui/core/dnd/DropInfo",
      "sap/f/dnd/GridDropInfo",
      "./../RevealGrid/RevealGrid",
      "sap/ui/core/library"
    ],
    function(Controller, JSONModel, DragInfo, DropInfo, GridDropInfo, RevealGrid, coreLibrary) {
      "use strict";
      	var DropLayout = coreLibrary.dnd.DropLayout;

	// shortcut for sap.ui.core.dnd.DropPosition
	var DropPosition = coreLibrary.dnd.DropPosition;
  
      return Controller.extend("app.project1.controller.Association", {
        
        onInit: function () {
          this.initData();
          this.attachDragAndDrop();
        },
    
        initData: function () {

          var oModel = this.getOwnerComponent().getModel("mainModel");
          var Model = this.getOwnerComponent().getModel("localModel");

          var JSONModel = new sap.ui.model.json.JSONModel([Model.getData()]);
          this.byId("grid1").setModel(JSONModel);





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
                      var oODataJSONModel = new sap.ui.model.json.JSONModel([data]);
                      console.log("patron",oODataJSONModel)
      
                      // Set the JSON model on the controls
                      this.byId("list1").setModel(oODataJSONModel);
                      console.log("aaaaaaaaaa",oODataJSONModel)
      
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
          var oBindingContext = oDraggedControl.getBindingContext() ;
          console.log("aaa",oBindingContext)
            var oData = oBindingContext.getModel().getProperty(oBindingContext.getPath());
            console.log("oData",oData)
    
          if (oDraggedControl.isA("sap.m.StandardListItem")) {
            return {
              rows: oData.rows,
              columns: oData.columns
            };
          }
        }, 
    
        onDrop: function (oInfo) {
         

          var oDragged = oInfo.getParameter("draggedControl");
           var oDropped = oInfo.getParameter("droppedControl"),
            sInsertPosition = oInfo.getParameter("dropPosition")
    
            var oDragContainer = oDragged.getParent();
           var oDropContainer = oInfo.getSource().getParent(),
    
            oDragModel = oDragContainer.getModel(),
            oDropModel = oDropContainer.getModel(),
            oDragModelData = oDragModel.getData(),
            oDropModelData = oDropModel.getData(),
    
            iDragPosition = oDragContainer.indexOfItem(oDragged),
            iDropPosition = oDropContainer.indexOfItem(oDropped);
            console.log("drag model",oDragModelData); 
            console.log("drop model",oDropModelData)
          
          // remove the item
          var oItem = oDragModelData[iDragPosition];
          oDragModelData.splice(iDragPosition, 1);
    
          if (oDragModel === oDropModel && iDragPosition < iDropPosition) {
            iDropPosition--;
          }
    
          if (sInsertPosition === "After") {
            iDropPosition++;
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
        }
      });
    }
  );
  