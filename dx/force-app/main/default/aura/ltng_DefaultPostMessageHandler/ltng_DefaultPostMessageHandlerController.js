({
	/**
	 *  Initialization event
	 **/
    doInit : function(component, event, helper) {
        //-- the record id of the current record we are on
        // var recordId=component.get('v.recordId');
        //-- the unique id of this instance of the component
        // var guid = component.getGlobalId();
        //-- the type of this component
        // var luid = component.getLocalId();
        
        helper.log( 'DefaultPostMessageHandler ignited');
	},
    
    /**
     *  Handler for when all associated scripts have finished loading
     **/
    handleScriptsLoaded: function( component, event, helper ){
        helper.log( 'DefaultPostMessageHandler loaded attempted' );
		//-- console.log( 'DefaultPostMessageHandler component finished loading all script/resources' );
		helper.onetimeSetup(component, helper);
    }
})