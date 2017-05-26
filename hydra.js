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
  
  //disable text box until button clicked
  $('#livetext').prop('disabled', true);

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
    $('#livecount').empty();
    $('#livecount').append(wc);
  });

});