// app/routes.js
module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    var Event            = require('../app/models/events');
    app.get('/getEvents', function(req, res){
        /*var things = [{eventText:"Walk the dog", weeklyRepeat: [2, 4], singleDates: ["day2018-10--1", "day2018-10--5", "day2018-10--27"], lengthEst:0.5, eventType:"Chore"},
            {eventText:"Watch the orchestra", weeklyRepeat: [], singleDates: ["day2018-10--4", "day2018-10--9"], lengthEst:3, eventType:"Social"},
            {eventText:"Cook dinner", weeklyRepeat: [6, 0], singleDates: [], lengthEst:2, eventType:"Health"},
            {eventText:"Advanced sword fighting", weeklyRepeat: [], singleDates: ["day2018-11--15", "day2019-0--15", "day2019-0--31"], lengthEst:6, eventType:"Class"},
            {eventText:"Write essays", weeklyRepeat:[1], singleDates:[], lengthEst:3, eventType:"Assignment"}];
            */
            //console.log(req.query.userID);
      Event.find({ userID:req.query.userID}, function(err, events) {//"5c1811a564770572b2465d71"
        //console.log(events)
        if (err) throw err;
        res.send(events);
      });

    });

    /*app.post('/makeEvent', function(req, res, next) {
      console.log(req.body);
      //console.log(JSON.parse(req.body));
      res.json({'status' : 'ok'});
    });*/
    app.post('/makeEvent', function(req, res){
      var newEvent            = new Event();
      var obj = /*JSON.parse(req)*/req.body;
      //console.log(obj);
      // set the user's local credentials
      newEvent.eventText = obj.eventText;
      newEvent.weeklyRepeat = obj.weeklyRepeat;
      newEvent.singleDates = obj.singleDates;
      newEvent.lengthEst = obj.lengthEst;
      newEvent.eventType = obj.eventType;
      newEvent.userID = obj.userID;

      // save the user
      newEvent.save(/*function(err) {
          if (err)
              throw err;
          return done(null, newEvent);
      }*/)
    })

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/calendar', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/calendar', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/calendar', isLoggedIn, function(req, res) {
        res.render('calendar.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
      passport.authenticate('google', {
              successRedirect : '/calendar',
              failureRedirect : '/'
      }));


    app.post('/posting', function(req, res){
      //console.log("posting");
      //console.log(req.eventObj);
    });

};





// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
