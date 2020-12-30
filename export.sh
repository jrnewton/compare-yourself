#!/bin/bash

pushd ./src/apigateway
./export_apigateway.sh
popd

pushd ./src/lambdafunctions
./export_lambdafunctions.sh
popd

