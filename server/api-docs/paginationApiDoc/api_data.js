define({ "api": [
  {
    "type": "get",
    "url": "/providers/:providerId/unmanagedInstances?page=1&pageSize=5&search=i-656ae2a3&filterBy=region:us-west-2+state:running&sortBy=state&sortOrder=asc",
    "title": "",
    "name": "_providers__providerId_unmanagedInstances",
    "group": "UnmanagedInstance_List_with_Pagination_Sorting_Searching_and_Filtering",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "providerId",
            "description": "<p>Unique providerID.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "page",
            "description": "<p>Current Page default is 1.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "pageSize",
            "description": "<p>Records per page default is 10.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "search",
            "description": "<p>User is able to search for specific attribute. User can enter Instance ID or IP Address for specific search.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "sortBy",
            "description": "<p>User can sort the records for any field. Default: results are sorted by state.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "sortOrder",
            "description": "<p>The sort order if sort parameter is provided. One of asc or desc. Default: desc</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "filterBy",
            "description": "<p>User is able to filter the records for a set of attributes.Default:{state:'running',os:'linux'}</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": true,
            "field": "JSONObject",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n{\n instances: [{\"_id\":\"56e7a198789daf6c3863b25c\",\"orgId\":\"46d1da9a-d927-41dc-8e9e-7e926d927537\",\"providerId\":\"56e2a90dccdaec5111a74e2f\",\"providerType\":\"aws\",\"providerData\":{\"region\":\"us-west-1\"},\"platformId\":\"i-1d97d593\",\"ip\":\"52.77.240.203\",\"os\":\"linux\",\"state\":\"running\",\"__v\":0},\n {\"_id\":\"56e7a199789daf6c3863b263\",\"orgId\":\"46d1da9a-d927-41dc-8e9e-7e926d927537\",\"providerId\":\"56e2a90dccdaec5111a74e2f\",\"providerType\":\"aws\",\"providerData\":{\"region\":\"us-west-1\"},\"platformId\":\"i-9d0f3118\",\"ip\":\"54.88.125.156\",\"os\":\"linux\",\"state\":\"running\",\"__v\":0,\"tags\":{\"Name\":\"SensuServer\"}},\n {\"_id\":\"56e7a19a789daf6c3863b26d\",\"orgId\":\"46d1da9a-d927-41dc-8e9e-7e926d927537\",\"providerId\":\"56e2a90dccdaec5111a74e2f\",\"providerType\":\"aws\",\"providerData\":{\"region\":\"us-west-1\"},\"platformId\":\"i-e75fb552\",\"ip\":\"10.0.0.106\",\"os\":\"linux\",\"state\":\"running\",\"__v\":0,\"tags\":{\"Name\":\"shreeram\"}},\n {\"_id\":\"56e7a19a789daf6c3863b26e\",\"orgId\":\"46d1da9a-d927-41dc-8e9e-7e926d927537\",\"providerId\":\"56e2a90dccdaec5111a74e2f\",\"providerType\":\"aws\",\"providerData\":{\"region\":\"us-west-1\"},\"platformId\":\"i-7bc992b9\",\"ip\":\"54.67.35.103\",\"os\":\"linux\",\"state\":\"running\",\"__v\":0,\"tags\":{\"Name\":\"NginX_Instance\",\"Owner\":\"Hamid\",\"Environment\":\"Production\",\"Role\":\"WebGateway\",\"Bill\":\"Catalyst\"}},\n {\"_id\":\"56e7a19a789daf6c3863b273\",\"orgId\":\"46d1da9a-d927-41dc-8e9e-7e926d927537\",\"providerId\":\"56e2a90dccdaec5111a74e2f\",\"providerType\":\"aws\",\"providerData\":{\"region\":\"us-west-1\"},\"platformId\":\"i-d3411313\",\"ip\":\"10.0.1.92\",\"os\":\"linux\",\"state\":\"running\",\"__v\":0,\"tags\":{\"Name\":\"MonitoringServer\",\"Environment\":\"Production\",\"Owner\":\"Hamid\",\"Bill\":\"Catalyst\"}\n }],\n metaData:{totalRecords:48,\n pageSize:5,\n page:1,\n totalPages:10,\n sortBy:state,\n sortOrder:asc\n filterBy:{region:'us-west-1',state:['running','stopped']}}\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "200",
            "description": "<p>The ProviderID of the Active Organization was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500",
            "description": "<p>Server Behaved Unexpectedly.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 Not Found\n{\n  \"error\": \"provider not found\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 Not Found\n{\n  \"error\": \"data not found\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500\n{\n  \"error\": \"Server Behaved Unexpectedly\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./pagination.js",
    "groupTitle": "UnmanagedInstance_List_with_Pagination_Sorting_Searching_and_Filtering"
  }
] });
