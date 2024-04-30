sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("appgenerator.controller.Generator", {
            onInit: function () {









                // Récupérer tous les champs des VBox
                // var oVBox = this.getView().byId("input");
                //var ovboxMetadata = oVBox.getMetadata();
                //var oVBoxItems = oVBox.getItems();
                //console.log(ovboxMetadata);
                // console.log(oVBoxItems);
                // var xml = " ";

                // Parcourir tous les champs et attacher l'événement liveChange


                //oVBoxItems.forEach(function (oField) {
                // Vérifier si l'élément est de classe "section"
                //if (oField.getMetadata().getName() === "sap.m.VBox") {
                // Attacher l'événement liveChange
                //  console.log("vbox has id", oField.getId());
                //    xml += this.process(oField)
                //  }
                //}, this);
                //console.log(xml);

                //var oOutputTextArea = this.getView().byId("outputTextArea");
                //oOutputTextArea.setValue(xml);



                var inputVBox = this.getView().byId("input");
                var vboxitems = inputVBox.getItems();
                var optionValues = {
                    "resourceTypeGeneral": ["Audiovisual", "Collection", "Dataset", "Event", "Image", "InteractiveResource", "Model", "PhysicalObject", "Service", "Software", "Sound", "Text", "Workflow", "Other"],
                    "dateType": ["Accepted", "Available", "Copyrighted", "Collected", "Created", "Issued", "Submitted", "Updated", "Valid"],
                    "funderIdentifierType": ["Crossref Funder ID", "GRID", "ISNI", "Other"],
                    "Type": ["Boolean", "Int32", "Float", "String",],
                    "Annotations":["@readonly","@mandatory","@assert.unique","@assert.integrity","@assert.target","@assert.notNull",		]

                };
                var oView = this.getView();
                // console.log(oView)



                // Define a function to recursively search for Select controls and add options
                function findAndPopulateSelectControls(container) {
                    var items = container.getItems();
                    items.forEach(function (item) {
                        if (item.getMetadata().getName() === "sap.m.Select") {
                            var name = item.getName();
                            var options = optionValues[name];
                            if (options) {
                                item.addItem(new sap.ui.core.Item({
                                    key: "",
                                    text: ""
                                }));
                                options.forEach(function (option) {
                                    item.addItem(new sap.ui.core.Item({
                                        key: option,
                                        text: option
                                    }));
                                });
                                //console.log("Options added to Select control:", name);
                            } else {
                                // console.log("No options found for Select control:", name);
                            }



                        } else if (item.getMetadata().getName() === "sap.m.VBox") {
                            // Recursively call the function for nested VBox
                            findAndPopulateSelectControls(item);
                        }
                    });
                }



                //inputVBox.attachBrowserEvent("keyup", this.onKeyupInput, this);
                inputVBox.attachBrowserEvent("livechange", this.onSelectChange, this);
                inputVBox.attachBrowserEvent("keyup", this.onKeyupInput1, this);



                findAndPopulateSelectControls(inputVBox);








            },


            onKeyupInput: function (event) {
                event.preventDefault();
                var kernelNamespace = "http://datacite.org/schema/kernel-4";
                var kernelSchema = "http://schema.datacite.org/meta/kernel-4/metadata.xsd";
                var kernelSchemaLocation = kernelNamespace + " " + kernelSchema;
                var header = "<?xml version=\"1.0\" encoding=\"-UTF8\"?>" + "<resource xmlns=\"" + kernelNamespace + "\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"" + kernelSchemaLocation + "\">" + this.br();
                var xml = header;
                var inputVBox = this.getView().byId("input"); // Récupérer l'élément VBox spécifique

                inputVBox.getItems().forEach(function (item) {
                    if (item.hasStyleClass("section")) {
                        xml += this.process(item); // Utiliser la fonction process pour chaque section dans l'élément VBox
                    }
                }, this);

                xml += this.ct("resource"); // Ajouter la balise de fermeture pour la ressource
                this.metadata = xml;

                // Mettre à jour le texte dans la section droite
                var rightCode = this.getView().byId("outputTextArea");
                rightCode.setValue(xml);
                rightCode.setVisible(true);

                // Afficher la section droite
                //var rightPanel = this.getView().byId("rightPanel");
                //rightPanel.setVisible(true);
            },
            onSelectChange: function (event) {
                //console.log("selectchange")
                event.preventDefault();
                this.onKeyupInput();
                this.onKeyupInput1() ; 
            },

            process: function (section) {
                var isWrapper = section.hasStyleClass("section");
                var indent = 0;
                var xml = "";
                // console.log(section.getId()) ; 


                // console.log(isWrapper) ; 
                //console.log("aaa")

                if (isWrapper) {
                    indent = 1;

                }
                //console.log(indent)
                var secItems = section.getItems();
                //console.log(secItems);

                section.getItems().forEach(function (item) {
                    if (item.hasStyleClass("tag-group")) {
                        //console.log(item.getId()) ;
                        item.getItems().forEach(function (tag) {
                            if (tag.hasStyleClass("tag")) {
                                xml += this.processTag(tag, indent);
                            }
                        }, this);
                    }
                }, this);

                if (xml.length > 0 && isWrapper) {
                    var wrapperName = section.getId();
                    //xml = this.ot(wrapperName) + this.br() + xml + this.ct(wrapperName) + this.br()
                }

                // console.log(xml) ; 

                return xml;
            },
            processTag: function (tag, indent) {
                var xml = "";
                var attributes;
                var value;
                var fullId = tag.getId();

                var tagName = "";
                //var idParts = tag.getId().split("--");
                //tagName = idParts[idParts.length - 1]; 
                var tagName = fullId.split('--')[1].split('-')[0]; // extrait 'Property'

                var attr = this.attribs(tag); // Définissez vos attributs selon les besoins
                var tagValues = tag.getItems(); // Obtenez les éléments enfants du contrôle
                //console.log(tagValues) ; 


                //Récupérez la valeur du tag s'il existe
                if (tagValues.length > 0) {
                    value = tagValues[0]; // Supposons que le premier élément contient la valeur
                }

                // Parcourez les enfants du tag et générez leur XML
                tag.getItems().forEach(function (childControl) {
                    // Vérifiez si l'enfant est un autre contrôle
                    if (childControl.getMetadata().getName() === "sap.m.VBox") {
                        // Si c'est le cas, appelez récursivement processTag pour traiter l'enfant
                        xml += this.processTag(childControl, indent + 1);
                    }
                }, this);
                // console.log("le contenu de xml est", xml)

                var hasNoClosingTag = tag.hasStyleClass("no-closing-tag"); // Vérifiez si le tag doit être auto-fermé
                //console.log(hasNoClosingTag);
                // console.log(xml)

                if (!hasNoClosingTag) {
                    if (xml.length > 0) {
                        // Balise régulière avec balises d'ouverture et de fermeture
                        xml = this.tab(indent) + this.ota(tagName, attr) + this.br() + xml + this.tab(indent) + this.ct(tagName) + this.br();
                    } else {
                        // Tag avec une valeur ou autorisé à être vide
                        xml = this.tab(indent) + this.ota(tagName, attr) + this.ct(tagName) + this.br();
                    }
                } else if (hasNoClosingTag) {
                    if (xml.length > 0) {
                        xml = this.tab(indent) + this.ota1(tagName, attr);
                    } else {
                        xml = this.tab(indent) + this.ota1(tagName, attr) + "/>" + this.br();
                    }
                }


                return xml;
            },
            attribs: function (element) {
                var attribs = "";
                var children = element.getItems(); // Obtenez les enfants du contrôle
                children.forEach(function (child) {
                    if (child.getMetadata().getName() === "sap.m.Input") {
                        var value = child.getValue(); // Obtenez la valeur du contrôle
                        var n = child.getName(); // Supposons que le titre du contrôle est son nom
                        if (value) {
                            if (attribs.length > 0) {
                                attribs += " ";
                            }
                            attribs += n + "=\"" + value + "\"";
                        }
                    } else if (child.getMetadata().getName() === "sap.m.Select") {
                        var selectedKey = child.getSelectedKey(); // Obtenez la clé sélectionnée du Select
                        var n = child.getName(); // Supposons que le titre du contrôle est son nom
                        if (selectedKey) {
                            if (attribs.length > 0) {
                                attribs += " ";
                            }
                            attribs += n + "=\"Edm." + selectedKey + "\"";
                        }
                    }
                });
                return attribs;
            },
            tab: function (number) {
                var tabs = "";
                if (typeof number !== "undefined") {
                    for (var i = 1; i <= number; i += 1) {
                        tabs += "\t";
                    }
                } else {
                    tabs = "\t";
                }
                return tabs;
            },
            ota1: function (tag, attr) {
                if (attr && attr.length > 0) {
                    return "<" + tag + " " + attr;
                } else {
                    return this.ot1(tag);
                }
            },
            br: function () {
                return "\n";
            },
            ota: function (tag, attr) {
                if (attr && attr.length > 0) {
                    return "<" + tag + " " + attr + ">";
                } else {
                    return this.ot1(tag);
                }
            },
            ct: function (tag) {
                return "</" + tag + ">";
            },
            ot1: function (tag) {
                return "<" + tag + " ";
            },
            ot: function (tag) {
                return "<" + tag + ">";
            },

            ps: function (select, optionValues) {
                var title = select.getName(); // Récupérer le titre de l'élément select
                this.addOption(select, "", "[" + title + "]"); // Ajouter une option vide avec le titre entre crochets

                // Parcourir le tableau d'options et les ajouter à l'élément select
                for (var i = 0; i < optionValues.length; i++) {
                    this.addOption(select, optionValues[i], optionValues[i]);
                }
            },

            addOption: function (select, key, text) {
                // Créer et ajouter une option à l'élément select
                select.addItem(new sap.ui.core.Item({ key: key, text: text }));
            },
            
            onAddGroupPress: function (event) {
                var button = event.getSource(); // Get the button that was clicked
                var parentVBox = button.getParent().getParent(); // Get the parent VBox containing the button

                // Clone the parent VBox
                var newVBox = parentVBox.clone();
                console.log(newVBox.getId())


                // Reset values of input fields in the cloned VBox
                this.resetInputValues(newVBox);
               

                // Add the cloned VBox below the original one
                parentVBox.getParent().addItem(newVBox);

                // Log the successful addition of the new group
                //console.log("New group added successfully.");
            },
            onAddPress: function (event) {
                var button = event.getSource(); // Get the button that was clicked
                var parentVBox = button.getParent()
                console.log(parentVBox)
                // Clone the input field
                var newVBox = parentVBox.clone();
            
                // Reset the value of the cloned input field
                //newInput.setValue("");
            
                // Add the cloned input field below the original one
                this.resetInputValues(newVBox);
               // console.log(newVBox.getParent())

                parentVBox.getParent().addItem(newVBox);
            
                // Log the successful addition of the new input
               // console.log("New input added successfully.");
            },
            
            resetAllInputs: function (container) {
                if (container.getMetadata().getName() == "sap.m.TextArea") {
                    container.setValue("");
                }
                container.getItems().forEach(function (item) {
                    if (item.getMetadata().getName() === "sap.m.Input") {
                        item.setValue(""); // Set value of Input to ""
                    } else if (item.getMetadata().getName() === "sap.m.VBox") {
                        this.resetAllInputs(item); // Recursively call for nested VBox
                    }


                }.bind(this));
            },

            onResetInputsPress: function () {
                var container = this.getView(container).byId("input");
                //console.log(container.getItems())
                this.resetAllInputs();

                var text = this.getView().byId("outputTextArea");
                this.resetAllInputs(text);
            },

            resetInputValues: function (container) {
                container.getItems().forEach(function (item) {
                    if (item.getMetadata().getName() === "sap.m.Input") {
                        item.setValue("");
                    } else if (item.getMetadata().getName() === "sap.m.VBox") {
                        this.resetInputValues(item);
                    }
                }.bind(this));
            },

            onRemoveGroupPress: function (event) {
                var button = event.getSource(); // Get the button that was clicked
                var parentVBox = button.getParent().getParent(); // Get the parent VBox containing the button

                // Remove the parent VBox from its container
                parentVBox.getParent().removeItem(parentVBox);

                // Log the successful removal of the group
                // console.log("Group removed successfully.");
            },
            onRemoveTagPress: function (event) {
                var button = event.getSource(); // Get the button that was clicked
                var parentVBox = button.getParent(); // Get the parent VBox containing the button

                // Remove the parent VBox from its container
                parentVBox.getParent().removeItem(parentVBox);

                // Log the successful removal of the group
                // console.log("Group removed successfully.");
            },


            onSaveFilePress: function () {
                var textArea = this.byId("outputTextArea");
                var textContent = textArea.getValue();

                if (textContent) {
                    var blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
                    var downloadLink = document.createElement("a");
                    downloadLink.href = window.URL.createObjectURL(blob);
                    downloadLink.download = "filename.txt";
                    downloadLink.click();
                } else {
                    sap.m.MessageToast.show("No content to save.");
                }
            },
            onResetPress: function () {
                var oPanel = this.getView().byId("Pageid");
                var aContent = oPanel.getContent();
                //console.log(aContent)
                // var metadata=oPanel.getMetadata() ; 
                //console.log(metadata)
                //oPanel.removeAllContent();

                // Réinitialisez le contenu du Panel ici
            },
            onKeyupInput1: function (event) {
                event.preventDefault();
                var outputTextArea = this.getView().byId("outputCDS");
                outputTextArea.setValue(""); // Clear previous content
                
                // Function to recursively traverse nested VBoxes within a section VBox
                var traverseNestedItems = function(nestedItems) {
                    var entityName = "";
                    var properties = "";
            
                    nestedItems.forEach(function(nestedItem) {
                        if (nestedItem.getMetadata().getName() === "sap.m.Input" && nestedItem.hasStyleClass("tag-attribute")) {
                            // Assuming 'EntityName' is the name of the input field for the entity name
                            if (nestedItem.getName() === "EntityName") {
                                entityName = nestedItem.getValue(); // Assign entityName from input value
                                console.log("uiiio1");
                            }
                        } else if (nestedItem.getMetadata().getName() === "sap.m.VBox") {
                            nestedItem.getItems().forEach(function(childItem) {
                                if (childItem.getMetadata().getName() === "sap.m.Input" && childItem.hasStyleClass("tag-attribute") && childItem.getName() === "FieldName") {
                                    properties += "\t" + childItem.getValue() + " : ";
                                } else if (childItem.getMetadata().getName() === "sap.m.Select" && childItem.hasStyleClass("tag-attribute") && childItem.getName() === "Type"  ) {
                                    console.log(childItem.getName())
                                    var selectedType = childItem.getSelectedKey();
                                    properties += selectedType  ;
                                }
                                else if (childItem.getMetadata().getName() === "sap.m.Select" && childItem.hasStyleClass("tag-attribute") && childItem.getName() === "Annotations" ) {
                                    console.log(childItem.getName())
                                    var selectedAnnotation = childItem.getSelectedKey();
                                    console.log(selectedAnnotation)
                                    if (selectedAnnotation== "@assert.notNull")
                                    properties +="\t"+ selectedAnnotation + ": false" + ";\n" ;
                                    else {
                                        properties +="\t"+ selectedAnnotation  + ";\n" ;


                                    }
                                }

                            });
                        }}
                    );
            
                    // Construct the CDS entity definition based on the input values
                    var cdsEntity = "entity " + entityName + " {\n" +
                                    "\tkey id : Integer;\n" + // Assuming 'id' is always a key field
                                    properties +
                                    "}\n";
            
                    // Append the generated CDS entity definition to the output TextArea
                    var currentValue = outputTextArea.getValue();
                    outputTextArea.setValue(currentValue + cdsEntity);
                };
            
                // Function to traverse through VBoxes with class "section" and create entities
                var traverseSectionVBoxes = function(items) {
                    items.forEach(function(item) {
                        if (item.getMetadata().getName() === "sap.m.VBox" && item.hasStyleClass("section")) {
                            console.log("test1")
                            traverseNestedItems(item.getItems());
                             // Create entity for each VBox with class "section"
                             console.log("test2")
                        }
                    });
                    
                };
        
                // Start traversal from the main VBox containing entities
                var mainVBox = this.getView().byId("input");
                traverseSectionVBoxes(mainVBox.getItems());
            },
            
           
            
            onCloneInputsPress: function () {
                // Get the VBox containing the input fields
                var oEntitygroupVBox = this.getView().byId("Entitygroup");
                var oTagVBox = this.getView().byId("tag");

                // Create new Input controls
                var oNewEntitygroupInput = new sap.m.Input({
                    value: "" // Set initial value as needed
                });
                oNewEntitygroupInput.attachLiveChange(this.onLiveChange, this);

                var oNewTagInput = new sap.m.Input({
                    value: "" // Set initial value as needed
                });
                oNewTagInput.attachLiveChange(this.onLiveChange, this);

                // Add the new inputs to the VBoxes
                oEntitygroupVBox.addItem(oNewEntitygroupInput);
                oTagVBox.addItem(oNewTagInput);
            },



        });
    });
