node-apns
=========

node-apns is a very effective and resilient APNS (Apple Push Notification Service) interface written in node.js

It's simple to use, catch error and send notifications !

How to use it ?
---------------

````javascript
var apns = require("apns"), options, connection, notification;

options = {
   keyFile : "conf/key.pem",
   certFile : "conf/cert.pem",
   debug : true
};

connection = new apns.Connection(options);

notification = new apns.Notification();
notification.device = new apns.Device("iphone_token");
notification.alert = "Hello World !";

connection.sendNotification(notification);
````

Installation
============

Via [npm][]:

     $ npm install apns
	
As a submodule of your project

	$ git submodule add http://github.com/neoziro/node-apns.git apns
	$ git submodule update --init
	
[npm]: https://github.com/isaacs/npm

API
===

new Notification()
------------------

Create a notification to send throw a connection.

* `notification.payload` : Notification payload.
* `notification.badge` : The number on the badge.
* `notification.sound` : The sound to use.
* `notification.alert` : Alert text.
* `notification.device` : The device where notification is sent.
* `notification.encoding` : The encoding of the notification, default `utf8`. If you wish to send notifications containing emoji or other multi-byte characters you will need to set `notification.encoding = 'ucs2'`. This tells node to send the message with 16bit characters, however it also means your message payload will be limited to 127 characters.

````javascript
var apns = require("apns"), notification;

notification = new apns.Notification();
notification.payload = {"description" : "A good news !"};
notification.badge = 1;
notification.sound = "dong.aiff";
notification.alert = "Hello World !";
notification.device = new apns.Device("iphone_token");
````

new Device(token)
-----------------

The device where notification is sent.

* `token` : The token in Buffer or string.

````javascript
var apns = require("apns"), device;

device = new apns.Device("iphone_token");
````

new Connection(options)
----------------

Create a connection to open a socket and send notification.

Options avalaible are :

* `certData` : Cert as Buffer.
* `keyData` : Key as Buffer.
* `certFile` : Path to the cert file (only if you don't use certData).
* `keyFile` : Path to the key file (only if you don't use keyData).
* `passphrase` : Passphrase used to connect.
* `gateway` : Apple gateway, default `gateway.push.apple.com`.
* `port` : Connection port, default `2195`.
* `enhanced` : Use enhanced mode to catch error, default `true`.
* `errorCallback` : Error callback.
* `cacheLength` : The number of notification to see if an error occur, if you don't know, let as default. Default `1000`.
* `connectionTimeout` : Time in ms before connection close, 10 minutes, is the time advised. Default `600000`.
* `debug` : Active debug mode (log main step to stdout), default `false`.

````javascript
var apns = require("apns");

var options = {
   keyFile : "conf/key.pem",
   certFile : "conf/cert.pem",
   debug : true
};

var connection = new apns.Connection(options);
````

connection.send(notification)
----------------------------

Send a notification.

* `notification` : The notification to send.

````javascript
var apns = require("apns"), notification, options, connection;

options = {
   keyFile : "conf/key.pem",
   certFile : "conf/cert.pem",
   debug : true
};

connection = new apns.Connection(options);

notification = new apns.Notification();
notification.alert = "Hello World !";
notification.device = new apns.Device("iphone_token");

connection.sendNotification(notification);
````

Handling errors
===============

If the enhanced binary interface is enabled and an error occurs when sending a message then subsequent messages will be automatically resent* and the connection will be re-established. If an `errorCallback` is also specified in the connection options then it will be invoked with 2 arguments.

1. The error number as returned from Apple. This can be compared to the predefined values in the `Errors` object.
1. The notification object as it existed when the notification was converted and sent to the server.

\* N.B.: The `cacheLength` option specifies the number of sent notifications which will be cached for error handling purposes. At present if more than the specified number of notifications have been sent between the incorrect notification being sent and the error being received then no resending will occur. This is only envisaged within very high volume environments and a higher cache number might be desired.

License
=======

Copyright (c) 2012 Bergé Greg

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Credits
=======

Written and maintained by [Greg Bergé][neoziro].

Largely inspired by [node-apn][node-apn].

Previously i used node-apn, but it revealed that it was not stable in case of big volumes, so i fork it, and finally I modified the code a lot, so I decided to create a more resilient module.

[neoziro]: http://github.com/neoziro
[node-apn]: https://github.com/argon/node-apn
