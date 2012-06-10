/**
 * Extend function
 * @param object target
 */
var extend = function(target)
{
   var ar = [];
   ar.slice.call(arguments, 1).forEach(function(source) {
      for (key in source)
        if (source[key] !== undefined)
          target[key] = source[key];
   });
};

/**
 * Add integer into a buffer
 * @param int number
 * @param Buffer buffer
 * @param int start
 * @param int length
 * @return number the length
 */
var int2buf = function (number, buffer, start, length) {
   length -= 1;
   for (var i = 0; i <= length; i++) {
      buffer[start + length - i] = number & 0xff;
      number = number >> 8;
   }
   return length + 1;
};

/**
 * Convert bytes to integer
 * @param Buffer bytes
 * @param int length
 * @param int start
 * @return number
 */
var bytes2int = function (bytes, length, start) {
   if (start === undefined) start = 0;
   var num = 0;
   length -= 1;
   for (var i = 0; i <= length; i++) {
      num += (bytes[start + i] << ((length - i) * 8));
   }
   return num;
};

exports.extend = extend;
exports.bytes2int = bytes2int;
exports.int2buf = int2buf;