/* globals PostMessageOffice */
({
    /**
     *  Determines the SRC address for the Visualforce page.
     *  @param pageName (String) - name of the visualforce page to load
     *  @param recordid (String) - Salesforce id of the record.
     *  @param urlArguments (String) - additional URL arguments to send
     *  @param auraId (String) - the Aura id of this particular visualforce component.
     */
    getPageSrc : function(pageName, recordId, urlArguments, auraId){
        var pageSrc='';
        
        //-- calculate the target page src/address.
        if( pageName ){
            pageSrc='/apex/'+pageName+"?auraId=" + auraId;
            if( recordId ){
                pageSrc+='&Id='+recordId;
            }
            if( urlArguments ){
                pageSrc+='&'+urlArguments;
            }
        }
        
        return( pageSrc );
    },
    
    /**
     *  Setup that should only run once.
     **/
    onetimeSetup: function( component, helper){
        //-- only setup an event listener once for this component.
        helper.log( 'VisualForceContainer onetimeSetup' );
        
        var didRun=false;
        
        if( component.get('v.setupComplete') === false ){
            helper.log( 'init and code all loaded' );
            
            //-- this will only run once
            helper.setupPostMessageListeners(component, helper);
            
            component.set('v.setupComplete', true);
            didRun=true;
        }
        
        return( didRun );
    },

    matchesPostMessageAuraId : function(component, helper, myPostMessage) {
        return(
            myPostMessage.data.auraId &&
            myPostMessage.data.auraId === component.getGlobalId()
        );
    },
    
    /**
     * Sets up the listners for visualforce notifications.
     **/
    setupPostMessageListeners: function(component, helper){
        
        this.postOffice = new PostMessageOffice(this);
        
        //-- handle the save complete
        this.postOffice.addTypeHandler( 'saveComplete', function( myPostMessage ){
            // var iFrameTarget=component.find( "targetFrame").getElement();

            if (helper.matchesPostMessageAuraId(component, helper, myPostMessage)) {
                helper.log('VisualforceContainer received event from contained vf page:saveComplete');
                $A.get('e.force:refreshView').fire();
            } else {
                helper.log('VisualforceContainer received saveComplete event from another iFrame/window');

                //-- tell the other pages
                // myPostMessage.dispatch( iFrameTarget.contentWindow );
                
                //-- show the notify button
                var btn0 = component.find("refresh-button");
                if (btn0) {
                    var btn = btn0.getElement();
                
                    if(btn) {
                        btn.style.display = 'block';
                    }
                }
            }
        });
        
        this.postOffice.addTypeHandler( 'forceRefresh', function( myPostMessage ){
            if (helper.matchesPostMessageAuraId(component, helper, myPostMessage)) {
                helper.info('VisualforceContainer received event: forceRefresh');
                $A.get('e.force:refreshView').fire();
            }
        });

        //-- handle opening a new tab
        this.postOffice.addTypeHandler( 'openTab', function( myPostMessage ){
            if (helper.matchesPostMessageAuraId(component, helper, myPostMessage)) {
                helper.info('VisualforceContainer received event: openTab');
                window.open(myPostMessage.data.src, '_blank');
            }
        });

        //-- toasts
        this.postOffice.addTypeHandler( 'showToast', function( myPostMessage ){
            if (helper.matchesPostMessageAuraId(component, helper, myPostMessage)) {
                helper.info('VisualforceContainer received event: showToast');
                
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    duration: myPostMessage.data.duration || 5000,
                    key: myPostMessage.data.key || '',
                    message: myPostMessage.data.message || '',
                    mode: myPostMessage.data.mode || 'dismissible',
                    title: myPostMessage.data.title || '',
                    type: myPostMessage.data.type || 'other'
                });
                toastEvent.fire();
            }

        });
        
        //-- handle any unknown types of events
        this.postOffice.addTypeHandler( null, function( myPostMessage ){
            var iFrameTarget=component.find( "targetFrame").getElement();
            
            if (helper.matchesPostMessageAuraId(component, helper, myPostMessage)) {
                helper.info('VisualforceContainer received unknown messageType:', myPostMessage.messageType);
                
                if( typeof myPostMessage.data.auraMessageType !== 'undefined' &&
                    myPostMessage.data.auraMessageType
                ){
                    // var auraMessageData = {} || myPostMessage.data.auraMessageData;
                    //console.log( 'Aura message:' + myPostMessage.data.auraMessageType );
                    //console.log( 'Aura data:' ); console.log( myPostMessage.data.auraMessageData );
                    
                    //debugger;
                    var appEvent = $A.get( myPostMessage.data.auraMessageType );
                    appEvent.setParams(myPostMessage.data.auraMessageData);
                    appEvent.fire();
                }

                //-- tell the contained page
                myPostMessage.dispatch( iFrameTarget.contentWindow );
            }
        });
        
        this.postOffice.listenForPostEvents(window);
    },
  
    log : function(msg){console.log.apply(this, arguments);}, // eslint-disable-line
    warn : function(msg){console.warn.apply(this, arguments);}, // eslint-disable-line
    error : function(msg){console.error.apply(this, arguments);}, // eslint-disable-line
    noop : function(){}
})