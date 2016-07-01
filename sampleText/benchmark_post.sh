#!/bin/bash -x
JSON=Bill_Shorten-02.json
#JSON="Bill\ Shorten-02.json"
CMD="ab -n 1 -c 1 -r -v 4 -p ${JSON} -T 'application/json' http://iw-personalityinsights-demo.mybluemix.net/api/profile"

echo $CMD

#cat $JSON

${CMD}
