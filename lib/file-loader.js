var fs = require('fs');

/**
 * Create a file loader
 */
var FileLoader = function()
{
   /**
    * Files
    * @type object
    */
   this.files = {};
};

/**
 * Load file
 * @param string file File
 * @param function callback Callback
 */
FileLoader.prototype.load = function(file, callback)
{
   if(typeof this.files[file] !== "undefined")
   {
      if(this.files[file].loaded === true)
      {
         callback(this.files[file].data);
         return;
      }
   }
   else
   {
      if(typeof this.files[file] === "undefined")
      {
         this.files[file] = {};
         this.files[file].loaded = false;
         this.files[file].data = null;
         this.files[file].callbacks = [];

         var k = this;

         fs.readFile(file, function (err, data)
         {
            if (err) throw err;
            
            k.files[file].data = data;
            k.files[file].loaded = true;

            var i;
            for(i = 0; i < k.files[file].callbacks.length; i++)
            {
               k.files[file].callbacks[i].call(k, data);
            }
         });
      }
   }

   this.files[file].callbacks.push(callback);
};

exports.FileLoader = FileLoader;