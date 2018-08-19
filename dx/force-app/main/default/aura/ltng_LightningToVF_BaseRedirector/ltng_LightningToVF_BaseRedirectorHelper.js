({
	findFirstBase : function(component, helper) {
		var action = component.get('c.findFirstBase');
		action.setParams({});
		
		action.setCallback(this, function(response){
		  var state = response.getState();
		  if( state === 'SUCCESS' ){
			console.info('action success');
			var results = response.getReturnValue();
			var navEvt = $A.get("e.force:navigateToSObject");
			navEvt.setParams({
				"recordId": results.Id,
				"isRedirect": true
			});
			navEvt.fire();
		  } else {
			console.error('Error occurred from Action');
			
			//-- https://developer.salesforce.com/blogs/2017/09/error-handling-best-practices-lightning-apex.html
			var errors = response.getError();
			var errorMessages = [];
			if( errors && Array.isArray(errors) && errors.length > 0 ){
			  errors.forEach(function(error){
				errorMessages.push(error.message);
			  });
			}
			
			if( state === 'ERROR' ){
			  helper.displayError('Error', 'Action error');
			} else {
			  helper.displayError('Unknown Response', 'Action failure');
			}
			
			console.error(errorMessages);
		  }
		});
		//-- optionally seet storable, abortable, background flags here
		$A.enqueueAction(action);
	}
})