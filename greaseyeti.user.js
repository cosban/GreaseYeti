// ==UserScript==
// @name GreaseYETI
// @description Adds a bunch of features to LL/ETI.
// @include http://endoftheinter.net/*
// @include https://endoftheinter.net/*
// @include http://*.endoftheinter.net/*
// @include https://*.endoftheinter.net/*
// @exclude http://*evt.endoftheinter.net/*
// @exclude https://*evt.endoftheinter.net/*
// @exclude http://evt*.endoftheinter.net/*
// @exclude https://evt*.endoftheinter.net/*
// @exclude http://wiki.endoftheinter.net/*
// @exclude https://wiki.endoftheinter.net/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @version 2.33
// @connect github.com
// @updateURL https://github.com/cosban/GreaseYeti/raw/master/greaseyeti.user.js
// @downloadURL https://github.com/cosban/GreaseYeti/raw/master/greaseyeti.user.js
// ==/UserScript==

var start = new Date().getTime();
var version_num = 2.33;
this.$ = this.jQuery = jQuery.noConflict(true);
if (typeof GM_setValue != 'function' || typeof GM_getValue != 'function' || typeof GM_xmlhttpRequest != 'function') {
    alert('Error: You need GM_setValue, GM_getValue, and GM_xmlhttpRequest functions to use GreaseYETI.');
}
// Set some core variables
var url = document.location.href;
var load_gif = 'data:image/gif;base64,R0lGODlhEAAQAPIAAP///2Zm/9ra/o2N/mZm/6Cg/rOz/r29/iH/C'
    + '05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwA'
    + 'AAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAd'
    + 'Ka+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqH'
    + 'wctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvB'
    + 'oVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAA'
    + 'EAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAA'
    + 'AIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEA'
    + 'Me6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQ'
    + 'radylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7w'
    + 'CRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAA'
    + 'AAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnl' + 'sRkAAAOwAAAAAAAAAAAA==';
var window_has_focus = false, currently_scrolling = false, uses_thumbnails = true, max_img_size = -1, shift_key = false, ctrl_key = false, highlighted_users = null, highlighted_colors = null, form_submitted = false, page_change = false, chat_mode_enabled = false;
// GRAB THE USER'S SETTINGS
var greaseyeti = JSON.parse(GM_getValue('greaseyeti', '-1'));

