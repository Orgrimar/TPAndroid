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
    initialize: function () {

        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        /*if (window.cordova) {
        } else {
            this.onDeviceReady();
        }*/
    },

    //SetUp application
    onDeviceReady: function () {
        document.addEventListener("offline", onOffline, false);
        document.addEventListener("online", onOnline, false);
        console.log("Device Ready");

        //Input handler
        $("#startCapture").on("click", function () {
//            if ($("#outputLanguageField").val != "KO") {
//                console.log("Language de destination selectionnée")
                app.startRecognition();
//            } else {
//                alert("Please select output language !");
//            }
        });

        $("#translateButton").on("click", function () {
            console.log("Traduction du message ");
            app.translateSpeech();
        });

        $("#readOutputField").prop("disabled", true);
        $("#readOutputField").on("click", function () {
            console.log("Lecture du message traduit");
            app.readSpeach();
        });
    },
    //Test disponibilité plugin Reconnaissance vocale et autorisation reseau
    //    onBabbelStart: function () { },

    //Saisie du message vocal
    startRecognition: function () {
        
        function startRecognitionVoice() {
            console.log("Debut de l' écoute");
            window.plugins.speechRecognition.startListening(function (result) {
                console.log("SpeechReco = " + result[0]);
                $("#inputField").html(result[0]);
                app.translateSpeech();
            }, function (err) {
                // Demande de recommencer enregistrement 
                console.log("Erreur Saisie");
                console.error(err);
            }, {
                language: "fr-FR",
                  showPartial: true,
                    showPopup: true
            });
        }
            
        window.plugins.speechRecognition.stopListening(function () {
            console.log("fn de la saisie vocale");
            // No more recognition
        }, function (err) {
            console.log(err);
        });

        window.plugins.speechRecognition.isRecognitionAvailable(function (available) {
            if (!available) {
                console.log("Desolé, ce n'est valide");
            }
            window.plugins.speechRecognition.hasPermission(function (isGranted) {
                console.log("Test Granted");
                if (isGranted) {
                    console.log("Permission OK");
                    console.log("Debut de la reconnaisance");
                    startRecognitionVoice();
                } else {
                    console.log("Permission KO");
                    window.plugins.speechRecognition.requestPermission(function () {
                        console.log("Permission OK");
                        console.log("Debut de la reconnaisance2");
                        startRecognitionVoice();
                    }, function (err) {
                        console.log(err);
                    });
                }
            }, function (err) {
                console.log(err);
            });
        }, function (err) {
            console.log(err);
        });

    },

    //Traduction du message
    translateSpeech: function () {

//        const translate = require('google-translate-api');
        var outputLanguage = $("#outputLanguageField").val();
        var inputSpeech = $("#inputField").val();
        var data = {
            'q': inputSpeech,
            'target': outputLanguage
        };
        
        var API_KEY = "AIzaSyBJYnOrvUlput4MaZlrMROZQMxXJxds1ek";
        
        $.ajax({
            url: 'https://translation.googleapis.com/language/translate/v2?key=' + API_KEY, // La ressource ciblée
            type: 'POST', // Le type de la requête HTTP.
            data: data,            
            complete: function () {
                //called when complete
                console.log('process complete');
            },

            success: function (data) {
                console.log(data);
                montexteTraduit = data;
                console.log('process sucess');
                $('#outputField').html(montexteTraduit);
                TTS.speak({
                    text: montexteTraduit,
                    locale: maLangueTTS,
                    rate: 0.75
                }, function () {
                    console.log('success');
                }, function (reason) {
                    console.log(reason);
                });
            },

            error: function () {
                console.log('process error');
            }
        });

        //        const translator = new Translate();
        //        translator.translate(inputSpeech, {
        //            from: 'fr',
        //            to: outputLanguage
        //        }).then(res => {
        //            console.log(res);
        //            console.log(res.text);
        //            //=> Ik spea Nederlands!
        //            console.log(res.from.text.autoCorrected);
        //            //=> false
        //            console.log(res.from.text.value);
        //            //=> I [speak] Dutch!
        //            //Ecriture du text traduit dans le champ "outputField";
        //            $("#outputField").html(res.from.text.value);
        //
        //            console.log(res.from.text.didYouMean);
        //            //=> true
        //Activation du boutton de lecture 
        //            $("#readOutputField").props("disabled", false);

    }

//    readSpeach: function () {
//
//        var contentToRead = $("#outputField").val();
//
//        if (contentToRead != null && contentToRead != "") {
//            TTS.speak({
//                text: contentToRead,
//                locale: 'fr-FR',
//                rate: 1
//            }, function () {
//                console.log('Text succesfully spoken');
//            }, function (error) {
//                console.log(error);
//            });
//        } else {
//            console.log("Text to read is null or length = 0");
//        }
//    }
}

function onOffline() {
    $('#app').load('views/networkError.html')
}

function onOnline() {
    window.location.reload();
}

app.initialize();
