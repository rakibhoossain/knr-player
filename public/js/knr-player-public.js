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
  // KNR Player
  // ========================================================
  
function audioSetup(player) {
const play    = $(player).find('.knr_play'),
      song    = $(player).find('audio')[0],
      volume  =  $(player).find('.knr-volume-controls');
      let mute      =   false;

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


const players = $(".knr_player");
if(players.length>0){ 
  for (let i = 0; i < players.length; i++) {
    audioSetup(players[i]);
  }
}


});


})( jQuery );