if (greaseyeti == -1 && url.indexOf('loser.php?settings') == -1) {
    document.location = '//endoftheinter.net/loser.php?settings';
}
// First, force HTTPS if enabled. There's no point loading the rest.
forceHttps();
// SETTINGS PAGE
if (url.indexOf('loser.php?settings') != -1) {
    if (typeof greaseyeti === 'number') {
        greaseyeti = {};
    }
    // DISPLAY SETTINGS - create some HTML.
    $('h1').html('GreaseYETI Settings');
    document.title = 'End of the Internet - GreaseYETI Settings';
    // there was honestly no good way to make this friendly.
    // this edit makes it so changes create smaller diffs.
    var settings_html = '<!-- Link to GreaseYeti topic --> '
        + '<tbody><tr><td>'
        + 'Need help? Have questions? Want to suggest a new feature? '
        + 'See the <a href="//boards.endoftheinter.net/showmessages.php?topic=8607569"> GreaseYETI topic </a>.'
        + '</td></tr>'
        + '<!--Stuff that applies everywhere-->'
        + '<tr><th>Everywhere</th></tr>'
        + '<tr><td><input type="checkbox" id="dramalinks" ' + settingCheck('dramalinks') + '/>'
        + '<label for ="dramalinks">Add Dramalinks to current page </label> '
        + '<p class="desc">Adds Dramalinks to the top of each page.You will need to enable 3rd party cookies in your browser.</p> '
        + '</td></tr>'
        + '<tr><td><input type="checkbox" id="custom_titles" ' + settingCheck('custom_titles') + '/>'
        + '<label for ="custom_titles"> Custom title format for pages </label>'
        + '<p class="desc"> Allows you to use a custom format for the page title(or even shorten it). '
        + 'Enter in your custom title format below, where "%TITLE%" will be replaced by the actual page title(e.g."GreaseYETI Settings"). '
        + 'For example, "End of the Internet - %TITLE%" is what LL uses by default. </p>'
        + '<p><input type="text" id="title_format" size="30" value ="'
        + ch('title_format', 'End of the Internet - %TITLE%') + '" /></p>'
        + '</td></tr>'
        + '<tr><td><input type="checkbox" id="message_history" ' + settingCheck('message_history') + '/>'
        + '<label for ="message_history"> Add link to old Message History to ETI bookmarks </label>'
        + '<p class="desc"> Adds a link to your <a href="//boards.endoftheinter.net/history.php"> Message History </a> in the top bar, at the end of your tag bookmarks. </p>'
        + '<div><input type="checkbox" id="history_topbar" ' + settingCheck('history_topbar') + '/>'
        + '<label for ="message_history"> Put in top nav-bar </label>'
        + '<p class="desc">Places this in the top nav-bar, just before the logout link instead of as the last "tag" link </p>'
        + '</div>'
        + '</td></tr>'
        + '<tr><td><input type="checkbox" id="alert_new_versions" ' + settingCheck('alert_new_versions') + '/>'
        + '<label for ="alert_new_versions"> Alert me when GreaseYETI is updated </label>'
        + '</td></tr>'
        + '<tr><td><input type="checkbox" id="force_https" ' + settingCheck('force_https') + '/>'
        + '<label for ="force_https"> Force ETI to use HTTPS </label>'
        + '<p class="desc"> Automatically redirects you to HTTPS </p>'
        + '</td></tr>'
        + '<tr><td><input type="checkbox" id="custom_css" ' + settingCheck('custom_css') + '/>'
        + '<label for ="custom_css"> Use custom CSS </label>'
        + '<p class="desc"> Select this box to add custom CSS rules.These rules will apply on the core LL pages, but <b> not </b> the Wiki. </p>'
        + '<textarea id="custom_css_rules">  ' + ch('custom_css_rules') + '</textarea>'
        + '</td></tr>'
        + '<!--Topic list settings-->'
        + '<tr><th> Topic Lists </th></tr>'
        + '<tr><td><input type="checkbox" id="autoload" ' + settingCheck('autoload') + '/>'
        + '<label for ="autoload"> Autoload the next page of topics </label>'
        + '<p class="desc"> Automatically load the next page of topics when you scroll near to the bottom. </p>'
        + '</td></tr>'
        + '<tr><td><input type="checkbox" id="remove_topics" ' + settingCheck('remove_topics') + '/>'
        + '<label for ="remove_topics"> Option to remove topics </label>'
        + '<p class="desc"> Creates a link next to the timestamp for each topic. '
        + 'When clicked, the topic is removed from the topic list permanently. '
        + 'Disabling this will bring back removed topics.</p>'
        + '</td></tr>'
        + '<tr><td><input type="checkbox" id="highlight_topics" ' + settingCheck('highlight_topics') + '/>'
        + '<label for ="highlight_topics"> Option to highlight any topic </label>'
        + '<p class="desc"> Creates a link next to the timestamp for each topic. '
        + 'When clicked, the topic is highlighted until clicked again. '
        + 'Enter in a highlight color below. </p>'
        + '<p>  <input type="text" id="highlight_color" value ="' + ch('highlight_color', '#5cc') + '" />  </p>'
        + '</td></tr>'
        + '<tr><td><input type="checkbox" id="load_unread" ' + settingCheck('load_unread') + '/>'
        + '<label for ="load_unread"> Link to load unread topics </label>'
        + '<p class="desc"> Creates a link to load all topics with new posts. '
        + 'When clicked, each topic opens in a new tab. </p>'
        + '<div><input type="checkbox" id="posted_only" ' + settingCheck('posted_only') + '/>'
        + '<label for ="posted_only"> Only if viewing[Posted] </label> <br />'
        + '<input type="checkbox" id="unread_title" ' + settingCheck('unread_title') + '/>'
        + '<label for ="unread_title"> Show number of unread topics in page title </label>  <br />'
        + '<input type="checkbox" id="disable_topics" ' + settingCheck('disable_topics') + '/>'
        + '<label for ="disable_topics"> Option to disable topics </label>'
        + '<p class="desc"> Creates a link next to the timestamp for each topic. '
        + 'When clicked, the topic will no longer open in the "Load Unread Topics" link, and will be grayed out. </p>'
        + '</div></td></tr>'
        + '<tr><td><input type="checkbox" id="update_new_window" ' + settingCheck('update_new_window') + '/>'
        + '<label for ="update_new_window"> Open topic update links in a new window / tab </label>'
        + '<p class="desc"> Clicking the links in the Msgs column that show new posts since your last visit will open a new window </p>'
        + '</td></tr>'
        + '<!--Message list settings-->'
        + '<tr><th> Message Lists </th></tr>'
        + '<tr><td><input type="checkbox" id="autoscroll" ' + settingCheck('autoscroll') + '/>'
        + '<label for ="autoscroll"> Scroll the topic automatically when new posts appear </label>'
        + '<p class="desc"> Scrolls the topic for you when new posts appear with Livelinks. </p>'
        + '<p><input type="text" size="8" id="autoscroll_y" value ="' + ch('autoscroll_y', 400) + '" />'
        + '<label for ="autoscroll_y"> Maximum number of pixels from bottom to allow scroll </label></p>'
        + '<p class="desc"> You must be within this distance from the bottom of the screen for the page to scroll. </p>'
        + '<p><input type="checkbox" id="page_change" ' + settingCheck('page_change') + '/>'
        + '<label for ="page_change"> Change the page automatically </label></p>'
        + '</td></tr>'
        + '<tr><td><input type="checkbox" id="messages_in_title" ' + settingCheck('messages_in_title') + '/>'
        + '<label for ="messages_in_title"> Change title when there are new posts </label>'
        + '<p class="desc"> Adds a number in the title of the page in your browser tabs / window when there are new messages and the topic window does not have focus </label>'
        + '</td></tr>'
        + '<tr><td><input type="checkbox" id="stealth_logout" ' + settingCheck('stealth_logout') + '/>'
        + '<label for ="stealth_logout"> Ask me to confirm logging out </label>'
        + '</td></tr>'
        + '<tr><td><input type="checkbox" id="load_omitted" ' + settingCheck('load_omitted') + '/>'
        + '<label for ="load_omitted"> Load[quoted text omitted]by clicking </label>'
        + '<p class="desc"> Clicking on "[quoted text omitted]" will load the actual message and insert it. </p>'
        + '</td></tr>'
        + '<tr><td><input type="checkbox" id="word_break" ' + settingCheck('word_break') + '/>'
        + '<label for ="word_break"> Break page - stretching words into multiple lines </label>'
        + '<p class="desc"> Forces long words to be broken into multiple lines to eliminate horizontal page - stretching. '
        + 'Enter the maximum number of characters a word can contain below. </p>'
        + '<p>  <input type="text" id="word_length" size="8" value ="' + ch('word_length', 180) + '" />  </p>'
        + '</td></tr>'
        + '<tr><td><input type="checkbox" id="expand_images" ' + settingCheck('expand_images') + '/>'
        + '<label for ="expand_images"> Expand thumbnails with a click </label>'
        + '<p class="desc"> Clicking on a thumbnail expands the image into its full - sized version </p>'
        + '<p><input type="checkbox" id="expand_all" ' + settingCheck('expand_all') + '/>'
        + '<label for ="expand_all"> Create menu option to expand all thumbnails on a page </label></p>'
        + '</td></tr>'
        + '<tr><td><input type="checkbox" id="resize_images" ' + settingCheck('resize_images') + '/>'
        + '<label for ="resize_images"> Resize large images to fit </label>'
        + '<p class="desc"> Resizes images that would stretch the page. '
        + 'Shift - clicking an image will show it full - sized. </p>'
        + '</td></tr>'
        + '<tr><td><input type="checkbox" id="open_spoilers" ' + settingCheck('open_spoilers') + '/>'
        + '<label for ="open_spoilers"> Userbar option to open all spoilers </label>'
        + '<p class="desc"> Creates a link in the userbar that will open all spoilers on a page when clicked. </p>'
        + '</td></tr>'
        + '<tr><td><input type="checkbox" id="mark_edited" ' + settingCheck('mark_edited') + '/>'
        + '<label for ="mark_edited"> Mark Message Detail link of edited posts </label>'
        + '<p class="desc"> Colors the Message Detail link when a post has been edited. '
        + 'Enter in the color below for the text. </p>'
        + '<p><input type="text" id="edited_color" value ="' + ch('edited_color', '#aa0000') + '" />'
        + '</p>'
        + '</td></tr>'
        + '<tr><td><input type="checkbox" id="number_posts" ' + settingCheck('number_posts') + '/>'
        + '<label for ="number_posts"> Number Posts </label>'
        + '</td></tr>'
        + '<tr><td><input type="checkbox" id="like_posts" ' + settingCheck('like_posts') + '/>'
        + '<label for ="like_posts"> Add option to "Like" a post </label>'
        + '<p class="desc"> Adds a "Like" option to the headers of each post. </p>'
        + '<p><input type="checkbox" id="like_automatic_post" ' + settingCheck('like_automatic_post') + '/>'
        + '<label for ="like_automatic_post"> Automatically submit the post </label></p>'
        + '</td></tr>'
        + '<tr><td><input type="checkbox" id="repeat_posts" ' + settingCheck('repeat_posts') + '" />'
        + '<label for="repeat_posts">Add option to "Repeat" a post</label>'
        + '<p class="desc">Adds a "Repeat" option to the headers of every post. '
        + 'Clicking this automatically quotes and submits the post.</p>'
        + '</td></tr>'
        + '<tr><td><input type="checkbox" id="filter_me"' + settingCheck('filter_me') + '/>'
        + '<label for="filter_me">Create menu option to "Filter Me" in topics</label>'
        + '</td></tr>'
        + '<tr><td><input type="checkbox" id="imgur_integration"' + settingCheck('imgur_integration') + '/>'
        + '<label for="imgur_integration">Automatically embed .gif/.webm/.gifv from Imgur</label>'
        + '</td></tr>'
        + '<tr><td><input type="checkbox" id="gfycat_integration"' + settingCheck('gfycat_integration') + '/>'
        + '<label for="gfycat_integration">Automatically embed .webm from gfycat</label>'
        + '</td></tr>'
        + '<tr><td><input type="checkbox" id="chat_mode"' + settingCheck('chat_mode') + '/>'
        + '<label for="chat_mode">"Chat Mode" option</label>'
        + '<p class="desc">Creates a toggle that turns on "Chat Mode". '
        + 'Useful for topics where users post at a rapid rate, chat mode strips out most of the UI so you can keep up with the topic.</p>'
        + '</td></tr>'
        + '<tr><td><input type="checkbox" id="autoexpand_quickpost"' + settingCheck('autoexpand_quickpost') + '/>'
        + '<label for="autoexpand_quickpost">Automatically expand quickpost when you enter a topic</label>'
        + '</td></tr>'
        + '<!-- Posting settings -->'
        + '<tr><th>Posting</th></tr>'
        + '<tr><td><input type="checkbox" id="lastfm_integration"' + settingCheck('lastfm_integration') + '/>'
        + '<label for="lastfm_integration">Integrate Last.fm into your posts</label>'
        + '<p class="desc">Allows you to integrate Last.fm into your signature/posts. '
        + 'When submitting a post, %TRACK% will be replaced by " ARTIST ? TRACK ", and %TIME% will let you know when the track was played.'
        + '<p><input type="text" id="lastfm_username" size="25" value="' + ch('lastfm_username', '') + '" />'
        + '<label for="lastfm_username">Last.fm Username</label><br />'
        + '<input type="text" id="lastfm_freq " size="5" value=" ' + ch('lastfm_freq', '') + '" />'
        + '<label for="lastfm_freq">Update Frequency (minutes)</label></p>'
        + '<p class="desc">After this many minutes, your Last.fm data will be refreshed.</p>'
        + '</td></tr>'
        + '<tr><td><input type="checkbox""checkbox" id="ctrl_key_shortcuts"' + settingCheck('ctrl_key_shortcuts') + '/>'
        + '<label for="ctrl_key_shortcuts">CTRL + [KEY] shortcuts for inserting tags in posts</label>'
        + '<p class="desc">Allows you to use common CTRL + [KEY] combinations to insert tags into your posts. '
        + 'You can select text and tags will appear outside, or you can insert them through normal typing. '
        + 'The combinations are:<br />'
        + 'CTRL + B - bold<br />'
        + 'CTRL + I - italic<br />'
        + 'CTRL + U - underline<br />'
        + 'CTRL + S - spoiler<br />'
        + 'CTRL + M - spoiler with caption<br />'
        + 'CTRL + Q - quote<br />'
        + 'CTRL + P - preformatted<br />'
        + 'CTRL + G - mod</p>'
        + '</td></tr>'
        + '<tr><td><input type="checkbox" id="confirm_leaving"' + settingCheck('confirm_leaving') + '/>'
        + '<label for="confirm_leaving">Confirm leaving the page when I have a long message typed</label>'
        + '<p class="desc">Pops up a confirmation window if you are about to leave a page where you have a long message typed</p>'
        + '</td></tr>'
        + '<tr><td><input type="checkbox" id="preserve_messages"' + settingCheck('preserve_messages') + '/>'
        + '<label for="preserve_messages">Preserve messages when I change the page</label>'
        + '<p class="desc">Keeps your typed message when you change pages in a topic.</p>'
        + '</td></tr>'
        + '<!-- Highlighting-->'
        + '<tr><th>Highlighting</th></tr>'
        + '<tr><td><p class="desc">You can highlight posts and topics from specific users. '
        + 'Click " Add User " to create a new row, then fill in the username and a '
        + '<a href="http://www.colorpicker.com/" target="_blank">CSS color</a>. '
        + 'Then select whether you would like to highlight posts and / or topics. </p>'
        + '<p class="desc"> Your username is automatically added to the table to highlight your own content. '
        + 'You can also highlight your posts in[Anonymous]topics. </p>'
        + '<table id="highlighting" class="gy_table">'
        + '<tr style="font-weight: bold;">'
        + '<td style="min-width: 25%"> User </td>'
        + '<td style="min-width: 50%"> Color </td>'
        + '<td> Posts </td><td> Topics </td>'
        + '<td> [Anonymous] </td><td> Remove </td>'
        + '</tr>'
        + populateHighlightedUsers()
        + '<tr><td colspan="6"><button id="add_highlight">Add User</button></td></tr>'
        + '</table>'
        + '</td></tr>'
        + '<!--Ignorator-->'
        + '<tr><th> Ignorator </th></tr>'
        + '<tr><td>'
        + '<p class="desc"> You can ignore posts and topics from specific users. '
        + 'Click "Add User" to create a new row, then fill in the username or userid. </p>'
        + '<p class="desc"> GreaseYeti will always ignore by userid and attempt to update usernames whenever possible. </p>'
        + '<table id="ignorating" class="gy_table">'
        + '<tr style="font-weight: bold;">'
        + '<td style="min-width: 45%"> User </td>'
        + '<td style="min-width: 45%"> Userid </td>'
        + '<td> Remove </td></tr>'
        + populateIgnoratedUsers()
        + '<tr><td colspan="6"><button id="add_ignorate"> Add User </button>  </td></tr>'
        + '</table>'
        + '</td></tr>'
        + '<!--Keyword / phrase Ignorator-->'
        + '<tr><th> Keyword Ignorator </th></tr>'
        + '<tr><td><p class="desc"> You can ignore posts and topics with specific key words! '
        + 'Click "Add Word" to create a new row, then fill in the word or phrase. </p>'
        + '<p class="desc"> You may then select whether you want to ignore just the topics, posts, or both. '
        + 'This is case -insensitive. </p>'
        + '<table id="kw_ignorating" class="gy_table">'
        + '<tr style="font-weight: bold;">'
        + '<td style="min-width: 45%"> Keyword </td>'
        + '<td> Is regex ?  </td>'
        + '<td> Posts </td>'
        + '<td> Topics </td>'
        + '<td> Remove </td></tr>  '
        + populateIgnoratedKWords()
        + '<tr><td colspan="6">  <button id="add_kw_ignorate"> Add Word </button>  </td></tr>'
        + '</table>'
        + '</td></tr>'
        + '<!--Save button-->'
        + '<tr><th> Save </th></tr>'
        + '<tr><td style="text-align: center"><button id="gm_save"> Save Settings </button>  <br />'
        + '<span id="save_confirmation" style="font-weight: bold;">  </span>'
        + '</td></tr></tbody>  ';

    // Apply the HTML and add some style
    $('.grid').addClass('greaseyeti_settings').html(settings_html);
    $('.grid label').css('font-weight', 'bold');
    $('.grid p, .grid div').css('margin', '0 0 0 25px');
    $('#custom_css_rules')
        .css({'width': '90%', 'margin': '10px auto', 'height': '20em', 'display': 'none', 'font-family': 'monospace'});
    $('.grid td').css('padding', '6px');
    $('.grid p.desc').css('font-size', '90%');
    $('table.gy_table')
        .css({'min-width': '60%', 'margin': '10px', 'text-align': 'center', 'border': '1px rgba(0,0,0,0.3) solid'});
    if ($('#custom_css').is(':checked')) {
        $('#custom_css_rules').css('display', 'block');
    }
    // Set up interactions with the page.
    $('#custom_css').change(function () {
        if ($(this).is(':checked')) {
            $('#custom_css_rules').css('display', 'block');
        } else {
            $('#custom_css_rules').hide();
        }
    });
    $('#add_highlight').click(function () {
        $(this).parent().parent().before('<tr class="huser">'
            + '<td><input type="text" class="highlight_username"/></td>'
            + '<td><input type="text" class="highlight_color"/></td>'
            + '<td><input type="checkbox" class="highlight_posts"/></td>'
            + '<td><input type="checkbox" class="highlight_topics"/></td>'
            + '<td>&nbsp;</td><td class="highlight_remove"><a style="cursor: pointer;color: #a33;">✖</a></td>'
            + '</tr>');
    });
    $('#add_ignorate').click(function () {
        $(this).parent().parent().before('<tr class="iguser">'
            + '<td><input type="text" class="ignorate_username"/></td>'
            + '<td><input type="text" class="ignorate_userid"/></td>'
            + '<td class="highlight_remove"><a style="cursor: pointer;color: #a33;">✖</a></td> '
            + '</tr>');
    });
    $('#add_kw_ignorate').click(function () {
        $(this).parent().parent().before('<tr class="igkword">'
            + '<td><input type="text" class="ignorate_kword"/></td>'
            + '<td><input type="checkbox" class="kw_ignorate_regex"/></td>'
            + '<td><input type="checkbox" class="kw_ignorate_posts"/></td>'
            + '<td><input type="checkbox" class="kw_ignorate_topics"/></td>'
            + '<td class="highlight_remove"><a style="cursor: pointer;color: #a33;">✖</a></td>'
            + '</tr>');
    });
    $('.highlight_color, #my_color').each(function () {
        $(this).parent().parent().children().css('background-color', $(this).val());
    });
    $(document).on('change', '.highlight_color, #my_color', function () {
        $(this).parent().parent().children().css('background-color', $(this).val());
    });
    $(document).on('click', '.huser a', function () {
        $(this).parent().parent().remove();
    });
    $(document).on('click', '.iguser a', function () {
        $(this).parent().parent().remove();
    });
    $(document).on('click', '.igkword a', function () {
        $(this).parent().parent().remove();
    });
    // SAVE THE SETTINGS
    document.getElementById('gm_save').addEventListener('click', function () {
        greaseyeti.dramalinks = $('#dramalinks').is(':checked');
        greaseyeti.custom_titles = $('#custom_titles').is(':checked');
        greaseyeti.title_format = $('#title_format').val();
        greaseyeti.message_history = $('#message_history').is(':checked');
        greaseyeti.history_topbar = $('#history_topbar').is(':checked');
        greaseyeti.alert_new_versions = $('#alert_new_versions').is(':checked');
        greaseyeti.force_https = $('#force_https').is(':checked');
        greaseyeti.custom_css = $('#custom_css').is(':checked');
        greaseyeti.custom_css_rules = $('#custom_css_rules').val();
        greaseyeti.autoload = $('#autoload').is(':checked');
        greaseyeti.remove_topics = $('#remove_topics').is(':checked');
        greaseyeti.highlight_topics = $('#highlight_topics').is(':checked');
        greaseyeti.highlight_color = $('#highlight_color').val();
        greaseyeti.load_unread = $('#load_unread').is(':checked');
        greaseyeti.posted_only = $('#posted_only').is(':checked');
        greaseyeti.unread_title = $('#unread_title').is(':checked');
        greaseyeti.disable_topics = $('#disable_topics').is(':checked');
        greaseyeti.update_new_window = $('#update_new_window').is(':checked');
        greaseyeti.autoscroll = $('#autoscroll').is(':checked');
        greaseyeti.autoscroll_y = $('#autoscroll_y').val();
        greaseyeti.page_change = $('#page_change').is(':checked');
        greaseyeti.messages_in_title = $('#messages_in_title').is(':checked');
        greaseyeti.stealth_logout = $('#stealth_logout').is(':checked');
        greaseyeti.load_omitted = $('#load_omitted').is(':checked');
        greaseyeti.word_break = $('#word_break').is(':checked');
        greaseyeti.word_length = $('#word_length').val();
        greaseyeti.expand_images = $('#expand_images').is(':checked');
        greaseyeti.expand_all = $('#expand_all').is(':checked');
        greaseyeti.resize_images = $('#resize_images').is(':checked');
        greaseyeti.open_spoilers = $('#open_spoilers').is(':checked');
        greaseyeti.mark_edited = $('#mark_edited').is(':checked');
        greaseyeti.edited_color = $('#edited_color').val();
        greaseyeti.number_posts = $('#number_posts').is(':checked');
        greaseyeti.like_posts = $('#like_posts').is(':checked');
        greaseyeti.like_automatic_post = $('#like_automatic_post').is(':checked');
        greaseyeti.repeat_posts = $('#repeat_posts').is(':checked');
        greaseyeti.filter_me = $('#filter_me').is(':checked');
        greaseyeti.imgur_integration = $('#imgur_integration').is(':checked');
        greaseyeti.gfycat_integration = $('#gfycat_integration').is(':checked');
        greaseyeti.chat_mode = $('#chat_mode').is(':checked');
        greaseyeti.autoexpand_quickpost = $('#autoexpand_quickpost').is(':checked');
        greaseyeti.lastfm_integration = $('#lastfm_integration').is(':checked');
        greaseyeti.lastfm_username = $('#lastfm_username').val();
        greaseyeti.lastfm_freq = $('#lastfm_freq').val();
        greaseyeti.ctrl_key_shortcuts = $('#ctrl_key_shortcuts').is(':checked');
        greaseyeti.confirm_leaving = $('#confirm_leaving').is(':checked');
        greaseyeti.preserve_messages = $('#preserve_messages').is(':checked');
        greaseyeti.my_color = $('#my_color').val();
        greaseyeti.my_posts = $('#my_posts').is(':checked');
        greaseyeti.my_topics = $('#my_topics').is(':checked');
        greaseyeti.my_anon = $('#my_anon').is(':checked');
        greaseyeti.highlighted_users = [];
        greaseyeti.ignorated_users = [];
        greaseyeti.ignorated_kwords = [];
        $('tr.huser').each(function () {
            var thisuser = new Object();
            thisuser.username = $(this).find('.highlight_username').val();
            thisuser.color = $(this).find('.highlight_color').val();
            thisuser.posts = $(this).find('.highlight_posts').is(':checked');
            thisuser.topics = $(this).find('.highlight_topics').is(':checked');
            greaseyeti.highlighted_users.push(thisuser);
        });
        $('tr.iguser').each(function () {
            var thisuser = new Object();
            thisuser.username = $(this).find('.ignorate_username').val();
            thisuser.userid = $(this).find('.ignorate_userid').val();
            greaseyeti.ignorated_users.push(thisuser);
        });
        $('tr.igkword').each(function () {
            var kword = new Object();
            kword.word = $(this).find('.ignorate_kword').val();
            kword.is_regex = $(this).find('.kw_ignorate_regex').is(':checked');
            kword.posts = $(this).find('.kw_ignorate_posts').is(':checked');
            kword.topics = $(this).find('.kw_ignorate_topics').is(':checked');
            greaseyeti.ignorated_kwords.push(kword);
        });
        saveGreaseyeti(false);
        $('span#save_confirmation').html('Settings saved!');
    });
    // ****************
    // * USER PROFILE *
    // ****************
} else if (url.indexOf('profile.php') != -1 && document.body.innerHTML.indexOf('Edit My Profile') != -1) {
    $('.grid').append('<tr><td colspan="2"><a href="loser.php?settings">Edit GreaseYETI Settings</a></td></tr>');
    // Just appending the link, that's it.
    // ***************
    // * TOPIC LISTS *
    // ***************
}
if (document.location.href.indexOf('.net/topics/') != -1) {
    var unread_topics = [], next_page;
    // Mark the next page URL
    var next_page_link = $('div.infobar').eq(-2).find('a');
    if (next_page_link.length > 0) {
        next_page = next_page_link.eq(0).attr('href');
    } else {
        next_page = false;
    }
    createLoadUnreadLink();
    processTopicList();
    if (ch('autoload') && next_page !== false) {
        document.addEventListener('scroll', topicListScrollCheck, true);
    }
    // new front page garbage
} else if(document.location.href.indexOf('.net/main.php') != -1) {
    // boring jquery stuff
    $.fn.onAvailable = function (fn) {
        var self = this;
        var timer;
        if (this.length > 0) {
            fn.call(this);
        } else {
            timer = setInterval(function () {
                if ($(self.selector).length > 0) {
                    fn.call($(self.selector));
                    clearInterval(timer);
                }
            }, 50);
        }
    };
    // wait for it to successfully load (because fuck melon wolf)
    $('#totm > h2').onAvailable(function(){
        var unread_topics = [], next_page;
        // Mark the next page URL
        var next_page_link = $('div.infobar').eq(-2).find('a');
        if (next_page_link.length > 0) {
            next_page = next_page_link.eq(0).attr('href');
        } else {
            next_page = false;
        }
        createLoadUnreadLink();
        processTopicList();
        if (ch('autoload') && next_page !== false) {
            document.addEventListener('scroll', topicListScrollCheck, true);
        }
    });
    // *****************
    // * MESSAGE LISTS *
    // *****************
} else if (document.location.href.indexOf('.net/showmessages.php') != -1) {
    var page_number = 1, unread_messages = 0, post_count = 0, initial_load = true, anon_topic = false, my_human_number = -1, last_scroll_position = $(window)
        .scrollTop(), prevent_scroll_timeout;
    if (gup('page')) {
        page_number = parseInt(gup('page'));
    }
    var topic_id = gup('topic');
    processPosts(page_number);
    openSpoilersOption();
    chatModeOption();
    filterMeOption();
    restoreMessage(topic_id);
    preserveMessage(topic_id);
    autoexpandQuickpost();
    // Use MutationObserver to listen for new posts
    // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
    var posts_target = document.querySelector('#u0_1');
    var observer = new MutationObserver(function (mutations) {
        autoscroll(post_count);
        processPosts(page_number);
        findImages();
    });
    var config = {
        childList: true
    };
    observer.observe(posts_target, config);
    // Use another one to  listen for new pages
    if (ch('page_change')) {
        var new_page_target = document.querySelector('#u0_3');
        var new_page_observer = new MutationObserver(function (mutations) {
            var new_page_number = parseInt($('#u0_3 a').last().text());
            changePage(page_number, new_page_number);
        });
        new_page_observer.observe(new_page_target, config);
    }
    // And a third to watch for loaded images...
    var img_targets = document.querySelectorAll('.imgs a span');
    var img_observer = new MutationObserver(function (mutations) {
        findImages();
    });
    for (var i = 0; i < img_targets.length; i++) {
        img_observer.observe(img_targets[i], {
            attributes: true
        });
    }
    // And a fourth to watch for scrolls if autoscroll is on
    if (ch('autoscroll')) {
        document.addEventListener('scroll', messageListScrollCheck, true);
    }
    // Add event listener for expanding thumbnails. Add menu option, if enabled.
    if (ch('expand_images')) {
        $(document).on('click', '.greaseyeti_img_collapsed, .greaseyeti_img_expanded', function (e) {
            toggleImage($(this));
            e.preventDefault();
        });
        if (ch('expand_all')) {
            $('.userbar').append(' | <a class="greaseyeti_link" id="greaseyeti_expand_all">Expand All Images</a>');
            $('#greaseyeti_expand_all').click(expandAllImages);
        }
    }
    // Monitor window focus and attempt to detect if the window has focus initially. Event listener for page resize
    $(window).focus(function () {
        window_has_focus = true;
        unreadMessagesInTitle();
    })
             .blur(function () {
                 window_has_focus = false;
             });

    function detectMovement() {
        document.removeEventListener('mousemove', detectMovement, true);
        document.removeEventListener('keypress', detectMovement, true);
    }

    document.addEventListener('mousemove', detectMovement, true);
    document.addEventListener('keypress', detectMovement, true);
    window.addEventListener('resize', findMaxImageWidth, true);
}
// EVERYWHERE
document.addEventListener('keydown', ctrlDetect, true);
document.addEventListener('keyup', ctrlDetect, true);
window.addEventListener('beforeunload', checkWindowClose, true);
customTitles();
stealthLogout();
messageHistoryLink();
dramalinks();
ctrlKeyShortcuts();
lastFMListeners();
versionCheck();
confirmLeavingListeners();
addClassToBody();
applyStyling();
addCustomCss();
if (gup('greaseyeti_debug') !== null) {
    console.log(greaseyeti);
}
greaseyetiTime();
//
// FUNCTION DEFINITIONS
//
// EVERYWHERE
// Quick getter to grab the value of a property in the greaseyeti object.
function ch(setting, default_value) {
    if (!greaseyeti.hasOwnProperty(setting)) {
        return default_value;
    }
    return greaseyeti[setting];
}
// Save the current GY settings. Need to limit mutability of some fields since we're saving all settings at once.
// It's possible you could change the settings page, but then an old tab calls saveGreaseyeti() and overwrites them.
function saveGreaseyeti(restrict_mutability) {
    if (typeof greaseyeti == 'number') {
        return;
    }
    // Mutable fields
    if (restrict_mutability) {
        var current_greaseyeti = JSON.parse(GM_getValue('greaseyeti', '-1'));
        if (typeof current_greaseyeti == 'number') {
            return;
        }
        var mutable_fields = ['lastfm_track', 'lastfm_lastcheck', 'lastfm_timestamp', 'preserved_topic_id', 'preserved_message_text', 'removed_topics', 'highlighted_topics', 'disabled_topics', 'last_version_check'];
        for (var i = 0; i < mutable_fields.length; i++) {
            current_greaseyeti[mutable_fields[i]] = greaseyeti[mutable_fields[i]];
        }
        json_string = JSON.stringify(current_greaseyeti);
        GM_setValue('greaseyeti', json_string);
        greaseyeti = JSON.parse(json_string);
    } else {
        GM_setValue('greaseyeti', JSON.stringify(greaseyeti));
    }
}
// Fetch 'get' parameters from URL
function gup(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regexS = '[\\?&]' + name + '=([^&#]*)';
    var regex = new RegExp(regexS);
    var results = regex.exec(document.location.href);
    return (results == null) ? null : results[1];
}

