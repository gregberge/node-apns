var Connection = require("./connection").Connection,
    Notification = require("./notification").Notification,
    Device = require("./notification").Device;

var options = {
   keyFile : "conf/key.pem",
   certFile : "conf/cert.pem"
};

var token = "c5bf61a839855b92a394dc883433df64447a7fe7ed0d8ee121f97c9973628f32";

var notification = new Notification();
var device = new Device(token);

notification.alert = "Test !";
notification.device = device;

var token = "b5bf61a839855b92a394dc883433df64447a7fe7ed0d8ee121f97c9973628f32";

var notification2 = new Notification();
var device2 = new Device(token);

notification2.alert = "Test 2";
notification2.device = device2;

var connection = new Connection(options);
connection.sendNotification(notification);
connection.sendNotification(notification2);