// ==UserScript==
// @name           mark_readed
// @namespace      http://github.com/svetlyak40wt/yaru.user
// @description    Добавляет действие "в курсе всего" в блоках на странице my.ya.ru
// @include        http://my.ya.ru/*
// @include        http://*.ya.ru/friends.xml*
// ==/UserScript==
//
// Version: 0.1.2
// Author: Alexander Artemenko svetlyak.40wt at gmail
// Site: http://github.com/svetlyak40wt/yaru.user/
//
// ChangeLog
//
// 0.1.2
//
// * Исправлена работа с блоком "С вами хотят подружится."
//
// 0.1.1
//
// * Исправлена ошибка в работе скрипта при получении последней порции информации.
//
// 0.1.0
//
// * Начальная реализация
//

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
                    var url = '/ajax/' + ajax_params.ajaxMethod_post + '.xml';

                    log('adding link');
                    var mark_readed = function(ids) {
                        var params = {};
                        params[ajax_params.ajaxParamName] = ids;

                        $.get(url, params, function(data) {
                            var next_ids = $(data).find('a.update');
                            --limit_queries;
                            if (data != '' && next_ids.length > 0 && limit_queries > 0) {
                                v_kurse_vsego.html($(data).find('h3.plain a').html());
                                mark_readed(next_ids[0].onclick());
                            } else {
                                $(form).html(data);
                            }
                        });
                    }
                    mark_readed(v_kurse[0].onclick());
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