function ctrlDetect(e) {
    shift_key = e.shiftKey;
    ctrl_key = e.ctrlKey;
}

function applyStyling() {
    $('.greaseyeti_nounderline_link').css('cursor', 'pointer');
    $('.greaseyeti_link').css({'cursor': 'pointer', 'text-decoration': 'underline'});
    $('.greaseyeti_imgur').css({'text-align': 'center', 'display': 'inline-block'});
    $('.greaseyeti_gfycat').css({'text-align': 'center', 'display': 'inline-block'});
}

function customTitles() {
    if (!ch('custom_titles')) {
        return;
    }
    var realTitle = document.title.replace(/End of the Internet - /i, '');
    document.title = greaseyeti.title_format.replace('%TITLE%', realTitle);
}

function messageHistoryLink() {
    if (!ch('message_history')) {
        return;
    }
    if (ch('history_topbar')) {
        $('.menubar a:nth-child(6)').before('<a href="//boards.endoftheinter.net/history.php">Message History</a> | ');
    } else {
        $('#bookmarks a:last').before('<a href="//boards.endoftheinter.net/history.php">Message History</a> | ');
    }
}

function greaseyetiTime() {
    var finish = new Date().getTime();
    //  $('small').filter(':last').prepend('<strong>GreaseYETI Processing:</strong> ' + (finish - start) + 'ms ');
}

