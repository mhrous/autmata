define({ "api": [
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./doc/main.js",
    "group": "C__Users_Mahrous_Desktop_New_folder__2__Training_lector_backend_doc_main_js",
    "groupTitle": "C__Users_Mahrous_Desktop_New_folder__2__Training_lector_backend_doc_main_js",
    "name": ""
  },
  {
    "type": "post",
    "url": "/dfa",
    "title": "Add New DFA",
    "name": "ADD_DFA",
    "group": "_",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"name\": اسم الاتومات,\n  \"dfa\": {\n     \"nodes\": [\n        {\n          \"start\": متغير بولياني يدل على كون الحالة بداية ,\n          \"label\": اسم الحالة\n          \"end\":متغير بولياني يدل على كون الحالة نهائية\n        },\n     ],\n     \"edges\": [\n        {\n          \"to\": اسم حالة الوصول,\n          \"from\": اسم حالة الانتقال,\n          \"state\": قيمة الانتقال\n        },\n     ],\n     \"alphabetObj\": [\n        احراف الابجداية\n     ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 202 ACCEPTED\n{\n  id: معرف الاتومات المنشا\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./src/routes/index.js",
    "groupTitle": "_"
  },
  {
    "type": "get",
    "url": "/dfa/:id",
    "title": "GET DFA",
    "name": "GET_DFA",
    "group": "_",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 202 ACCEPTED\n  {\n    \"nodes\": [\n       {\n         \"start\": متغير بولياني يدل على كون الحالة بداية ,\n         \"label\": اسم الحالة\n         \"end\":متغير بولياني يدل على كون الحالة نهائية\n       },\n    ],\n    \"edges\": [\n       {\n         \"to\": اسم حالة الوصول,\n         \"from\": اسم حالة الانتقال,\n         \"state\": قيمة الانتقال\n       },\n    ],\n    \"alphabetObj\": [\n       احراف الابجداية\n    ]\n  }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./src/routes/index.js",
    "groupTitle": "_"
  },
  {
    "type": "get",
    "url": "/dfaName",
    "title": "GET Names For DFA",
    "name": "name",
    "group": "_",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 202 ACCEPTED\n  {\n    \"names\": [\n       {\n         \"name\": اسم الاتومات,\n         \"id\": معرف الاتومات\n       },\n     ]\n  }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./src/routes/index.js",
    "groupTitle": "_"
  }
] });
