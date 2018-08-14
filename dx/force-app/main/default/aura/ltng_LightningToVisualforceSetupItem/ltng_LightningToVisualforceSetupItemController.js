({
	init : function(component, event, helper) {
		helper.reset(component, helper);
		helper.calcIconName(component, helper);
		helper.calcTimeLineClass(component, helper);
		helper.calcExpanderClass(component, helper);
	},

	/**
	 * Handle expansion toggle was clicked
	 */
	handleExpansionToggle : function(component, event, helper){
		helper.toggleExpansion(component, helper);
	}
})