({
	init : function(component, event, helper) {
		var classCode = "slds-box";
        
        var classes=['slds-box'];
        helper.addThemeClass(classes,component.get('v.theme'));
        
        classCode = helper.generateClassCode(classes);
        
        component.set("v.classCode", classCode);

        //-- styles
        var styleCode = '';
        var styles = [];
        helper.addHeightStyle(styles,component.get('v.cmpHeight'));
        styleCode = helper.generateStyleCode(styles);
        component.set('v.styleCode', styleCode);
	}
})