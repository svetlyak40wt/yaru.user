var widgets = $('form.Friends-c-PseudoWidgetControl');
widgets.each(function(i, form) {
    var v_kurse = $(form).find('a.update');
    var v_kurse_vsego = $('<a href="" class="update">в курсе всего</a>');
    v_kurse_vsego.click(function(e) {
        e.preventDefault();
        var ajax_params = form.onclick();
        var limit = 10;
        if (ajax_params.ajaxMethod_post == 'unread_replies_do_update_safe') {
            var mark_readed = function(ids) {
                var url = 'http://my.ya.ru/ajax/unread_replies_do_update_safe.xml';
                $.get(url, {unread: ids}, function(data) {
                    var next_ids = $(data).find('a.update')[0].onclick();
                    limit = limit - 1;
                    if (next_ids != '' && limit > 0) {
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
});
