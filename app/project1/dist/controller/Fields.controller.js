sap.ui.define(["sap/ui/core/mvc/Controller","sap/f/library","sap/m/MessageToast","sap/ui/core/Fragment","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageBox"],function(e,t,o,n,i,a,s){"use strict";return e.extend("app.project1.controller.Fields",{onInit:function(){var e={Actions:[{key:0,type:"String"},{key:1,type:"int"},{key:2,type:"boolean"},{key:3,type:"float"}]};var t={Annotations:[{key:0,name:"@readonly"},{key:1,name:"@mandatory"},{key:2,name:"@assert.unique"},{key:3,name:"@assert.integrity"},{key:3,name:"@assert.integrity"},{key:3,name:"@assert.notNull"}]};var o=new sap.ui.model.json.JSONModel({showTable:false});var n={Type:[{key:0,type:"ManyToMany"},{key:1,type:"ManyToOne"},{key:2,type:"OneToOne"}]};var i=new sap.ui.model.json.JSONModel(n);this.getView().setModel(i,"AssociationType");this.getView().setModel(o,"viewModel");var i=new sap.ui.model.json.JSONModel(e);this.getView().setModel(i,"actions");var i=new sap.ui.model.json.JSONModel(t);this.getView().setModel(i,"annotations");var i=this.getView().getModel("selectedEntityModel");this.getView().setModel(i,"selectedEntityModel");this.oRouter=this.getOwnerComponent().getRouter();this.oRouter.getRoute("Details").attachPatternMatched(this._onFieldsMatched,this)},_onFieldsMatched:function(e){this.index=e.getParameter("arguments").index||"0";this.getView().bindElement({path:"/Entity/"+this.index,model:"mainModel"})},onEditToggleButtonPress:function(){var e=this.getView().byId("ObjectPageLayout"),t=e.getShowFooter();e.setShowFooter(!t)},onSupplierPress:function(){var e=this.getOwnerComponent().getModel("localModel");this.getOwnerComponent().getRouter().navTo("Association");e.setProperty("/layout","ThreeColumnsEndExpanded")},onCloneInputField:function(e){var t=e.getSource();var o=t.getParent();console.log(o.getMetadata());var n=this.getView().byId("fields");var i=n.clone();var a=this.getView().byId("parentvbox");a.addItem(i)},onCancelDialog:function(e){e.getSource().getParent().close()},onCreate2:function(){var e=this.byId("fldd").getText();var t=this.getView().getModel("mainModel");var o=t.sServiceUrl+"/Entity";console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbb",this.getView().byId("annotations").mProperties.selectedKeys);var n=this.getView().byId("annotations").mProperties.selectedKeys;var i=n.join(" ");console.log("a7la annotation",i);var a=this.byId("key").getValue();var s;if(a.toLowerCase()==="true"){s=true}else if(a.toLowerCase()==="false"){s=false}else{console.error("Invalid input. Cannot convert to boolean.")}if(t){console.log("Main model found");fetch(o).then(e=>{if(!e.ok){throw new Error("Network response was not ok")}return e.json()}).then(t=>{console.log("Data:",t);if(t&&t.value&&Array.isArray(t.value)){const r=t.value;const l=r.find(t=>t.ID===e);if(l){console.log("Entity with ID :",l);const e=l;console.log("aaaaa",e);const t=this.getView().byId("table1");const r=t.getBinding("items");const d=r.create({ID:this.byId("fieldid").getValue(),value:this.byId("field").getValue(),type:this.byId("idComboBoxSuccess").getValue(),fld:e,annotations:i,iskey:s});var o=this.getView(),n=[o.byId("fieldid"),o.byId("field"),o.byId("idComboBoxSuccess"),,o.byId("key")];n.forEach(e=>{e.setValue("")});var a=this.getView().byId("annotations");a.setSelectedKeys([])}else{console.log("Entity with ID "+e+" not found")}}else{console.error("Invalid data format:",t)}}).catch(e=>{console.error("Error:",e)})}else{console.error("Main model not found")}},onShowTablePress:function(){var e=this.getView().getModel("viewModel");var t=e.getProperty("/showTable");e.setProperty("/showTable",!t);var o=this.getView().getModel("mainModel");var n=o.sServiceUrl+"/Entity";var i=o.sServiceUrl+"/Field";if(o){console.log("Main model found");fetch(n).then(e=>{if(!e.ok){throw new Error("Network response was not ok")}return e.json()}).then(e=>{console.log("Entity Data:",e);const t=e.value;fetch(i).then(e=>{if(!e.ok){throw new Error("Network response was not ok")}return e.json()}).then(e=>{console.log("Fields:",e);const o=[];t.forEach(t=>{const n=e.value.filter(e=>e.fld_ID===t.ID);o.push({ID:t.ID,name:t.name,fields:n})});const n=this.getView();const i=new sap.ui.model.json.JSONModel;i.setData({entityData:o});n.setModel(i)}).catch(e=>{console.error("Error retrieving fields:",e)})}).catch(e=>{console.error("Error retrieving entities:",e)})}else{console.error("Main model not found")}},onUpdate:function(){var e=this.getView().byId("table1").getSelectedItem();if(e){var t=e.getBindingContext("mainModel");if(t){var n=this.getView().byId("iskey").getValue();var i=this.getView().byId("value").getValue();var a=this.getView().byId("idComboBoxupdate").getValue();var s=this.getView().byId("idComboBoxupdate").mProperties.selectedKeys;var r;if(n.toLowerCase()==="true"){r=true}else if(n.toLowerCase()==="false"){r=false}else{console.error("Invalid input. Cannot convert to boolean.")}t.setProperty("iskey",r);t.setProperty("value",i);t.setProperty("type",a);var l=this.getView().getModel("mainModel");l.submitBatch("yourGroupId").then(function(){o.show("Update successful")}).catch(function(e){o.show("Update failed: "+e.message)})}else{o.show("Invalid Field")}}else{o.show("Please select a row to update")}},onDelete:function(){var e=this.byId("table1").getSelectedItem();if(e){var t=e.getBindingContext("mainModel").getObject();e.getBindingContext("mainModel").delete("$auto").then(function(){o.show(t+" SuccessFully Deleted")}.bind(this),function(e){o.show("Deletion Error: ",e)})}else{o.show("Please Select a Row to Delete")}},onOpenAddDialog2:function(){this.getView().byId("OpenDialog2").open()},formatFieldsValue:function(e){if(Array.isArray(e)){return e.map(e=>e.value).join(", ")}else{return""}},handleClose:function(){var e=this.getOwnerComponent().getModel("localModel");e.setProperty("/layout","OneColumn");this.getOwnerComponent().getRouter().navTo("Listview")},onCreate:function(){var e=this.getView().getModel("mainModel");var t=this.getView().byId("sourceInput").getValue();var o=this.getView().byId("targetInput").getValue();var n=this.getView().byId("associationtype").getValue();var i=e.sServiceUrl+"/Entity";var a=e.sServiceUrl+"/Association";var s={};var r={};if(e){fetch(i).then(e=>{if(!e.ok){throw new Error("Network response was not ok")}return e.json()}).then(i=>{const l=i.value;l.forEach(e=>{if(e.name==t){s=e}if(e.name==o){r=e}});if(s===r){var d=this.getView(),c=[d.byId("targetInput"),d.byId("associationtype")];c.forEach(e=>{e.setValue("")});this.showSameEntityConfirmationPopup()}else{fetch(a).then(e=>{if(!e.ok){throw new Error("Network response was not ok")}return e.json()}).then(t=>{const o=t.value;let i=false;o.forEach(e=>{console.log(e);if(e.entitySource_ID===s.ID&&e.entityTarget_ID===r.ID||e.entityTarget_ID===s&&e.entitySource_ID===r){i=true}});if(i){console.log("Association already exists between the entities.");d=[l.byId("targetInput"),l.byId("associationtype")];d.forEach(e=>{e.setValue("")})}else{console.log("No existing association found. Ready to create a new one.");var a=e.bindList("/Association");a.create({entitySource:s,entityTarget:r,type:n});var l=this.getView(),d=[l.byId("targetInput"),l.byId("associationtype")];d.forEach(e=>{e.setValue("")})}}).catch(e=>{console.error(e)})}}).catch(e=>{console.error("Error retrieving entities:",e)})}else{console.error("Model 'mainModel' is not defined or accessible in the view.")}},onSuggestionItemSelected:function(e){var t=e.getParameter("selectedItem");var o=t?t.getKey():"";this.byId("selectedKeyIndicator").setText(o)},onSuggestionItemSelected1:function(e){var t=e.getParameter("selectedItem");var o=t?t.getKey():"";this.byId("selectedKeyIndicator").setText(o)},onValueHelpRequest:function(e){var t=e.getSource();var o=e.getSource().getValue(),s=this.getView();if(!this._pValueHelpDialog){this._pValueHelpDialog=n.load({id:s.getId(),name:"app.project1.view.ValueHelpDialog",controller:this}).then(function(e){s.addDependent(e);return e})}this._pValueHelpDialog.then(function(e){e.getBinding("items").filter([new i("name",a.Contains,o)]);e.open(o)})},onValueHelpDialogSearch:function(e){var t=e.getParameter("value");var o=new i("name",a.Contains,t);e.getSource().getBinding("items").filter([o])},onValueHelpDialogClose:function(e){var t,o=e.getParameter("selectedItem");e.getSource().getBinding("items").filter([]);if(!o){return}t=o.getDescription();this.byId("sourceInput").setValue(t)},onValueHelpRequest1:function(e){var t=e.getSource().getValue(),o=this.getView();if(!this._pValueHelpDialog1){this._pValueHelpDialog1=n.load({id:o.getId(),name:"app.project1.view.ValueHelp",controller:this}).then(function(e){o.addDependent(e);return e})}this._pValueHelpDialog1.then(function(e){e.getBinding("items").filter([new i("name",a.Contains,t)]);e.open(t)})},onValueHelpDialogSearch1:function(e){var t=e.getParameter("value");var o=new i("name",a.Contains,t);e.getSource().getBinding("items").filter([o])},onValueHelpDialogClose1:function(e){var t,o=e.getParameter("selectedItem");e.getSource().getBinding("items").filter([]);if(!o){return}t=o.getDescription();this.byId("targetInput").setValue(t)},showSameEntityConfirmationPopup:function(){var e=this;var t=sap.m.MessageBox.show("You have selected the same entity for both the source and target entities. Please select different entities",{icon:sap.m.MessageBox.Icon.WARNING,title:"Confirmation",actions:[sap.m.MessageBox.Action.OK],onClose:function(e){if(e===sap.m.MessageBox.Action.OK){}}});t.getBeginButton().setEnabled(false)}})});