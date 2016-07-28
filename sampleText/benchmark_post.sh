#!/bin/bash -x
JSON=Bill_Shorten.json
CMD="ab -n 1 -c 1 -r -v 4 -p ${JSON} -T 'application/json' http://iw-personalityinsights-demo.mybluemix.net/api/profile"

echo $CMD

#cat $JSON

${CMD}
