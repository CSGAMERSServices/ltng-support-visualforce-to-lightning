#!/bin/bash

# environment specific consumer keys
export CONSUMER_KEY_DEV=""; # connected app consumer key
export CONSUMER_SECRET_DEV="3795792477907592194"; # connected app secret

# specify which environment you'd like to behave as
export CONSUMER_KEY=$CONSUMER_KEY_DEV;
export CONSUMER_SECRET=$CONSUMER_SECRET_DEV;

export EX_REQUEST=""; # example canvas request (found in the Visualforce Page - copy here to mock calling from Visualforce)
# any other example requests - like ones that have expired, etc.

# specify which signed request should be used if one was not sent.
export EX_SIGNED_REQUEST=$EX_REQUEST;

#-- uncomment the following line to avoid spinning up workers without closing.
export TESTING=true;