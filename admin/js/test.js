/** Wonderplugin Audio Player Plugin Trial Version
 * Copyright 2019 Magic Hills Pty Ltd All Rights Reserved
 * Website: http://www.wonderplugin.com
 * Version 9.0 
 */
(function($) {
    $(document).ready(function() {
        $(".wonderplugin-engine").css({
            display: "none"
        });
        $(".wonderplugin-select-mediaimage").click(function() {
            var textId = $(this).data("textid");
            var displayId = $(this).data("displayid");
            var inputName = $(this).data("inputname");
            var media_uploader = wp.media.frames.file_frame = wp.media({
                title: "Select Image",
                library: {
                    type: "image"
                },
                button: {
                    text: "Select Image"
                },
                multiple: false
            });
            media_uploader.on("select", function(event) {
                var selection = media_uploader.state().get("selection");
                var attachment = selection.first().toJSON();
                if (attachment.type == "image") {
                    $("#" + textId).val(attachment.url);
                    if ($("input:radio[name=" + inputName + "]:checked").val() == "custom") $("#" + displayId).attr("src", attachment.url)
                }
            });
            media_uploader.open()
        });
        $(document).on("click", ".wonderplugin-dialog-tab-button", function() {
            if ($(this).hasClass("wonderplugin-dialog-tab-button-selected")) return;
            var index = $(this).index();
            $(this).closest(".wonderplugin-dialog-tab-buttons").find("li").removeClass("wonderplugin-dialog-tab-button-selected");
            $(this).addClass("wonderplugin-dialog-tab-button-selected");
            var panelsID = $(this).closest(".wonderplugin-dialog-tab-buttons").data("panelsid");
            $("#" + panelsID).children("li").removeClass("wonderplugin-dialog-tab-panel-selected");
            $("#" + panelsID).children("li").eq(index).addClass("wonderplugin-dialog-tab-panel-selected")
        });
        $(".wonderplugin-tab-buttons-horizontal").each(function() {
            var index = $.wpaudioCookie($(this).attr("id"));
            if (index >= 0) {
                $(this).children("li").removeClass("wonderplugin-tab-button-horizontal-selected");
                $(this).children("li").eq(index).addClass("wonderplugin-tab-button-horizontal-selected");
                var panelsID = $(this).data("panelsid");
                $("#" + panelsID).children("li").removeClass("wonderplugin-tab-horizontal-selected");
                $("#" + panelsID).children("li").eq(index).addClass("wonderplugin-tab-horizontal-selected")
            }
            $(this).find("li").each(function(index) {
                $(this).click(function() {
                    if ($(this).hasClass("wonderplugin-tab-button-horizontal-selected")) return;
                    $(this).parent().find("li").removeClass("wonderplugin-tab-button-horizontal-selected");
                    $(this).addClass("wonderplugin-tab-button-horizontal-selected");
                    var panelsID = $(this).parent().data("panelsid");
                    $("#" + panelsID).children("li").removeClass("wonderplugin-tab-horizontal-selected");
                    $("#" + panelsID).children("li").eq(index).addClass("wonderplugin-tab-horizontal-selected");
                    $.wpaudioCookie($(this).parent().attr("id"), index)
                })
            })
        });
        $("#wonderplugin-audio-toolbar").find("li").each(function(index) {
            $(this).click(function() {
                if ($(this).hasClass("wonderplugin-tab-buttons-selected")) return;
                $(this).parent().find("li").removeClass("wonderplugin-tab-buttons-selected");
                if (!$(this).hasClass("laststep")) $(this).addClass("wonderplugin-tab-buttons-selected");
                $("#wonderplugin-audio-tabs").children("li").removeClass("wonderplugin-tab-selected");
                $("#wonderplugin-audio-tabs").children("li").eq(index).addClass("wonderplugin-tab-selected");
                $("#wonderplugin-audio-tabs").removeClass("wonderplugin-tabs-grey");
                if (index == 3) {
                    previewAudio();
                    $("#wonderplugin-audio-tabs").addClass("wonderplugin-tabs-grey")
                } else {
                    $("audio").attr("src", "");
                    if (index == 4) publishAudio()
                }
            })
        });
        var getURLParams =
            function(href) {
                var result = {};
                if (href.indexOf("?") < 0) return result;
                var params = href.substring(href.indexOf("?") + 1).split("&");
                for (var i = 0; i < params.length; i++) {
                    var value = params[i].split("=");
                    if (value && value.length == 2 && value[0].toLowerCase() != "v") result[value[0].toLowerCase()] = value[1]
                }
                return result
            };
        var addMediaToList = function(data) {
            if ($("#wonderplugin-newestfirst").is(":checked")) wonderplugin_audio_config.slides.unshift(data);
            else wonderplugin_audio_config.slides.push(data)
        };
        var reminderDialog = function() {
            var dialogCode =
                "<div class='wonderplugin-dialog-container'>" + "<div class='wonderplugin-dialog-bg'></div>" + "<div class='wonderplugin-dialog'>" + "<div class='wonderplugin-dialog-buttons'>" + "<p>The Trial Version supports up to three audios in a player. The Pro Version will remove the limitation.</p><p><a target='_blank' href='http://www.wonderplugin.com/wordpress-audio-player/order/'>Upgrade to Pro Version</a></p>" + "<input type='button' class='button button-primary' id='wonderplugin-dialog-ok' value='OK' />" + "</div>" +
                "</div>" + "</div>" + "</div>";
            var $popupDialog = $(dialogCode);
            $("body").append($popupDialog);
            $(".wonderplugin-dialog").css({
                "margin-top": String($(document).scrollTop() + 120) + "px"
            });
            $(".wonderplugin-dialog-bg").css({
                height: $(document).height() + "px"
            });
            $("#wonderplugin-dialog-ok").click(function() {
                $popupDialog.remove()
            })
        };
        var slideDialog = function(dialogType, onSuccess, data, dataIndex) {
            var dialogTitle = ["audio"];
            var langlist = $.parseJSON($("#wonderplugin-audio-langlist").text());
            var dialogCode = "<div class='wonderplugin-dialog-container'>" +
                "<div id='wonderplugin-dialog-langs' style='display:none;'></div>" + "<div class='wonderplugin-dialog-bg'></div>" + "<div class='wonderplugin-dialog'>" + "<h3 id='wonderplugin-dialog-title'></h3>" + "<div class='error' id='wonderplugin-dialog-error' style='display:none;'></div>" + "<table id='wonderplugin-dialog-form' class='form-table'>";
            dialogCode += "<tr>" + "<th>Mp3 URL</th>" + "<td><input name='wonderplugin-dialog-mp3' type='text' id='wonderplugin-dialog-mp3' value='' class='regular-text' /> or <input type='button' class='button' data-textid='wonderplugin-dialog-mp3' id='wonderplugin-dialog-select-mp3' value='Upload' />" +
                "<p><label><input name='wonderplugin-dialog-live' type='checkbox' id='wonderplugin-dialog-live' />This is a live streaming</label></p>" + "</td>" + "</tr>" + "<tr id='wonderplugin-dialog-live-advanced' style='display:none;'>" + "<th>Radionomy radioUID (Optional)</th>" + "<td><input name='wonderplugin-dialog-radionomyradiouid' type='text' id='wonderplugin-dialog-radionomyradiouid' value='' class='large-text' />" + "<p>If this is a Radionomy live streaming, you can enter the radioUID (GUID) to get the live song title.</p>" +
                "</td>" + "</tr>" + "<tr>" + "<th>Ogg URL (Optional)</th>" + "<td><input name='wonderplugin-dialog-ogg' type='text' id='wonderplugin-dialog-ogg' value='' class='regular-text' /> or <input type='button' class='button' data-textid='wonderplugin-dialog-ogg' id='wonderplugin-dialog-select-ogg' value='Upload' /></td>" + "</tr>";
            dialogCode += "<tr>" + "<th>Image URL</th>" + "<td><input name='wonderplugin-dialog-image' type='text' id='wonderplugin-dialog-image' value='' class='regular-text' /> or <input type='button' class='button' data-textid='wonderplugin-dialog-image' id='wonderplugin-dialog-select-image' value='Upload' /></td>" +
                "</tr>" + "<tr id='wonderplugin-dialog-image-display-tr' style='display:none;'>" + "<th></th>" + "<td><img id='wonderplugin-dialog-image-display' style='width:80px;height:80px;' /></td>" + "</tr>" + "<tr>";
            dialogCode += "<tr>" + "<th>Title</th>" + "<td><input name='wonderplugin-dialog-image-title' type='text' id='wonderplugin-dialog-image-title' value='' class='large-text' /></td>" + "</tr>" + "<tr>" + "<th>Album</th>" + "<td><input name='wonderplugin-dialog-image-album' type='text' id='wonderplugin-dialog-image-album' value='' class='large-text' /></td>" +
                "</tr>" + "<tr>" + "<th>Artist</th>" + "<td><input name='wonderplugin-dialog-image-artist' type='text' id='wonderplugin-dialog-image-artist' value='' class='large-text' /></td>" + "</tr>" + "<tr>" + "<th>Information</th>" + "<td><textarea name='wonderplugin-dialog-image-info' id='wonderplugin-dialog-image-info' class='large-text' rows='2'></textarea></td>" + "</tr>" + "<tr>" + "<th>Duration (seconds)</th>" + "<td><input name='wonderplugin-dialog-image-duration' type='number' id='wonderplugin-dialog-image-duration' size='10' value='' class='medium-text' /></td>" +
                "</tr>";
            if (langlist && langlist.length > 1) dialogCode += '<tr><th></th><td><input type="button" class="button button-primary" id="wonderplugin-dialog-multilingual" value="Multilingual Translation"></td></tr>';
            dialogCode += "</table>" + "<br /><br />" + "<div class='wonderplugin-dialog-buttons'>" + "<input type='button' class='button button-primary' id='wonderplugin-dialog-ok' value='OK' />" + "<input type='button' class='button' id='wonderplugin-dialog-cancel' value='Cancel' />" + "</div>" + "</div>" + "</div>";
            var $slideDialog =
                $(dialogCode);
            $("body").append($slideDialog);
            $("#wonderplugin-dialog-live").click(function() {
                $("#wonderplugin-dialog-live-advanced").css({
                    display: $(this).is(":checked") ? "table-row" : "none"
                })
            });
            $(".wonderplugin-dialog").css({
                "margin-top": String($(document).scrollTop() + 60) + "px"
            });
            $(".wonderplugin-dialog-bg").css({
                height: $(document).height() + "px"
            });
            $("#wonderplugin-dialog-title").html("Add " + dialogTitle[dialogType]);
            if (langlist && langlist.length > 1) $("#wonderplugin-dialog-multilingual").click(function() {
                var defaultlang =
                    $("#wonderplugin-audio-defaultlang").text();
                var form = '<div><ul class="wonderplugin-dialog-tab-buttons" data-panelsid="wonderplugin-dialog-tab-panels-multilingual">';
                for (var i = 0; i < langlist.length; i++) form += '<li class="wonderplugin-dialog-tab-button' + (defaultlang == langlist[i].code ? " wonderplugin-dialog-tab-button-selected" : "") + '">' + langlist[i].translated_name + (defaultlang == langlist[i].code ? " (default)" : "") + "</li>";
                form += "</ul>";
                form += '<ul class="wonderplugin-dialog-tab-panels" id="wonderplugin-dialog-tab-panels-multilingual">';
                for (var i = 0; i < langlist.length; i++) {
                    form += '<li data-langcode="' + langlist[i].code + '" class="wonderplugin-dialog-tab-panel-' + langlist[i].code + " wonderplugin-dialog-tab-panel" + (defaultlang == langlist[i].code ? " wonderplugin-dialog-tab-panel-selected" : "") + '">';
                    form += '<table style="width:100%;">';
                    form += '<tr><th>Title</th><td><input name="wonderplugin-dialog-multilingual-title" value="" type="text" class="large-text"></input></td></tr>';
                    form += '<tr><th>Album</th><td><input name="wonderplugin-dialog-multilingual-album" value="" type="text" class="large-text"></input></td></tr>';
                    form += '<tr><th>Artist</th><td><input name="wonderplugin-dialog-multilingual-artist" value="" type="text" class="large-text"></input></td></tr>';
                    form += '<tr><th>Info</th><td><textarea name="wonderplugin-dialog-multilingual-info" class="large-text"></textarea></td></tr>';
                    form += "</table>";
                    form += "</li>"
                }
                form += "</ul></div>";
                $(form).dialog({
                    title: "Multilingual Translation",
                    resizable: true,
                    modal: true,
                    width: 800,
                    open: function() {
                        var langs = null;
                        try {
                            langs = $.parseJSON($("#wonderplugin-dialog-langs").text())
                        } catch (err) {}
                        var defaultlang =
                            $("#wonderplugin-audio-defaultlang").text();
                        if (langs)
                            for (var key in langs) {
                                if (key == defaultlang) {
                                    langs[key].title = $("#wonderplugin-dialog-image-title").val();
                                    langs[key].album = $("#wonderplugin-dialog-image-album").val();
                                    langs[key].artist = $("#wonderplugin-dialog-image-artist").val();
                                    langs[key].info = $("#wonderplugin-dialog-image-info").val()
                                }
                                var panel = $("#wonderplugin-dialog-tab-panels-multilingual .wonderplugin-dialog-tab-panel-" + key);
                                if (panel.length > 0) {
                                    $("input[name=wonderplugin-dialog-multilingual-title]",
                                        panel).val(langs[key].title);
                                    $("input[name=wonderplugin-dialog-multilingual-album]", panel).val(langs[key].album);
                                    $("input[name=wonderplugin-dialog-multilingual-artist]", panel).val(langs[key].artist);
                                    $("textarea[name=wonderplugin-dialog-multilingual-info]", panel).val(langs[key].info)
                                }
                            } else
                                for (var i = 0; i < langlist.length; i++) {
                                    $("input[name=wonderplugin-dialog-multilingual-title]").val($("#wonderplugin-dialog-image-title").val());
                                    $("input[name=wonderplugin-dialog-multilingual-album]").val($("#wonderplugin-dialog-image-album").val());
                                    $("input[name=wonderplugin-dialog-multilingual-artist]").val($("#wonderplugin-dialog-image-artist").val());
                                    $("textarea[name=wonderplugin-dialog-multilingual-info]").val($("#wonderplugin-dialog-image-info").val())
                                }
                    },
                    buttons: {
                        "Ok": function() {
                            var defaultlang = $("#wonderplugin-audio-defaultlang").text();
                            var langs = {};
                            $("#wonderplugin-dialog-tab-panels-multilingual .wonderplugin-dialog-tab-panel").each(function(index) {
                                var langcode = $(this).data("langcode");
                                langs[langcode] = {
                                    title: $("input[name=wonderplugin-dialog-multilingual-title]",
                                        this).val(),
                                    album: $("input[name=wonderplugin-dialog-multilingual-album]", this).val(),
                                    artist: $("input[name=wonderplugin-dialog-multilingual-artist]", this).val(),
                                    info: $("textarea[name=wonderplugin-dialog-multilingual-info]", this).val()
                                };
                                if (langcode == defaultlang) {
                                    $("#wonderplugin-dialog-image-title").val(langs[langcode].title);
                                    $("#wonderplugin-dialog-image-album").val(langs[langcode].album);
                                    $("#wonderplugin-dialog-image-artist").val(langs[langcode].artist);
                                    $("#wonderplugin-dialog-image-info").val(langs[langcode].info)
                                }
                            });
                            $("#wonderplugin-dialog-langs").text(JSON.stringify(langs));
                            $(this).dialog("destroy").remove()
                        },
                        "Cancel": function() {
                            $(this).dialog("destroy").remove()
                        }
                    }
                })
            });
            if (data) {
                if (data.langs) $("#wonderplugin-dialog-langs").text(data.langs);
                $("#wonderplugin-dialog-image").val(data.image);
                if (data.image) {
                    $("#wonderplugin-dialog-image-display-tr").css({
                        display: "table-row"
                    });
                    $("#wonderplugin-dialog-image-display").attr("src", data.image)
                }
                $("#wonderplugin-dialog-image-title").val(data.title);
                $("#wonderplugin-dialog-image-album").val(data.album);
                $("#wonderplugin-dialog-image-artist").val(data.artist);
                $("#wonderplugin-dialog-image-info").val(data.info);
                $("#wonderplugin-dialog-image-duration").val(data.duration);
                $("#wonderplugin-dialog-mp3").val(data.mp3);
                $("#wonderplugin-dialog-ogg").val(data.ogg);
                $("#wonderplugin-dialog-live").attr("checked", data.live);
                $("#wonderplugin-dialog-radionomyradiouid").val(data.radionomyradiouid);
                $("#wonderplugin-dialog-live-advanced").css({
                    display: data.live ? "table-row" : "none"
                })
            }
            var get_media_langs = function(items,
                callback) {
                if (langlist && langlist.length > 1) {
                    var media = new Array;
                    for (var i = 0; i < items.length; i++) media.push(items[i].id);
                    var ajaxnonce = $("#wonderplugin-audio-ajaxnonce").text();
                    var loading = '<div><div class="wonderplugin-dialog-loading"></div><p style="text-align:center;font-size:1.2em;">Loading multilingual text from Media Library ... </p></div>';
                    var loadingDialog = $(loading).dialog({
                        title: "Loading",
                        width: 500,
                        resizable: false,
                        modal: true
                    });
                    $.ajax({
                        url: ajaxurl,
                        type: "POST",
                        data: {
                            action: "wonderplugin_audio_get_media_langs",
                            nonce: ajaxnonce,
                            item: JSON.stringify(media)
                        },
                        success: function(data) {
                            if (data) {
                                var defaultlang = $("#wonderplugin-audio-defaultlang").text();
                                var currentlang = $("#wonderplugin-audio-currentlang").text();
                                for (var i = 0; i < items.length; i++)
                                    for (var key in data)
                                        if (items[i].id == key) {
                                            items[i].langs = JSON.stringify(data[key]);
                                            if (currentlang != defaultlang && data[key])
                                                for (var langcode in data[key])
                                                    if (langcode == defaultlang) {
                                                        items[i].title = data[key][langcode].title;
                                                        items[i].album = data[key][langcode].album;
                                                        items[i].artist =
                                                            data[key][langcode].artist;
                                                        items[i].info = data[key][langcode].info;
                                                        break
                                                    } break
                                        }
                            }
                        },
                        complete: function() {
                            callback(items);
                            loadingDialog.dialog("destroy").remove()
                        }
                    })
                } else callback(items)
            };
            var media_upload_onclick = function(event) {
                event.preventDefault();
                var buttonId = $(this).attr("id");
                var textId = $(this).data("textid");
                var library_title = buttonId == "wonderplugin-dialog-select-image" ? "Add Image" : "Add Audio";
                var library_type = buttonId == "wonderplugin-dialog-select-image" ? "image" : "audio";
                var library_multiple = buttonId ==
                    "wonderplugin-dialog-select-mp3" ? true : false;
                var media_uploader = wp.media.frames.file_frame = wp.media({
                    title: library_title,
                    library: {
                        type: library_type
                    },
                    button: {
                        text: library_title
                    },
                    multiple: library_multiple
                });
                media_uploader.on("select", function(event) {
                    var selection = media_uploader.state().get("selection");
                    if (dialogType == 0 && buttonId == "wonderplugin-dialog-select-image" && selection.length > 1) {
                        var items = [];
                        selection.map(function(attachment) {
                            attachment = attachment.toJSON();
                            if (attachment.type != "image") return;
                            items.push({
                                image: attachment.url,
                                title: attachment.title,
                                album: attachment.album,
                                artist: attachment.artist,
                                info: attachment.info,
                                duration: attachment.duration,
                                weblink: "",
                                linktarget: "",
                                lightbox: true
                            })
                        });
                        $slideDialog.remove();
                        onSuccess(items)
                    } else if (buttonId == "wonderplugin-dialog-select-mp3" && selection.length > 1) {
                        var items = [];
                        selection.map(function(attachment) {
                            attachment = attachment.toJSON();
                            if (attachment.type != "audio") return;
                            var seconds = 0;
                            if (attachment.fileLength && attachment.fileLength.length > 0) {
                                var hms = attachment.fileLength.split(":");
                                var rate = 1;
                                for (var i = hms.length - 1; i >= 0; i--) {
                                    seconds += hms[i] * rate;
                                    rate *= 60
                                }
                            }
                            var item_image = attachment.image && attachment.image.src ? attachment.image.src : "";
                            var item_album = attachment.album ? attachment.album : attachment.meta && attachment.meta.album ? attachment.meta.album : "";
                            var item_artist = attachment.artist ? attachment.artist : attachment.meta && attachment.meta.artist ? attachment.meta.artist : "";
                            items.push({
                                id: attachment.id,
                                image: item_image,
                                mp3: attachment.url,
                                ogg: "",
                                title: attachment.title ? attachment.title : "",
                                album: item_album,
                                artist: item_artist,
                                info: attachment.description ? attachment.description : "",
                                duration: seconds,
                                live: false
                            })
                        });
                        $slideDialog.remove();
                        get_media_langs(items, onSuccess)
                    } else {
                        attachment = selection.first().toJSON();
                        if (buttonId == "wonderplugin-dialog-select-image") {
                            if (attachment.type != "image") {
                                $("#wonderplugin-dialog-error").css({
                                    display: "block"
                                }).html("<p>Please select an image file</p>");
                                return
                            }
                            $("#wonderplugin-dialog-image-display-tr").css({
                                display: "table-row"
                            });
                            $("#wonderplugin-dialog-image-display").attr("src",
                                attachment.url);
                            $("#wonderplugin-dialog-image").val(attachment.url)
                        } else {
                            if (attachment.type != "audio") {
                                $("#wonderplugin-dialog-error").css({
                                    display: "block"
                                }).html("<p>Please select an audio file</p>");
                                return
                            }
                            $("#" + textId).val(attachment.url);
                            var item_image = attachment.image && attachment.image.src ? attachment.image.src : "";
                            var item_album = attachment.album ? attachment.album : attachment.meta && attachment.meta.album ? attachment.meta.album : "";
                            var item_artist = attachment.artist ? attachment.artist : attachment.meta &&
                                attachment.meta.artist ? attachment.meta.artist : "";
                            if (item_image) {
                                $("#wonderplugin-dialog-image").val(item_image);
                                $("#wonderplugin-dialog-image-display-tr").css({
                                    display: "table-row"
                                });
                                $("#wonderplugin-dialog-image-display").attr("src", item_image)
                            }
                            $("#wonderplugin-dialog-image-album").val(item_album);
                            $("#wonderplugin-dialog-image-artist").val(item_artist);
                            $("#wonderplugin-dialog-image-title").val(attachment.title);
                            $("#wonderplugin-dialog-image-info").val(attachment.description);
                            if (attachment.fileLength &&
                                attachment.fileLength.length > 0) {
                                var hms = attachment.fileLength.split(":");
                                var seconds = 0;
                                var rate = 1;
                                for (var i = hms.length - 1; i >= 0; i--) {
                                    seconds += hms[i] * rate;
                                    rate *= 60
                                }
                                $("#wonderplugin-dialog-image-duration").val(seconds)
                            }
                            get_media_langs([{
                                id: attachment.id
                            }], function(data) {
                                if (data && data.length > 0) {
                                    $("#wonderplugin-dialog-langs").text(data[0].langs);
                                    var defaultlang = $("#wonderplugin-audio-defaultlang").text();
                                    var currentlang = $("#wonderplugin-audio-currentlang").text();
                                    if (currentlang != defaultlang && data[0].langs) {
                                        var langs =
                                            $.parseJSON(data[0].langs);
                                        for (var langcode in langs)
                                            if (langcode == defaultlang) {
                                                $("#wonderplugin-dialog-image-title").val(langs[langcode].title);
                                                $("#wonderplugin-dialog-image-album").val(langs[langcode].album);
                                                $("#wonderplugin-dialog-image-artist").val(langs[langcode].artist);
                                                $("#wonderplugin-dialog-image-info").val(langs[langcode].info);
                                                break
                                            }
                                    }
                                }
                            })
                        }
                    }
                    $("#wonderplugin-dialog-error").css({
                        display: "none"
                    }).empty()
                });
                media_uploader.open()
            };
            if (parseInt($("#wonderplugin-audio-wp-history-media-uploader").text()) ==
                1) {
                var buttonId = "";
                var textId = "";
                var history_media_upload_onclick = function(event) {
                    buttonId = $(this).attr("id");
                    textId = $(this).data("textid");
                    var mediaType = buttonId == "wonderplugin-dialog-select-image" ? "image" : "video";
                    tb_show("Upload " + mediaType, "media-upload.php?referer=wonderplugin-audio&type=" + mediaType + "&TB_iframe=true", false);
                    return false
                };
                window.send_to_editor = function(html) {
                    tb_remove();
                    if (buttonId == "wonderplugin-dialog-select-image") {
                        var $img = $("img", html);
                        if (!$img.length) {
                            $("#wonderplugin-dialog-error").css({
                                display: "block"
                            }).html("<p>Please select an image file</p>");
                            return
                        }
                        var src = $(html).is("a") ? $(html).attr("href") : $img.attr("src");
                        $("#wonderplugin-dialog-image-display-tr").css({
                            display: "table-row"
                        });
                        $("#wonderplugin-dialog-image-display").attr("src", src);
                        $("#wonderplugin-dialog-image").val(src);
                        $("#wonderplugin-dialog-image-title").val($("img", html).attr("title"))
                    } else {
                        if ($("img", html).length) {
                            $("#wonderplugin-dialog-error").css({
                                display: "block"
                            }).html("<p>Please select a video file</p>");
                            return
                        }
                        $("#" + textId).val($(html).attr("href"))
                    }
                    $("#wonderplugin-dialog-error").css({
                        display: "none"
                    }).empty()
                };
                $("#wonderplugin-dialog-select-image").click(history_media_upload_onclick);
                $("#wonderplugin-dialog-select-mp3").click(history_media_upload_onclick);
                $("#wonderplugin-dialog-select-ogg").click(history_media_upload_onclick)
            } else {
                $("#wonderplugin-dialog-select-image").click(media_upload_onclick);
                $("#wonderplugin-dialog-select-mp3").click(media_upload_onclick);
                $("#wonderplugin-dialog-select-ogg").click(media_upload_onclick)
            }
            $("#wonderplugin-dialog-ok").click(function() {
                if ($.trim($("#wonderplugin-dialog-mp3").val()).length <=
                    0) {
                    $("#wonderplugin-dialog-error").css({
                        display: "block"
                    }).html("<p>Please select an mp3 file</p>");
                    return
                }
                var langs = $.parseJSON($("#wonderplugin-dialog-langs").text());
                var defaultlang = $("#wonderplugin-audio-defaultlang").text();
                for (var key in langs)
                    if (key == defaultlang) {
                        langs[key].title = $("#wonderplugin-dialog-image-title").val();
                        langs[key].album = $("#wonderplugin-dialog-image-album").val();
                        langs[key].artist = $("#wonderplugin-dialog-image-artist").val();
                        langs[key].info = $("#wonderplugin-dialog-image-info").val()
                    } var item = {
                    image: $.trim($("#wonderplugin-dialog-image").val()),
                    mp3: $.trim($("#wonderplugin-dialog-mp3").val()),
                    ogg: $.trim($("#wonderplugin-dialog-ogg").val()),
                    title: $.trim($("#wonderplugin-dialog-image-title").val()),
                    album: $.trim($("#wonderplugin-dialog-image-album").val()),
                    artist: $.trim($("#wonderplugin-dialog-image-artist").val()),
                    info: $.trim($("#wonderplugin-dialog-image-info").val()),
                    duration: $.trim($("#wonderplugin-dialog-image-duration").val()),
                    live: $("#wonderplugin-dialog-live").is(":checked"),
                    radionomyradiouid: $.trim($("#wonderplugin-dialog-radionomyradiouid").val()),
                    langs: langs ? JSON.stringify(langs) : ""
                };
                $slideDialog.remove();
                onSuccess([item])
            });
            $("#wonderplugin-dialog-cancel").click(function() {
                $slideDialog.remove()
            })
        };
        var updateMediaTable = function() {
            $("#wonderplugin-audio-media-table").empty();
            for (var i = 0; i < wonderplugin_audio_config.slides.length; i++) $("#wonderplugin-audio-media-table").append("<li>" + "<div class='wonderplugin-audio-media-table-id'>" + (i + 1) + "</div>" + "<div class='wonderplugin-audio-media-table-img'>" + "<img class='wonderplugin-audio-media-table-image' data-order='" +
                i + "' src='" + (wonderplugin_audio_config.slides[i].image && wonderplugin_audio_config.slides[i].image.length > 0 ? wonderplugin_audio_config.slides[i].image : $("#wonderplugin-audio-jsfolder").text() + "audio.png") + "' />" + "</div>" + "<div class='wonderplugin-audio-media-table-title'>" + wonderplugin_audio_config.slides[i].title + "</div>" + "<div class='wonderplugin-audio-media-table-buttons-edit'>" + "<a class='wonderplugin-audio-media-table-button wonderplugin-audio-media-table-edit'>Edit</a>&nbsp;|&nbsp;" + "<a class='wonderplugin-audio-media-table-button wonderplugin-audio-media-table-clone'>Clone</a>&nbsp;|&nbsp;" +
                "<a class='wonderplugin-audio-media-table-button wonderplugin-audio-media-table-delete'>Delete</a>" + "</div>" + "<div class='wonderplugin-audio-media-table-buttons-move'>" + "<a class='wonderplugin-audio-media-table-button wonderplugin-audio-media-table-moveup'>Move Up</a>&nbsp;|&nbsp;" + "<a class='wonderplugin-audio-media-table-button wonderplugin-audio-media-table-movedown'>Move Down</a>" + "</div>" + "<div style='clear:both;'></div>" + "</li>");
            $(".wonderplugin-audio-media-table-image").wpdraggable(wonderPluginMediaTableMove);
            $(".wonderplugin-audio-media-table-help").css({
                display: wonderplugin_audio_config.slides.length > 0 ? "none" : "block"
            });
            $("#wonderplugin-audio-media-table").css({
                display: wonderplugin_audio_config.slides.length > 0 ? "block" : "none"
            })
        };
        $("#wonderplugin-add-mp3").click(function() {
            if ($("#wonderplugin-audio-license").text() != "C" && window.location.href.indexOf("://" + "www.wonderplugin.com") < 0 && wonderplugin_audio_config.slides.length >= 3) reminderDialog();
            else slideDialog(0, function(items) {
                var showReminder = false;
                items.map(function(data) {
                    if ($("#wonderplugin-audio-license").text() !=
                        "C" && window.location.href.indexOf("://" + "www.wonderplugin.com") < 0 && wonderplugin_audio_config.slides.length >= 3) showReminder = true;
                    else addMediaToList({
                        type: 0,
                        image: data.image,
                        mp3: data.mp3,
                        ogg: data.ogg,
                        title: data.title,
                        album: data.album,
                        artist: data.artist,
                        info: data.info,
                        duration: data.duration,
                        live: data.live,
                        radionomyradiouid: data.radionomyradiouid,
                        langs: data.langs
                    })
                });
                updateMediaTable();
                if (showReminder) reminderDialog()
            })
        });
        $("#wonderplugin-globalsettings").click(function() {
            globalSettingsDialog()
        });
        var globalSettingsDialog =
            function() {
                var form = '<table class="table-global-settings">';
                form += "<tr>";
                form += "<td>Image URL: </td>";
                form += '<td><label><input name="wonderplugin-globalsettings-image" type="text" value="" class="regular-text"></label><p><input type="button" class="button" data-textname="wonderplugin-globalsettings-image" id="wonderplugin-globalsettings-selectimage" value="Upload"></p></td>';
                form += '<td><button class="button button-secondary wonderplugin-globalsettings-apply" data-option="image">Apply the Option</button></td>';
                form += "</tr>";
                form += "<tr>";
                form += "<td>Title: </td>";
                form += '<td><label><input name="wonderplugin-globalsettings-title" type="text" value="" class="regular-text"></label></td>';
                form += '<td><button class="button button-secondary wonderplugin-globalsettings-apply" data-option="title">Apply the Option</button></td>';
                form += "</tr>";
                form += "<tr>";
                form += "<td>Album: </td>";
                form += '<td><label><input name="wonderplugin-globalsettings-album" type="text" value="" class="regular-text"></label></td>';
                form += '<td><button class="button button-secondary wonderplugin-globalsettings-apply" data-option="album">Apply the Option</button></td>';
                form += "</tr>";
                form += "<tr>";
                form += "<td>Artist: </td>";
                form += '<td><label><input name="wonderplugin-globalsettings-artist" type="text" value="" class="regular-text"></label></td>';
                form += '<td><button class="button button-secondary wonderplugin-globalsettings-apply" data-option="artist">Apply the Option</button></td>';
                form += "</tr>";
                form += "<tr>";
                form += "<td>Information: </td>";
                form += '<td><label><input name="wonderplugin-globalsettings-info" type="text" value="" class="regular-text"></label></td>';
                form +=
                    '<td><button class="button button-secondary wonderplugin-globalsettings-apply" data-option="info">Apply the Option</button></td>';
                form += "</tr>";
                form += "<tr>";
                form += '<td colspan="3"><p style="text-align:center;"><i><b>Click the button "Apply the Option" to apply the value of the option to all audios in the player.</b></i></p></td>';
                form += "</tr>";
                form += "</table>";
                $(form).dialog({
                    title: "Apply Option To All Audios In The Player At Once",
                    resizable: true,
                    modal: true,
                    width: 700,
                    buttons: {
                        "Close": function() {
                            $(this).dialog("destroy").remove()
                        }
                    }
                });
                $("#wonderplugin-globalsettings-selectimage").click(function() {
                    var textName = $(this).data("textname");
                    var media_uploader = wp.media.frames.file_frame = wp.media({
                        title: "Select Image",
                        button: {
                            text: "Select Image"
                        },
                        multiple: false
                    });
                    media_uploader.on("select", function(event) {
                        var attachment = media_uploader.state().get("selection").first().toJSON();
                        if (attachment.type == "image") $("input[name=" + textName + "]").val(attachment.url)
                    });
                    media_uploader.open()
                });
                $(document).off("click", ".wonderplugin-globalsettings-apply").on("click",
                    ".wonderplugin-globalsettings-apply",
                    function() {
                        var option = $(this).data("option");
                        for (var i = 0; i < wonderplugin_audio_config.slides.length; i++)
                            if (option == "image") wonderplugin_audio_config.slides[i].image = $("input[name=wonderplugin-globalsettings-image]").val();
                            else if (option == "title") wonderplugin_audio_config.slides[i].title = $("input[name=wonderplugin-globalsettings-title]").val();
                        else if (option == "album") wonderplugin_audio_config.slides[i].album = $("input[name=wonderplugin-globalsettings-album]").val();
                        else if (option == "artist") wonderplugin_audio_config.slides[i].artist = $("input[name=wonderplugin-globalsettings-artist]").val();
                        else if (option == "info") wonderplugin_audio_config.slides[i].info = $("input[name=wonderplugin-globalsettings-info]").val();
                        updateMediaTable();
                        $("<div><h2>Option Applied to All Items</h2></div>").dialog({
                            title: "",
                            modal: true,
                            open: function(e) {
                                var parentDialog = $(e.target).closest(".ui-dialog");
                                parentDialog.css("background-color", "#eee");
                                parentDialog.find(".ui-dialog-titlebar, .ui-dialog-buttonpane").css("background-color",
                                    "#eee")
                            },
                            buttons: {
                                "Close": function() {
                                    $(this).dialog("close")
                                }
                            }
                        })
                    })
            };
        $("#wonderplugin-sortlist").click(function() {
            sortDialog(function() {
                updateMediaTable()
            })
        });
        var sortDialog = function(onSuccess) {
            var dialogCode = "<div class='wonderplugin-dialog-container'>" + "<div class='wonderplugin-dialog-bg'></div>" + "<div class='wonderplugin-dialog wonderplugin-dialog-small'>" + "<h3 id='wonderplugin-dialog-title'>Sort List</h3>" + "<div class='error' id='wonderplugin-dialog-error' style='display:none;'></div>" + "<p id='wonderplugin-dialog-sortmessage' style='display:none;'>It may take a while, please wait ......</p>" +
                "<p id='wonderplugin-dialog-sortoptions'>Sort By: ";
            dialogCode += "<select name='wonderplugin-dialog-sortby' id='wonderplugin-dialog-sortby'>" + "<option value='title'>Title</option>" + "<option value='album'>Album</option>" + "<option value='artist'>Artist</option>" + "<option value='url'>URL</option>" + "<option value='file'>Filename</option>" + "</select>";
            dialogCode += "<select name='wonderplugin-dialog-sortorder' id='wonderplugin-dialog-sortorder'>" + "<option value='asc'>Ascending</option>" + "<option value='desc'>Descending</option>" +
                "</select>";
            dialogCode += "</p>" + "<div class='wonderplugin-dialog-buttons'>" + "<input type='button' class='button button-primary' id='wonderplugin-dialog-ok' value='OK' />" + "<input type='button' class='button' id='wonderplugin-dialog-cancel' value='Cancel' />" + "<input type='button' class='button button-primary' id='wonderplugin-dialog-sortok' value='Close' style='display:none;' />" + "</div>" + "</div>" + "</div>";
            var $sortDialog = $(dialogCode);
            $("body").append($sortDialog);
            $(".wonderplugin-dialog").css({
                "margin-top": String($(document).scrollTop() +
                    120) + "px"
            });
            $(".wonderplugin-dialog-bg").css({
                height: $(document).height() + "px"
            });
            $("#wonderplugin-dialog-ok").click(function() {
                $("#wonderplugin-dialog-sortoptions").hide();
                $("#wonderplugin-dialog-sortmessage").show();
                $("#wonderplugin-dialog-ok").hide();
                $("#wonderplugin-dialog-cancel").hide();
                $("#wonderplugin-dialog-sortok").hide();
                $sortby = $("#wonderplugin-dialog-sortby").val();
                $sortorder = $("#wonderplugin-dialog-sortorder").val();
                wonderplugin_audio_config.slides.sort(function(a, b) {
                    var ret = 0;
                    if ($sortby ==
                        "url") ret = a.mp3.localeCompare(b.mp3);
                    else if ($sortby == "title") ret = a.title.localeCompare(b.title);
                    else if ($sortby == "album") ret = a.album.localeCompare(b.album);
                    else if ($sortby == "artist") ret = a.artist.localeCompare(b.artist);
                    else if ($sortby == "file") {
                        var filea = a.mp3.substring(a.mp3.lastIndexOf("/") + 1);
                        var fileb = b.mp3.substring(b.mp3.lastIndexOf("/") + 1);
                        ret = filea.localeCompare(fileb)
                    }
                    if ($sortorder == "desc") ret = -ret;
                    return ret
                });
                $("#wonderplugin-dialog-sortmessage").html("Sorting finished!");
                $("#wonderplugin-dialog-sortok").show()
            });
            $("#wonderplugin-dialog-cancel").click(function() {
                $sortDialog.remove()
            });
            $("#wonderplugin-dialog-sortok").click(function() {
                $sortDialog.remove();
                onSuccess()
            })
        };
        $("#wonderplugin-reverselist").click(function() {
            wonderplugin_audio_config.slides.reverse();
            updateMediaTable()
        });
        $(document).on("click", ".wonderplugin-audio-media-table-edit", function() {
            var index = $(this).parent().parent().index();
            var mediaType = wonderplugin_audio_config.slides[index].type;
            slideDialog(mediaType, function(items) {
                if (items && items.length >
                    0) {
                    wonderplugin_audio_config.slides.splice(index, 1);
                    items.map(function(data) {
                        wonderplugin_audio_config.slides.splice(index, 0, {
                            type: mediaType,
                            image: data.image,
                            mp3: data.mp3,
                            ogg: data.ogg,
                            title: data.title,
                            album: data.album,
                            artist: data.artist,
                            info: data.info,
                            duration: data.duration,
                            live: data.live,
                            radionomyradiouid: data.radionomyradiouid,
                            langs: data.langs
                        })
                    });
                    updateMediaTable()
                }
            }, wonderplugin_audio_config.slides[index], index)
        });
        $(document).on("click", ".wonderplugin-audio-media-table-clone", function() {
            var $tr =
                $(this).parent().parent();
            var index = $tr.index();
            var slide = wonderplugin_audio_config.slides[index];
            wonderplugin_audio_config.slides.splice(index, 0, slide);
            updateMediaTable()
        });
        $(document).on("click", ".wonderplugin-audio-media-table-delete", function() {
            var $tr = $(this).parent().parent();
            var index = $tr.index();
            wonderplugin_audio_config.slides.splice(index, 1);
            $tr.remove();
            $("#wonderplugin-audio-media-table").find("li").each(function(index) {
                $(this).find(".wonderplugin-audio-media-table-id").text(index + 1);
                $(this).find("img").data("order", index);
                $(this).find("img").css({
                    top: 0,
                    left: 0
                })
            })
        });
        var wonderPluginMediaTableMove = function(i, j) {
            var len = wonderplugin_audio_config.slides.length;
            if (j < 0) j = 0;
            if (j > len - 1) j = len - 1;
            if (i == j) {
                $("#wonderplugin-audio-media-table").find("li").eq(i).find("img").css({
                    top: 0,
                    left: 0
                });
                return
            }
            var $tr = $("#wonderplugin-audio-media-table").find("li").eq(i);
            var data = wonderplugin_audio_config.slides[i];
            wonderplugin_audio_config.slides.splice(i, 1);
            wonderplugin_audio_config.slides.splice(j,
                0, data);
            var $trj = $("#wonderplugin-audio-media-table").find("li").eq(j);
            $tr.remove();
            if (j > i) $trj.after($tr);
            else $trj.before($tr);
            $("#wonderplugin-audio-media-table").find("li").each(function(index) {
                $(this).find(".wonderplugin-audio-media-table-id").text(index + 1);
                $(this).find("img").data("order", index);
                $(this).find("img").css({
                    top: 0,
                    left: 0
                })
            });
            $tr.find("img").wpdraggable(wonderPluginMediaTableMove)
        };
        $(document).on("click", ".wonderplugin-audio-media-table-moveup", function() {
            var $tr = $(this).parent().parent();
            var index = $tr.index();
            var data = wonderplugin_audio_config.slides[index];
            wonderplugin_audio_config.slides.splice(index, 1);
            if (index == 0) {
                wonderplugin_audio_config.slides.push(data);
                var $last = $tr.parent().find("li:last");
                $tr.remove();
                $last.after($tr)
            } else {
                wonderplugin_audio_config.slides.splice(index - 1, 0, data);
                var $prev = $tr.prev();
                $tr.remove();
                $prev.before($tr)
            }
            $("#wonderplugin-audio-media-table").find("li").each(function(index) {
                $(this).find(".wonderplugin-audio-media-table-id").text(index + 1);
                $(this).find("img").data("order",
                    index);
                $(this).find("img").css({
                    top: 0,
                    left: 0
                })
            });
            $tr.find("img").wpdraggable(wonderPluginMediaTableMove)
        });
        $(document).on("click", ".wonderplugin-audio-media-table-movedown", function() {
            var $tr = $(this).parent().parent();
            var index = $tr.index();
            var len = wonderplugin_audio_config.slides.length;
            var data = wonderplugin_audio_config.slides[index];
            wonderplugin_audio_config.slides.splice(index, 1);
            if (index == len - 1) {
                wonderplugin_audio_config.slides.unshift(data);
                var $first = $tr.parent().find("li:first");
                $tr.remove();
                $first.before($tr)
            } else {
                wonderplugin_audio_config.slides.splice(index + 1, 0, data);
                var $next = $tr.next();
                $tr.remove();
                $next.after($tr)
            }
            $("#wonderplugin-audio-media-table").find("li").each(function(index) {
                $(this).find(".wonderplugin-audio-media-table-id").text(index + 1);
                $(this).find("img").data("order", index);
                $(this).find("img").css({
                    top: 0,
                    left: 0
                })
            });
            $tr.find("img").wpdraggable(wonderPluginMediaTableMove)
        });
        var default_options = {
            id: -1,
            newestfirst: false,
            name: "My Audio Player",
            slides: [],
            skin: "bar",
            donotinit: false,
            addinitscript: false,
            forceflash: false,
            forcehtml5: false,
            setdefaultvolume: false,
            defaultvolume: 100,
            playbackrate: 1,
            enablega: false,
            gatrackingid: "",
            saveposincookie: false,
            cookiehours: 240,
            liveupdateinterval: 1E4,
            showliveplayedlist: false,
            maxplayedlist: 8,
            playedlisttitle: "Last Tracks Played",
            infoformat: "%ARTIST% %ALBUM% %INFO%",
            autoresize: false,
            preloadaudio: true,
            tracklistscroll: true,
            showtracklistsearch: false,
            customisetracklistitemformat: false,
            showtime: false,
            showimage: true,
            imagewidth: 160,
            imageheight: 160,
            showinfo: true,
            progressinbar: true,
            customcss: "",
            dataoptions: "",
            customjs: ""
        };
        var configSkinOptions = ["progressinbar", "showinfo", "showimage", "imagewidth", "imageheight", "width", "height", "autoplay", "random", "loop", "heightmode", "showtracklist", "tracklistscroll", "showprogress", "tracklistitem", "showprevnext", "showloop", "showloading", "titleinbarscroll", "titleinbarwidth", "preloadaudio", "tracklistitemformat", "infoformat", "showtitleinbar", "showtime", "showvolume", "showvolumebar", "playpauseimage", "playpauseimagewidth", "playpauseimageheight",
            "prevnextimage", "prevnextimagewidth", "prevnextimageheight", "volumeimage", "volumeimagewidth", "volumeimageheight", "loopimage", "loopimagewidth", "loopimageheight", "showliveplayedlist"
        ];
        var defaultSkinOptions = {};
        for (var key in WONDERPLUGIN_AUDIO_SKIN_OPTIONS) {
            if (key == "lightbox") WONDERPLUGIN_AUDIO_SKIN_OPTIONS[key]["progressinbar"] = false;
            if (key == "darkbox" || key == "jukebox") WONDERPLUGIN_AUDIO_SKIN_OPTIONS[key]["showtime"] = true;
            if (key == "lightbox" || key == "musicbox") WONDERPLUGIN_AUDIO_SKIN_OPTIONS[key]["heightmode"] =
                "auto";
            defaultSkinOptions[key] = $.extend({}, default_options);
            for (var i = 0; i < configSkinOptions.length; i++)
                if (configSkinOptions[i] in WONDERPLUGIN_AUDIO_SKIN_OPTIONS[key]) defaultSkinOptions[key][configSkinOptions[i]] = WONDERPLUGIN_AUDIO_SKIN_OPTIONS[key][configSkinOptions[i]];
            defaultSkinOptions[key]["skincss"] = WONDERPLUGIN_AUDIO_SKIN_TEMPLATE[key]["skincss"];
            defaultSkinOptions[key]["autoresize"] = false;
            defaultSkinOptions[key]["responsive"] = false;
            defaultSkinOptions[key]["forceflash"] = false;
            defaultSkinOptions[key]["forcehtml5"] =
                false;
            defaultSkinOptions[key]["playpauseimagemode"] = "defined";
            defaultSkinOptions[key]["prevnextimagemode"] = "defined";
            defaultSkinOptions[key]["volumeimagemode"] = "defined";
            defaultSkinOptions[key]["loopimagemode"] = "defined"
        }
        var printSkinOptions = function(options) {
            $("#wonderplugin-audio-width").val(options.width);
            $("#wonderplugin-audio-height").val(options.height);
            $("#wonderplugin-audio-autoplay").attr("checked", options.autoplay);
            $("#wonderplugin-audio-random").attr("checked", options.random);
            $("#wonderplugin-audio-loop").val(options.loop);
            $("#wonderplugin-audio-heightmode").val(options.heightmode);
            $("#wonderplugin-audio-preloadaudio").attr("checked", options.preloadaudio);
            $("#wonderplugin-audio-autoresize").attr("checked", options.autoresize);
            $("#wonderplugin-audio-responsive").attr("checked", options.responsive);
            $("#wonderplugin-audio-showtracklist").attr("checked", options.showtracklist);
            $("#wonderplugin-audio-tracklistscroll").attr("checked", options.tracklistscroll);
            $("#wonderplugin-audio-tracklistitem").val(options.tracklistitem);
            $("#wonderplugin-audio-showprogress").attr("checked", options.showprogress);
            $("#wonderplugin-audio-customisetracklistitemformat").attr("checked", options.customisetracklistitemformat);
            $("#wonderplugin-audio-tracklistitemformat").val(options.tracklistitemformat);
            $("#wonderplugin-audio-infoformat").val(options.infoformat);
            $("#wonderplugin-audio-showinfo").attr("checked", options.showinfo);
            $("#wonderplugin-audio-progressinbar").attr("checked", options.progressinbar);
            $("#wonderplugin-audio-showimage").attr("checked",
                options.showimage);
            $("#wonderplugin-audio-imagewidth").val(options.imagewidth);
            $("#wonderplugin-audio-imageheight").val(options.imageheight);
            $("#wonderplugin-audio-showprevnext").attr("checked", options.showprevnext);
            $("#wonderplugin-audio-showloop").attr("checked", options.showloop);
            $("#wonderplugin-audio-showloading").attr("checked", options.showloading);
            $("#wonderplugin-audio-showtime").attr("checked", options.showtime);
            $("#wonderplugin-audio-showvolume").attr("checked", options.showvolume);
            $("#wonderplugin-audio-showvolumebar").attr("checked",
                options.showvolumebar);
            $("#wonderplugin-audio-showtitleinbar").attr("checked", options.showtitleinbar);
            $("#wonderplugin-audio-titleinbarscroll").attr("checked", options.titleinbarscroll);
            $("#wonderplugin-audio-titleinbarwidth").val(options.titleinbarwidth);
            $("input:radio[name=wonderplugin-audio-playpauseimagemode][value=" + options.playpauseimagemode + "]").attr("checked", true);
            if (wonderplugin_audio_config.playpauseimagemode == "custom") {
                $("#wonderplugin-audio-customplaypauseimage").val(options.playpauseimage);
                $("#wonderplugin-audio-displayplaypauseimage").attr("src", options.playpauseimage)
            } else {
                $("#wonderplugin-audio-playpauseimage").val(options.playpauseimage);
                $("#wonderplugin-audio-displayplaypauseimage").attr("src", $("#wonderplugin-audio-jsfolder").text() + options.playpauseimage)
            }
            $("#wonderplugin-audio-playpauseimagewidth").val(options.playpauseimagewidth);
            $("#wonderplugin-audio-playpauseimageheight").val(options.playpauseimageheight);
            $("input:radio[name=wonderplugin-audio-prevnextimagemode][value=" +
                options.prevnextimagemode + "]").attr("checked", true);
            if (wonderplugin_audio_config.prevnextimagemode == "custom") {
                $("#wonderplugin-audio-customprevnextimage").val(options.prevnextimage);
                $("#wonderplugin-audio-displayprevnextimage").attr("src", options.prevnextimage)
            } else {
                $("#wonderplugin-audio-prevnextimage").val(options.prevnextimage);
                $("#wonderplugin-audio-displayprevnextimage").attr("src", $("#wonderplugin-audio-jsfolder").text() + options.prevnextimage)
            }
            $("#wonderplugin-audio-prevnextimagewidth").val(options.prevnextimagewidth);
            $("#wonderplugin-audio-prevnextimageheight").val(options.prevnextimageheight);
            $("input:radio[name=wonderplugin-audio-volumeimagemode][value=" + options.volumeimagemode + "]").attr("checked", true);
            if (wonderplugin_audio_config.volumeimagemode == "custom") {
                $("#wonderplugin-audio-customvolumeimage").val(options.volumeimage);
                $("#wonderplugin-audio-displayvolumeimage").attr("src", options.volumeimage)
            } else {
                $("#wonderplugin-audio-volumeimage").val(options.volumeimage);
                $("#wonderplugin-audio-displayvolumeimage").attr("src",
                    $("#wonderplugin-audio-jsfolder").text() + options.volumeimage)
            }
            $("#wonderplugin-audio-volumeimagewidth").val(options.volumeimagewidth);
            $("#wonderplugin-audio-volumeimageheight").val(options.volumeimageheight);
            $("input:radio[name=wonderplugin-audio-loopimagemode][value=" + options.loopimagemode + "]").attr("checked", true);
            if (wonderplugin_audio_config.loopimagemode == "custom") {
                $("#wonderplugin-audio-customloopimage").val(options.loopimage);
                $("#wonderplugin-audio-displayloopimage").attr("src", options.loopimage)
            } else {
                $("#wonderplugin-audio-loopimage").val(options.loopimage);
                $("#wonderplugin-audio-displayloopimage").attr("src", $("#wonderplugin-audio-jsfolder").text() + options.loopimage)
            }
            $("#wonderplugin-audio-loopimagewidth").val(options.loopimagewidth);
            $("#wonderplugin-audio-loopimageheight").val(options.loopimageheight);
            $("#wonderplugin-audio-showliveplayedlist").attr("checked", options.showliveplayedlist);
            $("#wonderplugin-audio-playedlisttitle").val(options.playedlisttitle);
            $("#wonderplugin-audio-maxplayedlist").val(options.maxplayedlist);
            $("#wonderplugin-audio-liveupdateinterval").val(options.liveupdateinterval);
            $("#wonderplugin-audio-skincss").val(options.skincss)
        };
        $("input:radio[name=wonderplugin-audio-skin]").click(function() {
            if ($(this).val() == wonderplugin_audio_config.skin) return;
            $(".wonderplugin-tab-skin").find("img").removeClass("selected");
            $("input:radio[name=wonderplugin-audio-skin]:checked").parent().find("img").addClass("selected");
            wonderplugin_audio_config.skin = $(this).val();
            printSkinOptions(defaultSkinOptions[$(this).val()])
        });
        $(".wonderplugin-audio-options-menu-item").each(function(index) {
            $(this).click(function() {
                if ($(this).hasClass("wonderplugin-audio-options-menu-item-selected")) return;
                $(".wonderplugin-audio-options-menu-item").removeClass("wonderplugin-audio-options-menu-item-selected");
                $(this).addClass("wonderplugin-audio-options-menu-item-selected");
                $(".wonderplugin-audio-options-tab").removeClass("wonderplugin-audio-options-tab-selected");
                $(".wonderplugin-audio-options-tab").eq(index).addClass("wonderplugin-audio-options-tab-selected")
            })
        });
        var updateAudioOptions = function() {
            wonderplugin_audio_config.newestfirst = $("#wonderplugin-newestfirst").is(":checked");
            wonderplugin_audio_config.name =
                $.trim($("#wonderplugin-audio-name").val());
            wonderplugin_audio_config.skin = $("input:radio[name=wonderplugin-audio-skin]:checked").val();
            wonderplugin_audio_config.width = parseInt($.trim($("#wonderplugin-audio-width").val()));
            wonderplugin_audio_config.height = parseInt($.trim($("#wonderplugin-audio-height").val()));
            wonderplugin_audio_config.autoplay = $("#wonderplugin-audio-autoplay").is(":checked");
            wonderplugin_audio_config.random = $("#wonderplugin-audio-random").is(":checked");
            wonderplugin_audio_config.loop =
                $("#wonderplugin-audio-loop").val();
            wonderplugin_audio_config.heightmode = $("#wonderplugin-audio-heightmode").val();
            wonderplugin_audio_config.preloadaudio = $("#wonderplugin-audio-preloadaudio").is(":checked");
            wonderplugin_audio_config.forceflash = $("#wonderplugin-audio-forceflash").is(":checked");
            wonderplugin_audio_config.forcehtml5 = $("#wonderplugin-audio-forcehtml5").is(":checked");
            wonderplugin_audio_config.autoresize = $("#wonderplugin-audio-autoresize").is(":checked");
            wonderplugin_audio_config.responsive =
                $("#wonderplugin-audio-responsive").is(":checked");
            wonderplugin_audio_config.showtracklist = $("#wonderplugin-audio-showtracklist").is(":checked");
            wonderplugin_audio_config.tracklistscroll = $("#wonderplugin-audio-tracklistscroll").is(":checked");
            wonderplugin_audio_config.tracklistitem = parseInt($.trim($("#wonderplugin-audio-tracklistitem").val()));
            wonderplugin_audio_config.showprogress = $("#wonderplugin-audio-showprogress").is(":checked");
            wonderplugin_audio_config.customisetracklistitemformat = $("#wonderplugin-audio-customisetracklistitemformat").is(":checked");
            wonderplugin_audio_config.tracklistitemformat = $.trim($("#wonderplugin-audio-tracklistitemformat").val());
            wonderplugin_audio_config.showtracklistsearch = $("#wonderplugin-audio-showtracklistsearch").is(":checked");
            wonderplugin_audio_config.infoformat = $.trim($("#wonderplugin-audio-infoformat").val());
            wonderplugin_audio_config.showinfo = $("#wonderplugin-audio-showinfo").is(":checked");
            wonderplugin_audio_config.progressinbar = $("#wonderplugin-audio-progressinbar").is(":checked");
            wonderplugin_audio_config.showimage =
                $("#wonderplugin-audio-showimage").is(":checked");
            wonderplugin_audio_config.imagewidth = parseInt($.trim($("#wonderplugin-audio-imagewidth").val()));
            wonderplugin_audio_config.imageheight = parseInt($.trim($("#wonderplugin-audio-imageheight").val()));
            wonderplugin_audio_config.showprevnext = $("#wonderplugin-audio-showprevnext").is(":checked");
            wonderplugin_audio_config.showloop = $("#wonderplugin-audio-showloop").is(":checked");
            wonderplugin_audio_config.showloading = $("#wonderplugin-audio-showloading").is(":checked");
            wonderplugin_audio_config.showtime = $("#wonderplugin-audio-showtime").is(":checked");
            wonderplugin_audio_config.showvolume = $("#wonderplugin-audio-showvolume").is(":checked");
            wonderplugin_audio_config.showvolumebar = $("#wonderplugin-audio-showvolumebar").is(":checked");
            wonderplugin_audio_config.playpauseimagemode = $("input[name=wonderplugin-audio-playpauseimagemode]:checked").val();
            if (wonderplugin_audio_config.playpauseimagemode == "custom") wonderplugin_audio_config.playpauseimage = $.trim($("#wonderplugin-audio-customplaypauseimage").val());
            else wonderplugin_audio_config.playpauseimage = $.trim($("#wonderplugin-audio-playpauseimage").val());
            wonderplugin_audio_config.playpauseimagewidth = parseInt($.trim($("#wonderplugin-audio-playpauseimagewidth").val()));
            wonderplugin_audio_config.playpauseimageheight = parseInt($.trim($("#wonderplugin-audio-playpauseimageheight").val()));
            wonderplugin_audio_config.prevnextimagemode = $("input[name=wonderplugin-audio-prevnextimagemode]:checked").val();
            if (wonderplugin_audio_config.prevnextimagemode == "custom") wonderplugin_audio_config.prevnextimage =
                $.trim($("#wonderplugin-audio-customprevnextimage").val());
            else wonderplugin_audio_config.prevnextimage = $.trim($("#wonderplugin-audio-prevnextimage").val());
            wonderplugin_audio_config.prevnextimagewidth = parseInt($.trim($("#wonderplugin-audio-prevnextimagewidth").val()));
            wonderplugin_audio_config.prevnextimageheight = parseInt($.trim($("#wonderplugin-audio-prevnextimageheight").val()));
            wonderplugin_audio_config.volumeimagemode = $("input[name=wonderplugin-audio-volumeimagemode]:checked").val();
            if (wonderplugin_audio_config.volumeimagemode ==
                "custom") wonderplugin_audio_config.volumeimage = $.trim($("#wonderplugin-audio-customvolumeimage").val());
            else wonderplugin_audio_config.volumeimage = $.trim($("#wonderplugin-audio-volumeimage").val());
            wonderplugin_audio_config.volumeimagewidth = parseInt($.trim($("#wonderplugin-audio-volumeimagewidth").val()));
            wonderplugin_audio_config.volumeimageheight = parseInt($.trim($("#wonderplugin-audio-volumeimageheight").val()));
            wonderplugin_audio_config.loopimagemode = $("input[name=wonderplugin-audio-loopimagemode]:checked").val();
            if (wonderplugin_audio_config.loopimagemode == "custom") wonderplugin_audio_config.loopimage = $.trim($("#wonderplugin-audio-customloopimage").val());
            else wonderplugin_audio_config.loopimage = $.trim($("#wonderplugin-audio-loopimage").val());
            wonderplugin_audio_config.loopimagewidth = parseInt($.trim($("#wonderplugin-audio-loopimagewidth").val()));
            wonderplugin_audio_config.loopimageheight = parseInt($.trim($("#wonderplugin-audio-loopimageheight").val()));
            wonderplugin_audio_config.showtitleinbar = $("#wonderplugin-audio-showtitleinbar").is(":checked");
            wonderplugin_audio_config.titleinbarscroll = $("#wonderplugin-audio-titleinbarscroll").is(":checked");
            wonderplugin_audio_config.titleinbarwidth = parseInt($.trim($("#wonderplugin-audio-titleinbarwidth").val()));
            wonderplugin_audio_config.skincss = $.trim($("#wonderplugin-audio-skincss").val());
            wonderplugin_audio_config.donotinit = $("#wonderplugin-audio-donotinit").is(":checked");
            wonderplugin_audio_config.addinitscript = $("#wonderplugin-audio-addinitscript").is(":checked");
            wonderplugin_audio_config.setdefaultvolume =
                $("#wonderplugin-audio-setdefaultvolume").is(":checked");
            wonderplugin_audio_config.defaultvolume = parseInt($.trim($("#wonderplugin-audio-defaultvolume").val()));
            wonderplugin_audio_config.playbackrate = parseFloat($.trim($("#wonderplugin-audio-playbackrate").val()));
            wonderplugin_audio_config.enablega = $("#wonderplugin-audio-enablega").is(":checked");
            wonderplugin_audio_config.gatrackingid = $.trim($("#wonderplugin-audio-gatrackingid").val());
            wonderplugin_audio_config.saveposincookie = $("#wonderplugin-audio-saveposincookie").is(":checked");
            wonderplugin_audio_config.cookiehours = parseFloat($.trim($("#wonderplugin-audio-cookiehours").val()));
            wonderplugin_audio_config.showliveplayedlist = $("#wonderplugin-audio-showliveplayedlist").is(":checked");
            wonderplugin_audio_config.playedlisttitle = $.trim($("#wonderplugin-audio-playedlisttitle").val());
            wonderplugin_audio_config.liveupdateinterval = parseInt($.trim($("#wonderplugin-audio-liveupdateinterval").val()));
            wonderplugin_audio_config.maxplayedlist = parseInt($.trim($("#wonderplugin-audio-maxplayedlist").val()));
            wonderplugin_audio_config.customcss = $.trim($("#wonderplugin-audio-custom-css").val());
            wonderplugin_audio_config.dataoptions = $.trim($("#wonderplugin-audio-data-options").val());
            wonderplugin_audio_config.customjs = $.trim($("#wonderplugin-audio-customjs").val())
        };
        var previewAudio = function() {
            updateAudioOptions();
            $("#wonderplugin-audio-preview-container").empty();
            var previewCode = "<div id='wonderplugin-audio-preview'";
            if (wonderplugin_audio_config.dataoptions && wonderplugin_audio_config.dataoptions.length >
                0) previewCode += " " + wonderplugin_audio_config.dataoptions;
            previewCode += "></div>";
            $("#wonderplugin-audio-preview-container").html(previewCode);
            if (wonderplugin_audio_config.slides.length > 0) {
                $("head").find("style").each(function() {
                    if ($(this).data("creator") == "wonderpluginaudiocreator") $(this).remove()
                });
                var audioid = wonderplugin_audio_config.id > 0 ? wonderplugin_audio_config.id : 0;
                if (wonderplugin_audio_config.customcss && wonderplugin_audio_config.customcss.length > 0) {
                    var customcss = wonderplugin_audio_config.customcss.replace(/#wonderpluginaudio-AUDIOPLAYERID/g,
                        "#wonderplugin-audio-preview");
                    customcss = customcss.replace(/#amazingaudioplayer-AUDIOPLAYERID/g, audioid);
                    $("head").append("<style type='text/css' data-creator='wonderpluginaudiocreator'>" + customcss + "</style>")
                }
                if (wonderplugin_audio_config.skincss && wonderplugin_audio_config.skincss.length > 0) {
                    var skincss = wonderplugin_audio_config.skincss.replace(/#amazingaudioplayer-AUDIOPLAYERID/g, "#wonderplugin-audio-preview");
                    if (skincss.indexOf("amazingaudioplayer-item-id") < 0) skincss += " #wonderplugin-audio-preview .amazingaudioplayer-item-id {float: left; width: 18px;}  #wonderplugin-audio-preview .amazingaudioplayer-item-info { \tfloat: right; \twidth: 36px; }  #wonderplugin-audio-preview .amazingaudioplayer-item-title { \toverflow: hidden; } #wonderplugin-audio-preview .amazingaudioplayer-track-item:before, #wonderplugin-audio-preview .amazingaudioplayer-track-item:after {display: none;} #wonderplugin-audio-preview ul, #wonderplugin-audio-preview li { list-style-type: none;}";
                    $("head").append("<style type='text/css' data-creator='wonderpluginaudiocreator'>" + skincss + "</style>")
                }
                var i;
                var code = '<ul class="amazingaudioplayer-audios" style="display:none;">';
                for (i = 0; i < wonderplugin_audio_config.slides.length; i++) {
                    code += "<li";
                    code += ' data-artist="' + wonderplugin_audio_config.slides[i].artist.replace(/"/g, "&quot;") + '"';
                    code += ' data-title="' + wonderplugin_audio_config.slides[i].title.replace(/"/g, "&quot;") + '"';
                    code += ' data-album="' + wonderplugin_audio_config.slides[i].album.replace(/"/g,
                        "&quot;") + '"';
                    code += ' data-info="' + wonderplugin_audio_config.slides[i].info.replace(/"/g, "&quot;") + '"';
                    code += ' data-image="' + wonderplugin_audio_config.slides[i].image + '"';
                    if (wonderplugin_audio_config.slides[i].live) {
                        code += ' data-live="true"';
                        if (wonderplugin_audio_config.slides[i].radionomyradiouid) code += ' data-radionomyradiouid="' + wonderplugin_audio_config.slides[i].radionomyradiouid + '"'
                    } else code += ' data-duration="' + wonderplugin_audio_config.slides[i].duration + '"';
                    code += ">";
                    if (wonderplugin_audio_config.slides[i].mp3 &&
                        wonderplugin_audio_config.slides[i].mp3.length > 0) code += '<div class="amazingaudioplayer-source" data-src="' + wonderplugin_audio_config.slides[i].mp3 + '" data-type="audio/mpeg" ></div>';
                    if (wonderplugin_audio_config.slides[i].ogg && wonderplugin_audio_config.slides[i].ogg.length > 0) code += '<div class="amazingaudioplayer-source" data-src="' + wonderplugin_audio_config.slides[i].ogg + '" data-type="audio/ogg" ></div>';
                    code += "</li>"
                }
                code += "</ul>";
                var jsfolder = $("#wonderplugin-audio-jsfolder").text();
                var audioOptions =
                    $.extend({}, WONDERPLUGIN_AUDIO_SKIN_OPTIONS[wonderplugin_audio_config["skin"]], {
                        audioplayerid: audioid,
                        jsfolder: jsfolder
                    }, wonderplugin_audio_config);
                if (!audioOptions.setdefaultvolume) audioOptions.defaultvolume = -1;
                var previewOptions = {
                    display: "block",
                    position: "relative",
                    margin: "0 auto",
                    height: audioOptions.heightmode == "auto" ? "auto" : audioOptions.height + "px"
                };
                if (audioOptions.responsive) previewOptions["width"] = "100%";
                else if (audioOptions.autoresize) {
                    previewOptions["width"] = "100%";
                    previewOptions["max-width"] =
                        audioOptions.width + "px"
                } else previewOptions["width"] = audioOptions.width + "px";
                $("#wonderplugin-audio-preview").css(previewOptions);
                $("#wonderplugin-audio-preview").html(code);
                $("#wonderplugin-audio-preview").wonderpluginaudio(audioOptions)
            }
        };
        var postPublish = function(message) {
            $("#wonderplugin-audio-publish-loading").hide();
            var formnonce = $("#wonderplugin-audio-saveformnonce").html();
            var errorHtml = "";
            if (message) {
                errorHtml += "<div class='error'><p>Error message: " + message + "</p></div>";
                errorHtml += "<div class='error'><p>WordPress Ajax call failed. Please click the button below and save with POST method</p></div>"
            } else {
                errorHtml +=
                    "<div class='error'><p>WordPress Ajax call failed. Please check your WordPress configuration file and make sure the WP_DEBUG is set to false.</p></div>";
                errorHtml += "<div class='error'><p>Please click the button below and save with POST method</p></div>"
            }
            errorHtml += "<form method='post'>";
            errorHtml += formnonce;
            errorHtml += "<input type='hidden' name='wonderplugin-audio-save-item-post-value' id='wonderplugin-audio-save-item-post-value' value='" + JSON.stringify(wonderplugin_audio_config).replace(/"/g, "&quot;").replace(/'/g,
                "&#39;") + "' />";
            errorHtml += "<p class='submit'><input type='submit' name='wonderplugin-audio-save-item-post' id='wonderplugin-audio-save-item-post' class='button button-primary' value='Save & Publish with Post Method'  /></p>";
            errorHtml += "</form>";
            $("#wonderplugin-audio-publish-information").html(errorHtml)
        };
        var publishAudio = function() {
            $("#wonderplugin-audio-publish-loading").show();
            updateAudioOptions();
            var ajaxnonce = $("#wonderplugin-audio-ajaxnonce").text();
            jQuery.ajax({
                url: ajaxurl,
                type: "POST",
                data: {
                    action: "wonderplugin_audio_save_config",
                    nonce: ajaxnonce,
                    item: JSON.stringify(wonderplugin_audio_config)
                },
                success: function(data) {
                    if (wonderplugin_audio_config.id == "-1" && data && data.success && data.id >= 0) {
                        var urlparams = {};
                        var searcharr = window.location.search.substring(1).split("&");
                        for (var i = 0; i < searcharr.length; i++) {
                            var value = searcharr[i].split("=");
                            if (value && value.length == 2) urlparams[value[0]] = value[1]
                        }
                        urlparams["page"] = "wonderplugin_audio_edit_item";
                        urlparams["itemid"] = data.id;
                        window.history.pushState(null, null, window.location.href.split("?")[0] +
                            "?" + $.param(urlparams))
                    }
                    $("#wonderplugin-audio-publish-loading").hide();
                    if (data && data.success && data.id >= 0) {
                        wonderplugin_audio_config.id = data.id;
                        $("#wonderplugin-audio-publish-information").html("<div class='updated'><p>The audio player has been saved and published: <a href='" + $("#wonderplugin-audio-viewadminurl").text() + "&itemid=" + data.id + "' target='_blank'>View Audio Player</a></p></div>" + "<div class='updated'><p>To embed the audio player into your page or post, use shortcode:  [wonderplugin_audio id=\"" +
                            data.id + '"]</p></div>' + "<div class='updated'><p>To embed the audio player into your template, use php code:  &lt;?php echo do_shortcode('[wonderplugin_audio id=\"" + data.id + "\"]'); ?&gt;</p></div>")
                    } else postPublish(data && data.message ? data.message : "")
                },
                error: function() {
                    $("#wonderplugin-audio-publish-loading").hide();
                    postPublish("")
                }
            })
        };
        var wonderplugin_audio_config = $.extend({}, default_options);
        var audioId = parseInt($("#wonderplugin-audio-id").text());
        if (audioId >= 0) {
            var id_options = $.parseJSON($("#wonderplugin-audio-id-config").text());
            var compatible = {
                tracklistscroll: false
            };
            if (id_options.skin == "darkbox" || id_options.skin == "jukebox")
                if (!("showtime" in id_options)) id_options.showtime = false;
            compatible.customisetracklistitemformat = "tracklistitemformat" in id_options;
            id_options = $.extend({}, compatible, id_options);
            $.extend(wonderplugin_audio_config, defaultSkinOptions[id_options.skin]);
            $.extend(wonderplugin_audio_config, id_options);
            wonderplugin_audio_config.id = audioId
        } else $.extend(wonderplugin_audio_config, defaultSkinOptions[default_options["skin"]]);
        var boolOptions = ["saveposincookie", "progressinbar", "showinfo", "showimage", "showtracklistsearch", "enablega", "newestfirst", "autoplay", "random", "forceflash", "forcehtml5", "autoresize", "responsive", "showtracklist", "tracklistscroll", "showprogress", "showprevnext", "preloadaudio", "showloop", "showtime", "showvolume", "showvolumebar", "showliveplayedlist", "customisetracklistitemformat", "showtitleinbar", "showloading", "titleinbarscroll", "donotinit", "addinitscript", "setdefaultvolume"];
        for (var i = 0; i < boolOptions.length; i++)
            if (wonderplugin_audio_config[boolOptions[i]] !==
                true && wonderplugin_audio_config[boolOptions[i]] !== false) wonderplugin_audio_config[boolOptions[i]] = wonderplugin_audio_config[boolOptions[i]] && wonderplugin_audio_config[boolOptions[i]].toLowerCase() === "true";
        if (wonderplugin_audio_config.slides)
            for (var i = 0; i < wonderplugin_audio_config.slides.length; i++) {
                if (!("radionomyradiouid" in wonderplugin_audio_config.slides[i])) wonderplugin_audio_config.slides[i].radionomyradiouid = "";
                if (!("live" in wonderplugin_audio_config.slides[i])) wonderplugin_audio_config.slides[i].live =
                    false;
                else if (wonderplugin_audio_config.slides[i].live !== true && wonderplugin_audio_config.slides[i].live !== false) wonderplugin_audio_config.slides[i].live = wonderplugin_audio_config.slides[i].live && wonderplugin_audio_config.slides[i].live.toLowerCase() === "true"
            }
        if (wonderplugin_audio_config.dataoptions && wonderplugin_audio_config.dataoptions.length > 0) wonderplugin_audio_config.dataoptions = wonderplugin_audio_config.dataoptions.replace(/\\"/g, '"').replace(/\\'/g, "'");
        var printConfig = function() {
            $("#wonderplugin-newestfirst").attr("checked",
                wonderplugin_audio_config.newestfirst);
            $("#wonderplugin-audio-name").val(wonderplugin_audio_config.name);
            updateMediaTable();
            $(".wonderplugin-tab-skin").find("img").removeClass("selected");
            $("input:radio[name=wonderplugin-audio-skin][value=" + wonderplugin_audio_config.skin + "]").attr("checked", true);
            $("input:radio[name=wonderplugin-audio-skin][value=" + wonderplugin_audio_config.skin + "]").parent().find("img").addClass("selected");
            $("#wonderplugin-audio-forceflash").attr("checked", wonderplugin_audio_config.forceflash);
            $("#wonderplugin-audio-forcehtml5").attr("checked", wonderplugin_audio_config.forcehtml5);
            printSkinOptions(wonderplugin_audio_config);
            $("#wonderplugin-audio-showtracklistsearch").attr("checked", wonderplugin_audio_config.showtracklistsearch);
            $("#wonderplugin-audio-donotinit").attr("checked", wonderplugin_audio_config.donotinit);
            $("#wonderplugin-audio-addinitscript").attr("checked", wonderplugin_audio_config.addinitscript);
            $("#wonderplugin-audio-setdefaultvolume").attr("checked", wonderplugin_audio_config.setdefaultvolume);
            $("#wonderplugin-audio-defaultvolume").val(wonderplugin_audio_config.defaultvolume);
            $("#wonderplugin-audio-playbackrate").val(wonderplugin_audio_config.playbackrate);
            $("#wonderplugin-audio-enablega").attr("checked", wonderplugin_audio_config.enablega);
            $("#wonderplugin-audio-gatrackingid").val(wonderplugin_audio_config.gatrackingid);
            $("#wonderplugin-audio-saveposincookie").attr("checked", wonderplugin_audio_config.saveposincookie);
            $("#wonderplugin-audio-cookiehours").val(wonderplugin_audio_config.cookiehours);
            $("#wonderplugin-audio-custom-css").val(wonderplugin_audio_config.customcss);
            $("#wonderplugin-audio-data-options").val(wonderplugin_audio_config.dataoptions);
            $("#wonderplugin-audio-customjs").val(wonderplugin_audio_config.customjs)
        };
        printConfig()
    });
    $.fn.wpdraggable = function(callback) {
        this.css("cursor", "move").on("mousedown", function(e) {
            var $dragged = $(this);
            var x = $dragged.offset().left - e.pageX;
            var y = $dragged.offset().top - e.pageY;
            var z = $dragged.css("z-index");
            $(document).on("mousemove.wpdraggable",
                function(e) {
                    $dragged.css({
                        "z-index": 999
                    }).offset({
                        left: x + e.pageX,
                        top: y + e.pageY
                    });
                    e.preventDefault()
                }).one("mouseup", function() {
                $(this).off("mousemove.wpdraggable click.wpdraggable");
                $dragged.css("z-index", z);
                var i = $dragged.data("order");
                var coltotal = Math.floor($dragged.parent().parent().parent().innerWidth() / $dragged.parent().parent().outerWidth());
                var row = Math.floor(($dragged.offset().top - $dragged.parent().parent().parent().offset().top) / $dragged.parent().parent().outerHeight());
                var col = Math.floor(($dragged.offset().left -
                    $dragged.parent().parent().parent().offset().left) / $dragged.parent().parent().outerWidth());
                var j = row * coltotal + col;
                callback(i, j)
            });
            e.preventDefault()
        });
        return this
    }
})(jQuery);
(function($) {
    $(document).ready(function() {
        var wp_replace_list = new Array({
            "search": "",
            "replace": ""
        });
        init_render();
        render_list();

        function update_list() {
            wp_replace_list = new Array;
            for (var i = 0;; i++) {
                if ($("#olddomain" + i).length <= 0) break;
                wp_replace_list.push({
                    "search": $.trim($("#olddomain" + i).val()),
                    "replace": $.trim($("#newdomain" + i).val())
                })
            }
        }

        function render_list() {
            var replace_code = "";
            for (var i = 0; i < wp_replace_list.length; i++) {
                replace_code += '<p><input type="text" size="40" name="olddomain' + i + '" id="olddomain' +
                    i + '" placeholder="Search" value="' + wp_replace_list[i].search + '" >';
                replace_code += '<span class="dashicons dashicons-arrow-right-alt" style="margin:0 12px;line-height:inherit;"></span>';
                replace_code += '<input type="text" size="40" name="newdomain' + i + '" id="newdomain' + i + '" placeholder="Replace" value="' + wp_replace_list[i].replace + '" >';
                replace_code += '<span class="dashicons dashicons-no wp-delete-replace-list" style="margin:0 12px;line-height:inherit;cursor:pointer;" data-listid=' + i + "></span></p>"
            }
            $("#wp-search-replace").html(replace_code)
        }

        function init_render() {
            $("body").on("click", ".wp-delete-replace-list", function() {
                update_list();
                wp_replace_list.splice($(this).data("listid"), 1);
                render_list()
            });
            $("#wp-add-replace-list").click(function() {
                update_list();
                wp_replace_list.push({
                    "search": "",
                    "replace": ""
                });
                render_list();
                return false
            });
            $("#wp-import-submit").click(function() {
                if (!$("#wp-importxml").val()) {
                    $("#wp-import-error").show().html("<p>Error: please select an exported .xml file.</p>");
                    return false
                } else $("#wp-import-error").hide();
                update_list();
                for (var i = 0; i < wp_replace_list.length; i++) {
                    if (wp_replace_list[i].search.length > 0 && wp_replace_list[i].replace.length <= 0) {
                        $("#wp-replace-error").show().html("<p>Error: please enter the new domain or delete the whole row.</p>");
                        return false
                    }
                    if (wp_replace_list[i].search.length <= 0 && wp_replace_list[i].replace.length > 0) {
                        $("#wp-replace-error").show().html("<p>Error: please enter the old domain or delete the whole row.</p>");
                        return false
                    }
                }
            })
        }
    })
})(jQuery);
(function($) {
    $(document).ready(function() {
        var wp_replace_list = new Array({
            "search": "",
            "replace": ""
        });
        init_render();
        render_list();

        function update_list() {
            wp_replace_list = new Array;
            for (var i = 0;; i++) {
                if ($("#standalonesearch" + i).length <= 0) break;
                wp_replace_list.push({
                    "search": $.trim($("#standalonesearch" + i).val()),
                    "replace": $.trim($("#standalonereplace" + i).val())
                })
            }
        }

        function render_list() {
            var replace_code = "";
            for (var i = 0; i < wp_replace_list.length; i++) {
                replace_code += '<p><input type="text" size="40" name="standalonesearch' +
                    i + '" id="standalonesearch' + i + '" placeholder="Search" value="' + wp_replace_list[i].search + '" >';
                replace_code += '<span class="dashicons dashicons-arrow-right-alt" style="margin:0 12px;line-height:inherit;"></span>';
                replace_code += '<input type="text" size="40" name="standalonereplace' + i + '" id="standalonereplace' + i + '" placeholder="Replace" value="' + wp_replace_list[i].replace + '" >';
                replace_code += '<span class="dashicons dashicons-no wp-standalone-delete-replace-list" style="margin:0 12px;line-height:inherit;cursor:pointer;" data-listid=' +
                    i + "></span></p>"
            }
            $("#wp-standalone-search-replace").html(replace_code)
        }

        function init_render() {
            $("body").on("click", ".wp-standalone-delete-replace-list", function() {
                update_list();
                wp_replace_list.splice($(this).data("listid"), 1);
                render_list()
            });
            $("#wp-add-standalone-replace-list").click(function() {
                update_list();
                wp_replace_list.push({
                    "search": "",
                    "replace": ""
                });
                render_list();
                return false
            });
            $("#wp-search-replace-submit").click(function() {
                update_list();
                for (var i = 0; i < wp_replace_list.length; i++) {
                    if (wp_replace_list[i].search.length >
                        0 && wp_replace_list[i].replace.length <= 0) {
                        $("#wp-standalone-replace-error").show().html("<p>Error: please enter the string to replace or delete the whole row.</p>");
                        return false
                    }
                    if (wp_replace_list[i].search.length <= 0 && wp_replace_list[i].replace.length > 0) {
                        $("#wp-standalone-replace-error").show().html("<p>Error: please enter the string to search or delete the whole row.</p>");
                        return false
                    }
                }
            })
        }
    });
    $.wpaudioCookie = function(key, value, options) {
        if (typeof value !== "undefined") {
            options = $.extend({}, {
                    path: "/"
                },
                options);
            if (options.expires) {
                var seconds = options.expires;
                options.expires = new Date;
                options.expires.setTime(options.expires.getTime() + seconds * 1E3)
            }
            return document.cookie = key + "=" + encodeURIComponent(value) + (options.expires ? ";expires=" + options.expires.toUTCString() : "") + (options.path ? ";path=" + options.path : "")
        }
        var result = null;
        var cookies = document.cookie ? document.cookie.split(";") : [];
        for (var i in cookies) {
            var parts = $.trim(cookies[i]).split("=");
            if (parts.length && parts[0] == key) {
                result = decodeURIComponent(parts[1]);
                break
            }
        }
        return result
    };
    $.wpaudioRemoveCookie = function(key) {
        return $.wpaudioCookie(key, "", $.extend({}, {
            expires: -1
        }))
    }
})(jQuery);