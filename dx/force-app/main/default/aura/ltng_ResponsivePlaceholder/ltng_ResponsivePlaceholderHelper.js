({
    /**
     * Generates out the spaced code for css themes based on an array.
     * @param classList (String[])
     * @return String
     **/
    generateClassCode : function(classList){
        var results = '';
        if($A.util.isArray(classList)){
            results += classList[0];
            for(var i = 1; i < classList.length; i++){
                results += ' ' + classList[i];
            }
        }
        return(results);
    },

    /**
     * Generates out the spaced code for css themes based on an array.
     * @param styles (String[])
     * @return String
     **/
    generateStyleCode : function(styles){
        var results = '';
        if($A.util.isArray(styles)){
            results += styles[0];
            for(var i = 1; i < styles.length; i++){
                results += styles[i];
            }
        }
        return(results);
    },
    
    /**
     * Determines and adds the theme class
     * @param existingClasses (String[])
     * @param themeName (String)
     * @return existingClasses (String[])
     **/
	addThemeClass : function(existingClasses,themeName) {
		var themeClass='slds-theme_' + themeName;
        existingClasses.push(themeClass);
	},
    
    /**
     * Determines and adds the theme class
     * @param existingClasses (String[])
     * @param paddingLocation (String)
     * @param paddingAmount (String)
     * @return existingClasses (String[])
     **/
	addPaddingClass : function(existingClasses,paddingLocation,paddingAmount) {
        if(paddingAmount !== 'none'){
            var paddingClass='slds-p-' + paddingLocation + '_' + paddingAmount;
            existingClasses.push(paddingClass);
        }
        return(existingClasses);
    },
    
    /**
     * Generates the height css style code.
     * @param existingStyles (String[])
     * @param cmpHeight (Integer)
     * @return existingStyles (String[])
     */
    addHeightStyle : function(existingStyles, cmpHeight){
        if(cmpHeight < 1){
            return(existingStyles);
        }
        var heightCode = 'height:' + cmpHeight + 'px;';
        existingStyles.push(heightCode);
        return(existingStyles);
    }
})