ABRAMO
======

Abramo is a simple RESTful document based database made in [nodejs](http://nodejs.org/).
It's inspired by the [CouchDB](http://couchdb.apache.org/) HTTP api, but it's not so advanced and it doesn't implement map/reduce.
The entire database is a big hierarchical JSON object.

The following snippet is a sample of database with 2 documents.
The first object is called "pages", it has no data, and it has one child called "first-page".

    {
        "/": {
            "data": null,
            "info": {
                "started_at": "2010-08-14T13:06:47.987Z"
            },
            "children": {
                "pages": {
                    "data": null,
                    "children": {
                        "first-page": {
                            "data": {
                                "title": "First Page",
                                "body": "hello world"
                            },
                            "children": {},
                            "info": {
                                "path": "/pages/first-page",
                                "last_update_at": "2010-08-14T13:07:53.754Z"
                            }
                        }
                    },
                    "info": {
                        "path": "/pages",
                        "last_update_at": "2010-08-14T13:07:53.754Z"
                    }
                }
            }
        }
    }
    
Here how to create the same database after starting abramo:

    curl http://127.0.0.1:9182/pages/first-page -X PUT -d '{"title" : "First Page", "body" : "hello world"}'
    
Basically the url is the key, so to get the value of "/pages/first-page" you just need to send a HTTP GET request to that url:

    curl http://127.0.0.1:9182/pages/first-page

And result will be:
    
    {"data":{"title":"First Page","body":"hello world"},"info":{"path":"/pages/first-page","last_update_at":"2010-08-14T13:07:53.754Z"},"status":200}

You can also use the include_children parameter to get the document with all its children.

    curl http://127.0.0.1:9182/pages?include_children=true
    
The result will be:

    {"data":null,"info":{"path":"/pages","last_update_at":"2010-08-14T13:07:53.754Z"},"children":{"first-page":{"data":{"title":"First Page","body":"hello world"},"children":{},"info":{"path":"/pages/first-page","last_update_at":"2010-08-14T13:07:53.754Z"}}},"status":200}
    
If you want to delete that document you can simply use an HTTP DELETE request:

  curl http://127.0.0.1:9182/pages/first-page -X DELETE
  
Only GET, PUT and DELETE methods are allowed, the HTTP POST request is not implemented.

SAVING DATABASE ON FILE
-----------------------

If you want you can save the JSON database in a file calling the following url:

    curl http://127.0.0.1/_/dump
    
You can specify the file path in the configuration file with the key **dump_file**.

Abramo will try to load that file if it exists the next time you'll start the server.

GETTING STARTED
------------

* Install [nodejs](http://nodejs.org/)
* Download Abramo

Make a copy of the example configuration file that you can find under the config folder, and then start the server:

    /path/to/abramo/bin/abramo /path/to/config/file/abramo-config.json
  
Enjoy