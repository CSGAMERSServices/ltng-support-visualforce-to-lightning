({
	/**
	 * Resets all the attributes on the component.
	 */
	reset : function(component, helper){
		component.set("v.isExpanded", false);
	},

	/**
	 * Determines which icon we should use
	 **/
	calcIconName : function(component, helper) {
		var iconName = "standard:canvas";
		if( !$A.util.isEmpty(component.get("v.errMsg"))){
			iconName = "standard:product_required";
		} else if( component.get("v.isComplete") === true){
			iconName = "standard:task2";
		}
		var result = iconName;
		component.set("v.iconName", result);
		return result;
	},

	/**
	 * Determines the timeline li class
	 */
	calcTimeLineClass : function(component, helper){
		var timeLineBaseClass = "slds-timeline__item_expandable ";
		var timeLineClass = "slds-timeline__item_email";
		var isExpanded = "";

		if( !$A.util.isEmpty(component.get("v.errMsg"))){
			timeLineClass = "slds-timeline__item_event";
		} else if( component.get("v.isComplete") === true){
			timeLineClass = "slds-timeline__item_task";
		}

		if( component.get("v.isExpanded")){
			isExpanded = " slds-is-open";
		}

		var result = timeLineBaseClass + timeLineClass + isExpanded;
		component.set("v.timeLineClass", result);
		return(result);
	},

	/**
	 * Determines the classes used for the expander class
	 */
	calcExpanderClass : function(component, helper){
		var baseClasses = "slds-button slds-button_icon";
		var visibilityHiddenClass = 'visibility-hidden';
		var result = baseClasses;

		var reasoningValue = component.get('v.reasoning');
		var seeMoreValue = component.get('v.seeMore');

		if( $A.util.isEmpty(reasoningValue) && $A.util.isEmpty(seeMoreValue)){
			result += ' ' + visibilityHiddenClass;
		}

		component.set('v.expanderClass', result);
		return(result);
	},

	/**
	 * Toggles whether the expandible area is expanded (true) or not (false)
	 * @see https://www.lightningdesignsystem.com/components/expandable-section/
	 */
	toggleExpansion : function(component, helper){
		component.set("v.isExpanded", !component.get("v.isExpanded"));
		helper.calcTimeLineClass(component, helper);
	}
})