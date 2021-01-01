#!/bin/bash

# we already get this information in each lambda json dump below...
# aws lambda list-functions > manifest.json

# --query to grab only FunctionName from returned json
# sed to remove first and last lines
# cut to remove trailing comma
# xargs to combine them all to a single line
for f in $(aws lambda list-functions --query 'Functions[*].FunctionName' | sed '1d;$d' | cut -d, -f1 | xargs);
do
  echo "Processing $f"
  # filter out the code section because the Location property changes each time (noisey).
  aws lambda get-function --function-name $f  | jq 'with_entries( select(.key|contains("Code")|not))' > $f.json
  aws lambda get-function --function-name $f --query 'Code.Location' | xargs wget -O /tmp/out.zip
  unzip -o /tmp/out.zip -d ./$f/
done
