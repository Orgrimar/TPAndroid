function startRecognition(){
    window.plugins.speechRecognition.startListening(function(result){
        console.log(result);
    }, function(err){
        console.error(err);
    }, {
        language: "fr-FR"
    });
}

window.plugins.speechRecognition.isRecognitionAvailable(function(available){
    if(!available){
        console.log("Desoler, ce n'est valide");
    }
    window.plugins.speechRecognition.hasPermission(function(isGranted){
        if(isGranted){
            startRecognition();
        }else{
            window.plugins.startRecognition.requestPermission(function(){
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