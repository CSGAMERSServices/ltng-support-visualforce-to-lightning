var chai = require('chai');
var assert = chai.assert;

var sinon = require('sinon');

//-- note that this is the container of the module.
var LnePostMessage2 = require('../src/public/js/postMessage/LNE_PostMessage2');
var PostMessage = LnePostMessage2.LNE_PostMessage;

//debugger;

//-- see here for more examples
//-- http://chaijs.com/api/assert/#method_strictequal

function once(fn){
	var returnValue;
	var called = false;
	return (
		function (){
			if (!called){
				called = true;
				returnValue = fn.apply(this, arguments);
			}
			
			return returnValue;
		}
	);
}

describe('LNE_PostMessage', function (){
	it('sender is sent transparently', function (){
		var myPostMessage = new PostMessage('testSender', 'testMessage', true, { testData: 1 });
		assert.equal(myPostMessage.sender, 'testSender');
	});

	it('messageType is sent transparently', function (){
		var myPostMessage = new PostMessage('testSender', 'testMessage', true, { testData: 1 });
		assert.equal(myPostMessage.messageType, 'testMessage');
	});

	it('isSuccessful is sent transparently', function (){
		var myPostMessage = new PostMessage('testSender', 'testMessage', true, { testData: 1 });
		assert.equal(myPostMessage.isSuccessful, true);
	});

	it('data is sent transparently', function (){
		var myPostMessage = new PostMessage('testSender', 'testMessage', true, { testData: 1 });
		var data = myPostMessage.data;
		assert.isNotNull(myPostMessage.data, 'data should not be null');
		assert.property(myPostMessage.data, 'testData', 'testData was sent, so it should be found');
		assert.strictEqual(myPostMessage.data.testData, 1,
			'testData must be a property and assigned to 1, as that was what was sent');
	});
	
	it('matchesPage verifies the page that the request was sent', function (){
		var myPostMessage = new PostMessage('testSender', 'testMessage', true, { testData: 1 });
		assert.equal(myPostMessage.matchesPage('testSender'), true,
			'we sent test sender so it is expected to match');
		assert.equal(myPostMessage.matchesPage('otherPage'), false,
			'we originally sent testSender, so other page is different');
	});
	
	it('matches the message type sent', function (){
		var myPostMessage = new PostMessage('testSender', 'testMessage', true, { testData: 1 });
		assert.equal(myPostMessage.matchesMessageType('testMessage'), true,
			'we sent testMessage so it is expected to match');
		assert.equal(myPostMessage.matchesMessageType('testOtherMessage'), false,
			'we originally sent testSender, so testOtherMessage is different');
	});
	
	it('matches pageMessage (page and messageType convenience function',
		function (){
			var myPostMessage = new PostMessage('testSender', 'testMessage', true, { testData: 1 });
			assert.equal(myPostMessage.matchesPageMessage('testSender', 'testMessage'), true,
				'both match so it should match');
			assert.equal(myPostMessage.matchesPageMessage('testSender', 'testOtherMessage'), false,
				'only page matches, so it is different');
			assert.equal(myPostMessage.matchesPageMessage('otherPage', 'testMessage'), false,
				'only page matches, so it is different');
			assert.equal(myPostMessage.matchesPageMessage('otherPage', 'testOtherMessage'), false,
				'neither matches, so it is different');
		}
	);
	
	it('matches the message origin', function (){
		var myPostMessage = new PostMessage('testSender', 'testMessage', true, { testData: 1 });
		var stubEvent = { origin: '*' };
		assert.equal(myPostMessage.getMessageOrigin(stubEvent), '*',
			'origin sent from stub post message must match');
		
		stubEvent = { originalEvent: { origin: '*' } };
		assert.equal(myPostMessage.getMessageOrigin(stubEvent), '*',
			'origin sent from stub post message must match');
	});
	
	it('message sent matches message parsed', function (){
		var myPostMessage = new PostMessage('testSender', 'testMessage', true, { testData: 1 });
		
		var payload = {
			data: {
				sender: myPostMessage.sender,
				messageType: myPostMessage.messageType,
				isSuccessful: myPostMessage.isSuccessful,
				data: myPostMessage.data,
			},
		};
		
		var newPostMessage = new PostMessage();
		newPostMessage.parse(payload);
		
		assert.equal(newPostMessage.sender, myPostMessage.sender, 'sender');
		assert.equal(newPostMessage.messageType, myPostMessage.messageType, 'messageType');
		assert.equal(newPostMessage.isSuccessful, myPostMessage.isSuccessful, 'isSuccessful');
	});
	
	it('verify postmessage dispatch', function (){
		var windowPostMessageSpy = sinon.spy();
		var proxy = once(windowPostMessageSpy);
		
		var targetWindow = {
			postMessage: windowPostMessageSpy,
		};
		
		var myPostMessage = new PostMessage('testSender', 'testMessage', true, { testData: 1 });
		myPostMessage.dispatch(targetWindow);
		
		assert(windowPostMessageSpy.calledOnce, true,
			'targetWindow.postMessage must be called on dispatch');
	});
	
	it('throws exception if parsing a non postmessage',
		function (){
			var myPostMessage = new PostMessage('testSender', 'testMessage', true, { testData: 1 });
			try{
				myPostMessage.parse({});
				assert(false, true, 'exception should be thrown on non postmessage');
			} catch (err){
				assert(true, true, 'exception should be thrown');
			}
		}
	);
});

