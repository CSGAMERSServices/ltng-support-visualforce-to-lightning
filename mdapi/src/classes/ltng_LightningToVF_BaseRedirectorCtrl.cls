/**
 * Controller for the ltng_LightningToVF_BaseRedirector component.
 * <p>The goal is to find the latest base, and redirect the user,
 * to make the demo easier</p>
 **/
public class ltng_LightningToVF_BaseRedirectorCtrl {
    /**
     * Description for method
     **/
    @AuraEnabled
    public static ltng_LightningToVisualforceBase__c findFirstBase() {
        ltng_LightningToVisualforceBase__c results;
        
        try {
            results = [ SELECT Id, Name
                FROM ltng_LightningToVisualforceBase__c
                ORDER BY createdDate desc
                LIMIT 1
            ];
        } catch(Exception err){
            throw new AuraHandledException('Exception occurred when processing: findFirstBase');
        }
        
        return(results);
    }
}