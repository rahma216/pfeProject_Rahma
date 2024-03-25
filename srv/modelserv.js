const cds = require('@sap/cds');
const fs = require('fs');

module.exports = cds.service.impl((srv) => {
    srv.on('appendTextToFile', async (req) => {
        try {
            const data = await srv.read('Entity');
            const filePath = '/home/user/projects/App_Generator/aa.js'; // Provide the path to your file
            console.log(data)
           const formattedData = JSON.stringify(data);

            // Append text to the file
            fs.appendFileSync(filePath, formattedData);

            console.log('Data written to file successfully.');
            return { success: true };
        } catch (error) {
            console.error('Error writing data to file:', error);
            return { success: false };
        }
    });
    srv.after('CREATE', 'Entity', async (entityData, req) => {
      try {
          // Récupérez les données de l'entité créée
          const formattedData = JSON.stringify(entityData);

          const { name, fields } = formattedData;

          // Créez les champs associés pour l'entité
          const createdFields = await createAssociatedFields(name, fields);

          // Retournez les champs créés
          return createdFields;
      } catch (error) {
          console.error('Erreur lors de la création des champs associés:', error);
          throw error;
      }
  });
});
async function createAssociatedFields(entityName, requestData) {
  const createdFields = [];
  try {
      // Assurez-vous que requestData est défini et qu'il contient les propriétés attendues
      if (requestData && requestData.fields) {
          const fieldsData = requestData.fields;

          for (const fieldData of fieldsData) {
              // Vérifiez si fieldData est défini et contient les propriétés attendues
              if (fieldData && 'value' in fieldData && 'type' in fieldData) {
                  // Créez un enregistrement Field associé pour chaque champ
                  const createdField = await cds.run(INSERT.into('Field').entries({
                      value: fieldData.value,
                      type: fieldData.type,
                      fld: { name: entityName } // Utilisez le nom de l'entité parente pour l'association
                  }));
                  createdFields.push(createdField);
              } else {
                  console.error('Erreur: fieldData n\'est pas défini ou ne contient pas les propriétés \'value\' et \'type\'');
                  throw new Error('Erreur: fieldData n\'est pas défini ou ne contient pas les propriétés \'value\' et \'type\'');
              }
          }
      } else {
          console.error('Erreur: requestData n\'est pas défini ou ne contient pas la propriété \'fields\'');
          throw new Error('Erreur: requestData n\'est pas défini ou ne contient pas la propriété \'fields\'');
      }

      return createdFields;
  } catch (error) {
      console.error('Erreur lors de la création des champs associés:', error);
      throw error;
  }
}




