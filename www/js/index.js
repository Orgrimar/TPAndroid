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

            //          if ($("#outputLanguageField").val != "KO"){;

            if ($("#outputLanguageField").isChecked()) {
                console.log("Language de destination selectionnée")
                app.onBabbelStart(); //.bind(this)
            } else {
                alert("Please select output language !");
            }


        });

        $("#readOutputField").on("click", function () {

            console.log("Lecture du message traduit")
            app.readSpeach();
            //            $("#outputField")

        })
    },

    //Test disponibilité plugin Reconnaissance vocale et autorisation reseau
    onBabbelStart: function () {
        window.plugins.speechRecognition.isRecognitionAvailable(function (available) {
            if (!available) {
                console.log("Desolé, ce n'est valide");
            }
            window.plugins.speechRecognition.hasPermission(function (isGranted) {
                console.log("Test Granted");
                if (isGranted) {
                    console.log("Permission OK");
                    console.log("Debut de la reconnaisance");
                    app.startRecognition();
                } else {
                    console.log("Permission KO");
                    window.plugins.speechRecognition.requestPermission(function () {
                        console.log("Permission OK");
                        console.log("Debut de la reconnaisance");
                        app.startRecognition();
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

    //Saisie du message vocal
    startRecognition: function () {
        console.log("Debut de l' écoute");
        window.plugins.speechRecognition.startListening(function (result) {
            console.log("SpeechReco = " + result);
            $("#inputField").text(result.text);
            app.translateSpeech(result.text);
        }, function (err) {
            // Demande de recommencer enregistrement 
            console.log("Erreur Saisie");
            console.error(err);
        }, {
            language: "fr-FR"
            //showPopup: true
            //$("#LangSelect").val()
        });
    },

    //Traduction du message
    translateSpeech: function (result) {

        const translate = require('google-translate-api');
        //        var input = $("#recordField").val();
        var outputLanguage = $("#outputLanguageField").val();

        const translator = new Translate();
        translator.translate(result, {
            from: 'fr',
            to: outputLanguage
        }).then(res => {
            console.log(res);
            console.log(res.text);
            //                => Ik spea Nederlands!
            console.log(res.from.text.autoCorrected);
            //=> false
            console.log(res.from.text.value);
            //=> I [speak] Dutch!
            $("#outputField").text(res.from.text.value);

            console.log(res.from.text.didYouMean);
            //=> true

            // Lecture du text 
            //                app.readSpeach();
        }).catch(err => {
            console.error(err);
        });
    },

    readSpeach: function () {

        var contentToRead = $("#outputField").val();

        if (contentToRead != null && contentToRead != "") {

            TTS.speak({
                text: contentToRead,
                locale: 'fr-FR',
                rate: 1
            }, function () {
                console.log('Text succesfully spoken');
            }, function (reason) {
                console.log(reason);
            });

        } else {
            console.log("");
        }
    }

}

function onOffline() {
    $('#app').load('views/networkError.html')
}

function onOnline() {
    window.location.reload();
}

app.initialize();
