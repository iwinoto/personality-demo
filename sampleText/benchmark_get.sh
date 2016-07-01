#!/bin/bash
CMD="ab -n 1000 -c 15 -r  http://iw-personalityinsights-demo.mybluemix.net/"

echo $CMD

${CMD}
