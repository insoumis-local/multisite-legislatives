jQuery(document).ready(function($){


    // FORM tab
    var $body = $('body');
    $body.on('click', '.rtec_require_checkbox', function (event) {
        if ($(event.target).is(':checked')) {
            $(event.target).closest('.rtec-checkbox-row').find('.rtec_include_checkbox').prop( "checked", true );
        }
    });

    $body.on('click', '.rtec_include_checkbox', function (event) {
        if (!$(event.target).is(':checked')) {
            $(event.target).closest('.rtec-checkbox-row').find('.rtec_require_checkbox').prop( "checked", false );
        }
    });

    var $rtecLimitRegistrations = $('#rtec_limit_registrations');

    function rtecCheckLimitOptions() {
        $('.rtec_attendance_message_type').each(function(){
            if ($(this).is(':checked')) {
                rtecToggleLimitOptions($(this).val());
            }
        });
    }
    rtecCheckLimitOptions();
    $rtecLimitRegistrations.change(function(){
        rtecCheckLimitOptions();
    });


    function rtecToggleLimitOptions(val) {
        if (val === 'down' && !$rtecLimitRegistrations.is(':checked')) {
            $rtecLimitRegistrations.closest('tr').find('td')
                .css('border','1px solid #ff3300')
                .css('background', '#ffebe6')
                .append('<p class="rtec-attendance-limit-error" style="color: #ff3300;">This option must be checked to have the "spots remaining" message work properly</p>');
        } else {
            $rtecLimitRegistrations.closest('tr').find('td')
                .css('border','none')
                .css('background', 'none')
                .find('.rtec-attendance-limit-error').remove();
        }
    }

    var $rtecAttendanceMessageType = $('.rtec_attendance_message_type');
    function rtecToggleMessageTypeOptions(val) {
        if ( val === 'down' ) {
            $('#rtec-message-text-wrapper-up').css('opacity', '.7').find('input').prop('disabled', 'true');
            $('#rtec-message-text-wrapper-down').css('opacity', '1').find('input').removeProp('disabled');
        } else {
            $('#rtec-message-text-wrapper-up').css('opacity', '1').find('input').removeProp('disabled');
            $('#rtec-message-text-wrapper-down').css('opacity', '.7').find('input').prop('disabled', 'true');
        }
    }
    $rtecAttendanceMessageType.change(function(){
        rtecToggleMessageTypeOptions($(this).val());
        rtecCheckLimitOptions();
    });
    $rtecAttendanceMessageType.each(function(){
        if ($(this).is(':checked')) {
            rtecToggleMessageTypeOptions($(this).val());
        }
    });

    function rtecUpdateCustomNames() {
        var names = [];
        $('.rtec-custom-field').each(function() {
            names.push($(this).attr('data-name'));
        });

        $('#rtec_custom_field_names').val(names.join(','));
    }


    $('.rtec-add-field').click(function(event) {
        event.preventDefault();

        var rtecFieldIndex = 1;
        while($('#rtec-custom-field-'+rtecFieldIndex).length) {
            rtecFieldIndex++;
        }
        var customFieldID = rtecFieldIndex;

        $(this).before(
            '<div id="rtec-custom-field-'+customFieldID+'" class="rtec-field-options-wrapper rtec-custom-field" data-name="custom'+customFieldID+'">' +
                '<a href="JavaScript:void(0);" class="rtec-custom-field-remove">Remove X</a>' +
                '<h4>Custom Field '+customFieldID+'</h4> ' +
                '<p>' +
                    '<label>Label:</label><input type="text" name="rtec_options[custom'+customFieldID+'_label]" value="Custom '+customFieldID+'" class="large-text">' +
                '</p>' +
                '<p class="rtec-checkbox-row">' +
                    '<input type="checkbox" class="rtec_include_checkbox" name="rtec_options[custom'+customFieldID+'_show]" checked="checked">' +
                    '<label>include</label>' +

                    '<input type="checkbox" class="rtec_require_checkbox" name="rtec_options[custom'+customFieldID+'_require]">' +
                    '<label>require</label>' +
                '</p>' +
                '<p>' +
                    '<label>Error Message:</label>' +
                    '<input type="text" name="rtec_options[custom'+customFieldID+'_error]" value="Error" class="large-text rtec-other-input">' +
                '</p>' +
            '</div>'
        );
        rtecUpdateCustomNames();
    });

    $body.on('click', '.rtec-custom-field-remove', function (event) {
        $(event.target).closest('.rtec-field-options-wrapper').remove();
        rtecUpdateCustomNames();
    });

    // color picker
    var $rtecColorpicker = $('.rtec-colorpicker');

    if ($rtecColorpicker.length > 0){
        $rtecColorpicker.wpColorPicker();
    }

    // EMAIL Tab
    var $rtecNotMessageTr = $('.rtec-notification-message-tr');

    function toggleCustomNotificationTextArea() {
        if ($(this).is(':checked')) {
            $rtecNotMessageTr.fadeIn();
        } else {
            $rtecNotMessageTr.fadeOut();
        }
    }
    toggleCustomNotificationTextArea.apply($('#rtec_use_custom_notification'));

    $('#rtec_use_custom_notification').click(function() {
        toggleCustomNotificationTextArea.apply($(this));
    });

    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };

    var $rtecConfirmationTextarea = $('.confirmation_message_textarea'),
        typingTimer,
        doneTypingInterval = 1500;
    function updateText() {
        $('.confirmation_message_textarea').each( function() {
            var confirmationMessage = $(this).val();
            confirmationMessage = confirmationMessage.replaceAll('{venue}', 'Secret Headquarters');
            confirmationMessage = confirmationMessage.replaceAll('{event-title}', 'Secret Meeting');
            confirmationMessage = confirmationMessage.replaceAll('{venue-address}', '123 1st Street');
            confirmationMessage = confirmationMessage.replaceAll('{venue-city}', 'Miami');
            confirmationMessage = confirmationMessage.replaceAll('{venue-state}', 'Florida');
            confirmationMessage = confirmationMessage.replaceAll('{venue-zip}', '55555');
            confirmationMessage = confirmationMessage.replaceAll('{event-date}', 'July 3');
            confirmationMessage = confirmationMessage.replaceAll('{first}', 'James');
            confirmationMessage = confirmationMessage.replaceAll('{last}', 'Bond');
            confirmationMessage = confirmationMessage.replaceAll('{email}', 'Bond007@ohmss.com');
            confirmationMessage = confirmationMessage.replaceAll('{phone}', '(007) 555-5555');
            confirmationMessage = confirmationMessage.replaceAll('{other}', 'Shaken not Stirred');
            confirmationMessage = confirmationMessage.replaceAll('{ical-url}', 'http://example.com/event/secret-meeting/?ical=1');
            confirmationMessage = confirmationMessage.replaceAll('{nl}', "\n");
            $(this).closest('tr').find('.rtec_js_preview').find('pre').text(confirmationMessage);
        });

    }
    if ( $rtecConfirmationTextarea.length){
        updateText();
    }
    $rtecConfirmationTextarea.keyup(function(){
        clearTimeout(typingTimer);
        typingTimer = setTimeout(updateText, doneTypingInterval);
    });

    // Tooltip
    $('.rtec-tooltip').hide();
    $('.rtec-tooltip-link').click( function() {
        if ($(this).next('.rtec-tooltip').is(':visible')) {
            $(this).next('.rtec-tooltip').slideUp();
        } else {
            $(this).next('.rtec-tooltip').slideDown();
        }
    });

    // REGISTRATIONS overview tab
    $('.rtec-single-event:nth-child(2n)').css('float', 'right').after('<div class="clear"></div>');
    $('.rtec-hidden-options').hide();

    var $rtecOptionsHandle = $('.rtec-event-options .handlediv');

    $rtecOptionsHandle.click(function() {
        var $rtecEventOptions = $(this).closest('.rtec-event-options')
        $rtecEventOptions.next().slideToggle();
        if ($rtecEventOptions.hasClass('open')) {
            $rtecEventOptions.addClass('closed').removeClass('open');
        } else {
            $rtecEventOptions.addClass('open').removeClass('closed');
        }
    });

    function rtecDisabledToggle($wrapEl) {
        var $disableReg = $wrapEl.find('input[name="_RTECregistrationsDisabled"]'),
            $limitReg = $wrapEl.find('input[name="_RTEClimitRegistrations"]'),
            $maxReg = $wrapEl.find('input[name="_RTECmaxRegistrations"]'),
            $deadlineType = $wrapEl.find('input[name="_RTECdeadlineType"]');

        if ($disableReg.is(':checked')) {
            $limitReg.attr('disabled','true');
            $maxReg.attr('disabled','true');
            $deadlineType.attr('disabled','true');
        } else {
            $limitReg.removeAttr('disabled').closest('.rtec-fade').removeClass('rtec-fade');
            $deadlineType.removeAttr('disabled').closest('.rtec-fade').removeClass('rtec-fade');
            if ($limitReg.is(':checked')) {
                $maxReg.removeAttr('disabled').closest('.rtec-fade').removeClass('rtec-fade');
            } else {
                $maxReg.attr('disabled','true');
            }
        }
    }

    $('.rtec-eventtable .rtec-hidden-option-wrap input').on('change', function() {
        rtecDisabledToggle($(this).closest('.rtec-eventtable'));
    });
    $('.rtec-hidden-options .rtec-hidden-option-wrap input').on('change', function() {
        rtecDisabledToggle($(this).closest('.rtec-hidden-options'));
    });

    $('.rtec-update-event-options').click(function(event) {
        event.preventDefault();
        $(this).after('<div class="rtec-table-changing spinner is-active"></div>')
            .attr('disabled', true);
        $(this).closest('.rtec-hidden-options').addClass('rtec-fade');

        var $targetForm = $(this).closest('.rtec-event-options-form'),
            eventOptionsData = $targetForm.serializeArray(),
            submitData = {
                action: 'rtec_update_event_options',
                event_options_data: eventOptionsData,
                rtec_nonce : rtecAdminScript.rtec_nonce
            },
            successFunc = function (data) {
                // remove spinner
                $targetForm.find('.rtec-table-changing').remove();
                $targetForm.find('.rtec-update-event-options').removeAttr('disabled');
                $targetForm.closest('.rtec-hidden-options').removeClass('rtec-fade');
                $targetForm.closest('.rtec-single-event').find('.rtec-reg-info p').text(data);
            };
        rtecRegistrationAjax(submitData,successFunc);
    });


    // REGISTRATION single tab
    // set table width to a minimum in case of a lot of fields
    $('.rtec-single').css('min-width', $('.rtec-single table th').length*125);

    function rtecRegistrationAjax(submitData,successFunc) {
        $.ajax({
            url: rtecAdminScript.ajax_url,
            type: 'post',
            data: submitData,
            success: successFunc
        });
    }

    $('.rtec-delete-registration').on('click', function() {
        var idsToRemove = [];
        $('.rtec-registration-select').each(function() {
            if ($(this).is(':checked')) {
                idsToRemove.push($(this).val());
                $(this).closest('.rtec-reg-row').addClass('rtec-being-removed');
            }
        });
        // if registrations_to_be_deleted is not empty
        if (idsToRemove.length) {
            // give a warning to the user that this cannot be undone
            if (confirm(idsToRemove.length + ' registrations to be deleted. This cannot be undone.')) {
                // start spinner to show user that request is processing
                $('.rtec-single table tbody')
                    .after('<div class="rtec-table-changing spinner is-active"></div>')
                    .fadeTo("slow", .2);

                var submitData = {
                    action: 'rtec_delete_registrations',
                    registrations_to_be_deleted: idsToRemove,
                    rtec_event_id: $('.rtec-single-event').attr('data-rtec-event-id'),
                    rtec_nonce : rtecAdminScript.rtec_nonce
                },
                successFunc = function (data) {
                    // remove deleted entries
                    $('.rtec-being-removed').each(function () {
                        $(this).remove();
                    });
                    // remove spinner
                    $('.rtec-table-changing').remove();
                    $('.rtec-single table tbody').fadeTo("fast", 1);
                    idsToRemove = [];
                    $('.rtec-num-registered-text').text(parseInt(data));
                };
                rtecRegistrationAjax(submitData,successFunc);

            } else {
                idsToRemove = [];
                $('.rtec-being-removed').each(function() {
                    $(this).removeClass('rtec-being-removed');
                });
            } // if user confirms delete registrations
        } // if registrations to be deleted is not empty
    }); // delete submit click

    $('.rtec-edit-registration').click( function() {
        var editCount = 0;

        if (! $('.rtec-submit-edit').length) {
            $('.rtec-registration-select').each(function() {
                if ($(this).is(':checked') && editCount < 1) {
                    var $closestRegRow = $(this).closest('.rtec-reg-row'),
                        dateStr = $closestRegRow.find('.rtec-reg-date').text(),
                        date = $closestRegRow.find('.rtec-reg-date').attr('data-rtec-submit'),
                        lastName = $closestRegRow.find('.rtec-reg-last').text().replace("'", '`').replace(/\\/g, ""),
                        firstName = $closestRegRow.find('.rtec-reg-first').text().replace("'", '`').replace(/\\/g, ""),
                        email = $closestRegRow.find('.rtec-reg-email').text(),
                        phone = $closestRegRow.find('.rtec-reg-phone').text(),
                        other = $closestRegRow.find('.rtec-reg-other').text().replace("'", '`').replace(/\\/g, ""),
                        custom = [];

                    editCount = 1;

                    if (! $('.rtec-submit-edit').length) {
                        $closestRegRow.find('.rtec-reg-date').html('<button data-rtec-val="'+dateStr+'" data-rtec-submit="'+date+'" class="button-primary rtec-submit-edit">Submit Edit</button>');
                    }

                    $closestRegRow.find('.rtec-reg-last').html('<input type="text" name="last" id="rtec-last" data-rtec-val="'+lastName+'" value="'+lastName+'" />');
                    $closestRegRow.find('.rtec-reg-first').html('<input type="text" name="first" id="rtec-first" data-rtec-val="'+firstName+'" value="'+firstName+'" />');
                    $closestRegRow.find('.rtec-reg-email').html('<input type="text" name="email" id="rtec-email" data-rtec-val="'+email+'" value="'+email+'" />');
                    $closestRegRow.find('.rtec-reg-phone').html('<input type="text" name="phone" id="rtec-phone" data-rtec-val="'+phone+'" value="'+phone+'" />');
                    $closestRegRow.find('.rtec-reg-other').html('<input type="text" name="other" id="rtec-other" data-rtec-val="'+other+'" value="'+other+'" />');
                    $closestRegRow.find('td').each(function() {
                        if ($(this).hasClass('rtec-reg-custom')) {
                            var val = $(this).text().replace("'", '`').replace(/\\/g, "");
                            $(this).addClass('rtec-custom-editing').html('<input type="text" name="'+jQuery(this).attr('data-rtec-key')+'" class="rtec-edit-input" id="'+jQuery(this).attr('data-rtec-key')+'" data-rtec-val="'+val+'" value="'+val+'" />');
                        }
                    });

                    $(this).addClass('rtec-editing');

                    $('.rtec-edit-registration').text('Undo');
                }
            });
        } else {
            var $rtecEditing = $('.rtec-editing'),
                $editingClosestRegRow = $rtecEditing.closest('.rtec-reg-row');

            function addBackRowData($row,findEl,inputEl) {
                var html = $editingClosestRegRow.find(inputEl).attr('data-rtec-val');
                $row.find(findEl).html(html);
            }

            addBackRowData($editingClosestRegRow,'.rtec-reg-date','.rtec-reg-date button');
            addBackRowData($editingClosestRegRow,'.rtec-reg-last','.rtec-reg-last input');
            addBackRowData($editingClosestRegRow,'.rtec-reg-first','.rtec-reg-first input');
            addBackRowData($editingClosestRegRow,'.rtec-reg-email','.rtec-reg-email input');
            addBackRowData($editingClosestRegRow,'.rtec-reg-phone','.rtec-reg-phone input');
            addBackRowData($editingClosestRegRow,'.rtec-reg-other','.rtec-reg-other input');
            $editingClosestRegRow.find('td').each(function() {
                if ($(this).hasClass('rtec-reg-custom')) {
                    var html = $(this).find('input').attr('data-rtec-val');
                    $(this).removeClass('rtec-custom-editing').html(html);
                }
            });
            $rtecEditing.removeClass('rtec-editing');

            $('.rtec-edit-registration').text('Edit Selected');

        }

    }); // edit registration click

    $body.on('click', '.rtec-submit-edit', function () {
        var $table = $(this).closest('table');

        var custom = {};
        $('.rtec-custom-editing').each(function() {
            custom[$(this).attr('data-rtec-key')] = $(this).find('input').val();
        });

        // start spinner to show user that request is processing
        $('.rtec-single table tbody')
            .after('<div class="rtec-table-changing spinner is-active"></div>')
            .fadeTo("slow", .2);

        var submitData = {
            action : 'rtec_update_registration',
            rtec_id: $table.find('.rtec-editing').val(),
            rtec_registration_date: $table.find('.rtec-reg-date').attr('data-rtec-val'),
            rtec_other: $table.find('input[name=other]').val().replace("'", '`').replace(/\\/g, ""),
            rtec_custom: JSON.stringify(custom),
            rtec_first: $table.find('input[name=first]').val().replace("'", '`').replace(/\\/g, ""),
            rtec_email: $table.find('input[name=email]').val().replace("'", '`').replace(/\\/g, ""),
            rtec_phone: $table.find('input[name=phone]').val().replace("'", '`').replace(/\\/g, ""),
            rtec_last: $table.find('input[name=last]').val().replace("'", '`').replace(/\\/g, ""),
            rtec_nonce : rtecAdminScript.rtec_nonce
        },
        successFunc = function () {
            //reload the page on success to show the added registration
            location.reload();
        };

        rtecRegistrationAjax(submitData,successFunc);
    }); // registration submit

    $('.rtec-add-registration').click( function() {
        var $table = $(this).closest('.rtec-single-event').find('table'),
            $nav = $table.next();
        // remove if input fields already displayed
        if ($table.find('.rtec-new-registration').length) {
            $nav.find('.rtec-add-registration').text('+ Add New Registration');
            $table.find('.rtec-new-registration').remove();
            // otherwise show the input fields
        } else {
            $nav.find('.rtec-add-registration').text('- Remove Add New Registration');
            var customNamesHtml = '';
            $table.find('thead').find('th:gt(5)').each(function() {
                customNamesHtml += '<td><input type="text" name="'+$(this).text()+'" id="'+$(this).text()+'" class="rtec-custom-add-new" placeholder="'+$(this).text()+'" /></td>';
            });
            $table.find('tbody')
                .append(
                    '<tr class="format-standard rtec-new-registration">' +
                        '<td></td>' +
                        '<td><button class="button-primary rtec-submit-new">Submit Entry</button></td>' +
                        '<td><input type="text" name="last" id="last" placeholder="Last" /></td>' +
                        '<td><input type="text" name="first" id="first" placeholder="First" /></td>' +
                        '<td><input type="email" name="email" id="email" placeholder="you@example.com" /></td>' +
                        '<td><input type="tel" name="phone" id="phone" placeholder="4445556666" /></td>' +
                        '<td><input type="text" name="other" id="other" placeholder="Other" /></td>' +
                        customNamesHtml +
                    '</tr>'
                );
        }
    });

    $body.on('click', '.rtec-submit-new', function () {
        var $table = $(this).closest('table');
        // start spinner to show user that request is processing
        $('.rtec-single table tbody')
            .after('<div class="rtec-table-changing spinner is-active"></div>')
            .fadeTo("slow", .2);

        var custom = {};
        $('.rtec-custom-add-new').each(function() {
            custom[$(this).attr('name')] = $(this).val().replace("'", '`').replace(/\\/g, "");
        });

        var submitData = {
                action : 'rtec_add_registration',
                rtec_event_id: $('.rtec-single-event').attr('data-rtec-event-id'),
                rtec_other: $table.find('input[name=other]').val().replace("'", '`').replace(/\\/g, ""),
                rtec_custom: JSON.stringify(custom),
                rtec_first: $table.find('input[name=first]').val().replace("'", '`').replace(/\\/g, ""),
                rtec_email: $table.find('input[name=email]').val(),
                rtec_phone: $table.find('input[name=phone]').val().replace(/\D/g,''),
                rtec_last: $table.find('input[name=last]').val().replace("'", '`').replace(/\\/g, ""),
                rtec_venue_title: $table.closest('.rtec-single-event').find('.rtec-venue-title').text().replace("'", '`').replace(/\\/g, ""),
                rtec_end_time: $table.closest('.rtec-single-event').find('.rtec-end-time').text(),
                rtec_nonce : rtecAdminScript.rtec_nonce
            },
            successFunc = function () {
                //reload the page on success to show the added registration
                location.reload();
            };
        rtecRegistrationAjax(submitData,successFunc);
    }); // registration submit

    $('.rtec_download_csv').click( function() {
        var submitData = {
                action : 'rtec_download_csv'
            },
            successFunc = function () {
                console.log('done');
            };
        rtecRegistrationAjax(submitData,successFunc);
    });
});
