var apns = require("./index");

var options = {
   keyFile : "conf/key.pem",
   certFile : "conf/cert.pem",
   debug : true
};

var connection = new apns.Connection(options);


var goodToken = "c5bf61a839855b92a394dc883433df64447a7fe7ed0d8ee121f97c9973628f32",
    notification = new apns.Notification(),
    device = new apns.Device(goodToken);

notification.alert = "Hello World (must not be sent) !";
notification.device = device;


var goodToken = "b5bf61a839855b92a394dc883433df64447a7fe7ed0d8ee121f97c9973628f32",
notification2 = new apns.Notification(),
device2 = new apns.Device(goodToken);

notification2.alert = "Hello World !";
notification2.device = device2;


connection.sendNotification(notification);
connection.sendNotification(notification2);