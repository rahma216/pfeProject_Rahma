sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'tt/project8/test/integration/FirstJourney',
		'tt/project8/test/integration/pages/EntityList',
		'tt/project8/test/integration/pages/EntityObjectPage'
    ],
    function(JourneyRunner, opaJourney, EntityList, EntityObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('tt/project8') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheEntityList: EntityList,
					onTheEntityObjectPage: EntityObjectPage
                }
            },
            opaJourney.run
        );
    }
);