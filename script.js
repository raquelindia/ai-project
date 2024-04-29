var app = angular.module('aiApp', ["ngRoute", "ngCookies"]);
app.controller('appCtrl', function($scope, $http, $cookies){
    var userMessage = "Heyyyy";
    $scope.aiResponse = "How can I help you today?";
    $scope.inputValue = '';
    $scope.userMessageVar = '';
    $scope.conversationThread = [

    ];

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
console.log(apiKey);
        // Construct headers with the fetched API key
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey
        };
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
            {role: 'system', content: `You are a helpful assistant that speaks in a business tone.`},
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

$scope.toDoButton = function () {
   
} 

});



app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "home.html",
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
