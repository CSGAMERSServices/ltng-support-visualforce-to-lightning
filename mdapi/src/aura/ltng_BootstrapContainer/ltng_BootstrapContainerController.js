({
	init : function(component, event, helper) {
		//-- do nothing for now.
		var newSize = component.get('v.containerSize');
        helper.setContainerSize(component, helper, newSize);
	},
    
    /**
     * Sends a message to the bootstrap application
     **/
    sendMessage : function(component, event, helper){
        console.info('sendMessage');
        var helloName = component.get('v.helloName');
        var msg = {
            name: "General",
            value: helloName
        };
        component.find('bootstrapApp').message(msg);
    },
    
    /**
     * Handles message sent from bootstrap application
     **/
    handleMessage : function(component, message, helper){
        console.info('lightning received message');
        var payload = message.getParams().payload;
        if (payload.name === "HiBack"){
            var value = payload.value;
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": "Container Says",
                "message": value
            });
            toastEvent.fire();
        } else if (payload.name === "ResizeContainer"){
            console.log('resizeContainer');
            var newSize = payload.value;
            helper.setContainerSize(component, helper, newSize);
        } else {
            console.error('unknown message sent from bootstrap');
        }
    },
    
    handleError : function(component, error, helper){
        console.error('Error from container message in lightning');
    }
})