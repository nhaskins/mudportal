jQuery(document).ready(function(){

  //var mud = {address: 'batmud.bat.org', port: 23};
  var mud    = {address: 'eotl.org', port: 2010}
  var socket = io.connect('mudportal.jit.su', {port: 80});

  var bufferTimeout;    // the timeout function
  var buffData = '';    // holds incoming dats
  var bufferDelay = 40;

  /*
    500 ms - no breaks in who
    100 ms - works
    75  ms - works
    50  ms - works
    40  ms - works

    30  ms - breaks
    10  ms - breaks in who
  */

  function runBuffer() {
      //consider adding in (if string is >) to
      //handle combat situations, jump dump
      //the buffer.

      bufferTimeout = window.setTimeout(function() {
        console.log('fired buff');
        $('.terminal>pre').append(filterMudStream(buffData));
        $('.terminal').scrollTop($('.terminal>pre').height()+2000); //+ to help img render
        buffData = '';  //reset buffer data
      }, bufferDelay);
  } //end runBuffer


//not so socket like stuff that needs seperation
    $('.prompt').focus();
    $('.container').click(function(){
      $('.prompt').focus();
    });


///scocket routing
    socket.on('connect', function(){
      socket.emit('init', mud);
      socket.on('mudText',  onmudText);
    }); //end connect

    $('#prompt_form').submit(pfSubmit);

    function onmudText(msg){
      //Does your terminal support ansi colors?
      buffData += msg;
      clearTimeout(bufferTimeout);
      runBuffer();
    }


    function pfSubmit(){
      var promptText = $('.prompt').val();
      socket.emit('termMsg', promptText);
      $('.prompt').val('').focus();

      return false;
    }

    function filterMudStream(data){

      console.log(data);
      data = ansi_up.escape_for_html(data);
      data = ansi_up.ansi_to_html(data);
      data = ansi_up.linkify(data);
      return data;
    }
});