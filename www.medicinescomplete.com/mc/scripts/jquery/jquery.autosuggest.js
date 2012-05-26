/*
 * Adapted from:
 * AutoSuggest
 * Copyright 2009-2010 Drew Wilson
 * www.drewwilson.com
 * code.drewwilson.com/entry/autosuggest-jquery-plugin
 *
 * Version 1.4   -   Updated: Mar. 23, 2010
 *
 * This Plug-In will auto-complete or auto-suggest completed search queries
 * for you as you type. It supports keybord navigation (UP + DOWN + RETURN), 
 * as well as multiple AutoSuggest fields on the same page.
 *
 * Inspied by the Autocomplete plugin by: Jšrn Zaefferer
 * and the Facelist plugin by: Ian Tearle (iantearle.com)
 *
 * This AutoSuggest jQuery plug-in is dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

(function ($) {
    $.fn.autoSuggest = function (req_string, options) {
        var defaults = {
            asHtmlID: false,
            control: null,
            startText: "",
            queryParam: "q",
            extraParams: "",
            minChars: 1,
            cookieName: "as",
            enabledText: "Suggest is <em>on</em>",
            disabledText: "Suggest is <em>off</em>",
            keyDelay: 200,
            neverSubmit: false,
            start: function () { },
            beforeRetrieve: function (string) { return string; },
            retrieveComplete: function (data) { return data; },
            resultClick: function (data) { },
            resultsComplete: function () { }
        };

        var history = {};
        var opts = $.extend(defaults, options);

        var d_count = 0;
        if (typeof req_string == "string") {
            return this.each(function (x) {
                if (!opts.asHtmlID) {
                    x = x + "" + Math.floor(Math.random() * 100); //this ensures there will be unique IDs on the page if autoSuggest() is called multiple times
                    var x_id = "as-input-" + x;
                } else {
                    x = opts.asHtmlID;
                    var x_id = x;
                }
                opts.start.call(this);
                var input = $(this);
                input.attr("autocomplete", "off").addClass("as-input").attr("id", x_id);
                if (input.val().length == 0)
                    input.val(opts.startText);

                var input_focus = false;

                // Setup basic elements and render them to the DOM
                var results_holder = $('<div class="as-results" id="as-results-' + x + '"></div>').hide();
                var results_ul = $('<ul class="as-list"></ul>');
                var shadow = $('<input type="text" class="as-shadow" id="as-values-' + x + '" />');
                shadow.insertBefore(input);

                /* feature removed
                var resetter = $('<strong class="as-x">&#xD7;</strong>');
                resetter.click(function () {
                results_holder.hide();
                shadow.val("");
                input.val("").focus();
                });
                resetter.insertAfter(input);
                results_holder.insertAfter(resetter);
                */
                results_holder.insertAfter(input);
                var cookieName = opts.cookieName;
                var cookie = $.cookie(cookieName);
                if (typeof cookie == 'undefined' ||
                                    cookie != 'true' &&
                                    cookie != 'false') {
                    isEnabled = true;
                    $.cookie(cookieName, true, { path: '/'});
                } else {
                    isEnabled = cookie == 'true';
                }
                if (typeof opts.control == "string") {
                    var control = $(opts.control);
                    if (control) {
                        var id = "as-checkbox-" + x;
                        var checkbox = $('<input id="' + id + '" type="checkbox" class="as-checkbox" />');
                        checkbox.insertAfter(control);
                        var enabledMsg = $('<label for="' + id + '" class="as-msg">' + opts.enabledText + '</span>');
                        var disabledMsg = $('<label for="' + id + '" class="as-msg">' + opts.disabledText + '</span>');
                        var checkMsg = null;
                        if (isEnabled) {
                            checkbox.attr("checked", "checked");
                            checkMsg = enabledMsg;
                        } else
                            checkMsg = disabledMsg;
                        checkMsg.insertAfter(checkbox);

                        checkbox.click(function () {
                            isEnabled = isEnabled == false;
                            if (isEnabled)
                                disabledMsg.replaceWith(enabledMsg);
                            else
                                enabledMsg.replaceWith(disabledMsg);
                            $.cookie(cookieName, isEnabled, {path: '/'} );
                        });
                    }
                }

                var timeout = null;
                var prev = "";
                var totalSelections = 0;
                var tab_press = false;

                // Handle input field events
                input.focus(function () {
                    if ($(this).val() == opts.startText) {
                        $(this).val("");
                    } else if (input_focus) {
                        if (isEnabled == true &&
                                                   $(this).val() != "") {
                            results_holder.css("width", input.outerWidth());
                            results_holder.show();
                            shadow.css('color', '#aaa');
                        }
                    }
                    input_focus = true;
                    return true;
                }).blur(function () {
                    if (input_focus) {
                        results_holder.hide();
                    }
                    shadow.css('color', shadow.css('background-color'));
                }).keydown(function (e) {
                    if (isEnabled == false)
                        return;

                    // track last key pressed
                    lastKeyPressCode = e.keyCode;
                    first_focus = false;
                    switch (e.keyCode) {
                        case 38: // up
                            e.preventDefault();
                            moveSelection(1);
                            break;
                        case 40: // down
                            e.preventDefault();
                            moveSelection(0);
                            break;
                        case 8:  // delete
                            if (input.val().length <= 1) {
                                results_holder.hide();
                                shadow.val("");
                                prev = "";
                            } else {
                                if (timeout) { clearTimeout(timeout); }
                                timeout = setTimeout(function () { keyChange(); }, opts.keyDelay);
                            }
                            break;
                        case 9: // tab 
                            tab_press = true;
                            results_holder.hide();
                            e.preventDefault();
                            var val = shadow.val();
                            input.val(val);
                            break;

                        case 13: // return
                            tab_press = false;
                            results_holder.hide();
                            shadow.val("");
                            break;
                        case 27: // escape
                            tab_press = false;
                            results_holder.hide();
                            shadow.val("");
                            break;
                        default:
                            if (timeout) { clearTimeout(timeout); }
                            timeout = setTimeout(function () { keyChange(); }, opts.keyDelay);
                            break;
                    }
                });

                function keyChange() {
                    if (isEnabled == false)
                        return;

                    // ignore if the following keys are pressed: [del] [shift] [capslock]
                    if (lastKeyPressCode == 46 || (lastKeyPressCode > 8 && lastKeyPressCode < 32)) { return results_holder.hide(); }
                    var val = input.val();
                    var string = input.val().replace(/[\\]+|[\/]+/g, "");
                    if (string == prev) return;
                    // if the previous string gave no
                    // results, neither will this
                    if (string.search(prev) == 0 &&
                                            history[prev] &&
					    history[prev].d_count == 0) {
                        return results_holder.hide();
                    }

                    prev = string;
                    if (string.length >= opts.minChars) {
                        var limit = "";
                        if (opts.beforeRetrieve) {
                            string = opts.beforeRetrieve.call(this, string);
                        }
                        if (history[string]) {
                            d_count = history[string].d_count;
                            processData(history[string].data);
                        } else {
                            $.getJSON(req_string + "?" + opts.queryParam + "=" + encodeURIComponent(string) + limit + opts.extraParams, function (data) {
                                d_count = 0;
                                var new_data = opts.retrieveComplete.call(this, data);
                                for (k in new_data) if (new_data.hasOwnProperty(k)) d_count++;
                                history[string] = { data: new_data, d_count: d_count };
                                var current = input.val().replace(/[\\]+|[\/]+/g, "");
                                // Cancel if input changed
                                if (string == current)
                                    processData(new_data);
                                else if (history[current]) {
                                    d_count = history[current].d_count;
                                    processData(history[current].data);
                                }

                            });
                        }
                    } else {
                        results_holder.hide();
                    }
                }
                var num_count = 0;
                function processData(data) {
                    var matchCount = 0;
                    results_holder.html(results_ul.html("")).hide();
                    for (var i = 0; i < d_count; i++) {
                        var num = i;
                        num_count++;
                        var str = data[num];
                        if (i == 0) {
                            var right = input.val() + str;
                            shadow.val(right);
                        }
                        var formatted = $('<li class="as-result-item" id="as-result-item-' + num + '"></li>').click(function () {
                            var raw_data = $(this).data("data");
                            var number = raw_data.num;
                            if (!tab_press) {
                                var data = raw_data.attributes;
                                input.val(input.val() + data).focus();
                                shadow.val(input.val());
                                opts.resultClick.call(this, raw_data);
                                results_holder.hide();
                                input_focus = false;
                                $("#searchForm").submit();
                            }
                            tab_press = false;
                        }).mousedown(function () { input_focus = false; }).mouseover(function () {
                            $("li", results_ul).removeClass("active");
                            $(this).addClass("active");
                        }).data("data", { attributes: data[num], num: num_count });
                        formatted = formatted.html(input.val() + "<em>" + data[num] + "</em>");
                        results_ul.append(formatted);
                        delete this_data;
                        matchCount++;
                    }
                    // hide the results_ul on no matches
                    results_ul.css('display', matchCount <= 0 ? 'none' : 'block');
                    if (matchCount <= 0) {
                        shadow.val("");
                        results_ul.css('none');
                    } else {
                        results_ul.css('display', 'block');
                    }
                    results_holder.css("width", input.outerWidth());
                    results_holder.show();
                    opts.resultsComplete.call(this);
                }

                function moveSelection(direction) {
                    if ($(":visible", results_holder).length > 0) {
                        var lis = $("li", results_holder);
                        // 0 = down, 1 = up
                        if (direction == 0) {
                            var start = lis.eq(0);
                        } else {
                            var start = lis.filter(":last");
                        }
                        var active = $("li.active:first", results_holder);
                        if (active.length > 0) {
                            if (direction == 0) {
                                start = active.next();
                            } else {
                                start = active.prev();
                            }
                        }

                        lis.removeClass("active");
                        start.addClass("active");
                        active = $("li.active:first", results_holder);
                        if (active.length == 0) {
                            moveSelection(direction);
                            return;
                        }

                        var val = active.text();
                        input.val(val);
                        shadow.val(val);
                    }
                }

            });
        }
    }
})(jQuery);  	
