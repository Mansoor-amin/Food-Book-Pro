var fbook = angular.module('foodbookpro');
fbook.factory('recipeService',function($firebaseArray){
  var fb = new Firebase('https://recipebookpro.firebaseio.com');
  var recs = $firebaseArray(fb);
  var recipeService = {
    all : recs,
    get : function(recId){
      return recs.$getRecord(recId);
    }
  };
  return recipeService;
});

fbook.factory('authService',function($state,$firebaseObject,$rootScope){
  var fb = new Firebase('https://recipebookpro.firebaseio.com');
  var usersRef = fb.child("users");

  var authService = {
    createUser : function(user){
      fb.createUser({
        email:  user.email,
        password: user.password
      }, function (err, success) {
        if(success){
          user.uid =success.uid;
          usersRef.push(user);
          alert("user created successfully.");
          console.log(success);
          $state.go('login')

        }else{
          alert("error in creating user.");
          console.log(err)
        }
      });
    },
    userLogin : function (user) {
      fb.authWithPassword({
        email    : user.email,
        password : user.password
      },function(err, authData) {
        if (err) {
          alert('login Failed '+ err);
          console.log("Login Failed!", err);
        }
        else{
          console.log("Authenticated successfully");
          localStorage.setItem('uid',authData.uid);
          localStorage.setItem('email',authData.password.email);


          var sync = $firebaseObject(fb);
          var firebaseObj = sync;

          firebaseObj.$loaded().then(function(){
            angular.forEach(firebaseObj.users, function(value, key){
              if(value.uid ===authData.uid){
                $rootScope.userData = {
                  Name : value.name,
                  Email : value.email,
                  PhoneNo : value.phoneNo,
                  profileImageURL : authData.password.profileImageURL,
                  id: key
                };
                $state.go('home');
              }
            });
          });

        }
      });
    }
  };
  return authService;
});