function forceHttps() {
    if (!ch('force_https')) {
        return;
    }
    if (document.location.href.substring(0, 5) != 'https') {
        document.location.href = 'https' + document.location.href.substring(4);
    }
}

function getMyUsername() {
    var regexp3 = / \((-)?\d+\)$/i;
    return $('.userbar a').first().text().replace(regexp3, '');
}

function getMyUserId() {
    var regexp4 = /^(.+)=/i;
    return $('.userbar a').first().attr('href').replace(regexp4, '');
}

function dramalinks() {
    if (!ch('dramalinks')) {
        return;
    }
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'http://wiki.endoftheinter.net/index.php?title=Dramalinks/current&action=raw&section=0&maxage=300',
        onload: function (responseDetails) {
            if (responseDetails.status == 200) {
                var dl = responseDetails.responseText;
                dl = dl.slice(dl.indexOf('<!--- NEW STORIES GO HERE --->') + 30);
                var color = dl.slice(dl.indexOf('{{') + 2)
                              .replace('}}', '');
                dl = dl.slice(0, dl.indexOf('</div>'));
                dl = dl.replace(/\[\[(.+?)(\|(.+?))\]\]/g, '<a href="http://wiki.endoftheinter.net/index.php/$1">$3</a>');
                dl = dl.replace(/\[\[(.+?)\]\]/g, '<a href="http://wiki.endoftheinter.net/index.php/$1">$1</a>');
                var linkct = 0;
                while (dl.match(/\[http(.+?)\]/)) {
                    dl = dl.replace(/\[http(.+?)\]/, '<a href="http$1">[' + (++linkct) + ']</a>');
                }
                var dl_bgcolor, dl_textcolor;
                switch (color) {
                    case 'white':
                        dl_bgcolor = '#fff';
                        dl_textcolor = '#000';
                        break;
                    case 'blue':
                        dl_bgcolor = 'rgba(120, 170, 255, 0.7)';
                        dl_textcolor = '#000';
                        break;
                    case 'green':
                        dl_bgcolor = 'rgba(150, 255, 150, 0.7)';
                        dl_textcolor = '#000';
                        break;
                    case 'yellow':
                        dl_bgcolor = 'rgba(255, 255, 100, 0.7)';
                        dl_textcolor = '#000';
                        break;
                    case 'orange':
                        dl_bgcolor = 'rgba(255, 160, 0, 0.7)';
                        dl_textcolor = '#000';
                        break;
                    case 'purple':
                        dl_bgcolor = 'rgba(175, 0, 175, 0.7)';
                        dl_textcolor = '#000';
                        break;
                    case 'red':
                        dl_bgcolor = 'rgba(255, 50, 50, 0.7)';
                        dl_textcolor = '#000';
                        break;
                    case 'black':
                        dl_bgcolor = 'rgba(0, 0, 0, 0.9)';
                        dl_textcolor = '#fff';
                        break;
                    case 'kermit':
                        dl_bgcolor = '#000';
                        dl_textcolor = '#fff';
                        color = "CODE KERMIT! <img alt='kermit.gif' "
                            + "src='data:image/gif;base64,R0lGODlhDQAMAMQAAGeWLYWQNFANCWoSCS1MEm9yKqwQDXWnMSY"
                            + "PB0dGF5AOCF2IKGklEEJwGW5RJUcqDxEPCZAkEJd1NCkwEFFoIoJZLmNFGqpZPYtJHd5rbB8hDkdZG"
                            + "U9+IGY2GoGERP///yH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWd"
                            + "pbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6e"
                            + "D0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY"
                            + "2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwO"
                            + "i8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiB"
                            + "yZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuc"
                            + "zp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA"
                            + "6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vb"
                            + "D0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ"
                            + "6NURGODAyRTAxRkU5MTFFMzk1QjQ5RTJGRUNCOEE1MUMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5ka"
                            + "WQ6NURGODAyRTExRkU5MTFFMzk1QjQ5RTJGRUNCOEE1MUMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3R"
                            + "SZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1REY4MDJERTFGRTkxMUUzOTVCNDlFMkZFQ0I4QTUxQyIgc"
                            + "3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1REY4MDJERjFGRTkxMUUzOTVCNDlFMkZFQ0I4QTUxQyI"
                            + "vPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZ"
                            + "D0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3"
                            + "My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTk"
                            + "pGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVh"
                            + "XVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eH"
                            + "RwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAUKAB8ALAAAAAANAAwAAAVOoIBAgyFC6Di"
                            + "cipkm3SPOLkQUGCOsZH0EMR6iJAL8cDoagvA7cGA8hqJjdD53toD2uNgQlx5OY3ybQFVigsamkc4q3"
                            + "AZBYHAN4E2x1BACACH5BAUKAB8ALAEAAAAMAAwAAAVLIPSNZDmYJKKWJaSKn6iMbpGs7OTZQt8mlYi"
                            + "wBzkJikFG0CVQ9CyVS+bSiQ0MkUpgS2WMFBHPYUEpR44fhWRMDiS86eqnQWhoEKMQACH5BAUKAB8AL"
                            + "AAAAAANAAwAAAVO4Id8ZGmeaPoxWns+T3U5ydSOq1V4HkWIEFwlQdlZbEHEaFizOBmClWBAQ2wcsqt"
                            + "iu5oQsY1EZDtecYpnAmOMMZgbC8C5M3Z/HPJ8kx0CACH5BAUKAB8ALAAAAQANAAsAAAVL4CeOpDiUA"
                            + "qRqrAkNRqpt1iB8MpwClWLjKd3hQHn8bC+FZ7jYTFwIxYXJISSDkgB1gjDaMMtFkys4OQofDqUx/hh"
                            + "EgGa6SnArDIYQADs=' "
                            + "style='height: 2.1em; width: 2.1em; margin: 0.1em 0.5em; border: 1px #fff solid; float: left;'/>";
                        break;
                    case 'dog':
                        dl_bgcolor = '#664422';
                        dl_textcolor = '#fff';
                        break;
                    case 'rainbow':
                        dl_bgcolor = 'linear-gradient(to right, ' + 'rgba(255, 50, 50, 0.7), '
                            + 'rgba(255, 160, 0, 0.7), rgba(255, 255, 100, 0.7), rgba(150, 255, 150, 0.7), '
                            + 'rgba(120, 170, 255, 0.7), rgba(175, 0, 175, 0.7))';
                        dl_textcolor = '#000';
                        break;
                    default:
                        console.log('Dramalinks color: ' + color);
                        dl_bgcolor = 'transparent';
                        dl_textcolor = 'inherit';
                }
                $('.userbar')
                    .eq(0)
                    .before('<div id="dramalinks_ticker" style="padding: 4px"><strong>' + color + ':</strong>' + dl
                        + '</div>');
                $('#dramalinks_ticker').css('background', dl_bgcolor);
                $('#dramalinks_ticker, #dramalinks_ticker a').css('color', dl_textcolor);
            }
        }
    });
}

