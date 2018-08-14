/**
 * Controller for the Demo Setup page.
 **/
/*
 * //-- CHANGE
 * //-- ensure the class name matches the name of the Setup page + CTRL
 * //-- ex: ltng_LightningToVisualforceSetupCtrl
 **/
global with sharing class ltng_LightningToVisualforceSetupCtrl {

    //-- static

    global static final String DEFAULT_MISSING_PERMISSION_URL = '/one/one.app#/setup/PermSets/home';
	
    //-- CHANGE
    //-- UPDATE PERMISSION_SET_NAME to the Name of the permission set
    //-- UPDATE the Child Object Name to the durable id of the object
    //--      ex: ltng_LightningToVisualforceBase__c is ltng_DependentPicklistBase
    //--      SELECT DeveloperName, DurableId FROM EntityDefinition WHERE DeveloperName = 'Object API Name'
    global static final String PERMISSION_SET_NAME = 'ltng_LightningToVisualforceDemoParticipant';
    global static final String CHILD_SOBJECT_NAME = 'ltng_LightningToVisualforceBase';
	
    //-- UPDATE: set the developer names of the record types you will use.
    //--     (remove properties if not used)
    /** Record type developer names for the records to create **/
    global static final String RT_STANDARD_NAME = 'Standard';

    //-- 
    
    //-- setup step (conveys to the component what was or will be run)
    /**
     * Internal class that represents an item to be completed.
     **/
    global class SetupStep {
        @AuraEnabled
        global boolean isComplete;

        @AuraEnabled
        global String errMsg;

        @AuraEnabled
        global String devErrMsg;

        @AuraEnabled
        global String completionDate;
        
        @AuraEnabled
        global String title;
        
        @AuraEnabled
        global String descr;

        @AuraEnabled
        global String reasoning;

        @AuraEnabled
        global String seeMore;

        @AuraEnabled
        global String seeMoreLabel;

        SetupStep( Map<String,Object> props){
            //-- make similar to sObject inline definition
            if( props.containsKey('isComplete')){
                this.isComplete = (boolean)props.get('isComplete');
            }
            if( props.containsKey('errMsg')){
                this.errMsg = (String)props.get('errMsg');
            }
            if( props.containsKey('devErrMsg')){
                this.devErrMsg = (String)props.get('devErrMsg');
            }
            if( props.containsKey('completionDate')){
                this.completionDate = (String)props.get('completionDate');
            }
            if( props.containsKey('title')){
                this.title = (String)props.get('title');
            }
            if( props.containsKey('descr')){
                this.descr = (String)props.get('descr');
            }
            if( props.containsKey('reasoning')){
                this.reasoning = (String)props.get('reasoning');
            }
            if( props.containsKey('seeMore')){
                this.seeMore = (String)props.get('seeMore');
            }
            if( props.containsKey('seeMoreLabel')){
                this.seeMoreLabel = (String)props.get('seeMoreLabel');
            }
        }

        void markCompleted(){
            this.isComplete = true;
            this.completionDate = System.now().format();
        }
    }

    

    //--    -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
    //--    One-Off - used only because the permission set doesn't seem to take the change
    //--    -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

    @AuraEnabled
    global static String getMissingPermissionSetRedirection(){
        String results = null;
        String tempStr = null;
        String newResult = null;
        
        try {
            PermissionSet targetPS = [
                SELECT Id, Name
                FROM PermissionSet
                WHERE Name = :PERMISSION_SET_NAME
                LIMIT 1
            ];

            EntityDefinition targetObject = [
                SELECT DeveloperName, DurableId
                FROM EntityDefinition 
                WHERE DeveloperName = :CHILD_SOBJECT_NAME
            ];

            tempStr = '/' + targetPS.Id + '?s=EntityPermissions&o=' + targetObject.DurableId;
            newResult = '/one/one.app#/setup/PermSets/page?address=' + EncodingUtil.urlEncode(tempStr,'UTF-8');
            
            results = newResult;
        } catch(Exception err){
            results = DEFAULT_MISSING_PERMISSION_URL;
        }

        return results;
    }
    

    //--    -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
    //--    CHANGE - BELOW
    //--    -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
    

    /**
     * Actually runs the setup
     * @return SetupStep[] - list of setup steps ran and the status for each.
     **/
    @AuraEnabled
    global static SetupStep[] runSetup(boolean getInfoOnly){
        SetupStep[] results = new SetupStep[]{
            removeAllBaseRecords(getInfoOnly),
            createBaseRecords(getInfoOnly),
            addUserToPermissionSet(getInfoOnly)
        };
        return results;
    }

    //-- actual steps to run

    /**
     * Remove any of the base records that are currently there.
     **/
    global static SetupStep removeAllBaseRecords( boolean getInfoOnly){
        SetupStep step = new SetupStep( new Map<String,Object>{
            'title' => 'Remove any existing base objects'
        });

        if(getInfoOnly){
            return step;
        }

        ltng_LightningToVisualforceBase__c[] recordsToDelete = null;
        try {
            recordsToDelete = [
                SELECT Id
                FROM ltng_LightningToVisualforceBase__c
            ];
            
            delete recordsToDelete;
        } catch(Exception err){
            step.errMsg = 'Error occurred while attempting to delete all base records';
            step.devErrMsg = err.getMessage();
            //-- do nothing for now.
            System.debug(step.errMsg);
        }
        
        step.markCompleted();
        return(step);
    }

    /**
     * Create the base records.
     **/
    global static SetupStep createBaseRecords( boolean getInfoOnly ){
        SetupStep step = new SetupStep( new Map<String,Object>{
            'title' => 'Create Base Objects',
            'descr' => 'LBase - objects (ltng_LightningToVisualforceBase__c)',
            'reasoning' => '(These are the objects you initiate the demo)'
        });

        if(getInfoOnly){
            return step;
        }

        //-- generated from data/trees/ltng_LightningToVisualforceBase__cs.json
        ltng_LightningToVisualforceBase__c[] baseRecords = new ltng_LightningToVisualforceBase__c[]{};
		
        //-- uncomment if different record types are needed
        /*
        Map<String,Id> recordTypeMap = new Map<String,Id>();
        for( RecordType rt : [
            SELECT Id, DeveloperName, Name, SObjectType
            FROM RecordType
            WHERE SObjectType = 'ltng_LightningToVisualforceBase__c'
        ]){
            recordTypeMap.put(rt.DeveloperName, rt.Id);
        }
		*/
        
        baseRecords.add( new ltng_LightningToVisualforceBase__c(
            Value__c = 'Initial Value'
            //RecordTypeId = recordTypeMap.get(RT_STANDARD_NAME)
        ));
        
        /*
        //-- @TODO: replace these to create the records
        baseRecords.add( new ltng_LightningToVisualforceBase__c(
            Name = 'Example Master',
            Descr__c = '<p>Example Master Record - only shows No Value and Valid Value.</p><p>(A and B variants are not shown)</p>',
            Level1__c = 'No Level 1',
            RecordTypeId = recordTypeMap.get(RT_STANDARD_NAME)
        ));
        baseRecords.add( new ltng_LightningToVisualforceBase__c(
            Name = 'Example Type A',
            Descr__c = '<p>Example Type A Record - includes No Value, Valid Value and Type A variant.</p><p>(Does not show Type B variants)</p>',
            Level1__c = 'No Level 1',
            RecordTypeId = recordTypeMap.get(RT_TYPEA_Name)
        ));
        baseRecords.add( new ltng_LightningToVisualforceBase__c(
            Name = 'Example Type B',
            Descr__c = '<p>Example Type B Record - includes No Value, Valid Value and Type B variant.</p><p>(Does not show Type A variants)</p>',
            Level1__c = 'No Level 1',
            RecordTypeId = recordTypeMap.get(RT_TYPEB_NAME)
        ));
		*/
        
        try {
            insert baseRecords;

            //step.seeMore = baseRecords[0].Id;
        } catch( Exception err){
            step.errMsg = 'error occurred while creating base records';
            step.devErrMsg = err.getMessage();
            System.debug(step.errMsg);
        }

        step.markCompleted();
        return(step);
    }

    /**
     * Assign the user to the custom setting.
     * <p>Note: actual work must be a future to avoid a MixedDML issue</p>
     **/
    global static SetupStep addUserToPermissionSet( boolean getInfoOnly ){
        SetupStep step = new SetupStep( new Map<String,Object>{
            'title' => 'Assign current user PermissionSet to see the Demo',
            'descr' => 'PermissionSet: ' + PERMISSION_SET_NAME + '. May take a second to take effect.',
            'reasoning' => 'All access is granted by PermissionSet. Only those with this PermissionSet can see the demo'
        });

        if( getInfoOnly ){
            return(step);
        }

        addUserToPermissionSetImpl();

        step.markCompleted();
        return(step);
    }

    /**
     * Implementation that actually adds the user to the permission set.
     **/
    @future
    global static void addUserToPermissionSetImpl(){    
        Id userId = UserInfo.getUserId();
        PermissionSetAssignment[] results = null;
        
        try {
            PermissionSet ps = [
                SELECT Id, Name
                FROM PermissionSet
                WHERE Name = :PERMISSION_SET_NAME
                LIMIT 1
            ];

            results = [
                SELECT Id, PermissionSetId, AssigneeId
                FROM PermissionSetAssignment
                WHERE AssigneeId = :userId
                    AND PermissionSetId = :ps.Id 
                LIMIT 1
            ];
            
            if(results.size() > 0){
                System.debug('User is already assigned to the PermissionSet');
            } else {
                results = new PermissionSetAssignment[]{
                    new PermissionSetAssignment( PermissionSetId = ps.Id, AssigneeId = UserInfo.getUserId() )
                };

                insert results;
            }
        } catch(Exception err){
            //-- do nothing
            System.debug('ERROR - could not assign user to permission set');
            System.debug(err.getMessage());
        }
    }
}