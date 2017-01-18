#Verjson

A simple microservice that allows you to store and retreive json documents and deals with version control.

## API

### Create a document
	`POST` /document

* **Data Params**
	Any Json document

* **Response**
	`{ id : *document id to use for retreival* }`

### Retrive a document
	`GET` /document/{id}/{version}
	* **Url Params**
		* *required* id: the id of the document
		* *optional* version: the specific version of the document, if not specified the newest version will be returned

	* **Response**
	The Json document

### Update a document
	`POST` /document/{id}
	* **Data Params**
		The updated json document

	* **Response**
	`{ version : *the version number for this update* }`
