(function ($)
{
    'use strict';

    // All of the code for your admin-facing JavaScript source
    // should reside in this file.
    //
    // Note: It has been assumed you will write jQuery code here, so the
    // $ function reference has been prepared for usage within the scope
    // of this function.
    //
    // This enables you to define handlers, for when the DOM is ready:
    //
    jQuery(document).ready(function ($)
    {
        $("#knr_player-tabs").tabs();

        const knr_plugin_url = knr_player.knr_player_url;

        // Get the button that opens the modal
        const knr_form = $('#knr_audio_form');
        const btn = $(knr_form).find("#knr_open_modal");
        const knr_list_mp3 = $(knr_form).find("#knr_list_mp3");

        let audio_data = {};

        // Get the modal
        const modal = $("#knr_player_Modal");
        // Get the <span> element that closes the modal
        const close = $(modal).find(".close");
        const save = $(modal).find("#save");
        const update = $(modal).find("#update");
        const delete_btn = $(modal).find("#delete_btn");

        // When the user clicks on the button, open the modal
        $(btn).click(function ()
        {

            const _this = this;
            $(_this).attr('disabled',true).addClass('disabled').after('<div class="load-spinner"><img src="'+knr_plugin_url+'/images/loader.gif" /></div>');

            const info = {
                option: 'new'
            };

            $.post(knr_player.ajax_url,
            { //POST request
                _ajax_nonce: knr_player.nonce, //nonce
                action: "knr_player_ajax_form", //action
                find_audio: info //data
            }, function (data)
            { //callback
                $('#knr_modal_table').html(data);
                $(save).show();
                $(update).hide();
                $(delete_btn).hide();
                $(_this).attr('disabled',false).removeClass('disabled').parent('li').find('.load-spinner').remove();
                $(modal).show();
            });
        });

        // When the user clicks on (x), close the modal 
        $(close).click(function ()
        {
            $(modal).hide();
            console.log('click');
        });


        $(save).click(function ()
        {
            $(modal).hide();
            const id = $(knr_list_mp3).find('li:last-child').attr('val') || 0;
            const item_id = (id * 1) + 1;

            const audio_item = knr_audio_info(modal);
            audio_item.id = item_id;
            audio_data[item_id] = audio_item;

            const li_cnt = '<li val="' + item_id + '">' + audio_item.title + '</li>';
            $('#knr_list_mp3').append(li_cnt);
        });


        $(update).click(function ()
        {
            const audio_item = knr_audio_info(modal);
            $('#knr_list_mp3').find($('li[val=' + audio_item.id + ']')).find('.knr_open_modal_update').val(audio_item.title);
            const current_id = audio_item.id;
            audio_data[current_id] = audio_item;
            $(modal).hide();
        });


        function knr_audio_info(modal)
        {
            const src = $(modal).find('#knr_player_mp3').val().trim();
            const id = $(modal).find('#knr_player_mp3').attr('data');
            const is_live = $(modal).find('#knr_player_is_live').is(":checked");
            const image = $(modal).find('#knr_player_image').val().trim();
            const title = $(modal).find('#knr_player_title').val().trim();
            const author = $(modal).find('#knr_player_author').val().trim();
            const info = $(modal).find('#knr_player_info').val().trim();
            const volume = $(modal).find('#knr_player_default_volume').val();
            
            const audio_item = {
                id: id,
                src: src,
                is_live: is_live,
                image: image,
                title: title,
                author: author,
                info: info,
                volume: volume
            };
            return audio_item;
        }


        $('.knr_player_save').click(function ()
        {
            const save_data = {
                name: $(knr_form).find("#knr_player_name").val(),
                option: $(this).attr('option'),
                skin: $("input[name='knr_player_skin']:checked").val() || 1,
                id: $(this).attr('upid'),
                data: audio_data
            };

            $.post(knr_player.ajax_url,
            { //POST request
                _ajax_nonce: knr_player.nonce, //nonce
                action: "knr_player_ajax_form", //action
                audio_data: save_data //data
            }, function (data)
            { //callback
                location.replace('admin.php?page=knr_player');
            });
        });

        $('.knr_open_modal_update').click(function ()
        {

            const _this = this;
            $(_this).attr('disabled',true).addClass('disabled').after('<div class="load-spinner"><img src="'+knr_plugin_url+'/images/loader.gif" /></div>');

            const info = {
                option: 'find',
                id: $(this).attr('auid'),
                pid: $(this).attr('pid')
            };

            $.post(knr_player.ajax_url,
            { //POST request
                _ajax_nonce: knr_player.nonce, //nonce
                action: "knr_player_ajax_form", //action
                find_audio: info //data
            }, function (data)
            { //callback
                $('#knr_modal_table').html(data);
                $(save).hide();
                $(update).show();
                $(delete_btn).show();
                $(modal).show();
                $(_this).attr('disabled',false).removeClass('disabled').parent('li').find('.load-spinner').remove();
                $(delete_btn).attr('auid', info.id);
                $(delete_btn).attr('pid', info.pid);

            });
        });


        $(delete_btn).click(function ()
        {
            const info = {
                option: 'delete',
                id: $(this).attr('auid'),
                pid: $(this).attr('pid')
            };
            $.post(knr_player.ajax_url,
            { //POST request
                _ajax_nonce: knr_player.nonce, //nonce
                action: "knr_player_ajax_form", //action
                delete_audio: info //data
            }, function (data)
            { //callback
                location.replace('admin.php?page=knr_player');
            });
        });



    });









    // $(function() {

    // });


    // When the window is loaded:
    // $( window ).load(function() {
    // });


    // ...and/or other possibilities.
    // Ideally, it is not considered best practise to attach more than a
    // single DOM-ready or window-load handler for a particular page.
    // Although scripts in the WordPress core, Plugins and Themes may be
    // practising this, we should strive to set a better example in our own work.


}(jQuery));