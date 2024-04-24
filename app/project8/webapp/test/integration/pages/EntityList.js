sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'tt.project8',
            componentId: 'EntityList',
            contextPath: '/Entity'
        },
        CustomPageDefinitions
    );
});