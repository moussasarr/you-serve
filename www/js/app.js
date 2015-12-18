// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var facebookExample = angular.module('starter', ['ionic', 'ngStorage', 'ngCordova']);

facebookExample.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});

facebookExample.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginController'
        })

         .state('signup', {
            url: '/signup',
            templateUrl: 'templates/register.html',
            controller: 'registerController'
        })

    
        
         .state('todo', {
            url: '/todo',
            templateUrl: 'templates/todo.html',
            controller: 'todoController'
        })
        


        .state('myprofile', {
            url: '/myprofile',
            templateUrl: 'templates/myprofile.html',
            controller: 'myProfileController'
        })
        

      




    $urlRouterProvider.otherwise('/login');    
});

facebookExample.controller("LoginController", function($scope, $http, $cordovaOauth, $localStorage, $location) {
  $scope.data = {};

    $scope.login = function() {
        $cordovaOauth.facebook("1204824659546785", ["email", "user_website", "user_location", "user_relationships"]).then(function(result) {
            $localStorage.accessToken = result.access_token;
            $location.path("/myprofile");
        }, function(error) {
            alert("There was a problem signing in!  See the console for logs");
            console.log(error);
        });
    };




function getlgToken() {
  
    return $http.post('http://you-serve.org/api.php?action=login&format=json&lgname=' + $scope.data.lgusername + '&lgpassword=' + $scope.data.lgpassword) 
      .then(
        function(response) {
          return response.data.login.token;
        },
        // End success
        function() {
          alert('error');
        } // End error 
      ); //End then
  } // End getToken

  function logmein(myToken) {
    return $http.post('http://you-serve.org/api.php?action=login&format=json&lgname=' + $scope.data.lgusername + '&lgpassword=' + $scope.data.lgpassword +'&lgtoken=' + myToken)
      .then(
        function(response) {
          alert("Welcome " + response.data.login.lgusername);
          $localStorage.myaccessToken = response.data.login.cookieprefix + response.data.login.sessionid;
          $localStorage.myUserId = response.data.login.lguserid;
          $localStorage.myUserName = response.data.login.lgusername;
          $location.path("/myprofile");
        },
        function(response) {
          alert("Error"

            //response.data.error.info
            );
        }
      ); //End then
  } //End register


  $scope.appLogin = function() {
    getlgToken().then(logmein);


   
   
  }; // End sign up


});



















facebookExample.controller('todoController', ['$scope', function($scope) {
// Initialize the todo list array
//if local storage is null save the todolist to local storage
$scope.todoList = [];
$scope.DoRequested = [];



if (localStorage.getItem("mytodos") === null)
{

   localStorage.setItem("mytodos", angular.toJson($scope.todoList));

}else
{
    //set the todolist from local storage
    $scope.todoList = angular.fromJson(localStorage.getItem("mytodos"));
}



// Add an item function
$scope.todoAdd = function() {

  //check to see if text has been entered, if not exit
    if ($scope.todoInput === null || $scope.todoInput === ''){ return; }

    //if there is text add it to the array
    $scope.todoList.push({todoText:$scope.todoInput, 
      todoAdmin:'' , doRequested: '', beingFunded: '', 
       adminAprovedRequest:false, currentFund: 0, userAproved: false, user_email:'' , userdidWork: "false", adminCheckedWork: "false",
         done:false});

    //clear the textbox
    $scope.todoInput = "";

    //resave the list to localstorage
    localStorage.setItem("mytodos", angular.toJson($scope.todoList));
   

  
};





//Do button


$scope.do = function(x){
   $scope.DoRequested.push(x);
   // Send email notifier to admin 
  $.ajax({
  type: “POST”,
  url: 'https://mandrillapp.com/api/1.0/messages/send.json',
  data: {
    ‘key’: ‘n3ZIdxXIRIZbvUWw6Z34wA’,
    ‘message’: {
      ‘from_email’: ‘noreply@you-serve.org’,
      ‘to’: [
          {
            ‘email’: ‘RECIPIENT_NO_1@EMAIL.HERE’,
            ‘name’: ‘RECIPIENT NAME (OPTIONAL)’,
            ‘type’: ‘to’
          },
          {
            ‘email’: ‘RECIPIENT_NO_2@EMAIL.HERE’,
            ‘name’: ‘ANOTHER RECIPIENT NAME (OPTIONAL)’,
            ‘type’: ‘to’
          }
        ],
      ‘autotext’: ‘true’,
      ‘subject’: ‘NEW TASK ASSIGNMENT REQUEST!’,
      ‘html’: ‘<div!’
    }
  }
 }).done(function(response) {
   console.log(response); // if you're into that sorta thing
 });



};




$scope.fund = function(x){
   $scope.FundingProcess.push(x);



}





























//fund button







































$scope.remove = function() {
  //copy list
    var oldList = $scope.todoList;
    //clear list
    $scope.todoList = [];
    //cycle through list
    angular.forEach(oldList, function(x) {
      //add any non-done items to todo list
        if (!x.done) $scope.todoList.push(x);
    });
    //update local storage
     localStorage.setItem("mytodos", angular.toJson($scope.todoList));

};

//The Update function
//This waits 100ms to store the data in local storage
$scope.update = function() {
//update local storage 100 ms after the checkbox is clicked to allow it to process
setTimeout(function(){
    localStorage.setItem("mytodos", angular.toJson($scope.todoList));
},100);


};

}]);















