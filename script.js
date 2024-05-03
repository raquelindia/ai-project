var app = angular.module('aiApp', ["ngRoute", "ngCookies"]);
const googleLensUrl = 'https://serpapi.com/search';

app.controller('appCtrl', function($scope, $http, $cookies){
    $scope.displayInputField = false;
    $scope.backgroundColor = 'whitesmoke';
    $scope.accentsColor = '#cccccc';
    $scope.navBackgroundColor = 'white';
    $scope.searchButtonBackgroundColor = 'rgb(228, 228, 228)';
    $scope.navFontColor = 'black';
    $scope.display = 'light';
    $scope.isBorderAdded = false;
    var userMessage = "Heyyyy";
    $scope.aiResponse = "How can I assist you today?";
    $scope.inputValue = '';
    $scope.userMessageVar = '';
    $scope.conversationThread = [];
    $scope.conversations = [];

    

    var headers = {};
    $scope.Data = {};
    const apiKeyUrl = '/api/data';
    console.log(apiKeyUrl);


    const chatGptUrl = `https://api.openai.com/v1/chat/completions`;


    $http.get(apiKeyUrl)
    .then(function(response) {
        $scope.apiKey = response.data.apiKey;
        $scope.instructions = response.data.instructions;
        var instructions = $scope.instructions;
        // Construct headers with the fetched API key
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey
        };
      
$scope.headers = headers;
        // Now you can use the headers to make requests to the OpenAI API
        // ...
    })
    .catch(function(error) {
        console.log(error);
    });

    var data = {
        "model": "gpt-3.5-turbo",
        messages: [
            {role: 'system', content: $scope.instructions},
            {role: 'assistant', content: `How may I assist you today?`},
            { role: 'user', content: $scope.inputValue }
        ]
    
    };

    $scope.sendMessage = function() {
        var id = $scope.Data.input;
        console.log(id);
        $scope.inputValue = id;
        $scope.conversationThread.push({role: 'User', message: id});
     

 
                data.messages[data.messages.length - 1].content = id;
                $scope.Data.input = '';

                console.log($scope.headers);

    $http.post(chatGptUrl, data, { headers: { 'Authorization': 'Bearer ' + $scope.apiKey, 'Content-Type': 'application/json' }  })
    .then(function(response) {
        $scope.chatGptData = response.data;
        console.log($scope.chatGptData);
        var arr1 = $scope.chatGptData.choices[0].message.content;
        $scope.aiResponse = arr1;
        $scope.conversationThread.push({role: 'Assistant', message: $scope.aiResponse});
        console.log($scope.conversationThread);
    })
    .catch(function(error) {
        console.log(error);
    });
    
};


$scope.toggleBackgroundColor = function (color) {
$scope.backgroundColor = color;
$scope.navFontColor = 'black';
console.log($scope.backgroundColor);
$scope.saveAppState();
window.location.reload();
};

$scope.toggleAccents = function (color) {
$scope.accentsColor = color;
$scope.saveAppState();
window.location.reload();
};

$scope.toggleDisplay = function () {
    if ($scope.display === 'light'){
        $scope.navBackgroundColor = 'white';
        $scope.searchButtonBackgroundColor = 'rgb(228, 228, 228)';
        $scope.searchButtonFontColor = 'black';
        $scope.navFontColor = 'black';
        $scope.backgroundColor = 'whitesmoke';
        console.log();
    } else {
        $scope.navBackgroundColor = 'black';
        $scope.searchButtonBackgroundColor = 'black';
        $scope.navFontColor = 'white';
        $scope.backgroundColor = '#1b1b1b';
        
    }
    $scope.saveAppState();
window.location.reload();
    };

$scope.lightMode = function () {
$scope.display = 'light';
$scope.saveAppState();
$scope.toggleDisplay();
} 

$scope.darkMode = function () {
    $scope.display = 'dark';
    $scope.saveAppState();
    $scope.toggleDisplay();
}

$scope.toggleInputFieldOn = function () {
    $scope.displayInputField = true;
}

$scope.toggleInputFieldOff = function () {
    $scope.displayInputField = false;
}



    //saving state with cookies
    $scope.saveAppState = function () {
        $cookies.putObject('appState', {
            backgroundColor: $scope.backgroundColor,
            accentsColor: $scope.accentsColor,
            display: $scope.display,
            navBackgroundColor: $scope.navBackgroundColor,
            navFontColor: $scope.navFontColor,
            searchButtonBackgroundColor: $scope.searchButtonBackgroundColor,
            conversationThread: $scope.conversationThread
        });
    };

    $scope.loadAppState = function () {
        var savedState = $cookies.getObject('appState');
        if (savedState) {
            $scope.backgroundColor = savedState.backgroundColor;
            $scope.accentsColor = savedState.accentsColor;
            $scope.display = savedState.display;
            $scope.navBackgroundColor = savedState.navBackgroundColor;
            $scope.navFontColor = savedState.navFontColor;
            $scope.searchButtonBackgroundColor = savedState.searchButtonBackgroundColor;
            $scope.conversationThread = savedState.conversationThread;
        };
    };

    $scope.$watchGroup([
        'backgroundColor',
        'accentsColor',
        'display',
        'navBackgroundColor',
        'navFontColor',
        'searchButtonBackgroundColor',
        'conversationThread'
    ], function(newValues, oldValues) {
        if (newValues[0] !== oldValues[0] || newValues[1] !== oldValues[1]) {
            $scope.saveAppState();
        }
    });

 //call loadAppState whenever controller initializes
$scope.loadAppState();
});



app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "home.html",
        controller: 'appCtrl'
    })
    .when("/home", {
        templateUrl : "home.html",
        controller: 'appCtrl'
    })
    .when("/settings", {
        templateUrl : "settings.html",
        controller: 'appCtrl'
    })
});

app.directive('conversationThread', function(){
    return {
        restrict: 'E',
        templateUrl: 'home-files/components/thread.html',
        scope: {
            role: '@',
            message: '@'
        },
    controller: 'appCtrl'
    };
});
