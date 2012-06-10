var FileLoader = require("./file-loader").FileLoader,
    tls = require('tls'),
    extend = require("./util").extend,
    int2buf = require("./util").int2buf,
    Q = require("q"),
    Buffer = require('buffer').Buffer;

fileLoader = new FileLoader();

/**
 * Create a connection
 * @param object options Options
 */
var Connection = function(options)
{
   // Default options
   this.options = {
      certFile : null,
      keyFile : null,
      certData : null,
      keyData : null,
      passphrase : null,
      gateway : "gateway.push.apple.com",
      port : 2195,
      enhanced : true,
      errorCallback : null,
      cacheLength : 1000,
      connectionTimeout : 10 * 60 * 1000
   };
   
   extend(this.options, options);
   
   this.initialized = false;
   
   this.cert = undefined;
   this.key = undefined;
   this.passphrase = undefined;
   
   this.tlsConnection = null;
   this.writeBuffer = [];
   
   this.initializeDeferred = null;
   this.openSocketDeferred = null;
   
   this.startSocketTime = null;
   
   this.currentId = 0;
};

/**
 * Check if the connection is initialized
 * @return boolean
 */
Connection.prototype.checkInitialized = function()
{
   if(this.key && this.cert)
      this.initializeDeferred.resolve();
};

/**
 * Initialize connection
 */
Connection.prototype.initialize = function()
{
   if(this.initializeDeferred)
      return this.initializeDeferred.promise;
   else
      this.initializeDeferred = Q.defer();
   
   if(typeof this.options.passphrase === "string")
      this.passphrase = this.options.passphrase;
   
   var k = this;
   
   if(this.options.certData)
   {
      this.cert = this.options.certData;
   }
   else if(this.options.certFile)
   {
      fileLoader.load(this.options.certFile, function(data){
         k.cert = data;
         k.checkInitialized();
      });
   }
   
   if(this.options.keyData)
   {
      this.key = this.options.keyData;
   }
   else if(this.options.keyFile)
   {
      fileLoader.load(this.options.keyFile, function(data){
         k.key = data;
         k.checkInitialized();
      });
   }
   
   return this.initializeDeferred.promise;
};

/**
 * Open socket
 */
Connection.prototype.openSocket = function()
{
   if(this.tlsConnection !== null
   && (this.tlsConnection.readyState === "open" || this.tlsConnection.readyState === "opening"))
      return this.openSocketDeferred.promise;
   else
   {
      if(this.openSocketDeferred)
         return this.openSocketDeferred.promise;
      else
         this.openSocketDeferred = Q.defer();
   }
   
   this.initialize().then(function()
   {
      var tlsConnectionOptions = {};
      
      if(this.key)
         tlsConnectionOptions.key = this.key;
      
      if(this.cert)
         tlsConnectionOptions.cert = this.cert;
      
      if(this.passphrase)
         tlsConnectionOptions.passphrase = this.passphrase;
      
      this.tlsConnection = tls.connect(
      this.options['port'],
      this.options['gateway'],
      tlsConnectionOptions,
      function(){
         if (!this.tlsConnection.authorized)
            throw this.tlsConnection.authorizationError;
         
         this.startSocketTime = new Date().getTime();
         
         this.openSocketDeferred.resolve();
      }.bind(this));
      
      this.tlsConnection.on("data", this.handleTransmissionError.bind(this));
      this.tlsConnection.on("error", this.resetTlsConnection.bind(this));
      this.tlsConnection.on("drain", this.drain.bind(this));
      this.tlsConnection.on("end", this.resetTlsConnection.bind(this));
      this.tlsConnection.once("close", this.resetTlsConnection.bind(this));
      
   }.bind(this));
   
   return this.openSocketDeferred.promise;
};

/**
 * Drain notifications
 */
Connection.prototype.drain = function()
{
   if(this.tlsConnection.socket.bufferSize !== 0)
      return;
   
   while(this.writeBuffer.length && this.tlsConnection.socket.bufferSize === 0)
   {
      this.sendNotification(writeBuffer.shift());
   }
};

/**
 * Reset the connection
 */
Connection.prototype.resetTlsConnection = function()
{
   this.tlsConnection.removeAllListeners();
   this.tlsConnection.end();
   this.tlsConnection = null;
};

/**
 * Catch notification error return by Apple server
 * @param Buffer data Data
 */
Connection.prototype.handleTransmissionError = function(data)
{
   if (data[0] == 8)
   {
      console.log("error");
      //error process
   }
};

/**
 * Send notification
 * @param Notification notification
 */
Connection.prototype.sendNotification = function(notification)
{
   this.openSocket().then(function()
   {
      if(this.tlsConnection.socket.bufferSize !== 0)
      {
         this.writeBuffer.push(notification);
         return ;
      }
         
      var encoding = "utf8",
      token = notification.device.token,
      message = JSON.stringify(notification),
      messageLength = Buffer.byteLength(message, encoding),
      pos = 0,
      data;

      if (notification.encoding)
      {
         encoding = notification.encoding;
      }

      notification._uid = this.currentId++;

      if (this.options.enhanced === true)
      {
         data = new Buffer(1 + 4 + 4 + 2 + token.length + 2 + messageLength);
         data[pos] = 1;
         pos++;

         pos += int2buf(notification._uid, data, pos, 4);

         pos += int2buf(notification.expiry, data, pos, 4);
      }
      else
      {
         data = new Buffer(1 + 2 + token.length + 2 + messageLength);
         data[pos] = 0;
         pos++;
      }

      pos += int2buf(token.length, data, pos, 2);
      pos += token.copy(data, pos, 0);
      pos += int2buf(messageLength, data, pos, 2);
      data.write(message, pos, encoding);
      
      this.tlsConnection.write(data);
      
   }.bind(this));
};


exports.Connection = Connection;