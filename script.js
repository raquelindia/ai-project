var app = angular.module('aiApp', ["ngRoute", "ngCookies"]);
const googleLensUrl = 'https://serpapi.com/search';

app.controller('appCtrl', function($scope, $http, $cookies){
    $scope.backgroundColor = 'whitesmoke';
    $scope.accentsColor = '#cccccc';
    $scope.display = '';
    var userMessage = "Heyyyy";
    $scope.aiResponse = "How can I assist you today?";
    $scope.inputValue = '';
    $scope.userMessageVar = '';
    $scope.imageSearchUrl = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
    $scope.conversationThread = [];
    $scope.conversations = [];
    
var image = $scope.imageSearchUrl;

    var headers = {};
    $scope.Data = {};
    const apiKeyUrl = '/api/data';
    console.log(apiKeyUrl);
    $scope.skins = [
        "white",
        "tan",
        "brown"
    ];

    $scope.selectedSkin = 'white';


    const chatGptUrl = `https://api.openai.com/v1/chat/completions`;

    $http.get(apiKeyUrl)
    .then(function(response) {
        console.log(apiKeyUrl);
        $scope.apiKey = response.data.apiKey;
        $scope.serpApiKey = response.data.serpApiKey;
        $scope.instructions = response.data.instructions;
        var instructions = $scope.instructions;
        console.log(instructions);
        var serpKey = $scope.serpApiKey;
        console.log(serpKey);
        // Construct headers with the fetched API key
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey
        };
        $scope.googleLensHeaders = {
            'Authorization': 'Bearer ' + serpKey
        };
        var image = $scope.imageSearchUrl;
        var googleLensConfig = {
                engine: 'google_lens',
                url: image,
                api_key: serpKey
        };
$scope.googleLensConfig = googleLensConfig;
     
        console.log(headers);
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
            {role: 'system', content: `You are a helpful assistant that speaks in a formal tone.`},
            {role: 'assistant', content: `How may I assist you today?`},
            { role: 'user', content: $scope.inputValue }
        ]
    
    };

    var serpKey = $scope.serpApiKey;
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
console.log($scope.backgroundColor);
$scope.saveAppState();
window.location.reload();
};

$scope.toggleAccents = function (color) {
$scope.accentsColor = color;
$scope.saveAppState();
window.location.reload();
};

$scope.toggleDisplay = function (display) {
$scope.display = display;
};


//google lens api
// Fetch data from Google Lens API
$http.get(googleLensUrl, {
    params: {
        engine: 'google_lens',
        url: $scope.imageSearchUrl,
        api_key: serpKey
    },
    headers: {
        'Content-Type': 'application/json'
    }
})
    .then(function(response) {
        $scope.googleLensData = response.data;
        console.log($scope.googleLensData);
    })
    .catch(function(error) {
        console.log(error);
    });



    //saving state with cookies
    $scope.saveAppState = function () {
        $cookies.putObject('appState', {
            backgroundColor: $scope.backgroundColor,
            accentsColor: $scope.accentsColor
        });
    };

    $scope.loadAppState = function () {
        var savedState = $cookies.getObject('appState');
        if (savedState) {
            $scope.backgroundColor = savedState.backgroundColor;
            $scope.accentsColor = savedState.accentsColor;
        };
    };

    $scope.$watchGroup([
        'backgroundColor',
        'accentsColor'
    ], function(newValues, oldValues) {
        if (newValues[0] !== oldValues[0] || newValues[1] !== oldValues[1]) {
            $scope.saveAppState();
        }
    });

 //call loadAppState whenever controller initializes
$scope.loadAppState();
console.log($scope.backgroundColor);
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
