sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'tt.project8',
            componentId: 'EntityObjectPage',
            contextPath: '/Entity'
        },
        CustomPageDefinitions
    );
});