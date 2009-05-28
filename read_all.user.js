// ==UserScript==
// @name           mark_readed
// @namespace      http://github.com/svetlyak40wt/yaru.user
// @description    Добавляет действие "в курсе всего" в блоках на странице my.ya.ru
// @include        http://my.ya.ru/*
// ==/UserScript==
//
// Author: Alexander Artemenko svetlyak.40wt at gmail
// Site: http://github.com/svetlyak40wt/yaru.user/

var limit_queries = 1000;

var $;
var initialized = false;

function log(msg) {
    GM_log(msg);
}

function init_plugin() {
    if (initialized == true)
        return;

    // Check if widgets loaded
    var checker = setInterval(function() {
        var widgets = $('form.Friends-c-PseudoWidgetControl');
        if(widgets.length > 0) {
            clearInterval(checker);

            log('adding links');

            widgets.each(function(i, form) {
                log('procession form');
                var v_kurse = $(form).find('a.update');
                var v_kurse_vsego = $('<a href="" class="update">в курсе всего</a>');
                v_kurse_vsego.click(function(e) {
                    e.preventDefault();
                    var ajax_params = form.onclick();
                    if (ajax_params.ajaxMethod_post == 'unread_replies_do_update_safe') {
                        log('adding link');
                        var mark_readed = function(ids) {
                            var url = 'http://my.ya.ru/ajax/unread_replies_do_update_safe.xml';
                            $.get(url, {unread: ids}, function(data) {
                                var next_ids = $(data).find('a.update')[0].onclick();
                                --limit_queries;
                                if (next_ids != '' && limit_queries > 0) {
                                    v_kurse_vsego.html($(data).find('h3.plain a').html());
                                    mark_readed(next_ids);
                                } else {
                                    $(form).html(data);
                                }
                            });
                        }
                        mark_readed(v_kurse[0].onclick());
                    }
                });
                v_kurse_vsego.insertAfter(v_kurse);
                $('<span>, </span>').insertAfter(v_kurse);
                log('link added');
            });
            log('done');
        }
    }, 5000);

    initialized = true;
}

// Check if jQuery's loaded
var checker = setInterval(function() {
    if(typeof ($ = unsafeWindow.jQuery) != "undefined") {
        clearInterval(checker);
        init_plugin();
    }
}, 100);