function addCustomCss() {
    if (!ch('custom_css')) {
        return;
    }
    $('head').append('<style type="text/css">' + ch('custom_css_rules') + '</style>');
}
// returns the number of pixels that are off the screen _below_ the page (e.g., 0 at the bottom)
function getScrollDistanceToBottom() {
    return document.body.clientHeight - window.pageYOffset - window.innerHeight;
}

function ctrlKeyShortcuts() {
    if (!ch('ctrl_key_shortcuts')) {
        return;
    }
    var open_tags = {
        'i': false, 'b': false, 'mod': false, 'p': false, 'q': false, 'spoiler': false, 'u': false
    };
    $('textarea[name=message]').keydown(function (e) {
        if (!ctrl_key) {
            return;
        }
        var tag = '', bool;
        switch (e.which) {
            case 73:
                tag = 'i';
                break;
            case 66:
                tag = 'b';
                break;
            case 71:
                tag = 'mod';
                break;
            case 80:
                tag = 'pre';
                break;
            case 81:
                tag = 'quote';
                break;
            case 83:
                tag = 'spoiler';
                break;
            case 85:
                tag = 'u';
                break;
            case 77:
                if (!open_tags['spoiler']) {
                    var caption = prompt('Please enter a caption for your spoiler tag.');
                }
                tag = 'spoiler';
                break;
            default:
                return;
        }
        var v = $(this).val();
        var selectStart = $(this)[0].selectionStart;
        var selectEnd = $(this)[0].selectionEnd;
        if (selectStart == selectEnd) {
            var ins = '<' + tag + '>';
            if (caption != null) {
                ins = '<spoiler caption="' + caption + '">';
            }
            if (open_tags[tag]) {
                ins = '</' + tag + '>';
            }
            open_tags[tag] = !open_tags[tag];
            $(this).val(v.substr(0, selectStart) + ins + v.substr(selectStart));
            $(this)[0].setSelectionRange(selectStart + ins.length, selectStart + ins.length);
        } else {
            var open_tag = tag;
            if (caption != null) {
                open_tag = 'spoiler caption="' + caption + '"';
            }
            $(this).val(v.substr(0, selectStart) + '<' + open_tag + '>'
                + v.substr(selectStart, selectEnd - selectStart) + '</' + tag + '>' + v.substr(selectEnd));
            $(this)[0].setSelectionRange(selectStart + 2 + open_tag.length, selectStart + 2 + open_tag.length
                + (selectEnd - selectStart));
        }
        e.preventDefault();
    });
}

function lastFMListeners() {
    if (!ch('lastfm_integration')) {
        return;
    }
    checkLastFM();
    $('input[value="Post Message"], input[value="Preview Message"]').click(function () {
        $(this).parents('form').find('textarea').val(function (i, v) {
            var d = new Date(ch('lastfm_timestamp', '-1')).getTime();
            var now = new Date();
            var stamp = 'Just now';
            if (now - d > 5 * 60000) {
                stamp = Math.floor((now - d) / 60000) + 'm ago';
            }
            if (now - d > 3600000) {
                stamp = Math.floor((now - d) / 3600000) + 'h ago';
            }
            if (now - d > 86400000) {
                stamp = Math.floor((now - d) / 86400000) + ' days ago';
            }
            return v.replace('%TRACK%', ch('lastfm_track', 'None'))
                    .replace('%TIME%', stamp);
        });
    });
}

function checkLastFM() {
    if (ch('lastfm_username').length < 1) {
        return;
    }
    if (start / 1000 > (ch('lastfm_lastcheck', 0) + ch('lastfm_freq') * 60)) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks' +
            	'&api_key=f3abaf953cc7f1695f90ec70752f80ef&format=json&limit=1&user=' +
            	ch('lastfm_username'),
            headers: {
                'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                'Accept': 'application/atom+xml,application/xml,text/xml',
                'Cache-Control': 'no-store',
            },
            onload: function (responseDetails) {
                if (responseDetails.status == 200) {
                	var mostRecentTrack = JSON.parse(responseDetails.responseText).recenttracks.track[0];
                	greaseyeti.lastfm_track = mostRecentTrack.artist["#text"] + ' – ' + mostRecentTrack.name;
                	greaseyeti.lastfm_timestamp = mostRecentTrack.date || 'Right Now';

                    greaseyeti.lastfm_lastcheck = Math.round(start / 1000);
                    saveGreaseyeti(true);
                }
            }
        });
    }
}

function confirmLeavingListeners() {
    if (!ch('confirm_leaving')) {
        return;
    }
    $('form')
        .submit(function () {
            form_submitted = true;
        });
}

function addClassToBody() {
    // Pages either have form blahblah.php or topics/tags.
    var pagename = window.location.pathname.slice(1).replace(/(\.php|\/).*$/, '');
    $('body').addClass(pagename);
}

function checkWindowClose(e) {
    if (ch('confirm_leaving') && !form_submitted && !page_change) {
        var stop_it = false;
        $('textarea[name=message]').each(function () {
            if ($(this).val().split(' ').length > 50) {
                stop_it = true;
            }
        });
        if (stop_it) {
            if (!window.confirm('It looks like you\'ve typed a long message. Are you sure you want to leave the page?')) {
                e.preventDefault();
            }
        }
    }
    if (ch('preserve_messages') && !page_change) {
        greaseyeti.preserved_topic_id = null;
        greaseyeti.preserved_message_text = '';
        saveGreaseyeti(true);
    }
}

function getHighlightColor(user, message_list) {
    if (highlighted_users === null) {
        indexHighlightedUsers(message_list);
    }
    var highlighted_index = highlighted_users.indexOf(user);
    if (highlighted_index == -1) {
        return false;
    }
    return highlighted_colors[highlighted_index];
}

function indexHighlightedUsers(message_list) {
    var h_users = ch('highlighted_users', []);
    highlighted_users = [];
    highlighted_colors = [];
    for (var i = 0; i < h_users.length; i++) {
        if (message_list && !h_users[i].posts) {
            continue;
        }
        if (!message_list && !h_users[i].topics) {
            continue;
        }
        highlighted_users.push(h_users[i].username);
        highlighted_colors.push(h_users[i].color);
    }
    if ((message_list && ch('my_posts')) || (!message_list && ch('my_topics'))) {
        highlighted_users.push(getMyUsername());
        highlighted_colors.push(ch('my_color'));
    }
}

