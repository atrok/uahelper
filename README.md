"# uahelper" 

Prerequisites:

Install nodejs from https://nodejs.org/download/release/v8.15.1/
Install CouchDB from http://couchdb.apache.org/
Install Git from https://git-scm.com/download/win
Install Oracle Instant Client 12.2 from http://www.oracle.com/technetwork/topics/winx64soft-089540.html
Install Microsoft VC Distributable 2013 http://download.microsoft.com/download/0/5/6/056dcda9-d667-4e27-8001-8a0c6971d6b1/vcredist_x64.exe
(restart is required)
Install Python 2.7 https://www.python.org/downloads/release/python-2715/


Installation:
Add path to Oracle Client libraries to %PATH%
Create a C:\SATools folder and run from command line:
	git clone https://github.com/atrok/uahelper.git
	git clone https://github.com/atrok/webscrapper.git
	npm install enduro -g
	go to /uahelper and unpack enduro_server.zip into AppData\Roaming\npm\node_modules\enduro\libs\enduro_server 
