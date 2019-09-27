function getWordCount(input) {
  //whitespace management (from writtenkitten.co)
  input = input.replace(/^\s*|\s*$/g, ''); //leading/trailing whitespace
  input = input.replace(/\s+/g, ' '); //multiple consecutive spaces
  input = input.replace(/\n/g, ' '); //new lines

  var words = input.split(' ');
  if (words[0] === '') {
    //set to 0 if all text deleted
    return 0;
  } else {
    //count words in array
    return words.length;
  }
}

$(document).ready(function() {

  var storeWords = false;

  //disable text box until button clicked
  $('#livetext').prop('disabled', true);

  //TODO restore any stored words
  if (localStorage.hasOwnProperty("_hydraText")) {
    if (
      confirm(
        "Your browser's local storage contains existing text you typed in on a previous visit to this page. If you would like to restore this text, click OK (this will not restart the timer). Otherwise, click Cancel to delete this text and turn off local storage for this page."
      )
    ) {
      storeWords = true;
      $('#livetext').val(localStorage._hydraText);
      $('#livetext').prop('disabled', false);
    } else {
      storeWords = false;
      localStorage.removeItem("_hydraText");
    }
  }

  //user starts a session
  $('#start').click(function() {
    //enable text box
    $('#livetext').prop('disabled', false);
    //empty timer of any previous display
    $('#timer').empty();
    //set focus to text box
    $('#livetext').focus();
    //remove button
    $('#start').hide();
    //display countdown
    $('#timer').show();
    //300 seconds in 5 minutes
    var seconds = 300;
    //set running status
    var running = true;
    $('#timer').append(convertMinutes(seconds));

    //perform a check every second
    var secondCheck = setInterval(tick, 1000);

    //countdown function to run every second
    function tick() {
      if (running) {
        //remove old time
        $("#timer").empty();
        //decrement seconds remaining
        seconds -= 1;

        //is the time up?
        if (seconds < 0) {
          $('#timer').append('00:00');
          //running status off
          running = false;
          clearInterval(secondCheck);
          //did you manage enough words?
          var wc = parseInt($("#livecount").text());
          if (wc >= 500) {
            var winMess = "You did it!";
            var bell = new Audio('http://soundbible.com/grab.php?id=2148&type=mp3');
          } else {
            var winMess = "Sorry, you didn't make it!";
            var bell = new Audio('http://soundbible.com/grab.php?id=2062&type=mp3');
          }
          //make textarea inactive to prevent further input
          $('#livetext').prop('disabled', true);
          //is sound on?
          if ($('#soundon').is(':checked')) {
            bell.play();
          }
          //hide the counter
          $('#timer').hide();
          $('#start').show();
          //transfer text to lower div
          var finalText = $('#livetext').val();
          $('#finaltext').append("<hr><p><strong>" + winMess + "</strong></p><p>Here's what you wrote! Be sure to copy and paste it somewhere safe - this site does <strong>not</strong> save your work once you navigate away from this page.</p><pre>" + finalText + "</pre>");
          //clear textarea
          $('#livetext').val('');
        } else {
          //display new time
          $('#timer').append(convertMinutes(seconds));
        }
      }
    }
  });

  //turn storage on/off
  $('input[name="storage"]:radio').change(function() {
    if ($("#storeon").is(":checked") && !storeWords) {
      $("#overlay").show();
      $("#storagebox").show();
    } else {
      if (storeWords) {
        if (confirm("This will remove any words stored by your browser. If you leave this page without copy-pasting them somewhere safe, you will not be able to get them back! Do you want to proceed?")) {
          storeWords = false;
          localStorage.removeItem("_hydraText");
        }
      }
    }
  });

  //accept storage
  $("#storeok").click(function() {
    $("#overlay").hide();
    $("#storagebox").hide();
    storeWords = true;
    localStorage.setItem("_hydraText", '');
  });

  //cancel storage
  $("#storecancel").click(function() {
    $("#overlay").hide();
    $("#storagebox").hide();
    storeWords = false;
    //set off to checked
    $("#storeon").prop("checked", false);
    $("#storeoff").prop("checked", true);
    localStorage.removeItem("_hydraText");
  });

  //converts second count to a mm:ss string for display
  function convertMinutes(timer) {
    var mins = String(Math.floor(timer / 60));
    var secs = String(timer - (mins * 60));
    if (mins.length < 2) {
      mins = "0" + mins;
    }
    if (secs.length < 2) {
      secs = "0" + secs;
    }
    return mins + ":" + secs;
  }

  //live word counter
  $('#livetext').keyup(function() {
    var input = $('#livetext').val();
    var wc = getWordCount(input);
    //update counter
    $('#livecount').empty().append(wc);
    //save words if enabled
    if (storeWords) {
      localStorage.setItem("_hydraText", input);
    }
  });

});
