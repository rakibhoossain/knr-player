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
	 */
   //  $( window ).load(function() {
  	//  var context = new AudioContext();
  	// });
	
	 /* ...and/or other possibilities.
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
    song.muted = false;
    let mute      =   false;
    song.volume= $(volume).attr('volume')/100;

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

// ========================================================
// KNR Player skin-2
// ========================================================
  function audioSetup2(player) {
    const play    = $(player).find('.knr_play_control'),
    volume_control    = $(player).find('.knr_volume_control'),
    song    = $(player).find('audio')[0],
    sound  = $(player).find('.knr_volume');
    let mute      =   false;
    song.muted = false;
    song.volume= $(volume_control).attr('volume')/100;

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


// ========================================================
// KNR Player skin-3
// ========================================================
function initAudio(player) {
    let audio;

    const element = $(player).find('.playlist li:first-child');
    const playlist = $(player).find('.playlist');

    audio = playAudio(element, player);

    const play = $(player).find('.play'),
        pause = $(player).find('.pause'),
        stop = $(player).find('.stop'),
        next = $(player).find('.next'),
        prev = $(player).find('.prev'),
        volume = $(player).find('.volume');

    $(pause).hide();

    //Next button
    $(next).click(function() {
        audio.pause();
        var nex = $(playlist).find($('li.active')).next();
        if (nex.length == 0) {
            nex = $(playlist).find($('li:first-child'));
        }
        audio = playAudio(nex, player);
        audio.play();
    });

    //Prev button
    $(prev).click(function() {
        audio.pause();
        var pre = $(playlist).find($('li.active')).prev();
        if (pre.length == 0) {
            pre = $(playlist).find($('li:last-child'));
        }
        audio = playAudio(pre, player);
        audio.play();
    });

    //Playlist song click
    $(playlist).find($('li')).click(function() {
        audio.pause();
        audio = playAudio(this, player);
        $(play).hide();
        $(pause).show();
        audio.play();
    });


    //Play button
    $(play).click(function() {
        audio.play();
        $(this).hide();
        $(pause).show();
    });

    //Pause button
    $(pause).click(function() {
        audio.pause();
        $(play).show();
        $(this).hide();
    });

    //Stop button
    $(stop).click(function() {
        audio.pause();
        audio.currentTime = 0;
        $(play).show();
        $(pause).hide();
    });

    //Volume control
    $(volume).change(function() {
        audio.volume = parseFloat(this.value / 10);
    });
$(volume)

}

function playAudio(element, player) {
    let audio;

    const song = $(element).attr('song');
    const title = $(element).text();
    const cover = $(element).attr('cover');
    const artist = $(element).attr('artist');


    const duration = $(player).find('.duration'),
        progress = $(player).find('.progress-bar-inner.progress'),
        volume_d = $(player).find('.volume').val();

    //Create audio object
    audio = new Audio(song);
    audio.volume = parseFloat(volume_d / 10);

    //Insert audio info
    $(player).find($('.artist')).text(artist);
    $(player).find($('.title')).text(title);

    //Insert song cover
    $(player).find($('.audio-image')).css('background-image', 'url(' + cover + ')');

    $(player).find($('.playlist li')).removeClass('active');
    $(element).addClass('active');

    audio.onplaying = function() {
        showDuration(audio, duration, progress);
    };

    audio.addEventListener('ended', function() {
        audio.currentTime = 0;
        $(player).find('.play').show();
        $(player).find('.pause').hide();
        $(progress).css('width', '0');
        $(duration).html('0:00');
    });

    return audio;
}

//Time/Duration
function showDuration(audio, duration, progress) {
    $(audio).bind('timeupdate', function() {
        //Get hours and minutes
        var s = parseInt(audio.currentTime % 60);
        var m = parseInt(audio.currentTime / 60) % 60;
        if (s < 10) {
            s = '0' + s;
        }
        $(duration).html(m + ':' + s);
        var value = 0;
        if (audio.currentTime > 0) {
            value = Math.floor((100 / audio.duration) * audio.currentTime);
        }
        $(progress).css('width', value + '%');
    });
}



//call player
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

  const knrPlayList = $(".knr_palyer_pl_play");
  if (knrPlayList.length > 0) {
      for (let i = 0; i < knrPlayList.length; i++) {
          initAudio(knrPlayList[i]);
      }
  }

});


})( jQuery );