function versionCheck() {
    var settings_page = (document.location.href.indexOf('endoftheinter.net/loser.php?settings') != -1);
    if ((!ch('alert_new_versions') || ch('last_version_check', 0) + 43200 >= start / 1000) && !settings_page) {
        return;
    }
    GM_xmlhttpRequest({
        method: 'GET', url: 'https://github.com/cosban/GreaseYeti/raw/master/greaseyeti.json', headers: {
            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            'Accept': 'application/atom+xml,application/xml,text/xml',
            'Cache-Control': 'no-store',
        }, onload: function (responseDetails) {
            if (responseDetails.status == 200) {
                var result = JSON.parse(responseDetails.responseText);
                if (settings_page) {
                    if (result.version > version_num) {
                        $('table.greaseyeti_settings')
                            .prepend('<tr>'
                                + '<td style="background: #ff8888; text-align: center; color: black; padding: 5px 0">'
                                + '<strong> A new version of GreaseYETI is out. </strong><br/>'
                                + '<strong> Your version :  </strong>' + version_num.toFixed(2)
                                + '<strong> Current version :  </strong>' + result.version + '<br/>' + result.changes
                                + '<br/>'
                                + '<a href="https://github.com/cosban/GreaseYeti/raw/master/greaseyeti.user.js"> Update </a></td>'
                                + '</tr>');
                    } else {
                        $('table.greaseyeti_settings')
                            .prepend('<tr><td style="background:#88ff88;font-weight:bold; text-align: center;color:black;padding:5px0">'
                                + 'Your version of GreaseYETI is up-to-date. Current version: ' + result.version
                                + '</td></tr>');
                    }
                } else if (result.version > version_num) {
                    $('body')
                        .prepend('<div style="position: absolute;top: 0;left:0;right:0;background: #ff8888;font-weight: bold;text-align: center;color: black;padding: 5px 0">'
                            + '<strong> A new version of GreaseYETI is out </strong> | '
                            + '<a href="https://github.com/cosban/GreaseYeti/raw/master/greaseyeti.user.js"> Update </a> | '
                            + '<a href="//endoftheinter.net/loser.php?settings"> View Changes </a> |'
                            + '<a style="cursor: pointer; text-decoration: underline" id="remove_bar_yeti"> Remove this damn bar </a>'
                            + '</div>');
                    $('#remove_bar_yeti').click(function () {
                        $(this).parent().remove();
                    });
                }
                greaseyeti.last_version_check = parseInt(start / 1000);
                saveGreaseyeti(true);
            }
        }
    });
}
//
// SETTINGS PAGE
//
function settingCheck(setting) {
    return (ch(setting, false) ? ' checked="checked"' : '');
}
// TOPIC LISTS
function processTopicList() {
    $('.grid tr:not(.gm_checked)')
        .each(function () {
            $(this).addClass('gm_checked');
            var cells = $(this).find('td');
            if (cells.length != 4) {
                return;
            }
            // Fetch the topic_id
            var topic_id = cells[0].getElementsByTagName('a')[0].href.split('=')[1];
            // Handle removed topics: Remove the topic or add the link to do so
            if (ch('remove_topics')) {
                if (isRemoved(topic_id)) {
                    $(this).remove();
                    return;
                } else {
                    cells.eq(3).append(' <a class="greaseyeti_nounderline_link rtopic ' + topic_id
                        + '" title="Remove topic" style="cursor:pointer;color:#a33;">✖</a>');
                }
            }
            // Highlighted topics: highlight if necessary and add the link
            if (ch('highlight_topics')) {
                if (isHighlighted(topic_id)) {
                    cells.css('background-color', ch('highlight_color', '#5cc'));
                }
                cells.eq(3).append(' <a class="greaseyeti_nounderline_link htopic ' + topic_id
                    + '" title="Highlight topic" >H</a>');
            }
            // Disabled topics. Add to Unread topics if not disabled
            if (ch('load_unread')) {
                var add_to_unread = true;
                if (ch('disable_topics')) {
                    if (isDisabled(topic_id)) {
                        add_to_unread = false;
                        cells.css('opacity', '0.35');
                    }
                    cells.eq(3).append(' <a class="greaseyeti_nounderline_link dtopic ' + topic_id
                        + '" title="Disable topic" style="color: #33a">D</a>');
                }
                if (add_to_unread && cells[2].getElementsByTagName('a').length != 0) {
                    unread_topics.push(cells[2].getElementsByTagName('a')[0].href);
                }
            }
            var topic_title = $(this).children().eq(0).find('a').eq(0).text();
            if (topic_title.length != 0) {
                if (isKWordIgnorated(topic_title, 'topics')) {
                    cells[0].parentNode.style.display = 'none';
                }
            }
            // Check if this is from a highlighted/ignorated user
            var topic_creator = $(this).children().eq(1).find('a').text();
            if (topic_creator.length != 0) { // Skip Anon topics
                var tc_id = $(this).children().eq(1).html();
                tc_id = tc_id.substring(tc_id.indexOf('r=') + 2, tc_id.indexOf('\">'));
                if (isIgnorated(topic_creator, tc_id)) {
                    cells[0].parentNode.style.display = 'none';
                } else {
                    var highlight_color = getHighlightColor(topic_creator, false);
                    if (highlight_color !== false) {
                        cells.css('background-color', highlight_color);
                    }
                }
            }
            // Post updates into new windows
            if (ch('update_new_window')) {
                cells.eq('2').find('a').attr('target', '_blank');
            }
        });
    // Add event listeners
    $('.rtopic').click(removeTopic);
    $('.htopic').click(highlightTopic);
    $('.dtopic').click(disableTopic);
    // Update unread link
    updateUnreadTopics();
}
// Load the next page of topics
function loadMoreTopics() {
    // Remove the event listener and create the loading... row.
    document.removeEventListener('scroll', topicListScrollCheck, true);
    $('.grid')
        .append('<tr><td colspan="4" id="gy_loading_row" style="text-align: center; padding: 5px 0; font-size: 11px;">Loading next page... <img src="'
            + load_gif + '" /></td></tr>');
    // AJAX request for the next page. Add each row to the table and reprocess the page. Bring back the event listener
    // at the end and identify the next page.
    $.get(next_page, function (data) {
        var newPage = document.createElement('div');
        newPage.innerHTML = data;
        var newRows = newPage.getElementsByTagName('tr');
        while (newRows.length > 0) {
            $('.grid').append(newRows[0]);
        }
        $('#gy_loading_row').remove();
        processTopicList();
        var next_page_link = $(newPage)
            .find('div.infobar a:contains("Next Page")');
        if (next_page_link.length == 1) {
            next_page = next_page_link.attr('href');
            document.addEventListener('scroll', topicListScrollCheck, true);
        }
        applyStyling();
    });
}
// Detect scrolling on topic list
function topicListScrollCheck() {
    if (getScrollDistanceToBottom() < 10) {
        loadMoreTopics();
    }
}
// Creates the link for unread topics.
function createLoadUnreadLink() {
    if (!ch('load_unread') || (ch('posted_only') && url.indexOf('Posted') == -1)) {
        return;
    }
    $('div.userbar')
        .append(' | <a class="greaseyeti_link" style="text-decoration: underline" id="unread_topics_link">a</a>');
}
// Updates the Unread Topics link. If there aren't any, show a placeholder. If there are, create the link and possibly
// change the page title.
function updateUnreadTopics() {
    if (!ch('load_unread') || (ch('posted_only') && url.indexOf('Posted') == -1)) {
        return;
    }
    if (ch('unread_title')) {
        var regexp = / \(\d+\)$/;
        document.title = document.title.replace(regexp, '');
    }
    var unread_topics_link = $('#unread_topics_link');
    if (unread_topics.length > 0) {
        unread_topics_link.html('Load Unread Topics (' + unread_topics.length + ')');
        unread_topics_link.css('text-decoration', 'underline');
        unread_topics_link.click(loadUnreadTopics);
        if (ch('unread_title')) {
            document.title += ' (' + unread_topics.length + ')';
        }
    } else {
        unread_topics_link.html('No Unread Topics');
        unread_topics_link.css('text-decoration', 'none');
    }
}
// When clicking the link to open unread topics, loads each one in a new window. Empties the array and updates the link.
function loadUnreadTopics() {
    for (var i = 0; i < unread_topics.length; i++) {
        window.open(unread_topics[i], '_blank');
    }
    unread_topics = [];
    updateUnreadTopics();
}
// Helper functions for testing if a topic is removed, highlighted, or disabled. Need to make sure the arrays aren't
// blank before .indexOf!
function isRemoved(topic_id) {
    return (ch('removed_topics', false) && greaseyeti.removed_topics.indexOf(topic_id) != -1);
}

function isHighlighted(topic_id) {
    return (ch('highlighted_topics', false) && greaseyeti.highlighted_topics.indexOf(topic_id) != -1);
}

function isDisabled(topic_id) {
    return (ch('disabled_topics', false) && greaseyeti.disabled_topics.indexOf(topic_id) != -1);
}
// Confirm the removal of the topic. Add it to the list and delete the row.
function removeTopic() {
    var topic_title = $(this).parent().siblings().find('a').html();
    if (confirm('Are you sure you want to remove the topic "' + topic_title + '"?')) {
        var topic_id = $(this).attr('class').replace('greaseyeti_nounderline_link rtopic ', '');
        if (!greaseyeti.hasOwnProperty('removed_topics')) {
            greaseyeti.removed_topics = [];
        }
        greaseyeti.removed_topics.push(topic_id);
        saveGreaseyeti(true);
        $(this).parent().parent().remove();
    }
}
// Toggle highlighting a topic. Add to list of highlighted topics and give background color.
function highlightTopic() {
    var topic_id = $(this).attr('class').replace('greaseyeti_nounderline_link htopic ', '');
    if (isHighlighted(topic_id)) {
        greaseyeti.highlighted_topics.splice(greaseyeti.highlighted_topics.indexOf(topic_id), 1);
        $(this).parent().parent().find('td').css('background-color', 'transparent');
    } else {
        if (!greaseyeti.hasOwnProperty('highlighted_topics')) {
            greaseyeti.highlighted_topics = [];
        }
        greaseyeti.highlighted_topics.push(topic_id);
        $(this).parent().parent().find('td').css('background', ch('highlight_color', '#5cc'));
    }
    saveGreaseyeti(true);
}
// Toggle disabling a topic. Add to list of disabled topics and decrease opacity.
// Grab unread link and remove from list. Do the opposite of this if we're enabling a topic.
function disableTopic() {
    var topic_id = $(this).attr('class').replace('greaseyeti_nounderline_link dtopic ', '');
    var cells = $(this).parent().parent().find('td');
    var unread_link = cells.eq(2).find('a');
    if (unread_link.length == 2) {
        var unread_url = unread_link.eq(0).attr('href');
    }
    if (isDisabled(topic_id)) {
        cells.css('opacity', '1.0');
        greaseyeti.disabled_topics.splice(greaseyeti.disabled_topics.indexOf(topic_id), 1);
        if (unread_link.length == 2) {
            unread_topics.push(unread_url);
        }
    } else {
        cells.css('opacity', '0.35');
        if (!greaseyeti.hasOwnProperty('disabled_topics')) {
            greaseyeti.disabled_topics = [];
        }
        greaseyeti.disabled_topics.push(topic_id);
        var unread_topic_index = unread_topics.indexOf(unread_url);
        if (unread_link.length == 2) {
            unread_topics.splice(unread_topic_index, 1);
        }
    }
    updateUnreadTopics();
    saveGreaseyeti(true);
}
//
// MESSAGE LISTS
//
// Message lists go post-by-post, so it's easier to mark the posts we've seen and avoid coming back to them.
// Don't use the .not() rule to skip the done messages because it fucks up the indexing.
function processPosts(page_number) {
    var messages = $('.message-container');
    post_count = messages.length;
    messages.each(function (i) {
        // Only let these happen on the first pass over a message
        if ($(this)
                .hasClass('greaseyeti_checked')) {
            return;
        }
        ignoratePost($(this));
        addLikeAndRepeatOptions($(this));
        numberPost($(this), page_number, i);
        markEditedPosts($(this));
        highlightPost($(this));
        identifyOmittedQuotes($(this));
        checkWordLength($(this));
        imgurLinks($(this));
        gfycatLinks($(this));
        if (chat_mode_enabled) {
            chatModePost($(this));
        }
        if (!window_has_focus && !initial_load) {
            unread_messages++;
        }
        $(this).addClass('greaseyeti_checked');
    });
    unreadMessagesInTitle();
    initial_load = false;
    applyStyling();
}

function unreadMessagesInTitle() {
    if (!ch('messages_in_title')) {
        return;
    }
    if (!window_has_focus && unread_messages != 0) {
        document.title = '(' + unread_messages + ') ' + document.title.replace(/^\(\d+\) /, '');
    } else {
        document.title = document.title.replace(/^\(\d+\) /, '');
        unread_messages = 0;
    }
}

function numberPost(message_container, page_number, i) {
    if (!ch('number_posts')) {
        return;
    }
    message_container.children('.message-top').append(' | #' + (i + 1 + 50 * (page_number - 1)));
}

function markEditedPosts(message_container) {
    if (!ch('mark_edited')) {
        return;
    }
    message_container.children('.message-top a').each(function () {
        if ($(this).text().indexOf('edit') != -1 && $(this).attr('href').indexOf('message.php') != -1) {
            $(this).css('color', ch('edited_color', 'red'));
        }
    });
}

