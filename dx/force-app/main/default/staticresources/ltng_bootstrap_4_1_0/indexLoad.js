//-- from
//-- https://www.kevinleary.net/javascript-get-url-parameters/
function url_query( query ) {
    query = query.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var expr = "[\\?&]"+query+"=([^&#]*)";
    var regex = new RegExp( expr );
    var results = regex.exec( window.location.href );
    if ( results !== null && results[1] ) {
        return decodeURIComponent(results[1]);
    } else {
        return false;
    }
}

/**
 * Handles the message from the lightning component
 * @param {*} message - same as sent from lightning component
 */
function receiveMessage(message){
    console.info('message received');
    var newName = message.value;
    jQuery("h1#greeting").text(newName);
}

/**
 * Dispatches a message to the lightning:component
 * @param {} message 
 */
function dispatchMessage(message){
    console.log('sending message');

    //-- sent from the lightning-container/lightning-container.js module
    window.sendMessage({
        name : 'HiBack',
        value : jQuery("h1#greeting").text()
    });
}

/**
 * Tell the container app to resize
 * @param newSize
 */
function resizeContainer(newSize){

    //-- determine best fit if size is negative
    if (newSize < 0){
        //-- determine min fit
        var windowHeight = jQuery(window).height();
        var documentHeight = jQuery(document).height();

        if (windowHeight < documentHeight){
            newSize = documentHeight;
        } else {
            return;
        }
    }

    window.sendMessage({
        name : "ResizeContainer",
        value : newSize
    });
}

jQuery(document).ready(function(){
    console.info('document is ready');

    //-- update the hello name
    var helloName = url_query("helloName");
    if (!helloName) helloName = "Hello, World";
    jQuery("h1.display-3").text(helloName);

    //-- send a message when clicking the button
    jQuery("a#sendMessage").click(dispatchMessage);

    //-- defined from the lightning-container/lightning-container.js module
    window.addMessageHandler(receiveMessage);

    //-- defined from the lightning-container/lightning-container.js module
    window.addErrorHandler( function(){
        console.error('error occurred');
    });

    //-- resize the container if needed
    resizeContainer(-1);
});