({
    /**
     *  Setup that should only run once.
     **/
    onetimeSetup: function( component, helper){
        //-- only setup an event listener once for this component.
        console.log( 'indepdendent post message listener one time setup attempted' );
        
        var didRun=false;
        
        if( component.get('v.setupComplete') === false ){
            console.log( 'init and code all loaded' );
            
            //-- this will only run once
            helper.setupPostMessageListeners(component, helper);
            
            component.set('v.setupComplete',true);
            didRun=true;
        }
        
        console.log( 'onetimeSetup completed' );
        return( didRun );
    },
    
    /**
     *  Determines whether this component is the target
     *  of the postMessage.
     *  (Explicitly through postMessage.data.auraId)
     *  @param component (LightningComponent)
     *  @param helper (Helper)
     *  @param postMessage (LNE_PostMessage - v2)
     *  @return (Boolean) - whether this is the target (true) or not (false)
     **/
    isPostMessageTarget: function( component, helper, myPostMessage ){
        var expectedAuraId = component.get( 'v.respondingAuraId' );
        if( myPostMessage && myPostMessage.data && myPostMessage.data.auraId ){
            //-- aura id was sent
            if( myPostMessage.data.auraId === expectedAuraId ){
                return( true );
            }
        }
        return( false );
    },
    
    /**
     * Sets up the listners for visualforce notifications.
     **/
    setupPostMessageListeners: function(component, helper){
        
        this.postOffice = new LNE_MessagePostOffice(this);
        
        //-- handle the save complete
        this.postOffice.addTypeHandler( 'saveComplete', $A.getCallback(function( myPostMessage ){
            if( helper.isPostMessageTarget( component, helper, myPostMessage ) ){
                $A.get('e.force:refreshView').fire();
            }
        }));

        //-- handle opening a new tab
        this.postOffice.addTypeHandler( 'openTab', $A.getCallback(function( myPostMessage ){
			if( helper.isPostMessageTarget( component, helper, myPostMessage ) ){
               window.open(myPostMessage.data.src, '_blank');
            }
        }));

        //-- toasts
        this.postOffice.addTypeHandler( 'toast', $A.getCallback(function( myPostMessage ){
			if( helper.isPostMessageTarget( component, helper, myPostMessage ) ){
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title: myPostMessage.data.title,
                    message: myPostMessage.data.message
                });
                toastEvent.fire();
            }

        }));
        
        //-- handle any unknown types of events
        this.postOffice.addTypeHandler( null, $A.getCallback(function( myPostMessage ){
            //-- now notify visualforce pages.
            console.log( "YAY, vf event in lightning" );
            
            if( typeof myPostMessage.data.auraMessageType !== 'undefined' &&
               myPostMessage.data.auraMessageType
            ){
                
                if( helper.isPostMessageTarget( component, helper, myPostMessage ) ){
                    var auraMessageData = {} || myPostMessage.data.auraMessageData;
                    //console.log( 'Aura message:' + myPostMessage.data.auraMessageType );
                    //console.log( 'Aura data:' ); console.log( myPostMessage.data.auraMessageData );
                    
                    //debugger;
                    var appEvent = $A.get( myPostMessage.data.auraMessageType );
                    appEvent.setParams(myPostMessage.data.auraMessageData);
                    appEvent.fire();
                }
            }
        }));
        
        this.postOffice.listenForPostEvents(window);
    }
})