sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'project2/test/integration/FirstJourney',
		'project2/test/integration/pages/EntityList',
		'project2/test/integration/pages/EntityObjectPage'
    ],
    function(JourneyRunner, opaJourney, EntityList, EntityObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('project2') + '/index.html'
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