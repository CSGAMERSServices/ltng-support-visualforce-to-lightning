({
	/**
	 *  Initialization event
	 **/
    doInit : function(component, event, helper) {
        console.log( 'LNE_VisualforceContainer inited');
        
        var pageName=component.get('v.pageName');
        var recordId=component.get('v.recordId');
        var urlArguments=component.get('v.urlArguments');
        var guid = component.getGlobalId();
        
        var pageSrc=helper.getPageSrc(pageName, recordId, urlArguments, guid);
        component.set('v.src', pageSrc);
	},
    
    refreshPage : function(component) {
        var btn = component.find("refresh-button").getElement();
        if(btn) {
            btn.style.display = 'none';
        }
        
        var iFrameTarget = component.find( "targetFrame").getElement()
        iFrameTarget.src = iFrameTarget.src;
    },    
    
    /**
     *  Handler for when all associated scripts have finished loading
     **/
    handleScriptsLoaded: function( component, event, helper ){
        console.log( 'handleScripts loaded attempted' );
		//-- console.log( 'LNE_VisualforceContainer component finished loading all script/resources' );
		helper.onetimeSetup(component, helper);
    }
    
})