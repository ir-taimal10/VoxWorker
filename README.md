# Vox

### Install Dependencies

We have dependencies for test enviroment in this project, this tools help
us manage and test the application.

* We get the tools we depend upon via `npm`, the [node package manager][npm].


We have configured `npm` to download all tools on WebContent/node_modules

```
git fetch --all
git reset --hard origin/master

cd Vox/WebContent
Vox\WebContent>npm install
Vox\WebContent>npm install -g webpack
```


* `node_modules` - contains the npm packages for the tools we need




### Webpack
To generate the bundle and to start the application, you must run:

```
Vox\WebContent>webpack
Vox\WebContent>npm start
```
Once generated the bundle, you can open  the project with webstorm and open the index.html in the root and see the application in a browser. http://localhost:3000





(Optional)watch for changes in source files
```
Vox\WebContent>webpack -w 
```



### CouchDB

```
http://127.0.0.1:5984/_utils/
//Create  Admin  user: admin   password:admin
http://localhost:5984/_utils/#createAdmin/couchdb@localhost
//Create initial DBs
announcements
users
voices
```