function stealthLogout() {
    if (!ch('stealth_logout')) {
        return;
    }
    $('a[href*="endoftheinter.net/logout.php"]').click(function (e) {
        if (!window.confirm('Are you sure you want to log out of ETI?')) {
            e.preventDefault();
        }
    });
}

function highlightPost(message_container) {
    message_container.find('.message-top').each(function () {
        var message_top = $(this);
        var poster = findWhoPostedMessage(message_top.html());
        if (!anon_topic) {
            // Make sure it's not an anon topic
            if (poster.indexOf('#') != -1) {
                anon_topic = true;
            } else {
                var hcolor = getHighlightColor(poster, true);
                if (hcolor !== false) {
                    message_top.css('background-color', hcolor);
                    message_top.parent().css('border-color', hcolor);
                }
            }
        }
        if (anon_topic) {
            findMyHumanNumber();
            if (my_human_number == 0 || !ch('my_anon')) {
                return;
            }
            if ('Human #' + my_human_number == poster) {
                message_top.css('background-color', ch('my_color'));
            }
        }
    });
}

function ignoratePost(message_container) {
    message_container.find('.message-top').each(function () {
        var message_top = $(this);
        var poster = findWhoPostedMessage(message_top.html());
        var posterid = findWhoPostedUserId(message_top.html());
        if (isIgnorated(poster, posterid)) {
            $(this).parent().css('display', 'none');
        }
    });
}

function findMyHumanNumber() {
    if (my_human_number != -1) {
        return;
    }
    var human_number_link = $('.quickpost-body div:contains("You are posting as") a');
    if (human_number_link.length != 1) {
        my_human_number = 0;
        return;
    } else {
        my_human_number = human_number_link.text()
                                           .replace('Human #', '');
    }
}

function identifyOmittedQuotes(message_container) {
    if (!ch('load_omitted')) {
        return;
    }
    message_container.find('.quoted-message a:contains("quoted text omitted")')
                     .click(function () {
                         var load_url = $(this).attr('href');
                         var tparent = $(this).parent();
                         $(this).remove();
                         tparent.append('<span class="greaseyeti_loading">Loading original message... <img src="'
                             + load_gif + '" /></span>');
                         $.get(load_url, function (data) {
                             var mssg = $(data).find('td.message, div.message');
                             mssg.find('script').remove();
                             var mssg_html = mssg.html();
                             mssg_html = mssg_html.substring(0, mssg_html.indexOf('---'))
                                                  .replace(/^(\s|\<br\>)*/, '')
                                                  .replace(/(\s|\<br\>)*$/, '');
                             tparent.find('.greaseyeti_loading').remove();
                             tparent.append(mssg_html);
                         });
                         return false;
                     });
}

function checkWordLength(message_container) {
    if (!ch('word_break')) {
        return;
    }
    var max_word_length = parseInt(ch('word_length', 180));
    message_container.find('.message').contents().each(function () {
        checkTextNodes(this, max_word_length);
    });
}

function checkTextNodes(node, max_word_length) {
    if (node.nodeType == 3) {
        var v = node.nodeValue;
        var edited = false;
        var words = v.split(/\s/);
        for (var i = 0; i < words.length; i++) {
            if (words[i].length > max_word_length) {
                edited = true;
                v = v.replace(words[i], insertBreaks(words[i], max_word_length));
            }
        }
        if (edited) {
            node.nodeValue = v;
        }
    } else {
        for (var j = 0; j < node.childNodes.length; j++) {
            checkTextNodes(node.childNodes[j], max_word_length);
        }
    }
}

function insertBreaks(text, max_word_length) {
    if (text.length <= max_word_length) {
        return text;
    }
    result = text.substr(0, max_word_length) + ' ';
    var newsection = text.substr(max_word_length);
    return result + insertBreaks(newsection, max_word_length);
}

function autoexpandQuickpost() {
    if (!ch('autoexpand_quickpost')) {
        return;
    }
    $('body').addClass('quickpost-expanded');
}
// Convert Imgur links into embedded images/webms
function imgurLinks(message_container) {
    if (!ch('imgur_integration')) {
        return;
    }
    // Check if each link is a valid Imgur link
    message_container.find('.message-body a').each(function () {
        var anchor_link = $(this).attr('href');
        var imgur_regexp = /^https?:(\/\/i\.imgur\.com\/[a-zA-Z0-9]+)\.(webm|gif|gifv)$/i;
        var matches = anchor_link.match(imgur_regexp);
        // If so, separate into the "base" (which has the imgur ID) and the file ext.
        // Wrap the media in a div (so we can center it later) and create the corresponding element.
        if (matches !== null) {
            var file_extension = matches[2];
            var imgur_base = matches[1];
            $(this).wrap('<div class="greaseyeti_imgur"></div>');
            if (file_extension === 'webm' || file_extension === 'gifv') {
                $(this)
                    .before('<video loop controls><source type="video/webm" src="' + imgur_base
                        + '.webm"></source><source type="video/mp4" src="' + imgur_base
                        + '.mp4"></source></video><br>');
            } else if (file_extension === 'gif') {
                $(this).before('<img src="' + anchor_link + '"><br>');
            }
        }
    });
}
// Convert gfycat links into embedded webms
function gfycatLinks(message_container) {
    if (!ch('gfycat_integration')) {
        return;
    }
    findMaxImageWidth();
    // Check if each link is a valid gfycat link
    message_container.find('.message-body a').each(function () {
        var msg_container = $(this);
        var anchor_link = $(this).attr('href');
        var gfycat_regexp = /^https?:\/\/gfycat\.com\/([a-zA-Z0-9]+)$/i;
        var matches = anchor_link.match(gfycat_regexp);
        // If so, separate into the "base" (which has the gfycat ID)
        // Wrap the media in a div (so we can center it later) and create the corresponding element.
        if (matches !== null) {
            GM_xmlhttpRequest({
                method: 'GET', url: 'https://gfycat.com/cajax/get/' + matches[1], onload: function (responseDetails) {
                    if (responseDetails.status == 200) {
                        var dl = JSON.parse(responseDetails.responseText);
                        msg_container.wrap('<div class="greaseyeti_gfycat" style="display:inline-block; text-align:center"></div>');
                        msg_container.before('<video loop autoplay><source src="' + dl.gfyItem.webmUrl
                            + '" type="video/webm"></video><br>');
                    }
                }
            });
        }
    });
}
// Shorten a post vertically by removing the sig and removing unnecessary line breaks between adjacent elements
function chatModePost(message_container) {
    var message = message_container.find('.message').eq(0);
    message_contents = message.contents();
    // Check each node for a text one that contains the sig separator. Then remove everything after that.
    // Can't change the HTML directly because it fucks up LL images
    // Also this will halt at the first instance of the separator, so some posts might get truncated...
    var after_sig = false;
    message_contents.each(function () {
        if (after_sig || (this.nodeType == 3 && /^\n?---$/.test($(this).text()))) {
            after_sig = true;
            $(this).remove();
        }
    });
    // Remove adjacent brs
    message.find('br + br').remove();
}

function autoscroll(post_count) {
    if (!ch('autoscroll') || currently_scrolling) {
        return;
    }
    var current_y = $(document).scrollTop() + $(window).height();
    var last_post = $('.message-container').last();
    var new_y = last_post.offset().top + last_post.height();
    // If we're within the right distance of the bottom of the page, scroll it.
    if ($(document).height() < current_y + parseInt(ch('autoscroll_y'))) {
        // If chat mode is enabled, do an instant scroll. Otherwise, do a slow animation.
        if (chat_mode_enabled) {
            $('html, body').scrollTop(new_y);
        } else {
            $('html, body').stop().animate({
                scrollTop: new_y
            }, 'slow', 'swing');
        }
    }
}

function messageListScrollCheck() {
    var new_scroll = $(window).scrollTop();
    if (new_scroll < last_scroll_position) {
        currently_scrolling = true;
        prevent_scroll_timeout = window.clearTimeout();
        prevent_scroll_timeout = window.setTimeout(function () {
            currently_scrolling = false;
        }, 1750);
    }
    last_scroll_position = new_scroll;
}

function changePage(page_number, new_page_number) {
    var current_y = $(document).scrollTop() + $(window).height();
    if (page_number + 1 == new_page_number && $(document).height() < current_y + parseInt(ch('autoscroll_y'))) {
        if (document.location.href.match(/page=[0-9]+/gi)) {
            var newUrl = document.location.href.replace(/page=[0-9]+/gi, 'page=' + (
                        new_page_number)) + (chat_mode_enabled ? '&chatmode=true' : '');
        } else {
            var newUrl = document.location.href + '&page=2' + (chat_mode_enabled ? '&chatmode=true' : '');
        }
        page_change = true;
        document.location.href = newUrl;
    }
}

function preserveMessage(topic_id) {
    if (!ch('preserve_messages')) {
        return;
    }
    $('a')
        .click(function () {
            page_change = false;
            var ahref = $(this).prop('href');
            if (typeof ahref != 'undefined' && ahref.indexOf('showmessages.php?topic=' + topic_id) != -1) {
                page_change = true;
                form_submitted = true;
                greaseyeti.preserved_message_text = $('textarea[name=message]').val();
                greaseyeti.preserved_topic_id = topic_id;
                saveGreaseyeti(true);
            }
        });
}

function restoreMessage(topic_id) {
    if (!ch('preserve_messages')) {
        return;
    }
    if (ch('preserved_topic_id') != topic_id) {
        return;
    }
    var message = ch('preserved_message_text');
    if (message.length != 0) {
        $('textarea[name=message]').val(message);
    }
}

function findImages() {
    var new_images = $('.message .img-loaded').not('.greaseyeti_img');
    new_images.each(function () {
        $(this).addClass('greaseyeti_img');
        if ($(this).find('img').attr('src').indexOf('/i/t/') == -1) {
            uses_thumbnails = false;
            resizeImage($(this));
            $(this).click(function (e) {
                if (!shift_key) {
                    return;
                }
                resizeImage($(this), true);
                e.preventDefault();
            });
        } else {
            $(this).addClass('greaseyeti_img_collapsed');
        }
    });
}

function toggleImage(img) {
    var parentAnchor = img.parent();
    // If we clicked on the expanded image
    if (img.hasClass('greaseyeti_img_expanded')) {
        if (shift_key) { // Shift to show the full size
            resizeImage(img, true);
        } else { // Otherwise go back to the thumbnail
            img.hide();
            parentAnchor.find('.greaseyeti_img_collapsed')
                        .show();
        }
        // If we clicked on the collapsed image
    } else {
        img.hide();
        // If we've already loaded the image, just show it.
        var expanded = parentAnchor.find('.greaseyeti_img_expanded');
        if (expanded.length > 0) {
            expanded.show();
            resizeImage(expanded, shift_key);
            // Otherwise, find the URL for the full image and display it inline.
        } else {
            img.after('<span class="greaseyeti_img_expanded"><img src="' + img.parent().attr('imgsrc') + '" /></a>');
            parentAnchor.find('.greaseyeti_img_expanded img').one('load', function () {
                resizeImage($(this).parent(), shift_key);
            });
        }
    }
}

