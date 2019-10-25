(function( $ ) {
	'use strict';

	/**
	 * All of the code for your public-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: It has been assumed you will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 *
	 * This enables you to define handlers, for when the DOM is ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * When the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and/or other possibilities.
	 *
	 * Ideally, it is not considered best practise to attach more than a
	 * single DOM-ready or window-load handler for a particular page.
	 * Although scripts in the WordPress core, Plugins and Themes may be
	 * practising this, we should strive to set a better example in our own work.
	 */


jQuery(document).ready(function($){
 // ========================================================
  // KNR Player skin-1
  // ========================================================
  
function audioSetup(player) {
  const play    = $(player).find('.knr_play'),
  song    = $(player).find('audio')[0],
  volume  =  $(player).find('.knr-volume-controls');
  let mute      =   false;
  song.volume=1.0;

  play.click(function(){
    if (!song.paused) {
      song.pause();
      play.removeClass('player-animate');
    } else {
      song.play();
    }
  });
  song.onplaying = function(){
    $(play).addClass('player-animate');
  };

  song.addEventListener('ended', function () {
    song.currentTime = 0;
    play.removeClass('player-animate');
  });

  volume.click(function(){
      if (mute) {
      $(volume).removeClass('mute');
    } else {
      $(volume).addClass('mute');
    }
    song.muted = !mute;
    mute = !mute;
  });

}


  function audioSetup2(player) {
    const play    = $(player).find('.knr_play_control'),
    volume_control    = $(player).find('.knr_volume_control'),
    song    = $(player).find('audio')[0],
    sound  = $(player).find('.knr_volume');
    let mute      =   false;
    song.volume= $(volume_control).attr('volume')/100;

    console.log($(volume_control).attr('volume')/100);

    sound.slider({
        min: 0,
        max: 100,
        value: (song.volume * 100),
        range: "min",
        slide: function(event, ui) {
          song.volume = (ui.value / 100);
          if(song.volume == 0){
            $(volume_control).addClass('mute');
            song.muted = true;
          }else{
            $(volume_control).removeClass('mute');
            song.muted = false;
          }
        }
    });

    play.click(function(){
      if (!song.paused) {
        song.pause();
        play.removeClass('player-animate');
      } else {
        song.play();
      }
    });

    song.onplaying = function(){
      $(play).addClass('player-animate');
    };

    song.addEventListener('ended', function () {
      song.currentTime = 0;
      play.removeClass('player-animate');
    });

    volume_control.click(function(){
        if (mute) {
        $(volume_control).removeClass('mute');
      } else {
        $(volume_control).addClass('mute');
      }
      song.muted = !mute;
      mute = !mute;
    });

  }

  const players = $(".knr_player");
  if(players.length>0){ 
    for (let i = 0; i < players.length; i++) {
      audioSetup(players[i]);
    }
  }

  const players2 = $(".knr_player_2");
  if(players2.length>0){ 
    for (let i = 0; i < players2.length; i++) {
      audioSetup2(players2[i]);
    }
  }


});


})( jQuery );
