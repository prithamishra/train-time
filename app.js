$(document).ready(function () {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAj5GPxfkMPfe4Wxidn3k3M2QoidNIpufI",
    authDomain: "train-966b0.firebaseapp.com",
    databaseURL: "https://train-966b0.firebaseio.com",
    projectId: "train-966b0",
    storageBucket: "train-966b0.appspot.com",
    messagingSenderId: "616734605604"
  };
  firebase.initializeApp(config);

  var dataRef = firebase.database();

  $("#submit-btn").on("click", function (event) {
    event.preventDefault();

    var name = $("#name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrain = $("#firstTrain").val().trim();
    var frequency = $("#frequency").val().trim();


    $("#name").val("");
    $("#destination").val("");
    $("#firstTrain").val("");
    $("#frequency").val("");

    dataRef.ref().push({
      name: name,
      destination: destination,
      time: firstTrain,
      frequency: frequency
    });
  });

  dataRef.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    var name = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var frequency = childSnapshot.val().frequency;
    var time = childSnapshot.val().time;
    var key = childSnapshot.key;
    var remove = "<button class='glyphicon glyphicon-trash' id=" + key + "></button>"

    var firstTrain = moment(time, "hh:mm").subtract(1, "years");

    var currentTime = moment();

    $("#currentTime").html("Current Time: " + moment(currentTime).format("hh:mm:ss"));

    var timeDiff = moment().diff(moment(firstTrain), "minutes");

    var timeRemainder = timeDiff % frequency;
    var nextTrainMin = frequency - timeRemainder;
    var nextTrainAdd = moment().add(nextTrainMin, "minutes");
    var nextTrainArrival = moment(nextTrainAdd).format("hh:mm");

    $("#schedule").prepend(
      "<tr><td>" + name +
      "</td><td>" + destination +
      "</td><td>" + frequency +
      "</td><td>" + nextTrainArrival +
      "</td><td>" + nextTrainMin +
      "</td><td>" + remove +
      "</td></tr>");


  }, function (err) {
    console.log(err);
  });

  $(document).on("click", ".glyphicon-trash", deleteTrain);

  function deleteTrain() {
    var deleteKey = $(this).attr("id");
    dataRef.ref().child(deleteKey).remove();

    location.reload();

  }

});