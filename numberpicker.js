(function($){
  'use strict';

  var NumberPicker = function(element, options){
    this.$element    = $(element);
    this.options     = $.extend({}, NumberPicker.DEFAULTS, options);
  }

  NumberPicker.DEFAULTS = {
    theme: 'a',
    isInteger: false,
    validateResult: function(data) {
      return true;
    }
  }

  // NunberPicker PLUGIN DEFINITION
  // ========================
  var old = $.fn.numberPicker;

  $.fn.numberPicker = function (option) {
    return this.each(function () {
      var $this   = $(this);
      var options = typeof option == 'object' && option;
      var np = new NumberPicker($this, options);

      $this.focus(function(ev){
        $(this).blur();
        ev.preventDefault();

        $(this).addClass('np-target');
        np.show();
      });
    });
  }

  $.fn.numberPicker.Constructor = NumberPicker;

  // BUTTON NO CONFLICT
  // ==================
  $.fn.numberPicker.noConflict = function() {
    $.fn.numberPicker = old;
    return this;
  }

  NumberPicker.prototype.show = function() {
    var template = "",
         np;

    template += '<div class="np-w">';
    template += '<div class="np-persp">';
    template += '<div class="npo"></div>';
    template += '<div class="np">';
    template += '<div class="npoq"><\/div>';
    template += '<div id="numberInput" class="npinput"><\/div>';
    template += '<div class="npc">';
    template += '<div class="npwc">';
    template += '<table class="np-tbl" cellpadding="0" cellspacing="0">';
    template += '<tr>';
    template += '<td><div class="nbfl"><input data-role="none" type="button" value="1"><\/div><\/td>';
    template += '<td><div class="nbfl"><input data-role="none" type="button" value="2"><\/div><\/td>';
    template += '<td><div class="nbfl"><input data-role="none" type="button" value="3"><\/div><\/td>';
    template += '<td><div class="nbfl"><input data-role="none" type="button" value="4"><\/div><\/td>';
    template += '<\/tr>';
    template += '<tr>';
    template += '<td><div class="nbfl"><input data-role="none" type="button" value="5"><\/div><\/td>';
    template += '<td><div class="nbfl"><input data-role="none" type="button" value="6"><\/div><\/td>';
    template += '<td><div class="nbfl"><input data-role="none" type="button" value="7"><\/div><\/td>';
    template += '<td><div class="nbfl"><input data-role="none" type="button" value="8"><\/div><\/td>';
    template += '<\/tr>';
    template += '<tr>';
    template += '<td><div class="nbfl"><input data-role="none" type="button" value="9"><\/div><\/td>';
    template += '<td><div class="nbfl"><input data-role="none" type="button" value="0"><\/div><\/td>';
    template += '<td><div class="nbfl"><input data-role="none" type="button" value="."><\/div><\/td>';
    template += '<td><div class="nbfl"><input id="clear" data-role="none" type="button" value="c"><\/div><\/td>';
    template += '<\/tr>';
    template += '<\/table>';
    template += '<\/div>';
    template += '<div class="npbc">';
    template += '<span style="width: 50%" class="npbw"><input id="confirm" class="nbkey" data-role="none" type="button" value="确定"><\/span>';
    template += '<span style="width: 50%" class="npbw"><input id="cancel" class="nbkey" data-role="none" type="button" value="取消"><\/span>';
    template += '<\/div>';
    template += '<\/div>';
    template += '<\/div>';
    template += '<\/div>';
    template += '<\/div>';

    np = $(template);

    $('input[type="button"]', np).addClass('ui-btn-up-' + this.options.theme + ' ui-btn-' + this.options.theme + ' ui-btn-down-' + this.options.theme + ' ui-btn-corner-all')
      .addClass('nbkey')
      .hover(function(){
        $(this).addClass('ui-btn-hover-a');
      },function(){
        $(this).removeClass('ui-btn-hover-a');
      });

    np.appendTo($('body'));

    position(np, this.$element);

    np.on('tap', 'input[id!="clear"][id!="confirm"][id!="cancel"]', { option: this.options}, onKeyDown)
      .on('click', '#clear', onClear)
      .on('click', '#confirm', { el: this.$element, np: np, option: this.options }, onConfirm)
      .on('click', '#cancel', { el: this.$element, np: np }, onCancel)
      .on('click', '.npo', { el: this.$element, np: np }, onCancel);

    $(document).on('touchmove', onScroll);
  }

  function onScroll(e) {
    e.preventDefault();
  }

  function onClose(e) {
    $(document).off('touchmove');
    $("#numberInput").text('');
    e.el.removeClass('np-target');
    e.np.remove();
  }

  function onKeyDown(e) {
    var result;
    var key;
    var dotCount;
    var ctrl;

    ctrl =  $('#numberInput');
    key = $(this).val();
    result = ctrl.text();

    if(key === '.'){
      if(e.data.option.isInteger) return;

      dotCount = result.match(/\./g);

      if((dotCount && dotCount.length > 0) || result.length === 0) {
        return;
      }
    }

    if(result === '0' && key !== '.') {
      result = '';
    }

    result += key;

    ctrl.text(result);
  }

  function onClear(e) {
    var ctrl;

    ctrl =  $('#numberInput');

    ctrl.text('0');
  }

  function onConfirm(e) {
    var result;
    var ctrl;
    var param;

    ctrl =  $("#numberInput");
    result = ctrl.text().trim();
    param = e.data;

    if(result.length == 0){
      result = '0';
    }

    if(param.option.validateResult(result)) {
      param.el.val(result);

      onClose(param);
    }
  }

  function onCancel(e) {
    var param;

    param = e.data;

    onClose(param);
  }

  function position(np, el) {
    var persp = $('.np-persp', np);
    var wndw = $(window);
    var nw = persp.width(),
         nh = wndw[0].innerHeight || wndw.innerHeight();

    var w,
      l,
      t,
      mw,
      mh,
      dh,
      sl = wndw.scrollLeft(),
      st = wndw.scrollTop(),
      d = $('.np', np),
      css = {},
      elHeight;

    mw = d.outerWidth();
    mh = d.outerHeight(true);

    t = st + nh - mh;
    elHeight = el.offset().top;

    if(t < elHeight) {
      t = st;
    }

    css.top = t < 0 ? 0 : t;

    d.css(css);

    persp.height(0);
    dh = Math.max(t + mh, $(document).height());
    persp.css({ height: dh, left: sl });
  }
})(jQuery);