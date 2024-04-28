var app = angular.module('aiApp', ["ngRoute", "ngCookies"]);
app.controller('appCtrl', function($scope, $http, $cookies){
    var userMessage = "Heyyyy";
    $scope.aiResponse = "How can I help you today?";
    $scope.inputValue = '';
    $scope.userMessageVar = '';
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
            {role: 'system', content: `your name is hannah.`},
            {role: 'assistant', content: `Hey there, Pookie! What's on your mind today? Let's get chatty and see what fun we can stir up together.`},
            { role: 'user', content: $scope.inputValue }
        ]
    
    };


    $scope.sendMessage = function() {
        var id = $scope.Data.input;
        console.log(id);
        $scope.inputValue = id;
        
     

 
                data.messages[data.messages.length - 1].content = id;
                $scope.Data.input = '';

                console.log($scope.headers);

    $http.post(chatGptUrl, data, { headers: { 'Authorization': 'Bearer ' + $scope.apiKey, 'Content-Type': 'application/json' }  })
    .then(function(response) {
        $scope.chatGptData = response.data;
        console.log($scope.chatGptData);
        var arr1 = $scope.chatGptData.choices[0].message.content;
        $scope.aiResponse = arr1;
    })
    .catch(function(error) {
        console.log(error);
    });
};

});

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "home.html",
        controller: 'appCtrl'
    })
});