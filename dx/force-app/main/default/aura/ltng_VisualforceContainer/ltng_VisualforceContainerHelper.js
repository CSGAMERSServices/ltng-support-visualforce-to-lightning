({
    //-- @TODO: include more code comments on how this can be called.

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
        console.log( 'onetimeSetup attempted' );
        
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
     * Sets up the listners for visualforce notifications.
     **/
    setupPostMessageListeners: function(component, helper){
        
        this.postOffice = new PostMessageOffice(this);
        
        //-- handle the save complete
        this.postOffice.addTypeHandler( 'saveComplete', $A.getCallback(function( myPostMessage ){
            //-- now notify visualforce pages.
            var iFrameTarget=component.find( "targetFrame").getElement();



            if(myPostMessage.data.auraId) {

                console.log('saveComplete received');

                if (myPostMessage.data.auraId !== component.getGlobalId()) {

                    // $A.get('e.force:refreshView').fire();
                    // fake click button
                    
                	//-- tell the other pages
                	//myPostMessage.dispatch( iFrameTarget.contentWindow );
                    
                    var btn0 = component.find("refresh-button");
                    if (btn0) {
                        var btn = btn0.getElement();
                    
                        if(btn) {
                        	btn.style.display = 'block'; 
                        }
                    }
                }
                else {
                    // setTimeout(function() {
                        // console.log('saveComplete refresh to ' + myPostMessage.data.auraId);
                        // $A.get('e.force:refreshView').fire();
                    // }, 50);
                    // component.find('hidden-refresh').getElement().dispatchEvent(new Event('click'));
                    // $A.getCallback(function() {
                    //     if (component.isValid()) {
                            $A.get('e.force:refreshView').fire();
                    //     }
                    // });
                }
            }
        }));
        
        this.postOffice.addTypeHandler( 'forceRefresh', $A.getCallback(function( myPostMessage ){
            // $A.get('e.force:refreshView').fire();
            // component.find('hidden-refresh').getElement().dispatchEvent(new Event('click'));
            // $A.getCallback(function() {
            //     if (component.isValid()) {
                    $A.get('e.force:refreshView').fire();
            //     }
            // });
            
        	var iFrameTarget = component.find( "targetFrame").getElement()
        	iFrameTarget.src = iFrameTarget.src;            
        }));

        //-- handle opening a new tab
        this.postOffice.addTypeHandler( 'openTab', $A.getCallback(function( myPostMessage ){

            if( myPostMessage.data.auraId &&
                myPostMessage.data.auraId !== component.getGlobalId()
            ){
                console.log( 'auraId sent and does not match. not sending aura message' );
            } else {

                window.open(myPostMessage.data.src, '_blank');

            }
        }));

        //-- toasts
        this.postOffice.addTypeHandler( 'toast', $A.getCallback(function( myPostMessage ){

            if( myPostMessage.data.auraId &&
                myPostMessage.data.auraId !== component.getGlobalId()
            ){
                console.log( 'auraId sent and does not match. not sending aura message' );
            } else {

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

        }));
        
        //-- handle any unknown types of events
        this.postOffice.addTypeHandler( null, $A.getCallback(function( myPostMessage ){
            //-- now notify visualforce pages.
            var iFrameTarget=component.find( "targetFrame").getElement();
            
            console.log( "YAY, vf event in lightning" );
            
            if( typeof myPostMessage.data.auraMessageType !== 'undefined' &&
               myPostMessage.data.auraMessageType
            ){
               
                if( myPostMessage.data.auraId &&
                    myPostMessage.data.auraId !== component.getGlobalId()
                ){
                    console.log( 'auraId sent and does not match. not sending aura message' );
                } else {
                    var auraMessageData = {} || myPostMessage.data.auraMessageData;
                    //console.log( 'Aura message:' + myPostMessage.data.auraMessageType );
                    //console.log( 'Aura data:' ); console.log( myPostMessage.data.auraMessageData );
                    
                    //debugger;
                    var appEvent = $A.get( myPostMessage.data.auraMessageType );
                    appEvent.setParams(myPostMessage.data.auraMessageData);
                    appEvent.fire();
                }
            }
            
            //-- tell the other pages.
            myPostMessage.dispatch( iFrameTarget.contentWindow );
        }));
        
        this.postOffice.listenForPostEvents(window);
    }
})