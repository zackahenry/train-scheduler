var config = {
    apiKey: "AIzaSyANJetQqqL7ohpOd_TRkJcPMmmTKpD4WeA",
    authDomain: "trainscheduler-41b69.firebaseapp.com",
    databaseURL: "https://trainscheduler-41b69.firebaseio.com",
    projectId: "trainscheduler-41b69",
    storageBucket: "trainscheduler-41b69.appspot.com",
    messagingSenderId: "932543230394"
  };

firebase.initializeApp(config);

var trainData = firebase.database();

$("#addTrainBtn").on("click", function(){
    var trainName = $("#trainNameInput").val().trim();
    var destination = $("#destinationInput").val().trim();
    var firstTrain = $("#firstTrainInput").val().trim();
    var frequency = $("#frequencyInput").val().trim();  
    
    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    }

    trainData.ref().push(newTrain);
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);
    alert("train added");

    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#firstTrainInput").val("");
    $("#frequencyInput").val("");
    
    console.log(firstTrain);
    return false;
});

trainData.ref().on("child_added", function(childSnapshot, prevChildKey){
    console.log(childSnapshot.val());    
    var tName = childSnapshot.val().name;
    var tDestination = childSnapshot.val().destination;
    var tFrequency = childSnapshot.val().frequency;
    var tFirstTrain = childSnapshot.val().firstTrain;

    var timeArr = tFirstTrain.split(":");
    var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
    var maxMoment = moment.max(moment(), trainTime);
    var tMinutes;
    var tArrival;

    if (maxMoment === trainTime) {
    tArrival = trainTime.format("hh:mm A");
    tMinutes = trainTime.diff(moment(), "minutes");
    } else {

    var differenceTimes = moment().diff(trainTime, "minutes");
    var tRemainder = differenceTimes % tFrequency;
    tMinutes = tFrequency - tRemainder;

    tArrival = moment().add(tMinutes, "m").format("hh:mm A");
    }
    console.log("tMinutes:", tMinutes);
    console.log("tArrival:", tArrival);

    $("#train-table > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" +
        tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");
    });