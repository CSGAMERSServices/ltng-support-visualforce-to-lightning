/**
 * Controller Extension for the Visualforce without PostMessage demo page.
 * <p>
 * @class ltng_VisualforceWithoutPostMessageCtrl
**/
public class ltng_VisualforceWithoutPostMessageCtrl {
	
    /** Standard Controller **/
    private ApexPages.StandardController ctrl;
    
    /** Current Record **/
    private ltng_LightningToVisualforceBase__c record {get;set;}
    
    /**
     * Constructor
     **/
    public ltng_VisualforceWithoutPostMessageCtrl(ApexPages.StandardController ctrl){
        this.ctrl = ctrl;
        this.record = (ltng_LightningToVisualforceBase__c)ctrl.getRecord();
    }
    
    /**
     * Saves the record
     * <p>Allows us to save the record without everything refreshing
     *   and potentially losing work.</p>
     **/
    public void updateRecord(){
        update this.record;
    }
}