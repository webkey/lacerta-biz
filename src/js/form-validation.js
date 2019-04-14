/**
 * !Form validation
 * */
var formValidInit = function () {

  $.validator.methods.email = function (value, element) {
    return this.optional(element) || /[a-z]+@[a-z]+\.[a-z]+/.test(value);
  };

  var $validationForm = $('.form-validate-js');

  if ($validationForm.length) {
    $.each($validationForm, function (i, el) {
      var changeClasses = function (element, removeClass, addClass) {
        var $element = $(element);
        $element
            .removeClass(removeClass)
            .addClass(addClass);
        $element
            .closest('form').find('label[for="' + $element.attr('id') + '"]')
            .removeClass(removeClass)
            .addClass(addClass);
        $element
            .closest('.input-wrap')
            .removeClass(removeClass)
            .addClass(addClass);
      };

      $(el).validate({
        errorClass: 'error',
        validClass: 'success',
        errorElement: false,
        errorPlacement: function (error, element) {
          return true;
        },
        highlight: function (element, errorClass, successClass) {
          changeClasses(element, successClass, errorClass);
        },
        unhighlight: function (element, errorClass, successClass) {
          changeClasses(element, errorClass, successClass);
        }
      });
    });
  }
};

$(document).ready(function () {
  formValidInit();
});