facebookExample.controller('registerController', function($scope, $http, $localStorage, $location) {
  $scope.data = {};

  function getToken() {
    return $http.post('http://you-serve.org/api.php?action=createaccount&format=json&name=' + $scope.data.username + '&email=' + $scope.data.email + '&realname=' + $scope.data.firstname + ' ' + $scope.data.lastname  + '&password=' +
        $scope.data.password + '&reason=Fun_and_profit&language=en&token')
      .then(
        function(response) {
          return response.data.createaccount.token;
        },
        // End success
        function() {
          alert('error');
        } // End error 
      ); //End then
  } // End getToken

  function register(myToken) {
    return $http.post('http://you-serve.org/api.php?action=createaccount&format=json&name=' +

        $scope.data.username + '&email=' +
        $scope.data.email + '&realname=' +
        $scope.data.firstname + ' ' +
        $scope.data.lastname + '&password=' +
        $scope.data.password +

        '&reason=Fun_and_profit&language=en&token=' + myToken)
      .then(
        function(response) {
          alert("Registration successful !  You can log in now " + response.data.createaccount.username);
        },
        function(response) {
          alert(response.data.error.info);
        }
      ); //End then
  } //End register


  $scope.signup = function() {
    getToken().then(register);
  }; // End sign up
}); // End controller







facebookExample.controller("myProfileController", function($scope, $http, $localStorage, $location) {

    $scope.init = function() {
        if($localStorage.hasOwnProperty("myaccessToken") === true) {

            $http.get("http://you-serve.org/api.php?action=query&meta=userinfo&format=json&list=users&ususers='+&uiprop=blockinfo|hasmsg|groups|implicitgroups|rights|changeablegroups|options|editcount|ratelimits|email|realname|acceptlang|registrationdate|unreadcount").then(function(result) {
                $scope.myprofileData = result.data;
            }, function(error) {
                alert("There was a problem getting your profile.  Check the logs for details.");
                console.log(error);
            });
        } 

       
        else if($localStorage.hasOwnProperty("accessToken") === true){

              $http.get("https://graph.facebook.com/v2.2/me", { params: { access_token: $localStorage.accessToken, fields: "id,name,gender,location,website,picture,relationship_status", format: "json" }}).then(function(result) {
                $scope.profileData = result.data;
            }, function(error) {
                alert("There was a problem getting your profile.  Check the logs for details.");
                console.log(error);
            });

        }


        else {
            alert("Not signed in");
            $location.path("/login");
        }
    };

});



/**
facebookExample.controller("FeedController", function($scope, $http, $localStorage, $location) {

    $scope.init = function() {
        if($localStorage.hasOwnProperty("accessToken") === true) {
            $http.get("https://graph.facebook.com/v2.2/me/feed", { params: { access_token: $localStorage.accessToken, format: "json" }}).then(function(result) {
                $scope.feedData = result.data.data;
                $http.get("https://graph.facebook.com/v2.2/me", { params: { access_token: $localStorage.accessToken, fields: "picture", format: "json" }}).then(function(result) {
                    $scope.feedData.myPicture = result.data.picture.data.url;
                });
            }, function(error) {
                alert("There was a problem getting your profile.  Check the logs for details.");
                console.log(error);
            });
        } else {
            alert("Not signed in");
            $location.path("/login");
        }
    };

});

***/