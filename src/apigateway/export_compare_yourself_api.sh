#!/bin/bash

# using text value for parameters did not allow multiple values for extensions.  Use json instead.
aws apigateway get-export --rest-api-id 8dqz0v87p3 --stage-name dev --export-type swagger --parameters '{"extensions":"integrations,authorizers"}' compare_yourself_swagger.json

# Meh - not sure how useful this is... 
# aws apigateway get-sdk --rest-api-id 8dqz0v87p3 --stage-name dev --sdk-type javascript compare_yourself_sdk.zip 
