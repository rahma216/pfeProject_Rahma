sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'tt/projectrahma/test/integration/FirstJourney',
		'tt/projectrahma/test/integration/pages/EntityList',
		'tt/projectrahma/test/integration/pages/EntityObjectPage'
    ],
    function(JourneyRunner, opaJourney, EntityList, EntityObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('tt/projectrahma') + '/index.html'
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