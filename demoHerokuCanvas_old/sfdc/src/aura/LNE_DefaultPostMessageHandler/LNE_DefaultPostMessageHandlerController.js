({
	/**
	 *  Initialization event
	 **/
    doInit : function(component, event, helper) {
        //console.log( 'DefaultPostMessageHandler starting to init');
        
        var recordId=component.get('v.recordId');
        var guid = component.getGlobalId();
        
        console.log( 'DefaultPostMessageHandler ignited')
	}, 
    
    /**
     *  Handler for when all associated scripts have finished loading
     **/
    handleScriptsLoaded: function( component, event, helper ){
        console.log( 'DefaultPostMessageHandler loaded attempted' );
		//-- console.log( 'DefaultPostMessageHandler component finished loading all script/resources' );
		helper.onetimeSetup(component, helper);
    }
})