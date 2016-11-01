#Use to run off Cloud Foundry
export VCAP_SERVICES='{
  "personality_insights": [
   {
    "credentials": {
        "url": "https://gateway.watsonplatform.net/personality-insights/api",
        "password": "etxihk3iGNCf",
        "username": "b4b4609e-27a7-4fbb-be17-e104d27491d6"
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
 