var myApp = angular.module("myApp", []);
myApp.controller("myController", myControllerFun);

function myControllerFun($scope, $http) {
    $scope.location = {};
    $scope.markerLocations = {};
    $scope.markersObj = [];

    var map = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(51.5, -0.2),
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    $http({
        method: 'GET',
        url: 'http://dev.tripininc.in:3000/api/v1/locations',
        data: {},
        processData: true,
        responseType: "text",
        headers: { 'Content-Type': 'application/json' }
    }).then(function(data) {
        $scope.location = data.data.location;
        // console.log($scope.location)
        $scope.location.forEach(function(elem, i) {
            if ($scope.markerLocations[elem._id] == undefined) {
                $scope.markerLocations[elem._id] = { lat: (50 + Math.random() * 10), long: (0 + Math.random() * 10) }
            }
            var marker = new google.maps.Marker({ position: new google.maps.LatLng($scope.markerLocations[elem._id].lat, $scope.markerLocations[elem._id].long) });
            marker.setMap(map);
            $scope.markersObj.push(marker);
            google.maps.event.addListener(marker, 'click', function() {
                new google.maps.InfoWindow({
                    content: elem.name + "<br>" + elem.description
                }).open(map, marker);
            });
        });
    });

    $scope.onLinkClick = function(_id, _name) {
        for (var i in $scope.location) {
            if ($scope.location[i]._id == _id && $scope.location[i].name == _name) {
                $scope.descriptionHeading = $scope.location[i].name;
                $scope.descriptionText = $scope.location[i].description;
                document.getElementById("map").style.display = "none";
                document.getElementsByClassName("description")[0].style.display = "block";
                break;
            }
        }
    }

    $scope.onRemoveClick = function(_id, _name, $event) {
        // console.log(_id)
        $http({
            // method: 'PUT',
            method: 'DELETE',
            url: 'http://dev.tripininc.in:3000/api/v1/locations/' + _id,
            data: $scope.location,
            processData: true,
            responseType: "text",
            headers: { 'Content-Type': 'application/json' }
        }).then(function(data) {
            if (data.statusText == "Created" && data.data.status == "success") {
                $http({
                    method: 'GET',
                    url: 'http://dev.tripininc.in:3000/api/v1/locations',
                    data: {},
                    processData: true,
                    responseType: "text",
                    headers: { 'Content-Type': 'application/json' }
                }).then(function(data) {
                    $scope.location = data.data.location;
                    for (var i in $scope.markersObj) {
                        $scope.markersObj[i].setMap(null);
                        $scope.markersObj[i] = null;
                    }
                    $scope.markersObj = [];
                    $scope.location.forEach(function(elem, i) {
                        if ($scope.markerLocations[elem._id] == undefined) {
                            $scope.markerLocations[elem._id] = { lat: (50 + Math.random() * 10), long: (0 + Math.random() * 10) }
                        }
                        var marker = new google.maps.Marker({ position: new google.maps.LatLng($scope.markerLocations[elem._id].lat, $scope.markerLocations[elem._id].long) });
                        marker.setMap(map);
                        $scope.markersObj.push(marker);
                        google.maps.event.addListener(marker, 'click', function() {
                            new google.maps.InfoWindow({
                                content: elem.name + "<br>" + elem.description
                            }).open(map, marker);
                        });
                    });
                });
            }
            // console.log(data)
        });

        if ($event.stopPropagation)
            $event.stopPropagation();
        if ($event.preventDefault)
            $event.preventDefault();
    }

    $scope.onAddClick = function() {
        if ($scope.inputText != "" && $scope.inputText) {
            $http({
                method: 'POST',
                url: 'http://dev.tripininc.in:3000/api/v1/locations',
                data: {
                    location: {
                        "name": $scope.inputText,
                        "description": "sid " + $scope.inputText,
                        "url": $scope.inputText,
                        "__v": 0
                    }
                },
                processData: true,
                responseType: "text",
                headers: { 'Content-Type': 'application/json' }
            }).then(function(data) {
                if (data.statusText == "Created" && data.data.status == "success") {
                    $scope.inputText = "";
                    $http({
                        method: 'GET',
                        url: 'http://dev.tripininc.in:3000/api/v1/locations',
                        data: {},
                        processData: true,
                        responseType: "text",
                        headers: { 'Content-Type': 'application/json' }
                    }).then(function(data) {
                        $scope.location = data.data.location;
                        $scope.location.forEach(function(elem, i) {
                            if ($scope.markerLocations[elem._id] == undefined) {
                                $scope.markerLocations[elem._id] = { lat: (50 + Math.random() * 10), long: (0 + Math.random() * 10) };
                                var marker = new google.maps.Marker({ position: new google.maps.LatLng($scope.markerLocations[elem._id].lat, $scope.markerLocations[elem._id].long) });
                                marker.setMap(map);
                                $scope.markersObj.push(marker);
                                google.maps.event.addListener(marker, 'click', function() {
                                    new google.maps.InfoWindow({
                                        content: elem.name + "<br>" + elem.description
                                    }).open(map, marker);
                                });
                            }
                        });


                    });
                }
            });
        }
    }

    $scope.onClose = function() {
        document.getElementById("map").style.display = "block";
        document.getElementsByClassName("description")[0].style.display = "none";
    }
}