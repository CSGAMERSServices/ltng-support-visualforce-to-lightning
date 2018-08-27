({
	init : function(component, event, helper) {
		console.info('canvas app component initialized');
	},
    
    /**
     * Handler when the scripts finished loading
     **/
    scriptsLoaded : function(component, event, helper){
        console.info('scripts loaded');
    },
    
    /**
     * Handler called when the canvas app loads
     **/
    handleCanvasAppLoad : function(component, event, helper){
        console.info('handleCanvasAppLoad');
        
        var result = Sfdc.canvas(function(){
            console.info('firstArg');
        });
        
        var resultObj = JSON.parse(JSON.stringify(resultObj));
        
        /*
        console.info('sfdc:' + typeof(Sfdc));
        console.info('Sfdc.canvas:' + typeof(Sfdc.canvas));
        console.info('Sfdc.canvas.controller:' + typeof(Sfdc.canvas.controller));
        //console.info('Sfdc.canvas.controller.subscribe:' + typeof(Sfdc.canvas.controller.subscribe));
        
        Sfdc.canvas(function(){
            console.info('sfdc:' + typeof(Sfdc));
            console.info('Sfdc.canvas:' + typeof(Sfdc.canvas));
            console.info('Sfdc.canvas.controller:' + typeof(Sfdc.canvas.controller));
            console.info('Sfdc.canvas.controller.subscribe:' + typeof(Sfdc.canvas.controller.subscribe));
        });

        //-- listen for events sent from the canvas app.
        //-- if namespace is used, subscribe to something like name:
        //-- Sfdc.canvas.controller.subscribe({ name: "mynamespace.showToast", onData: function(e){});
        // Subscribe to multiple events.
        Sfdc.canvas(function() {
            sr = JSON.parse('<%=signedRequestJson%>');
            Sfdc.canvas.client.subscribe(sr.client, [
                {name : 'mynamespace.statusChanged', onData : handler1},
                {name : 'anothernamespace.tripCancelled', onData : handler2},
            ]);
        });
		
        //-- listen for events sent from the canvas app.
        //-- if namespace is used, subscribe to something like name:
        //-- Sfdc.canvas.controller.subscribe({ name: "mynamespace.showToast", onData: function(e){});
        Sfdc.canvas.controller.subscribe({ name: "showToast", onData: function(e){
            console.info('showToast event sent from heroku');
            debugger;

            if(e && e.status){
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Success!",
                    "message": "Message from heroku:" + e.status
                });
                toastEvent.fire();
            }
        }});
        */
    },
    
    /**
     * Handler called when the canvas app subscribed
     **/
    handleCanvasSubscribed : function(component, event, helper, testArg){
        console.info('handleCanvasSubscribed');
        
        var result = Sfdc.canvas(function(){
            console.info('firstArg');
        },
        'salesforce');
        
        console.info('result');
        console.info(result);
        
        //console.info('sfdc:' + typeof(Sfdc));
        //console.info('Sfdc.canvas:' + typeof(Sfdc.canvas));
        //console.info('Sfdc.canvas.controller:' + typeof(Sfdc.canvas.controller));
        //console.info('Sfdc.canvas.controller.subscribe:' + typeof(Sfdc.canvas.controller.subscribe));
		
        /*
        Sfdc.canvas(function(){
            console.info('sfdc:' + typeof(Sfdc));
            console.info('Sfdc.canvas:' + typeof(Sfdc.canvas));
            console.info('Sfdc.canvas.controller:' + typeof(Sfdc.canvas.controller));
            console.info('Sfdc.canvas.controller.subscribe:' + typeof(Sfdc.canvas.controller.subscribe));
        });
        */
    },
    
    /**
     * Handler called when the canvas app has an error
     **/
    handleCanvasAppError : function(component, event, helper){
        console.info('handleCanvasAppError');
    }
})