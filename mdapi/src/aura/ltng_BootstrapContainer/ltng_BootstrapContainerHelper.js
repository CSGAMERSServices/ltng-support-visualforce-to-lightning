({
    sendMessage : function(name){
    },
    
    handleMessage : function(name) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Hi Back",
            "message": name + " says: 'Hi Back'"
        });
        toastEvent.fire();
	},
    
    setContainerSize : function(component, helper, newSize){
        if (!newSize) newSize = 250;
        var containerSizeCode = "height:" + newSize + 'px';
        component.set('v.containerSize', newSize);
        component.set('v.containerSizeCode', containerSizeCode);
    }
})