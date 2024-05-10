sap.ui.define(["sap/ui/core/mvc/Controller"],function(t){"use strict";return t.extend("appgenerator.controller.Generator",{onInit:function(){var t=this.getView().byId("input");var e=t.getItems();var a={resourceTypeGeneral:["Audiovisual","Collection","Dataset","Event","Image","InteractiveResource","Model","PhysicalObject","Service","Software","Sound","Text","Workflow","Other"],dateType:["Accepted","Available","Copyrighted","Collected","Created","Issued","Submitted","Updated","Valid"],funderIdentifierType:["Crossref Funder ID","GRID","ISNI","Other"],Type:["Boolean","Int32","Float","String"],Annotations:["@readonly","@mandatory","@assert.unique","@assert.integrity","@assert.target","@assert.notNull"]};var n=this.getView();function s(t){var e=t.getItems();e.forEach(function(t){if(t.getMetadata().getName()==="sap.m.Select"){var e=t.getName();var n=a[e];if(n){t.addItem(new sap.ui.core.Item({key:"",text:""}));n.forEach(function(e){t.addItem(new sap.ui.core.Item({key:e,text:e}))})}else{}}else if(t.getMetadata().getName()==="sap.m.VBox"){s(t)}})}t.attachBrowserEvent("livechange",this.onSelectChange,this);t.attachBrowserEvent("keyup",this.onKeyupInput1,this);s(t)},onKeyupInput:function(t){t.preventDefault();var e="http://datacite.org/schema/kernel-4";var a="http://schema.datacite.org/meta/kernel-4/metadata.xsd";var n=e+" "+a;var s='<?xml version="1.0" encoding="-UTF8"?>'+'<resource xmlns="'+e+'" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="'+n+'">'+this.br();var r=s;var i=this.getView().byId("input");i.getItems().forEach(function(t){if(t.hasStyleClass("section")){r+=this.process(t)}},this);r+=this.ct("resource");this.metadata=r;var o=this.getView().byId("outputTextArea");o.setValue(r);o.setVisible(true)},onSelectChange:function(t){t.preventDefault();this.onKeyupInput();this.onKeyupInput1()},process:function(t){var e=t.hasStyleClass("section");var a=0;var n="";if(e){a=1}var s=t.getItems();t.getItems().forEach(function(t){if(t.hasStyleClass("tag-group")){t.getItems().forEach(function(t){if(t.hasStyleClass("tag")){n+=this.processTag(t,a)}},this)}},this);if(n.length>0&&e){var r=t.getId()}return n},processTag:function(t,e){var a="";var n;var s;var r=t.getId();var i="";var i=r.split("--")[1].split("-")[0];var o=this.attribs(t);var u=t.getItems();if(u.length>0){s=u[0]}t.getItems().forEach(function(t){if(t.getMetadata().getName()==="sap.m.VBox"){a+=this.processTag(t,e+1)}},this);var g=t.hasStyleClass("no-closing-tag");if(!g){if(a.length>0){a=this.tab(e)+this.ota(i,o)+this.br()+a+this.tab(e)+this.ct(i)+this.br()}else{a=this.tab(e)+this.ota(i,o)+this.ct(i)+this.br()}}else if(g){if(a.length>0){a=this.tab(e)+this.ota1(i,o)}else{a=this.tab(e)+this.ota1(i,o)+"/>"+this.br()}}return a},attribs:function(t){var e="";var a=t.getItems();a.forEach(function(t){if(t.getMetadata().getName()==="sap.m.Input"){var a=t.getValue();var n=t.getName();if(a){if(e.length>0){e+=" "}e+=n+'="'+a+'"'}}else if(t.getMetadata().getName()==="sap.m.Select"){var s=t.getSelectedKey();var n=t.getName();if(s){if(e.length>0){e+=" "}e+=n+'="Edm.'+s+'"'}}});return e},tab:function(t){var e="";if(typeof t!=="undefined"){for(var a=1;a<=t;a+=1){e+="\t"}}else{e="\t"}return e},ota1:function(t,e){if(e&&e.length>0){return"<"+t+" "+e}else{return this.ot1(t)}},br:function(){return"\n"},ota:function(t,e){if(e&&e.length>0){return"<"+t+" "+e+">"}else{return this.ot1(t)}},ct:function(t){return"</"+t+">"},ot1:function(t){return"<"+t+" "},ot:function(t){return"<"+t+">"},ps:function(t,e){var a=t.getName();this.addOption(t,"","["+a+"]");for(var n=0;n<e.length;n++){this.addOption(t,e[n],e[n])}},addOption:function(t,e,a){t.addItem(new sap.ui.core.Item({key:e,text:a}))},onAddGroupPress:function(t){var e=t.getSource();var a=e.getParent().getParent();var n=a.clone();console.log(n.getId());this.resetInputValues(n);a.getParent().addItem(n)},onAddPress:function(t){var e=t.getSource();var a=e.getParent();console.log(a);var n=a.clone();this.resetInputValues(n);a.getParent().addItem(n)},resetAllInputs:function(t){if(t.getMetadata().getName()=="sap.m.TextArea"){t.setValue("")}t.getItems().forEach(function(t){if(t.getMetadata().getName()==="sap.m.Input"){t.setValue("")}else if(t.getMetadata().getName()==="sap.m.VBox"){this.resetAllInputs(t)}}.bind(this))},onResetInputsPress:function(){var t=this.getView(t).byId("input");this.resetAllInputs();var e=this.getView().byId("outputTextArea");this.resetAllInputs(e)},resetInputValues:function(t){t.getItems().forEach(function(t){if(t.getMetadata().getName()==="sap.m.Input"){t.setValue("")}else if(t.getMetadata().getName()==="sap.m.VBox"){this.resetInputValues(t)}}.bind(this))},onRemoveGroupPress:function(t){var e=t.getSource();var a=e.getParent().getParent();a.getParent().removeItem(a)},onRemoveTagPress:function(t){var e=t.getSource();var a=e.getParent();a.getParent().removeItem(a)},onSaveFilePress:function(){var t=this.byId("outputTextArea");var e=t.getValue();if(e){var a=new Blob([e],{type:"text/plain;charset=utf-8"});var n=document.createElement("a");n.href=window.URL.createObjectURL(a);n.download="filename.txt";n.click()}else{sap.m.MessageToast.show("No content to save.")}},onResetPress:function(){var t=this.getView().byId("Pageid");var e=t.getContent()},onKeyupInput1:function(t){t.preventDefault();var e=this.getView().byId("outputCDS");e.setValue("");var a=function(t){var a="";var n="";t.forEach(function(t){if(t.getMetadata().getName()==="sap.m.Input"&&t.hasStyleClass("tag-attribute")){if(t.getName()==="EntityName"){a=t.getValue();console.log("uiiio1")}}else if(t.getMetadata().getName()==="sap.m.VBox"){t.getItems().forEach(function(t){if(t.getMetadata().getName()==="sap.m.Input"&&t.hasStyleClass("tag-attribute")&&t.getName()==="FieldName"){n+="\t"+t.getValue()+" : "}else if(t.getMetadata().getName()==="sap.m.Select"&&t.hasStyleClass("tag-attribute")&&t.getName()==="Type"){console.log(t.getName());var e=t.getSelectedKey();n+=e}else if(t.getMetadata().getName()==="sap.m.Select"&&t.hasStyleClass("tag-attribute")&&t.getName()==="Annotations"){console.log(t.getName());var a=t.getSelectedKey();console.log(a);if(a=="@assert.notNull")n+="\t"+a+": false"+";\n";else{n+="\t"+a+";\n"}}})}});var s="entity "+a+" {\n"+"\tkey id : Integer;\n"+n+"}\n";var r=e.getValue();e.setValue(r+s)};var n=function(t){t.forEach(function(t){if(t.getMetadata().getName()==="sap.m.VBox"&&t.hasStyleClass("section")){console.log("test1");a(t.getItems());console.log("test2")}})};var s=this.getView().byId("input");n(s.getItems())},onCloneInputsPress:function(){var t=this.getView().byId("Entitygroup");var e=this.getView().byId("tag");var a=new sap.m.Input({value:""});a.attachLiveChange(this.onLiveChange,this);var n=new sap.m.Input({value:""});n.attachLiveChange(this.onLiveChange,this);t.addItem(a);e.addItem(n)}})});