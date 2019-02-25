/* globals LightningSafeNavigation, PostMessageOffice */
({
    /**
     *  Setup that should only run once.
     **/
    onetimeSetup: function( component, helper){
        //-- only setup an event listener once for this component.
        helper.log( 'indepdendent post message listener one time setup attempted' );
        
        var didRun=false;
        
        if( component.get('v.setupComplete') === false ){
            helper.log( 'init and code all loaded' );
            
            //-- this will only run once
            helper.setupPostMessageListeners(component, helper);
            
            component.set('v.setupComplete', true);
            didRun=true;
        }
        
        helper.log( 'onetimeSetup completed' );
        return( didRun );
    },
    
    /**
     *  Determines whether this component is the target
     *  of the postMessage.
     *  (Explicitly through postMessage.data.auraId)
     *  @param component (LightningComponent)
     *  @param helper (Helper)
     *  @param postMessage (PostMessageEnvelope - v2)
     *  @return (Boolean) - whether this is the target (true) or not (false)
     **/
    isPostMessageTarget: function( component, helper, myPostMessage ){
        var expectedAuraId = component.get( 'v.respondingAuraId' );
        if( myPostMessage && myPostMessage.data && myPostMessage.data.auraId ){
            //-- aura id was sent
            if( myPostMessage.data.auraId !== expectedAuraId ){
                return( false );
            }
        }
        return( true );
    },

    /**
     * Echo the post message received with this as the aura id.
     * @param originalPostMessage
     */
    echoPostMessage : function(component, helper, originalPostMessage) {
        if (!originalPostMessage) {
            return;
        }

        //-- set the aura id to the current component
        var updatedData = originalPostMessage.data;
        if (!updatedData) {
            updatedData = {};
        }
        updatedData.auraId = component.getGlobalId();
        originalPostMessage.data = updatedData;

        //-- dispatch on the current window
        originalPostMessage.dispatch(window);
    },

    /**
     * Checks if the component dispatched the post message
     * @param component {*}
     * @param helper {*}
     * @param currentPostMessage - PostMessageEnvelope
     * @return (Boolean) - whether this component dispatched this component (echoed)
     */
    isEchoedMessage : function(component, helper, postMessage) {
        var thisAuraId = component.getGlobalId();
        var postMessageAuraId = null;
        if (postMessage &&
            ((typeof postMessage.data) != 'undefined') &&
            ((typeof postMessage.data.auraId) != 'undefined')
        ) {
            postMessageAuraId = postMessage.data.auraId;
        }
        var isEchoedMessage = (postMessageAuraId === thisAuraId);
        
        if (isEchoedMessage) {
            helper.log('Default handler detected echoed message');
        }

        return isEchoedMessage;
    },
    
    /**
     * Sets up the listners for visualforce notifications.
     **/
    setupPostMessageListeners: function(component, helper){
        
        this.postOffice = new PostMessageOffice(this);
        
        //-- handle the save complete
        this.postOffice.addTypeHandler( 'saveComplete', $A.getCallback(function( myPostMessage ){
            if( helper.isPostMessageTarget( component, helper, myPostMessage ) ){
                $A.get('e.force:refreshView').fire();
            }
        }));

        //-- handle opening a new tab
        this.postOffice.addTypeHandler( 'openTab', $A.getCallback(function( myPostMessage ){
            helper.log('openTab');
			if( helper.isPostMessageTarget( component, helper, myPostMessage ) ){
                var workspace = component.find('workspace');
                myPostMessage.data.workspace = workspace;
                if (typeof LightningSafeNavigation != 'undefined') {
                    LightningSafeNavigation.navigate(myPostMessage.data);
                } else {
                    window.open(myPostMessage.data.url, '_blank');
                }
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
            if( typeof myPostMessage.data.auraMessageType !== 'undefined' &&
               myPostMessage.data.auraMessageType
            ){
                //-- now notify visualforce pages.
                helper.log( "VF Event registered in lightning" );

                if( helper.isPostMessageTarget( component, helper, myPostMessage ) ){
                    // var auraMessageData = {} || myPostMessage.data.auraMessageData;
                    // console.log( 'Aura message:' + myPostMessage.data.auraMessageType );
                    // console.log( 'Aura data:' ); console.log( myPostMessage.data.auraMessageData );
                    
                    //debugger;
                    var appEvent = $A.get( myPostMessage.data.auraMessageType );
                    appEvent.setParams(myPostMessage.data.auraMessageData);
                    appEvent.fire();
                }
            }
        }));
        
        this.postOffice.listenForPostEvents(window);
    },
  
    log : function(msg){console.log.apply(this, arguments);}, // eslint-disable-line
    warn : function(msg){console.warn.apply(this, arguments);}, // eslint-disable-line
    error : function(msg){console.error.apply(this, arguments);}, // eslint-disable-line
    noop : function(){}
})