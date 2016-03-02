/*!
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  if ('serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      // Check to see if there's an updated version of service-worker.js with
      // new files to cache:
      // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-registration-update-method
      if (typeof registration.update === 'function') {
        registration.update();
      }

      // updatefound is fired if service-worker.js changes.
      registration.onupdatefound = function() {
        // updatefound is also fired the very first time the SW is installed,
        // and there's no need to prompt for a reload at that point.
        // So check here to see if the page is already controlled,
        // i.e. whether there's an existing service worker.
        if (navigator.serviceWorker.controller) {
          // The updatefound event implies that registration.installing is set:
          // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
          var installingWorker = registration.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                                'service worker became redundant.');

              default:
                // Ignore
            }
          };
        }
      };
    }).catch(function(e) {
      console.error('Error during service worker registration:', e);
    });
  }

  // DIGITAL MIND Scripts

  // TASK 3 - more bacon!
  var baconButton = $('button:contains("more bacon!")');
  if (baconButton.get(0)) {
    baconButton.on('click', function(e) {
      e.preventDefault();
      var beaconImage = $('img[alt="Bacon"]:first');
      beaconImage.clone().appendTo(beaconImage.parent()).addClass('clone');
    });
  }

  // TASK 5 - checkout simple validation
  $.fn.fieldValidate = function(action) {
    if (typeof action === 'undefined') {
      action = 'single';
    }
    /**
    * function which parses and eventually returns corrected single fields values
    * @param {string} input - selected form element
    * @param {string} inputType - validate types
    * @return {Boolean|Array} Checks validation or returns corrected value
    */
    function validateChecker(input, inputType) {
      var inputValue = input.val();
      if (!inputValue || (inputValue && inputValue === input.data('default'))) {
        return false;
      }
      if (typeof inputType === 'undefined') {
        inputType = 'string';
      }
      var match;
      var result;
      switch (inputType) {
        case 'email':
          match = /\S+@\S+\.\S+/;
          result = match.test(inputValue);
          return result;
        case 'credit_card':
          inputValue = inputValue.replace(/-|\s-\s/g, ' ');
          match = /(\d{4}\s){3}\d{4}/;
          result = match.test(inputValue);
          result = result === false ? false : match.exec(inputValue);
          return result;
        case 'card_expiration_date':
          inputValue = inputValue.replace(/\s\/\s/g, '/');
          match = /\d{2}\/\d{2}/;
          result = match.test(inputValue);
          result = result === false ? false : match.exec(inputValue);
          return result;
        case 'card_security_code':
          match = /\d{3}/;
          return match.test(inputValue);
        case 'postal_code':
          inputValue = inputValue.replace(/-|\s-\s/g, '');
          match = /\d{5}/;
          result = match.test(inputValue);
          result = result === false ? false : match.exec(inputValue);
          return result;
        default:
          return true;
      }
    }

    /**
    * simple field validate using validateChecker
    * @param {object} input - selected form element
    * @return {Boolean} Checks validation
    */
    function validateField(input) {
      var validateResult = validateChecker(input, input.data('validate'));
      var result;
      if (validateResult) {
        if (typeof validateResult === 'object' && validateResult[0]) {
          input.val(validateResult[0]);
        }
        result = true;
      } else {
        result = false;
      }
      return result;
    }

    if (action === 'single') {
      return this.each(function() {
        if (!$(this).data('default')) {
          $(this).data('default', $(this).val());
        }
        var targerLabel = $('label[for=' + $(this).attr('id') + ']');
        $(this).on('focus', function() {
          targerLabel.removeClass('error');
          if ($(this).data('default') &&
          $(this).val() === $(this).data('default')) {
            $(this).val('');
          }
        }).on('blur', function() {
          if ($(this).data('default') && $(this).val() === '') {
            $(this).val($(this).data('default'));
          }
          if (!validateField($(this))) {
            targerLabel.addClass('error');
          }
        });
      });
    } else if (action === 'all') {
      var countErrors = 0;
      this.each(function() {
        var targerLabel = $('label[for=' + $(this).attr('id') + ']')
        .removeClass('error');
        if (!validateField($(this))) {
          targerLabel.addClass('error');
          countErrors++;
        }
      });
      return countErrors;
    }
  };
  /**
    * create simple modal
    * @param {String} title - title for modal
    * @param {String} description - description for modal (really!) :D
    * @param {String} closeButtonString - text on modal closing button (default: 'OK')
    */
  function uiModal(title, description, closeButtonString) {
    if (typeof closeButtonString === 'undefined') {
      closeButtonString = 'OK';
    }
    $('.ui-modal').stop().clearQueue().slideUp(300, function() {
      $(this).remove();
    });
    var modal = $('<div class="ui-modal">' +
      '<div class="ui-modal-container">' +
        '<div class="title">' + title + '</div>' +
          '<p>' + description + '</p>' +
          '<div class="buttons"></div>' +
        '</div>' +
      '</div>');
    var button = $('<button class="mdl-button mdl-js-button ' +
      'mdl-js-ripple-effect close">' + closeButtonString +
      '</button>');
    $('.buttons', modal).append(button);
    modal.hide();
    $('body').append(modal);
    modal.show(200);
    button.on('click', function(event) {
      event.preventDefault();
      $('.ui-modal').stop().clearQueue().hide(300, function() {
        $(this).remove();
      });
    });
  }

  // form in action
  $('#checkout form .required').fieldValidate();
  $('#checkout form').on('submit', function(event) {
    event.preventDefault();
    if ($('#checkout form .required').fieldValidate('all') === 0) {
      uiModal('Thank you', 'Your form was sent');
    }
  });
})();
