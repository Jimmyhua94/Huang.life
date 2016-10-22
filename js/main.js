var app = angular.module('huangLife', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ui.bootstrap']);

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/', {templateUrl: 'pages/home.html', controller: 'PageCtrl'})
    .when('/home', {templateUrl: 'pages/home.html', controller: 'PageCtrl'})
    .when('/about', {templateUrl: 'pages/about.html', controller: "PageCtrl"})
    .when('/portfolio', {templateUrl: 'pages/portfolio.html', controller: 'PageCtrl'})
    .when('/contact', {templateUrl: 'pages/contact.html', controller: 'ContactCtrl'})
    .otherwise({templateUrl: 'pages/404.html', controller: 'PageCtrl'});
}]);

app.directive('myImg', function ($window) {
    'use strict';
    
    return {
        restrict: 'A',
        link: function(scope, element) {
            var width = $window.innerWidth;
            angular.element($window).bind('resize', function () {
                width = $window.innerWidth;
            });
            var expanded = false,
                temp = element.clone();
            element.bind('click', function () {
                if(expanded && width > 768){
                    temp.remove();
                    expanded = false;
                }
                else if(width > 768) {
                    if (temp.attr('class')) {
                        temp.removeAttr('class');
                    }
                    temp.addClass('expanded');
                    element.parent().append(temp);
                    expanded = true;
                }
            });
            angular.element($window).bind('click', function (event) {
                if (event.target != element[0] && expanded) {
                    temp.remove();
                    expanded = false;
                }
            });
            angular.element($window).bind('scroll', function () {
                if (expanded) {
                    temp.remove();
                    expanded = false;
                }
            });
        }
    };
});

app.controller('PageCtrl', function ($scope, $location) {
    $scope.page = $location.path();
});

app.controller('NavCtrl', function ($scope, $location) {
    $scope.pages = ['home', 'about', 'portfolio', 'contact'];
    $scope.changeView = function() {
        $location.path($scope.enteredPath);
        $scope.enteredPath = "";
    };
});

app.controller('ContactCtrl', function ($scope, $http) {
    $scope.result = 'hidden';
    $scope.resultMessage;
    $scope.formData;
    $scope.submitButtonDisabled = false;
    $scope.submitted = false;
    $scope.submit = function(form) {
        $scope.submitted = true;
        $scope.submitButtonDisabled = true;
        if (form.$valid) {
            $http({
                method  : 'POST',
                url     : 'contact-form.php',
                data    : $.param($scope.formData),  //param method from jQuery
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  //set the headers so angular passing info as form data (not request payload)
            }).then(function(data){
                console.log(data);
                if (data.success) { //success comes from the return json object
                    $scope.submitButtonDisabled = true;
                    $scope.resultMessage = data.message;
                    $scope.result='success';
                } else {
                    $scope.submitButtonDisabled = false;
                    $scope.resultMessage = data.message;
                    $scope.result='error';
                }
            });
        }
        else {
            $scope.submitButtonDisabled = false;
            $scope.resultMessage = 'All fields were not filled out correctly!';
            $scope.result='error';
        }
    };
});