angular.module('ng-aside', [])
.service('ngAside', function() {
  var cache = {}, body = angular.element(document.body);

  var dimmer = document.createElement('div');
  dimmer.className = 'dimming nd';
  dimmer.setAttribute('id', 'dimmer');
  document.body.appendChild(dimmer);
  // body.append('<div id="dimmer" class="dimming nd"></div>');

  return {
    invertSide: invertSide,
    closeMenu: closeMenu,
    slideMenu: slideMenu,
    pushMenu: pushMenu,
    isOpen: isOpen
  };


  function menuCache(id) {
    return menuCache[id] ? menuCache[id] : menuCache[id] = angular.element(document.getElementById(id));
  }

  function invertSide(side) {
    return side === 'left' ? 'right' : side === 'right' ? 'left' : side === 'bottom' ? 'top' : side === 'top' ? 'bottom' : null;
  }

  function isOpen(id) {
    var menu = menuCache(id);

    return menu.hasClass('cbp-spmenu-open');
  }

  function closeMenu(id) {
    var menu = menuCache(id);

    // menu.removeClass('cbp-spmenu-open');
    body.removeClass('cbp-spmenu-push-to' + invertSide(menu.attr('side')));
    removeDimmer(id);
  }

  function slideMenu(id, dimmer, lock) {
    // var menu = menuCache(id);
    var menu = menuCache(id);

    if(dimmer || lock) setDimmer(id, lock);

    menu.toggleClass('cbp-spmenu-open');
  }

  function pushMenu(id, dimmer, lock) {
    var menu = menuCache(id);
    var invPos = invertSide(menu.attr('side'));

    if(dimmer || lock) setDimmer(id, lock);

    body.toggleClass('cbp-spmenu-push-to' + invPos);
    menu.toggleClass('cbp-spmenu-open');
  }

  function setDimmer(id, lock) {
    var menu = menuCache(id);
    var dimmer = angular.element(document.getElementById('dimmer'));

    dimmer.removeClass('nd');
    dimmer.addClass('open');
    if(!lock) dimmer.one('click', function() {
      removeDimmer(id);
    });

  }

  function removeDimmer(id) {
    var menu = menuCache(id);
    var dimmer = angular.element(document.getElementById('dimmer'));

    menu.removeClass('cbp-spmenu-open');
    dimmer.removeClass('open');
    body.removeClass('cbp-spmenu-push-to' + invertSide(menu.attr('side')));

    setTimeout(function() {
      dimmer.addClass('nd');
    }, 300);
  }

})
.directive('ngAsideClose', function(ngAside) {
  return {
    restrict: 'EA',
    link: function(scope, element, attrs, controller) {
      element.on('click', function() {
        ngAside.closeMenu(attrs['ngAsideClose']);
      });
    }
  };
})
.directive('ngAsideSlide', function(ngAside) {
  return {
    restrict: 'EA',
    link: function(scope, element, attrs, controller) {
      element.on('click', function() {
        ngAside.slideMenu(attrs['ngAsideSlide'], attrs['dimmer'], attrs['lock']);
      });
    }
  };
})
.directive('ngAsidePush', function(ngAside) {
  return {
    restrict: 'EA',
    link: function(scope, element, attrs, controller) {
      element.on('click', function() {
        ngAside.pushMenu(attrs['ngAsidePush'], attrs['dimmer'], attrs['lock']);
      });
    }
  };
})
.directive('ngAside', function() {
  function templateGen(element, attrs) {
    var classes = 'cbp-spmenu cbp-spmenu-vertical cbp-spmenu-';

    if(['left', 'right'].indexOf(attrs.side) == -1) {
      classes = 'cbp-spmenu cbp-spmenu-horizontal cbp-spmenu-';
    }

    classes += attrs.side;

    return '<nav class="'+ classes +'" side="'+ attrs.side +'" id="'+ attrs.id +'">' +
             '<ng-transclude></ng-transclude>' +
            '</nav>';
  }

  return {
    restrict: 'EA',
    transclude: true,
    replace: true,
    template: templateGen
  };
})
