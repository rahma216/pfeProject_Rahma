const cds = require('@sap/cds');

module.exports = cds.service.impl((srv) => {
  srv.on('CREATE', 'createEntity', async (req) => {
    const { entry } = req.data;
    const result = await cds.transaction(req).run(() => {
      return INSERT.into(Entity).entries(entry);
    });
    return result;
  });
});
