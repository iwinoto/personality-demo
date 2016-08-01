## BMX Dedicated IBM staging admin console walk through
  * DevOps concerned about maverick service instantiation, show catalogue management and organisation utilisation.

## Demo application build and resilience with node.js and Personality Insight boilerplate
  1. get code from boiler plate - **Node.js->Watson Personality Insights**
    * Applcation name: `PersonalityInsights`
    * Host name: `iw-personalityinsights-demo` - this will be derived from `cf-targets.json` file during `grunt deploy`
  * Explore application overview and application when its ready
  * Indicate where to connect to github repo and deploy pipeline (new toolchain?)
    * `https://github.com/iwinoto/personality-demo`
  * Explore code editing
    * Eclipse, Atom, Orion
    * edit `views/indes.ejs` show instance display code
  * Uncomment kill me button code
  * commit code and show pipeline
    - talk about other tools, eg Jenkins
  * kill an instance
    * talk about platform resilience
    * show instance restart
  * add auto scale service
    * as app restages talk about platform auto configuring routing
  * Config auto scale service
    * min instances 2
    * Upper threshold: 75% (80% ?)
    * Lower threshold: 70%
    * all timers and windows to minimum (30 sec in US)
  * test with:
    * Post profile request for greater workload stress.
      * After stressing with a series of POSTs, send some GETs to reclaim memory:

      ```bash
      $ ab -n 1000 -c 15 -s 60 -r -p sampleText/Bill\ Shorten.json -T 'application/json' http://iw-personalityinsights-demo.mybluemix.net/api/profile
      ```
    * Get page:
      * After stressing with a series of POSTs, send some GETs to reclaim memory and show scale down:

      ```bash
      $ ab -n 1000 -c 15 -s 60 -r http://iw-personalityinsights-demo.mybluemix.net/
      ```

## Demo OpenWhisk.

Trigger an action through a DB update
1. create CloudantNoSQL DB
* create whisk action to get Personality Insight from text
  1. create action
  * test action
* get CloudantNoSQL credentials
* create

https://console.ng.bluemix.net/docs/dedicated/index.html#dedicated