function expandAllImages() {
    var newtext;
    if ($(this).text() == 'Expand All Images') {
        newtext = 'Collapse All Images';
        $('.greaseyeti_img_collapsed:visible').click();
    } else {
        $('.greaseyeti_img_expanded:visible').click();
        newtext = 'Expand All Images';
    }
    $(this).text(newtext);
}
// Check if we need to resize an image, and if so, do it.
function resizeImage(img_span, show_full_size) {
    if (!ch('resize_images')) {
        return;
    }
    img_span.css({
        'width': 'auto', 'height': 'auto'
    });
    var img = img_span.find('img');
    findMaxImageWidth();
    var old_w = img.width();
    if (old_w > max_img_size && !show_full_size) {
        var new_h = Math.round(img.height() * max_img_size / old_w);
        img.css('width', max_img_size + 'px');
        img.css('height', new_h + 'px');
    } else {
        img.css('width', 'auto');
        img.css('height', 'auto');
    }
}

function findMaxImageWidth() {
    max_img_size = Math.min(Math.min($(window).width(), $('div.body').width()) - 43 - $('.userpic')
                .eq(0)
                .width(), $('.message').eq(0).width()) - 5;
}

function openSpoilersOption() {
    if (!ch('open_spoilers')) {
        return;
    }
    $('.userbar').append(' | <a id="open_spoilers" class="greaseyeti_link">Open All Spoilers</a>');
    $('#open_spoilers').click(function () {
        $('.spoiler_on_close b').click();
    });
}

function chatModeOption() {
    if (!ch('chat_mode')) {
        return;
    }
    // Add item to userbar
    $('.userbar').append(' | <a id="chat_mode" class="greaseyeti_link">Enable Chat Mode</a>');
    // Toggler
    $('#chat_mode').click(function () {
        if (chat_mode_enabled) {
            if (gup('chatmode')) {
                document.location.href = document.location.href.replace('&chatmode=true', '');
            } else {
                document.location.reload(true);
            }
        } else {
            enableChatMode();
            $(this)
                .text('Disable Chat Mode');
        }
    });
    if (gup('chatmode')) {
        enableChatMode();
    }
}

function enableChatMode() {
    chat_mode_enabled = true;
    // Add CSS rules
    $('body').before('<style type="text/css">	'
        + 'body.chat_mode td.userpic * {height : 45px;width : auto;}'
        + 'body.chat_mode td.userpic center {display : none}'
        + 'body.chat_mode div.body> small {display : none}'
        + 'body.chat_mode.message div + br {display : none}'
        + 'body.chat_mode div.body> br {display : none}'
        + 'body.chat_mode form.quickpost {height : 200px;}'
        + 'body.chat_mode form.quickpost textarea {height : 100px;}'
    );
    $('.message-container').each(function () {
        chatModePost($(this));
    });
    $('body').addClass('chat_mode');
}

function filterMeOption() {
    if (!ch('filter_me')) {
        return;
    }
    var filter_me_url = '//boards.endoftheinter.net/showmessages.php?topic=' + topic_id + '&u=';
    var use_href = true;
    if (anon_topic) {
        findMyHumanNumber();
        if (my_human_number == 0) {
            use_href = false;
        } else {
            filter_me_url += '-' + my_human_number;
        }
    } else {
        filter_me_url += getMyUserId();
    }
    if (use_href) {
        $('.userbar').append(' | <a id="filter_me" class="greaseyeti_link" href="' + filter_me_url + '">Filter Me</a>');
    } else {
        $('.userbar').append(' | <a id="filter_me" class="greaseyeti_link">Filter Me</a>');
        $('#filter_me').click(function () {
            alert('You have not posted in this topic yet!');
        });
    }
}

function addLikeAndRepeatOptions(message_container) {
    if ((!ch('like_posts') && !ch('repeat_posts')) || document.location.href.indexOf('archives.endoftheinter') != -1) {
        return;
    }
    if (ch('like_posts')) {
        message_container.children('.message-top').append(' | <a class="greaseyeti_link like_post">Like</a>');
    }
    if (ch('repeat_posts')) {
        message_container.children('.message-top').append(' | <a class="greaseyeti_link repeat_post">Repeat</a>');
    }
}
$(document).on('click', '.like_post, .repeat_post', function () {
    // "Click" the quote link
    $(this).parent().find('a').filter(function () {
        if ($(this).text() == 'Quote') {
            $(this).click();
        }
    });
    // If we're liking it, we have to do a bit more...
    var this_was_a_like = ($(this).text() == 'Like');
    if (this_was_a_like) {
        // Extract usernames of the current user and of the poster in an [Anonymous]-friendly way.
        var poster_username = findWhoPostedMessage($(this).parent().html());
        var my_username = getMyUsername();
        if (poster_username.indexOf('#') != -1) {
            my_username = 'This human';
        }
        // Create the post text
        var post_text = '<img src="http://i4.endoftheinter.net/i/n/f818de60196ad15c888b7f2140a77744/like.png" /> '
            + my_username + ' likes ' + poster_username + '\'s post';
        // Quote the original and add the text.
        var textarea = $('.quickpost-body textarea').val();
        if (textarea.indexOf('---') == -1) {
            textarea += post_text;
        } else {
            textarea = textarea.replace(/(\-\-\-\n(.+)(\n.+)?)$/g, post_text + '\n$1');
        }
        $('.quickpost-body textarea').val(textarea);
    }
    // Submit the post, if that option is enabled.
    if (ch('like_automatic_post') || !this_was_a_like) {
        $('.quickpost-body input[value="Post Message"]').click();
    }
});

function populateHighlightedUsers() {
    // First add yourself
    var html = '<tr><td>' + getMyUsername()
        + '</td><td><input type="text" id="my_color" value="' + ch('my_color', '#c3c4c9')
        + '" /></td><td><input type="checkbox" id="my_posts"' + settingCheck('my_posts')
        + '" /></td><td><input type="checkbox" id="my_topics"' + settingCheck('my_topics')
        + '" /></td><td><input type="checkbox" id="my_anon"' + settingCheck('my_anon')
        + '" /></td><td>&nbsp;</td></tr>';
    // Then list everyone you've added
    var users = ch('highlighted_users', null);
    if (users != null) {
        for (var i = 0; i < users.length; i++) {
            html += '<tr class="huser"><td><input type="text" class="highlight_username" value="' + users[i].username
                + '" /></td><td><input type="text" class="highlight_color" value="' + users[i].color
                + '" /></td><td><input type="checkbox" class="highlight_posts"' + checkForHighlight(users[i], 'posts')
                + ' /></td><td><input type="checkbox" class="highlight_topics"' + checkForHighlight(users[i], 'topics')
                + ' /></td><td>&nbsp;</td><td class="highlight_remove"><a style="cursor: pointer;color: #a33;">✖</a></td></tr>';
        }
    }
    return html;
}

function populateIgnoratedUsers() {
    var html = '';
    var users = ch('ignorated_users', null);
    if (users != null) {
        for (var i = 0; i < users.length; i++) {
            html += '<tr class="iguser"><td><input type="text" class="ignorate_username" value="' + users[i].username
                + '" /></td><td><input type="text" class="ignorate_userid" value="' + users[i].userid
                + '" /></td><td class="ignorate_remove"><a style="cursor: pointer;color: #a33;">✖</a></td></tr>';
        }
    }
    return html;
}

function populateIgnoratedKWords() {
    var html = '';
    var words = ch('ignorated_kwords', null);
    if (words != null) {
        for (var i = 0; i < words.length; i++) {
            html += '<tr class="igkword"><td><input type="text" class="ignorate_kword" value="' + words[i].word
                + '" /></td><td><input type="checkbox" class="kw_ignorate_regex"'
                + checkforIgnorated(words[i], 'is_regex')
                + '" /></td><td><input type="checkbox" class="kw_ignorate_posts"' + checkforIgnorated(words[i], 'posts')
                + ' /></td><td><input type="checkbox" class="kw_ignorate_topics"'
                + checkforIgnorated(words[i], 'topics')
                + ' /></td><td class="ignorate_remove"><a style="cursor: pointer;color: #a33;">✖</a></td></tr>';
        }
    }
    return html;
}

function checkForHighlight(user, where) {
    return (user.hasOwnProperty(where) && user[where] === true ? 'checked="checked"' : '');
}

function checkforIgnorated(kword, where) {
    return (kword.hasOwnProperty(where) && kword[where] === true ? 'checked="checked"' : '');
}

function findWhoPostedMessage(message_top_html) {
    var regexp1 = /^(.*)From:(\<\/b\>)? (\<a href\="([^"]+)"\>)?/i;
    var regexp2 = /(\<\/a\>)?( \(.+\))? \| (.+)$/i;
    var poster_username = message_top_html.replace(regexp1, '').replace(regexp2, '');
    return poster_username;
}

function findWhoPostedUserId(message_top_html) {
    var regexp1 = /^(.*)From:(\<\/b\>)? (\<a href\="([^\d]+))?/i;
    var regexp2 = /(\"\>[a-z\d ]+)(\<\/a\>)?( \(.+\))? \| (.+)$/i;
    var posted_userid = message_top_html.replace(regexp1, '').replace(regexp2, '');
    return posted_userid;
}

function isIgnorated(user, userid) {
    var users = ch('ignorated_users', []);
    for (var i = 0; i < users.length; i++) {
        if (users[i].username === user || users[i].userid === userid) {
            // update userid to the current poster id because it was blank
            if (users[i].userid.length === 0) {
                users[i].userid = userid;
                saveGreaseyeti(false);
            }
            // update username because the userid matched when username didn't (user changed their username)
            if (users[i].username !== user) {
                console.log('Updating username to match userid for ' + user);
                users[i].username = user;
                saveGreaseyeti(false);
            }
            users[i].username = user;
            return true;
        }
    }
    return false;
}

function isKWordIgnorated(s, where) {
    var words = ch('ignorated_kwords', []);
    for (var i = 0; i < words.length; i++) {
        var kword = words[i];
        if (where === 'topics' && kword.topics || where === 'posts' && kword.posts) {
            if (kword.is_regex && s.match(kword.word)) {
                return true;
            } else if (s.toUpperCase().indexOf(kword.word.toUpperCase()) >= 0) {
                return true;
            }
        }
    }
    return false;
}
