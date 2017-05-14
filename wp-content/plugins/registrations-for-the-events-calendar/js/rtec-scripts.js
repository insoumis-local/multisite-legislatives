jQuery(document).ready(function($) {

    $('.rtec-js-show').show();
    $('.rtec-js-hide').hide();

    $('.rtec-form-toggle-button').on('click', function() {
        $rtecEl = $(this).closest('.rtec');
        $rtecEl.find('.rtec-toggle-on-click').toggle('slow');
        if ($(this).hasClass('tribe-bar-filters-open')) {
            $(this).removeClass('tribe-bar-filters-open');
        } else {
            $(this).addClass('tribe-bar-filters-open');
        }
    });

    var RtecForm = {

        validClass : 'rtec-valid',

        invalidClass : 'rtec-error',

        showErrorMessage : function(formEl){
            var $formField = formEl.closest($('.rtec-input-wrapper'));
            if (!$formField.find('.rtec-error-message').length) {
                $formField.append('<p class="rtec-error-message" role="alert">'+formEl.closest($('.rtec-form-field')).attr('data-rtec-error-message')+'</p>');
            }
            formEl.attr('aria-invalid','true');
        },

        removeErrorMessage : function(formEl){
            formEl.closest($('.rtec-input-wrapper')).find('.rtec-error-message').remove();
            formEl.attr('aria-invalid','false');
        },

        addScreenReaderError : function(){
            $('#rtec .rtec-form-wrapper').prepend('<div class="rtec-screen-reader rtec-screen-reader-error" role="alert" aria-live="assertive">There were errors with your submission. Please try again.</div>');
        },

        validateLength : function(formEl, min, max){
            if (formEl.val().length > max || formEl.val().length < min ) {
                if (formEl.hasClass(RtecForm.validClass)) {
                    formEl.removeClass(RtecForm.validClass);
                }
                formEl.addClass(RtecForm.invalidClass);
                RtecForm.showErrorMessage(formEl);
            } else {
                if (formEl.hasClass(RtecForm.invalidClass)) {
                    formEl.removeClass(RtecForm.invalidClass);
                }
                formEl.addClass(RtecForm.validClass);
                RtecForm.removeErrorMessage(formEl);
            }
        },

        validateEmail : function(formEl) {
            var regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/,
                emailTest = regEx.test(formEl.val());
            if (emailTest) {
                if (formEl.hasClass(RtecForm.invalidClass)) {
                    formEl.removeClass(RtecForm.invalidClass);
                }
                formEl.addClass(RtecForm.validClass);
                RtecForm.removeErrorMessage(formEl);
            } else {
                if (formEl.hasClass(RtecForm.validClass)) {
                    formEl.removeClass(RtecForm.validClass);
                }
                formEl.addClass(RtecForm.invalidClass);
                RtecForm.showErrorMessage(formEl);
            }
        },

        validateCount : function(formEl, validCountArr){

            var strippedNumString = formEl.val().replace(/\D/g,''),
                formElCount = strippedNumString.length,
                validCountNumbers = validCountArr.map(function(x) {
                    return parseInt(x);
                }),
                countTest = validCountNumbers.indexOf(formElCount);

            // if the valid counts is blank, allow any entry that contains at least one number
            if (validCountArr[0] === '') {
                countTest = formElCount - 1;
            }

            if (countTest !== -1) {
                if (formEl.hasClass(RtecForm.invalidClass)) {
                    formEl.removeClass(RtecForm.invalidClass);
                }
                formEl.addClass(RtecForm.validClass);
                RtecForm.removeErrorMessage(formEl);
            } else {
                if (formEl.hasClass(RtecForm.validClass)) {
                    formEl.removeClass(RtecForm.validClass);
                }
                formEl.addClass(RtecForm.invalidClass);
                RtecForm.showErrorMessage(formEl);
            }
        },

        validateSum : function(formEl, val1, val2 ){

            var eqTest = (parseInt(val1) === parseInt(val2));

            if (eqTest) {
                if (formEl.hasClass(RtecForm.invalidClass)) {
                    formEl.removeClass(RtecForm.invalidClass);
                }
                formEl.addClass(RtecForm.validClass);
                RtecForm.removeErrorMessage(formEl);
            } else {
                if (formEl.hasClass(RtecForm.validClass)) {
                    formEl.removeClass(RtecForm.validClass);
                }
                formEl.addClass(RtecForm.invalidClass);
                RtecForm.showErrorMessage(formEl);
            }
        }

    };
    
    $('.rtec-form').submit(function(event) {
        event.preventDefault();

        $rtecEl = $(this).closest('.rtec');

        if ($rtecEl.find('.rtec-screen-reader-error').length) {
            $rtecEl.find('.rtec-screen-reader-error').remove();
        }

        var required = [];

        $rtecEl.find('#rtec-form :input').each(function() {
            if ($(this).attr('aria-required') == 'true') {
                if ($(this).attr('name') == 'rtec_email') {
                    RtecForm.validateEmail($(this));
                } else if ($(this).attr('name') == 'rtec_phone') {
                    RtecForm.validateCount($(this), $(this).closest('.rtec-form-field').attr('data-rtec-valid-count').replace(' ', '').split(','));
                } else if ($(this).attr('name') == 'rtec_recaptcha_input') {
                    RtecForm.validateSum($(this), $(this).val(), $(this).closest('.rtec-form').find('.rtec-recaptcha-sum').val());
                } else if ($(this).attr('name') == 'rtec_last') {
                    RtecForm.validateLength($(this), 1, 100);
                } else if ($(this).attr('name') == 'rtec_first') {
                    RtecForm.validateLength($(this), 1, 100);
                } else {
                    RtecForm.validateLength($(this), 1, 1000);
                }
            }
        });

        if (!$rtecEl.find('.rtec-error').length) {
            $rtecEl.find('.rtec-spinner').show();
            $rtecEl.find('.rtec-form-wrapper #rtec-form, .rtec-form-wrapper p').fadeTo(500,.1);
            $rtecEl.find('#rtec-form-toggle-button').css('visibility','hidden');

            var submittedData = {};

            $rtecEl.find('#rtec-form :input').each(function() {
                var name = $(this).attr('name');
                var val = $(this).val();
                submittedData[name] = val;
            });

            submittedData['action'] = 'rtec_process_form_submission';

            $.ajax({
                url : rtec.ajaxUrl,
                type : 'post',
                data : submittedData,
                success : function(data) {

                    $rtecEl.find('.rtec-spinner, #rtec-form-toggle-button').hide();
                    $rtecEl.find('.rtec-form-wrapper').slideUp();
                    $('html, body').animate({
                        scrollTop: $rtecEl.offset().top - 200
                    }, 750);

                    if (data === 'full') {
                        $rtecEl.prepend('<p class="rtec-success-message tribe-events-notices" aria-live="polite">Sorry! Registrations just filled up for this event. You are not registered</p>');
                    } else if (data === 'email') {
                        $rtecEl.prepend('<p class="rtec-success-message tribe-events-notices" aria-live="polite">There was a problem sending the email confirmation. Please contact the site administrator to confirm your registration</p>');
                    } else if (data === 'form') {
                        $rtecEl.prepend('<p class="rtec-success-message tribe-events-notices" aria-live="polite">There was a problem with one or more of the entries you submitted. Please try again</p>');
                    } else {
                        $rtecEl.prepend('<p class="rtec-success-message tribe-events-notices" aria-live="polite">'+$('#rtec').attr('data-rtec-success-message')+'</p>');
                    }
                    
                }
            }); // ajax
        } else { // if not .rtec-error
            RtecForm.addScreenReaderError();
        } // if not .rtec-error
    }); // on rtec-form submit


});