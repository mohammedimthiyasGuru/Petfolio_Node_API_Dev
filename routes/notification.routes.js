var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var notificationModel = require('./../models/notificationModel');
var userdetailsModel = require('./../models/userdetailsModel');

router.post('/create', async function(req, res) {
  console.log(req.body);
  try{
        await notificationModel.create({
            user_id:  req.body.user_id,
            notify_title : req.body.notify_title,
            notify_descri : req.body.notify_descri,
            notify_img : req.body.notify_img,
            notify_time : "",
            date_and_time : req.body.date_and_time,
            delete_status : false
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Notification Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.post('/filter_date', function (req, res) {
        notificationModel.find({}, function (err, StateList) {
          var final_Date = [];
          for(let a = 0; a < StateList.length; a ++){
            var fromdate = new Date(req.body.fromdate);
            var todate = new Date(req.body.todate);
            var checkdate = new Date(StateList[a].createdAt);
            console.log(fromdate,todate,checkdate);
            if(checkdate >= fromdate && checkdate <= todate){
              final_Date.push(StateList[a]);
            }
            if(a == StateList.length - 1){
              res.json({Status:"Success",Message:"Demo screen  List", Data : final_Date ,Code:200});
            }
          }
        });
});



router.post('/mobile/alert/notification',async function (req, res) {
       var appointment_id = req.body.appointment_UID;
       var title  = '';
       var subtitle = '';
       var msg = '';
       var date = req.body.date;
       if(req.body.status == "Payment Failed"){
       title = "Payment Failed";
       subtitle = "Payment Failed";
       body = "There was an error processing your appointment. Please try again"
       sendnotify(req.body.user_id,title,body,subtitle,date);
       } 
       else if(req.body.status == "Patient Appointment Cancelled"){
       appointmetitle = "Appointment Cancelled";
       doc_subtitle = "Appointment Cancelled";
       doc_body = "Patient Cancelled the appointment of "+appointment_id+" at "+date;
       pet_subtitle = "Appointment Cancelled";
       pet_body = "You have Cancelled the appointment of "+appointment_id+" at "+date;
       sendnotify(req.body.user_id,title,pet_body,pet_subtitle,date);
       sendnotify(req.body.doctor_id,title,doc_body,doc_subtitle,date);
       } 
       else if(req.body.status == "Doctor Appointment Cancelled"){
       title = "Appointment Cancelled";
       doc_subtitle = "Appointment Cancelled";
       doc_body = "You have Cancelled the appointment of "+appointment_id+" at "+date;
       pet_subtitle = "Appointment Cancelled";
       pet_body = "Doctor Cancelled the appointment of "+appointment_id+" at "+date;
       sendnotify(req.body.user_id,title,pet_body,pet_subtitle,date);
       sendnotify(req.body.doctor_id,title,doc_body,doc_subtitle,date);
       } 
       else if(req.body.status == "No show"){
       title = "Appointment Missed";
       doc_subtitle = "Appointment Missed";
       doc_body = "You have Missed the appointment of "+appointment_id+" at "+date;
       pet_subtitle = "Appointment Missed";
       pet_body = "You have Missed the appointment of "+appointment_id+" at "+date;
       sendnotify(req.body.user_id,title,pet_body,pet_subtitle,date);
       sendnotify(req.body.doctor_id,title,doc_body,doc_subtitle,date);

       }

        else if(req.body.status == "Appointment Completed"){
       title = "Appointment Completed";
       doc_subtitle = "Appointment Completed";
       doc_body = "You have Completed the appointment of "+appointment_id+" at "+date;
       pet_subtitle = "Appointment Completed";
       pet_body = "You have Completed the appointment of "+appointment_id+" at "+date;
       sendnotify(req.body.user_id,title,pet_body,pet_subtitle,date);
       sendnotify(req.body.doctor_id,title,doc_body,doc_subtitle,date);

       }
async function sendnotify(user_id,title1,body1,subtitle1,datetime1) {


let phone  =  await userdetailsModel.findOne({_id:user_id});

  var user_id = user_id; 
  var title1 = title1;
  var body1 = body1;
  var subtitle1 = subtitle1;
  var datetime1 = datetime1;



 // userdetailsModel.findOne({_id:user_id},async function (err, phone) {
          // res.json({Status:"Success",Message:"Notification Details", Data : phone ,Code:200});
// console.log(phone);
const headers = {
 'Authorization': 'key=AAAAuAfKTJc:APA91bEqg2JkAjFv_0zTeD-1V2NYdQuwEn9jFJitGzMj607Qh7Xp5UhSEkzVKcgN64s4pt0UA1jqdjPAhnZP9bA1bxLcWJonPHWuRQfP4DkW2du79egB9krlUH2GRa6WmGZ0uOLd0Gyg',
 'Content-Type': 'application/json'
}
     // Set the message as high priority and have it expire after 24 hours.
        var options = {
          priority: "high",
          timeToLive: 60 * 60 * 24
        };
          var request1 = require("request");
           // firebase url
        var myURL1 = "https://fcm.googleapis.com/fcm/send";
        var body1 = {
          to: phone.fb_token,
          notification: {
            title: subtitle1,
            body: body1,
            subtitle: subtitle1,
            sound: "default"
          }
        };
        console.log(body1);
         request1.post(
            {
              url: myURL1,
              method: "POST",
              headers,
              body: body1,
              options,
              json: true
            }, function(error, response, body1) {
              if (error) {
                return res.json(
                  _.merge(
                    {
                      error: error
                    },
                    utils.errors["500"]
                  )
                );
              }else {
                console.log(response.body);
                console.log("Firebase Send");
              }
            });

  try{
        await notificationModel.create({
            user_id:  phone._id,
            notify_title : subtitle1,
            notify_descri : body1.notification.body,
            notify_img : "",
            notify_time : datetime1,
            date_and_time : datetime1
        }, 
        function (err, user) {
          console.log(user)
          console.log(err)

        // res.json({Status:"Success",Message:"Notification Added successfully", Data : user ,Code:200}); 
        });
}catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}

// });

}
 res.json({Status:"Success",Message:"Notification Added successfully", Data : {} ,Code:200}); 
});





router.post('/mobile/alert/sp_notification',async function (req, res) {
       var appointment_id = req.body.appointment_UID;
       var title  = '';
       var subtitle = '';
       var msg = '';
       var date = req.body.date;
       if(req.body.status == "Payment Failed"){
       title = "Payment Failed";
       subtitle = "Payment Failed";
       body = "There was an error processing your appointment. Please try again"
       sendnotify(req.body.user_id,title,body,subtitle,date);
       } 
       else if(req.body.status == "Patient Appointment Cancelled"){
       appointmetitle = "Appointment Cancelled";
       doc_subtitle = "Appointment Cancelled";
       doc_body = "Patient Cancelled the appointment of "+appointment_id+" at "+date;
       pet_subtitle = "Appointment Cancelled";
       pet_body = "You have Cancelled the appointment of "+appointment_id+" at "+date;
       sendnotify(req.body.user_id,title,pet_body,pet_subtitle,date);
       sendnotify(req.body.sp_id,title,doc_body,doc_subtitle,date);
       } 
       else if(req.body.status == "Doctor Appointment Cancelled"){
       title = "Appointment Cancelled";
       doc_subtitle = "Appointment Cancelled";
       doc_body = "You have Cancelled the appointment of "+appointment_id+" at "+date;
       pet_subtitle = "Appointment Cancelled";
       pet_body = "SP Cancelled the appointment of "+appointment_id+" at "+date;
       sendnotify(req.body.user_id,title,pet_body,pet_subtitle,date);
       sendnotify(req.body.sp_id,title,doc_body,doc_subtitle,date);
       } 
       else if(req.body.status == "No show"){

       title = "Appointment Missed";
       doc_subtitle = "Appointment Missed";
       doc_body = "You have Missed the appointment of "+appointment_id+" at "+date;
       pet_subtitle = "Appointment Missed";
       pet_body = "You have Missed the appointment of "+appointment_id+" at "+date;
       sendnotify(req.body.user_id,title,pet_body,pet_subtitle,date);
       sendnotify(req.body.sp_id,title,doc_body,doc_subtitle,date);

       }

        else if(req.body.status == "Appointment Completed"){
       title = "Appointment Completed";
       doc_subtitle = "Appointment Completed";
       doc_body = "You have Completed the appointment of "+appointment_id+" at "+date;
       pet_subtitle = "Appointment Completed";
       pet_body = "You have Completed the appointment of "+appointment_id+" at "+date;
       sendnotify(req.body.user_id,title,pet_body,pet_subtitle,date);
       sendnotify(req.body.sp_id,title,doc_body,doc_subtitle,date);

       }

       
async function sendnotify(user_id,title1,body1,subtitle1,datetime1) {
  console.log(user_id,title1,body1,subtitle1,datetime1);

let phone  =  await userdetailsModel.findOne({_id:user_id});

  var user_id = user_id; 
  var title1 = title1;
  var body1 = body1;
  var subtitle1 = subtitle1;
  var datetime1 = datetime1;


 // userdetailsModel.findOne({_id:user_id},async function (err, phone) {
          // res.json({Status:"Success",Message:"Notification Details", Data : phone ,Code:200});
// console.log(phone);
const headers = {
 'Authorization': 'key=AAAAuAfKTJc:APA91bEqg2JkAjFv_0zTeD-1V2NYdQuwEn9jFJitGzMj607Qh7Xp5UhSEkzVKcgN64s4pt0UA1jqdjPAhnZP9bA1bxLcWJonPHWuRQfP4DkW2du79egB9krlUH2GRa6WmGZ0uOLd0Gyg',
 'Content-Type': 'application/json'
}
     // Set the message as high priority and have it expire after 24 hours.
        var options = {
          priority: "high",
          timeToLive: 60 * 60 * 24
        };
          var request1 = require("request");
           // firebase url
        var myURL1 = "https://fcm.googleapis.com/fcm/send";
        var body1 = {
          to: phone.fb_token,
          notification: {
            title: title1,
            body: body1,
            subtitle: subtitle1,
            sound: "default"
          }
        };
        console.log(body1);
         request1.post(
            {
              url: myURL1,
              method: "POST",
              headers,
              body: body1,
              options,
              json: true
            }, function(error, response, body1) {
              if (error) {
                return res.json(
                  _.merge(
                    {
                      error: error
                    },
                    utils.errors["500"]
                  )
                );
              }else {
                console.log(response.body);
                console.log("Firebase Send");
              }
            });

  try{
        await notificationModel.create({
            user_id:  phone._id,
            notify_title : subtitle1,
            notify_descri : body1.notification.body,
            notify_img : "",
            notify_time : datetime1,
            date_and_time : datetime1
        }, 
        function (err, user) {
          console.log(user)
        // res.json({Status:"Success",Message:"Notification Added successfully", Data : user ,Code:200}); 
        });
}catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}

// });

}
 res.json({Status:"Success",Message:"Notification Added successfully", Data : {} ,Code:200}); 
});




router.post('/admin_send_notification', function (req, res) {
  res.json({Status:"Success",Message:"Notification Send successfully", Data : '' ,Code:200});
});


router.post('/sendnotification_doc_start', async function(req, res) {
   let phone  =  await userdetailsModel.findOne({_id:req.body.user_id});
     const headers = {
 'Authorization': 'key=AAAAuAfKTJc:APA91bEqg2JkAjFv_0zTeD-1V2NYdQuwEn9jFJitGzMj607Qh7Xp5UhSEkzVKcgN64s4pt0UA1jqdjPAhnZP9bA1bxLcWJonPHWuRQfP4DkW2du79egB9krlUH2GRa6WmGZ0uOLd0Gyg',
 'Content-Type': 'application/json'
}
     // Set the message as high priority and have it expire after 24 hours.
        var options = {
          priority: "high",
          timeToLive: 60 * 60 * 24
        };
          var request1 = require("request");
           // firebase url
        var myURL1 = "https://fcm.googleapis.com/fcm/send";
        var body1 = {
          to: phone.user_token,
          notification: {
            title: "Appointment",
            body: "Doctor Start the appointment, waiting for you",
            subtitle: "Appointment Startard....",
            sound: "default"
          }
        };
         request1.post(
            {
              url: myURL1,
              method: "POST",
              headers,
              body: body1,
              options,
              json: true
            }, function(error, response, body1) {
              if (error) {
                return res.json(
                  _.merge(
                    {
                      error: error
                    },
                    utils.errors["500"]
                  )
                );
              }else {
                console.log(response.body);
                console.log("Firebase Send");
              }
            });

  try{
        await notificationModel.create({
            user_id:  req.body.user_id,
            notify_title : "Appointment",
            notify_descri : "Doctor Start the appointment, waiting for you",
            notify_img : "",
            notify_time : "",
            date_and_time : req.body.date_and_time
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Notification Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});




router.post('/send_notifiation', async function(req, res) {
  console.log("Notification Send Request", req.body);
     const headers = {
 'Authorization': 'key=AAAAuAfKTJc:APA91bEqg2JkAjFv_0zTeD-1V2NYdQuwEn9jFJitGzMj607Qh7Xp5UhSEkzVKcgN64s4pt0UA1jqdjPAhnZP9bA1bxLcWJonPHWuRQfP4DkW2du79egB9krlUH2GRa6WmGZ0uOLd0Gyg',
 'Content-Type': 'application/json'
}
     // Set the message as high priority and have it expire after 24 hours.
        var options = {
          priority: "high",
          timeToLive: 60 * 60 * 24
        };
          var request1 = require("request");
           // firebase url
        var myURL1 = "https://fcm.googleapis.com/fcm/send";
        var body1 = {
          to: req.body.user_token,
          notification: {
            title: req.body.title,
            body: req.body.message,
            subtitle: req.body.subtitle,
            sound: "default"
          }
        };
         request1.post(
            {
              url: myURL1,
              method: "POST",
              headers,
              body: body1,
              options,
              json: true
            }, function(error, response, body1) {
              if (error) {
                return res.json(
                  _.merge(
                    {
                      error: error
                    },
                    utils.errors["500"]
                  )
                );
              }else {
              	console.log(response.body);
                console.log("Firebase Send");
              }
            });

  try{
        await notificationModel.create({
            user_id:  req.body.user_id,
            notify_title : req.body.notify_title,
            notify_descri : req.body.notify_descri,
            notify_img : req.body.notify_img,
            notify_time : "",
            date_and_time : req.body.date_and_time
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Notification Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});



router.get('/deletes', function (req, res) {
      notificationModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Notification Deleted", Data : {} ,Code:200});     
      });
});


router.post('/mobile/getlist_id', function (req, res) {
        notificationModel.find({user_id:req.body.user_id}, function (err, StateList) {
             StateList.sort(function compare(a, b) {
               var dateA = new Date(a.updatedAt);
               var dateB = new Date(b.updatedAt);
               console.log(dateA,dateB);
               return dateB - dateA;
               });
          res.json({Status:"Success",Message:"Notification List", Data : StateList ,Code:200});
        });
});



router.get('/getlist', function (req, res) {
        notificationModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Notification Details", Data : Functiondetails ,Code:200});
        });
});


router.get('/mobile/getlist', function (req, res) {
        notificationModel.find({}, function (err, Functiondetails) {
          let a = {
            usertypedata : Functiondetails
          }
          res.json({Status:"Success",Message:"Notification Details", Data : a ,Code:200});
        });
});

router.post('/edit', function (req, res) {
        notificationModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Notification Updated", Data : UpdatedDetails ,Code:200});
        });
});


router.post('/delete', function (req, res) {
 let c = {
    delete_status : true
  }
  notificationModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Location Deleted successfully", Data : UpdatedDetails ,Code:200});
  });
});

// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      notificationModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Notification Deleted successfully", Data : {} ,Code:200});
      });
});

module.exports = router;
