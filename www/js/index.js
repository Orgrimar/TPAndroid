/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        if (window.cordova)
            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        else
            this.onDeviceReady();
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        var options = { frequency: 500 };  // Update every 3 seconds
        var watchID = navigator.accelerometer.watchAcceleration(app.onSuccess, null, options);
        document.addEventListener("offline", onOffline, false);
        document.addEventListener("online", onOnline, false);
        window.plugins.speechRecognition.isRecognitionAvailable(function(available){
            if(!available){
                console.log("Desoler, ce n'est valide");
            }
            window.plugins.speechRecognition.hasPermission(function(isGranted){
                if(isGranted){
                    startRecognition();
                }else{
                    window.plugins.speechRecognition.requestPermission(function(){
                        startRecognition();
                    }, function(err){
                        console.log(err);
                    });
                }
            }, function(err){
                console.log(err);
            });
        }, function(err){
            console.log(err);
        });
    },

    onSuccess: function (acceleration) {
        $("#xPos").html((acceleration.x).toFixed(3));
        $("#yPos").html((acceleration.y).toFixed(3));
        $("#zPos").html((acceleration.z).toFixed(3));
    }
};

function onOffline() {
    $('#app').load('views/networkError.html')
}

function onOnline(){
    window.location.reload();
}

function startRecognition(){
    window.plugins.speechRecognition.startListening(function(result){
        console.log(result);
    }, function(err){
        console.error(err);
    }, {
        language: "fr-FR"
    });
}

app.initialize();