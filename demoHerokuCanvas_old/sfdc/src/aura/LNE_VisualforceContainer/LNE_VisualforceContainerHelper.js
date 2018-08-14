({
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
        
        this.postOffice = new LNE_MessagePostOffice(this);
        
        //-- handle the save complete
        this.postOffice.addTypeHandler( 'saveComplete', $A.getCallback(function( myPostMessage ){
            //-- now notify visualforce pages.
            var iFrameTarget=component.find( "targetFrame").getElement();



            if(myPostMessage.data.auraId) {

                console.log('saveComplete received');

                if (myPostMessage.data.auraId !== component.getGlobalId()) {
                    
                	//-- tell the other pages
                	myPostMessage.dispatch( iFrameTarget.contentWindow );
                    
                    var btn0 = component.find("refresh-button");
                    if (btn0) {
                        var btn = btn0.getElement();
                    
                        if(btn) {
                        	btn.style.display = 'block'; 
                        }
                    }
                }
                else {
                    $A.get('e.force:refreshView').fire();
                }
            }
        }));
        
        this.postOffice.addTypeHandler( 'forceRefresh', $A.getCallback(function( myPostMessage ){

            $A.get('e.force:refreshView').fire();
            
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
            
            if( typeof myPostMessage.data.auraMessageType !== 'undefined' &&
               myPostMessage.data.auraMessageType
            ){
               
                if( myPostMessage.data.auraId &&
                    myPostMessage.data.auraId !== component.getGlobalId()
                ){
                    console.log( 'auraId sent and does not match. not sending aura message' );
                } else {
                    var auraMessageData = {} || myPostMessage.data.auraMessageData;
                    var appEvent = $A.get( myPostMessage.data.auraMessageType );
                    appEvent.setParams(myPostMessage.data.auraMessageData);
                    appEvent.fire();
                }
            }
            
            //-- tell the other pages.
            myPostMessage.dispatch( iFrameTarget.contentWindow );
        }));
        
        helper.ignoreSpecificMessages(this.postOffice, 'toggleVariance', component, helper)
        
        this.postOffice.listenForPostEvents(window);
    },
    
    /**
     * Used to ignore messages that are meant to be received by windows
     * other than the VisualforceContainer
     **/    
    ignoreSpecificMessages: function(postOffice, toIgnore, component, helper){
        postOffice.addTypeHandler(toIgnore, $A.getCallback(function( myPostMessage ){
            //do nothing
        }));       
    }
})