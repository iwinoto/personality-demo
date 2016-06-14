#Use to run off Cloud Foundry
export VCAP_SERVICES='{
  "personality_insights": [
   {
    "credentials": {
     "password": "hoZWX7EHEY4h",
     "url": "https://gateway.watsonplatform.net/personality-insights/api",
     "username": "956715b9-b14c-4f8d-b977-f4c72949cede"
    },
    "label": "personality_insights",
    "name": "iw-personality-demo-personality_insights",
    "plan": "tiered",
    "tags": [
     "watson",
     "ibm_created",
     "ibm_dedicated_public"
    ]
   }
  ]
 }'
 
 echo $VCAP_SERVICES
 