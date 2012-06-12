var Buffer = require('buffer').Buffer;

/**
 * Create notification
 */
var Notification = function ()
{
   this.payload = {};
   this.expiry = 0;
   this.identifier = 0;
   this.device;

   this.alert = undefined;
   this.badge = undefined;
   this.sound = undefined;
};

/**
 * JSON serialization
 */
Notification.prototype.toJSON = function ()
{
   if(this.payload === undefined)
      this.payload = {};
   
   if(this.payload.aps === undefined)
      this.payload.aps = {};
   
   if(typeof this.badge === "number")
      this.payload.aps.badge = this.badge;
   
   if(typeof this.sound === "string")
      this.payload.aps.sound = this.sound;
   
   if(typeof this.alert === "string" || typeof this.alert == "object")
      this.payload.aps.alert = this.alert;
   
   return this.payload;
};

/**
 * Device
 * @param mixed deviceToken
 * @param boolean ascii
 */
var Device = function (token)
{
   var self = this;
   self.token = undefined;
   
   self.setToken(token);
};

/**
 * Convert ascii token to Buffer token
 * @param string token
 * @return Buffer
 */
Device.prototype.parseToken = function (token)
{
   token = token.replace(/\s/g, "");
   var length = Math.ceil(token.length / 2);
   var hexToken = new Buffer(length);
   for (var i = 0; i < token.length; i += 2)
   {
      var word = token[i];
      
      if ((i + 1) >= token.length || typeof(token[i + 1]) === undefined)
         word += '0';
      else
         word += token[i + 1];
      
      hexToken[i / 2] = parseInt(word, 16);
   }
   
   return hexToken;
};

/**
 * Set the token
 * @param mixed newToken
 */
Device.prototype.setToken = function (newToken)
{
   if(typeof newToken === "string")
      newToken = this.parseToken(newToken);
   
   this.token = newToken;
   
   return this;
};

/**
 * Return the hexadecimal token in string
 * @return string
 */
Device.prototype.hexToken = function ()
{
   var out = [];
   var len = this.token.length;
   var n;
   for (var i = 0; i < len; i++)
   {
      n = this.token[i];
      if (n < 16) out[i] = "0" + n.toString(16);
      else out[i] = n.toString(16);
   }
   
   return out.join("");
};

exports.Notification = Notification;
exports.Device = Device;