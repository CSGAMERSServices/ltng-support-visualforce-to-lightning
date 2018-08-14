({
	/**
	 * Initializes all values to the beginning.
	 */
	reset : function(component, helper) {
		component.set("v.isRunningSetup", false);
	},

	/**
	 * Runs the setup
	 * @param getInfoOnly (boolean) - whether to only get description of the steps to run (not run them) - true - or to actually run them - false.
	 */
	runSetup : function(getInfoOnly, component, helper){
		var action = component.get("c.runSetup");
		action.setParams({
			'getInfoOnly': getInfoOnly
		});
		action.setCallback(this, function(response){
			var state = response.getState();
			if(state !== "SUCCESS"){
				console.error('error occurred while running setup');
				debugger;
				return;
			}

			var results = response.getReturnValue();
			component.set("v.completionSteps", results);
		})
		$A.enqueueAction(action);
	},

	/**
	 * starts the process to redirect to the permission set trouble spot.
	 */
	redirectToPermissionIssue : function(component, helper){
		var action = component.get("c.getMissingPermissionSetRedirection");
		var defaultAddress = '/one/one.app#/setup/PermSets/home';

		action.setCallback(this, function(response){
			var state = response.getState();
			var targetAddress = defaultAddress;

			if(state === "SUCCESS"){
				var targetAddress = response.getReturnValue();
			}

			helper.redirectToURL(component, helper, targetAddress);
		})
		$A.enqueueAction(action);
	},

	/**
	 * Redirects the user to the trouble spot from metadata.
	 * @param targetURL (String) - the url to redirect to.
	 */
	redirectToURL : function(component, helper, targetURL){
		var action = $A.get('e.force:navigateToURL');
		action.setParams({
			'url': targetURL
		});
		action.fire();
	}
})