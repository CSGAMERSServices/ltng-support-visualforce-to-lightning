/**
 * Utility Scripts for common navigation patterns.
 **/

this.LightningSafeNavigation = {};

/**
 * Safely navigates to a target URL regardless if in mobile or lightning
 * or just plain visualforce.
 * @param navigationInfo (string|object) - the target url we want to go to or object with other properties.
 * @param navigationInfo.url (string) - if an object is sent, the url is required - the address to redirect to
 * @param navigationInfo.tab (string?=redirect) - (redirect - to navigate as redirect|blank - new window|primary - new primary tab|secondary - new secondary tab)
 * @param navigationInfo.name (string?) - the optional name of the tab - so it can be later found by name
 * @param navigationInfo.callback (function?) - the optional callback on completion
 * @param navigationInfo.label (string) - the optional label of the tab
 * @param navigationInfo.active (boolean?=true) - whether to navigate to the tab right away
 * @param navigationInfo.id (string?) - the tab id to try to set for the new tab
 * @param navigationInfo.workspace (object?) - the instance of component.find('workspace') of type lightning:workspaceAPI
 **/
this.LightningSafeNavigation.navigate = function(navigationInfo) {
	//-- safe object.assign
	var navigationObject = {
		tab: 'redirect',
		active: true,
		id: null,
		url: null,
		label: null,
		name: null,
		callback: null
	};
	if (typeof navigationInfo === 'string') {
		navigationObject.url = '' + navigationInfo;
	}
	for (var key in navigationInfo) {
		if (navigationInfo.hasOwnProperty(key)) {
			navigationObject[key] = navigationInfo[key];
		}
	}
	
	//-- check if there is a workspace sent
	var workspace = navigationInfo.workspace ? navigationInfo.workspace : null;
	
	//-- require at least the url
	if (!navigationObject.url) {
		throw(new Error('navigation.url is required'));
		return;
	}
	
	console.log('lightningSafeNavigation called');
	
	if (workspace) {
		//-- we have a lightning workspace
		//-- https://developer.salesforce.com/docs/atlas.en-us.api_console.meta/api_console/sforce_api_console_methods_lightning_tabs.htm
		
		workspace.getFocusedTabInfo()
			.then( function(response) {
				var focusedTabId = response.tabId;
				if (navigationObject.tab==='primary') {
					workspace.openTab({
						focus: navigationObject.active,
						url: navigationObject.url
					});
				} else {
					workspace.openSubtab({
						parentTabId: focusedTabId,
						focus: navigationObject.active,
						url: navigationObject.url
					});
				}
			})
			.catch( function(err) {
				console.error('error in finding focused tab:' + JSON.stringify(err));
				console.error(err);
			});
		
	} else if (typeof sforce != "undefined" ) {
		if (typeof sforce.one != "undefined") {
			//-- use standard navigation
			//-- see https://developer.salesforce.com/docs/atlas.en-us.salesforce1.meta/salesforce1/salesforce1_dev_jsapi_sforce_one.htm
			var isRedirect = navigationObject.tab === 'redirect';
			sforce.one.navigateToURL(navigationObject.url, isRedirect);
		} else if (typeof sforce.console != "undefined") {
			//-- use the console navigation
			//-- see https://developer.salesforce.com/docs/atlas.en-us.api_console.meta/api_console/sforce_api_console_opensubtab.htm
			sforce.console.getEnclosingPrimaryTabId(
				function(result) {
					var currentPrimaryTab = result.id;
					if (navigationObject.tab==='primary') {
						sforce.console.openPrimaryTab(navigationObject.id, navigationObject.url, navigationObject.active, navigationObject.label, navigationObject.callback, navigationObject.name);
					} else {
						sforce.console.openSubtab(currentPrimaryTab, navigationObject.url, navigationObject.active, navigationObject.label, navigationObject.id, navigationObject.callback, navigationObject.name);
					}
				}
			);
		} else {
			throw(new Error('neither sforce.one or sforce.console defined'));
		}
	} else if (typeof $A != "undefined" && typeof $A.get != "undefined") {
		//-- see https://developer.salesforce.com/docs/component-library/bundle/force:navigateToURL/documentation
		$A.get("e.force:navigateToURL")
			.setParams({
			  "url": navigationObject.url
			}).fire();
	} else {
		window.location.href = targetUrl;
	}
}