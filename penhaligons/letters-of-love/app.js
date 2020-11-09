(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("App.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert(".wrapper{background-color:#f3e9d7;background:url(imgs/shared/bg_texture.jpg);height:100%;min-height:100vh;position:relative;visibility:hidden;font-family:Lovato,Helvetica,Arial,sans-serif;font-weight:400;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#2c3e50}.mirrorX{transform:scaleX(-1)}main{flex:1;padding:1vh 16.5vw 10vh}main,section{margin:auto;width:100%;box-sizing:border-box}section{text-align:center;position:relative;max-width:800px}h2{font-size:2.2rem;margin:0;margin-bottom:.6rem}h2,h3{text-transform:uppercase}h3{font-size:1.6rem;line-height:1.9rem;font-weight:bolder;margin:1rem 0}h4{font-size:1.2rem;margin:.8rem 0}h4,h6{text-align:left}h6{font-size:2rem;text-transform:uppercase;color:#f17691;margin:.6rem 0;line-height:1.8rem}h6>span{color:#000;text-transform:capitalize;font-size:1rem;opacity:.5}p{font-size:1.15rem;line-height:1.6rem;margin:.7rem 0}a{font-weight:700;color:#f17691}a:visited{color:gray}button{background-color:#f17691;color:#f9ecef;box-shadow:1px 1px 0 #0d0d0d,2px 2px 0 #0d0d0d,3px 3px 0 #0d0d0d;border:none;padding:14px 30px 10px;cursor:pointer;font-weight:700;font-family:Lovato,Helvetica,Arial sans-serif;font-size:1.1rem;line-height:1.1rem;text-transform:uppercase;margin:4px;min-width:5ch;transition:all .03s}button:hover{transform:translate(-1px,-1px);box-shadow:1px 1px 0 #0d0d0d,2px 2px 0 #0d0d0d,3px 3px 0 #0d0d0d,4px 4px 0 #0d0d0d}button.disabled,button[disabled]{cursor:not-allowed;pointer-events:none;opacity:.6}button.disabled,button:active,button[disabled]{box-shadow:0 0 0 #0d0d0d,0 0 0 #0d0d0d,0 0 0 #0d0d0d;transform:translate(3px,3px)}.highlight{color:#f17691}.bold{font-weight:700}.disabled{opacity:.5;pointer-events:none}.enabled{opacity:1;pointer-events:auto}.warning{color:red}.modal{position:absolute;background:hsla(0,0%,95%,.75);left:0;top:0;width:100%;height:100%;z-index:1;visibility:hidden;opacity:0;transition:all 1s}.modal .modal-message{background:#f2f2f2;position:absolute;max-width:400px;left:50%;top:50vh;transform:translate(-50%,-50%);text-align:center;padding:4rem;box-shadow:0 0 30px rgba(0,0,0,.25)}.modal-message p.number{font-size:1.5rem}.show{visibility:visible;opacity:1}@media screen and (max-width:420px),screen and (max-width:1024px) and (orientation:portrait){main{padding:1vh 5vw 10vh}.modal .modal-message{padding:2.5rem}}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _CoatOfArms = require('./components/CoatOfArms');

var _CoatOfArms2 = _interopRequireDefault(_CoatOfArms);

var _SideDecoration = require('./components/SideDecoration');

var _SideDecoration2 = _interopRequireDefault(_SideDecoration);

var _BottomDecoration = require('./components/BottomDecoration');

var _BottomDecoration2 = _interopRequireDefault(_BottomDecoration);

var _Transitions = require('./animations/Transitions');

var _Transitions2 = _interopRequireDefault(_Transitions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  name: 'app',

  data: function data() {

    return {

      transitions: null,
      from: '',
      to: '',
      showingArms: false,
      showModal: false,

      mediaQuery: window.matchMedia('(max-width: 768px)')

    };
  },


  components: {

    CoatOfArms: _CoatOfArms2.default,
    SideDecoration: _SideDecoration2.default,
    BottomDecoration: _BottomDecoration2.default

  },

  created: function created() {

    this.mediaQuery.onchange = this.matchMediaChange;

    this.matchMediaChange();
  },
  mounted: function mounted() {

    this.showArms();

    this.$nextTick(function () {
      if (this.$route.name === 'landing') {

        _Transitions2.default.landing.firstEnter(this.mobile);
      } else {
        _Transitions2.default.fadeIn();
      }
    });
  },


  methods: {
    showArms: function showArms() {

      if (this.$route.name === 'landing' || this.$route.name === 'valentine') {

        this.showingArms = false;
      } else {

        this.showingArms = true;
      }
    },
    beforeEnter: function beforeEnter(el) {

      this.showArms();

      if (_Transitions2.default[this.to]) {

        _Transitions2.default[this.to].beforeEnter(this.mobile, { to: this.to, from: this.from });
      }
    },
    enter: function enter(el, done) {

      this.$nextTick(function () {

        var vm = this;

        if (_Transitions2.default[this.to]) {

          if (this.to === 'thankYou') {
            var callback = function callback() {

              done();
              vm.$router.push('/promo');
            };

            _Transitions2.default[this.to].enter(callback, this.mobile, { to: this.to, from: this.from });
          } else {

            _Transitions2.default[this.to].enter(done, this.mobile, { to: this.to, from: this.from });
          }
        }

        if (this.from === 'landing' && this.to === 'selector') {

          setTimeout(function () {

            vm.showModal = true;
          }, 2000);
        }
      });
    },
    leave: function leave(el, done) {

      if (_Transitions2.default[this.from]) {

        _Transitions2.default[this.from].leave(done, this.mobile);
      }
    },
    matchMediaChange: function matchMediaChange() {

      this.$store.commit({
        type: 'toggleIsMobile',
        boolean: this.mediaQuery.matches
      });
    }
  },

  computed: {
    mobile: function mobile() {

      return this.$store.state.isMobile;
    }
  },

  watch: {
    '$route': function $route(to, from) {
      this.from = from.name;
      this.to = to.name;
    }
  }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"wrapper"},[(_vm.showingArms)?_c('coat-of-arms'):_vm._e(),_vm._v(" "),_c('main',{attrs:{"id":"app"}},[_c('side-decoration'),_vm._v(" "),_c('transition',{attrs:{"mode":"out-in","css":false},on:{"before-enter":_vm.beforeEnter,"enter":_vm.enter,"leave":_vm.leave}},[_c('router-view')],1),_vm._v(" "),_c('side-decoration',{staticClass:"mirrorX",staticStyle:{"left":"auto","right":"0"}})],1),_vm._v(" "),_c('bottom-decoration'),_vm._v(" "),_c('div',{class:[ { show : _vm.showModal }, 'modal' ]},[_c('div',{staticClass:"modal-message"},[_c('h2',[_vm._v("Instructions")]),_vm._v(" "),_c('p',{staticClass:"highlight bold number"},[_vm._v("-1-")]),_vm._v(" "),_c('p',[_vm._v("First of all, choose the Portraits character who you would like to pen your passions.")]),_vm._v(" "),_c('p',{staticClass:"highlight bold number"},[_vm._v("-2-")]),_vm._v(" "),_c('p',[_vm._v("Answer the questions to help your admirer guess your identity")]),_vm._v(" "),_c('button',{attrs:{"type":"button"},on:{"click":function($event){_vm.showModal = false}}},[_vm._v("Ok, got it")])])])],1)}
__vue__options__.staticRenderFns = []

});

;require.register("animations/ConfirmTransitions.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Shared = require('./Shared');

var _Shared2 = _interopRequireDefault(_Shared);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  dur: _Shared2.default.dur,

  beforeEnter: function beforeEnter(mobile, route) {

    _Shared2.default.defaultBeforeEnter();
  },
  enter: function enter(callback) {

    var tl = new TimelineLite({
      onComplete: callback,
      paused: true
    });

    tl.add(_Shared2.default.sectionIn());

    tl.add(_Shared2.default.splitText('h2'), 0);

    tl.add(_Shared2.default.svgDecoratorIn('.svg-decorator'), 0);

    tl.staggerFrom('.to-stagger', this.dur, {
      autoAlpha: 0,
      yPercent: 10,
      clearProps: 'all',
      ease: Back.easeOut
    }, 0.1, '-=' + this.dur);

    requestAnimationFrame(function () {

      tl.play();
    });
  },
  leave: function leave(callback) {

    _Shared2.default.defaultLeave(callback);
  }
};

});

require.register("animations/LandingTransitions.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Shared = require('./Shared');

var _Shared2 = _interopRequireDefault(_Shared);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  dur: _Shared2.default.dur,

  beforeEnter: function beforeEnter(mobile, route) {

    _Shared2.default.defaultBeforeEnter();
  },
  firstEnter: function firstEnter(mobile) {

    var tl = new TimelineLite({
      paused: true
    });

    tl.to('.wrapper', this.dur, {
      autoAlpha: 1,
      ease: Linear.easeNone
    });

    tl.add(_Shared2.default.foliageIn(mobile), 0);

    tl.staggerFrom(['.penhaligons-logo', '.coat-of-arms'], this.dur, {
      autoAlpha: 0,
      ease: Linear.easeNone
    }, 0.5, 0.5);

    tl.add(_Shared2.default.svgDecoratorIn('.svg-decorator'), '-=' + this.dur * 0.5);

    if (!mobile) {

      tl.add('Courters', '-=' + this.dur);

      tl.staggerFrom(['.lady', '.gentleman'], this.dur * 0.5, {
        autoAlpha: 0
      }, 0.15, 'Courters');

      tl.staggerFrom(['.lady', '.gentleman'], this.dur, {
        cycle: {
          xPercent: [-5, 5]
        }
      }, 0.15, 'Courters');

      tl.add(_Shared2.default.paragraphsIn(), '-=' + this.dur * 0.5);
    }

    // Breaks reactivity
    // tl.add( Shared.splitText( 'h3' ), '-='+this.dur*0.25 )

    tl.from('h3', this.dur, {
      autoAlpha: 0,
      clearProps: 'all',
      ease: Linear.easeNone
    });

    tl.from('button', this.dur * 2, {
      autoAlpha: 0,
      yPercent: 25,
      ease: Back.easeOut,
      clearProps: 'all'
    }, '-=' + this.dur * 0.25);

    requestAnimationFrame(function () {

      tl.play();
    });
  },
  enter: function enter(callback, mobile) {

    var tl = new TimelineLite({
      onComplete: callback,
      paused: true
    });

    tl.add(_Shared2.default.sectionIn());

    tl.add(_Shared2.default.paragraphsIn(), 0);

    requestAnimationFrame(function () {

      tl.play();
    });
  },
  leave: function leave(callback, mobile) {

    var tl = new TimelineLite({
      onComplete: callback,
      paused: true
    });

    tl.add(_Shared2.default.resetScroll());

    if (!mobile) {

      tl.to('.paragraphs', this.dur, {
        height: 0,
        ease: Power2.easeInOut
      }, 0);
    }

    tl.to('section', this.dur, {
      autoAlpha: 0,
      ease: Linear.easeNone
    }, 0);

    requestAnimationFrame(function () {

      tl.play();
    });
  }
};

});

require.register("animations/LetterTransitions.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Shared = require('./Shared');

var _Shared2 = _interopRequireDefault(_Shared);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  dur: _Shared2.default.dur,

  beforeEnter: function beforeEnter(mobile, route) {

    _Shared2.default.defaultBeforeEnter();
  },
  enter: function enter(callback) {

    var tl = new TimelineLite({
      onComplete: callback,
      paused: true
    });

    tl.add(_Shared2.default.sectionIn());

    tl.add(_Shared2.default.splitText('.letter p').timeScale(1.5), 0);

    tl.from('.reveal', 1, { autoAlpha: 0 }, '-=' + this.dur);

    requestAnimationFrame(function () {

      tl.play();
    });
  },
  leave: function leave(callback) {

    _Shared2.default.defaultLeave(callback);
  }
};

});

require.register("animations/PromoTransitions.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Shared = require('./Shared');

var _Shared2 = _interopRequireDefault(_Shared);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  dur: _Shared2.default.dur,

  beforeEnter: function beforeEnter(mobile, route) {

    _Shared2.default.defaultBeforeEnter();
  },
  enter: function enter(callback) {

    var tl = new TimelineLite({
      paused: true
    });

    tl.add(_Shared2.default.sectionIn());

    tl.add(_Shared2.default.splitText('.perfumes > h3:first-of-type'), 0);

    tl.add(_Shared2.default.svgDecoratorIn('.svg-decorator:first-of-type'), 0);

    tl.staggerFrom('.perfumes li', this.dur * 2, {
      yPercent: 5,
      autoAlpha: 0,
      ease: Back.easeOut
    }, 0.2, this.dur);

    tl.add(_Shared2.default.svgDecoratorIn('.svg-decorator:last-of-type'), '-=' + this.dur);

    tl.from('.perfumes > h3:last-of-type', this.dur * 2, {
      yPercent: 5,
      autoAlpha: 0,
      ease: Back.easeOut
    }, '-=' + this.dur * 0.75);

    requestAnimationFrame(function () {

      tl.play();
    });
  },
  leave: function leave(callback) {

    _Shared2.default.defaultLeave(callback);
  }
};

});

require.register("animations/ReceiverTransitions.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Shared = require('./Shared');

var _Shared2 = _interopRequireDefault(_Shared);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  dur: _Shared2.default.dur,

  beforeEnter: function beforeEnter(mobile, route) {

    _Shared2.default.defaultBeforeEnter();
  },
  enter: function enter(callback) {

    var tl = new TimelineLite({
      onComplete: callback,
      paused: true
    });

    tl.add(_Shared2.default.sectionIn());

    tl.add(_Shared2.default.splitText('h2'), 0);

    tl.add(_Shared2.default.svgDecoratorIn('.svg-decorator'), 0);

    tl.add('Stagger', '-=' + this.dur * 0.5);

    tl.staggerFrom('.to-stagger', this.dur, {
      autoAlpha: 0,
      yPercent: 10,
      clearProps: 'all'
    }, 0.05, 'Stagger');

    requestAnimationFrame(function () {

      tl.play();
    });
  },
  leave: function leave(callback) {

    _Shared2.default.defaultLeave(callback);
  }
};

});

require.register("animations/SelectorTransitions.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Shared = require('./Shared');

var _Shared2 = _interopRequireDefault(_Shared);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  dur: _Shared2.default.dur,

  beforeEnter: function beforeEnter(mobile, route) {

    _Shared2.default.defaultBeforeEnter();
  },
  enter: function enter(callback, mobile, route) {

    var tl = new TimelineLite({
      onComplete: callback,
      paused: true
    });

    tl.add(_Shared2.default.sectionIn());

    tl.add('Choices', '-=' + this.dur * 0.5);

    tl.add(_Shared2.default.splitText('.choices h2'), 'Choices');

    if (!mobile) {

      tl.add(_Shared2.default.svgDecoratorIn('.choices svg'), 'Choices');

      tl.add(_Shared2.default.splitText('.choices h4'), '-=' + this.dur * 1.5);

      tl.staggerFrom('.choices li', this.dur, {
        scale: 0,
        transformOrigin: '50% 50%',
        clearProps: 'all',
        ease: Back.easeOut
      }, 0.07, '-=' + this.dur * 2);
    } else {

      tl.staggerFrom('.choices li', this.dur, {
        autoAlpha: 0,
        clearProps: 'all',
        ease: Linear.easeNone
      }, 0.07, '-=' + this.dur * 2);
    }

    requestAnimationFrame(function () {

      tl.play();
    });
  },
  leave: function leave(callback, mobile) {

    _Shared2.default.defaultLeave(callback);
  }
};

});

require.register("animations/SenderTransitions.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Shared = require('./Shared');

var _Shared2 = _interopRequireDefault(_Shared);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  dur: _Shared2.default.dur,

  beforeEnter: function beforeEnter(mobile, route) {

    _Shared2.default.defaultBeforeEnter();
  },
  enter: function enter(callback) {

    var tl = new TimelineLite({
      onComplete: callback,
      paused: true
    });

    tl.add(_Shared2.default.sectionIn());

    tl.add(_Shared2.default.splitText('h2'), 0);

    tl.add(_Shared2.default.svgDecoratorIn('.svg-decorator'), 0);

    tl.add('Stagger', '-=' + this.dur * 0.5);

    tl.staggerFrom('.to-stagger', this.dur, {
      autoAlpha: 0,
      yPercent: 10,
      clearProps: 'all'
    }, 0.05, 'Stagger');

    requestAnimationFrame(function () {

      tl.play();
    });
  },
  leave: function leave(callback) {

    _Shared2.default.defaultLeave(callback);
  }
};

});

require.register("animations/ShareTransitions.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Shared = require('./Shared');

var _Shared2 = _interopRequireDefault(_Shared);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  dur: _Shared2.default.dur,

  beforeEnter: function beforeEnter(mobile, route) {

    _Shared2.default.defaultBeforeEnter();
  },
  enter: function enter(callback) {

    var tl = new TimelineLite({
      onComplete: callback,
      paused: true
    });

    tl.add(_Shared2.default.sectionIn());

    tl.add(_Shared2.default.svgDecoratorIn('.svg-decorator'), 0);

    tl.add('Stagger', 0);

    tl.add(_Shared2.default.splitText('h3:first-of-type'), 'Stagger');

    tl.add(_Shared2.default.paragraphsIn(), '-=' + this.dur);

    tl.from('h3:last-of-type', this.dur * 1.5, {
      yPercent: 50,
      autoAlpha: 0,
      ease: Back.easeOut
    });

    requestAnimationFrame(function () {

      tl.play();
    });
  },
  leave: function leave(callback) {

    _Shared2.default.defaultLeave(callback);
  }
};

});

require.register("animations/Shared.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {

  dur: 1,

  foliageIn: function foliageIn(mobile) {

    var tl = new TimelineLite();

    tl.add('Foliage', 0);

    tl.staggerFrom('.lilly', 3, {
      rotation: 120,
      xPercent: -40,
      transformOrigin: "left bottom",
      ease: Back.easeOut.config(1.25)
    }, 0.2, 'Foliage');

    if (!mobile) {

      tl.staggerFrom('.roses', 3, {
        rotation: -20,
        xPercent: -50,
        yPercent: 40,
        transformOrigin: "left bottom",
        ease: Back.easeOut.config(1.25)
      }, 0.2, 'Foliage');
    }

    return tl;
  },
  svgDecoratorIn: function svgDecoratorIn(el) {

    var trg = el + ' path';

    return TweenMax.staggerFrom(trg, this.dur, {
      drawSVG: '50% 50%'
    }, 0.2);
  },
  paragraphsIn: function paragraphsIn() {

    return TweenMax.from('.paragraphs', this.dur, {
      height: 0,
      clearProps: 'all',
      ease: Power2.easeInOut
    });
  },
  splitText: function splitText(el) {
    var split = new SplitText(el, { type: 'words' });

    var tl = new TimelineLite();

    tl.staggerFrom(split.words, this.dur * 1.5, {
      autoAlpha: 0,
      yPercent: 15,
      rotation: 0.1,
      force3D: true
    }, 0.125);

    return tl;
  },
  resetScroll: function resetScroll() {

    return TweenMax.to(window, this.dur, {
      scrollTo: 0,
      ease: Power4.easeInOut
    });
  },
  sectionIn: function sectionIn() {

    return TweenMax.to('section', this.dur, {
      autoAlpha: 1,
      ease: Linear.easeNone
    });
  },
  defaultBeforeEnter: function defaultBeforeEnter() {

    return TweenMax.set('section', {
      autoAlpha: 0
    });
  },
  defaultLeave: function defaultLeave(callback) {

    var tl = new TimelineLite({
      onComplete: callback,
      paused: true
    });

    tl.add(this.resetScroll());

    tl.to('section', this.dur, {
      autoAlpha: 0
    }, 0);

    requestAnimationFrame(function () {

      tl.play();
    });
  }
};

});

require.register("animations/ThankYouTransitions.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Shared = require('./Shared');

var _Shared2 = _interopRequireDefault(_Shared);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  dur: _Shared2.default.dur,

  beforeEnter: function beforeEnter(mobile, route) {

    _Shared2.default.defaultBeforeEnter();
  },
  enter: function enter(callback) {

    var tl = new TimelineLite({
      onComplete: callback,
      paused: true
    });

    tl.add(_Shared2.default.sectionIn());

    tl.add(_Shared2.default.svgDecoratorIn('.svg-decorator'), 0);

    tl.add('Stagger', this.dur * 0.5);

    tl.add(_Shared2.default.splitText('h2'), 'Stagger');

    tl.add(_Shared2.default.splitText('h3'), '-=' + this.dur);

    tl.to('.thank', this.dur, {
      autoAlpha: 0,
      ease: Linear.easeNone
    }, '+=1');

    requestAnimationFrame(function () {

      tl.play();
    });
  },
  leave: function leave(callback) {

    _Shared2.default.defaultLeave(callback);
  }
};

});

require.register("animations/Transitions.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _LandingTransitions = require('./LandingTransitions');

var _LandingTransitions2 = _interopRequireDefault(_LandingTransitions);

var _SelectorTransitions = require('./SelectorTransitions');

var _SelectorTransitions2 = _interopRequireDefault(_SelectorTransitions);

var _LetterTransitions = require('./LetterTransitions');

var _LetterTransitions2 = _interopRequireDefault(_LetterTransitions);

var _ReceiverTransitions = require('./ReceiverTransitions');

var _ReceiverTransitions2 = _interopRequireDefault(_ReceiverTransitions);

var _SenderTransitions = require('./SenderTransitions');

var _SenderTransitions2 = _interopRequireDefault(_SenderTransitions);

var _ConfirmTransitions = require('./ConfirmTransitions');

var _ConfirmTransitions2 = _interopRequireDefault(_ConfirmTransitions);

var _ThankYouTransitions = require('./ThankYouTransitions');

var _ThankYouTransitions2 = _interopRequireDefault(_ThankYouTransitions);

var _PromoTransitions = require('./PromoTransitions');

var _PromoTransitions2 = _interopRequireDefault(_PromoTransitions);

var _ValentineTransitions = require('./ValentineTransitions');

var _ValentineTransitions2 = _interopRequireDefault(_ValentineTransitions);

var _ShareTransitions = require('./ShareTransitions');

var _ShareTransitions2 = _interopRequireDefault(_ShareTransitions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  // Dev only
  fadeIn: function fadeIn() {
    TweenMax.to('.wrapper', 0.2, { autoAlpha: 1 });
  },


  /* Sender's journey */

  landing: _LandingTransitions2.default,

  selector: _SelectorTransitions2.default,

  letter: _LetterTransitions2.default,

  receiver: _ReceiverTransitions2.default,

  sender: _SenderTransitions2.default,

  confirm: _ConfirmTransitions2.default,

  thankYou: _ThankYouTransitions2.default,

  promo: _PromoTransitions2.default,

  /* Receiver's journey */

  valentine: _ValentineTransitions2.default,

  valentineLetter: _LetterTransitions2.default,

  share: _ShareTransitions2.default

};

});

require.register("animations/ValentineTransitions.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Shared = require('./Shared');

var _Shared2 = _interopRequireDefault(_Shared);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  dur: _Shared2.default.dur,

  beforeEnter: function beforeEnter(mobile, route) {

    _Shared2.default.defaultBeforeEnter();
  },
  firstEnter: function firstEnter(mobile) {

    var tl = new TimelineLite({
      paused: true
    });

    tl.to('.wrapper', this.dur, {
      autoAlpha: 1,
      ease: Linear.easeNone
    });

    tl.add(_Shared2.default.foliageIn(mobile), 0);

    tl.staggerFrom(['.penhaligons-logo', '.coat-of-arms'], this.dur, {
      autoAlpha: 0,
      ease: Linear.easeNone
    }, 0.5, 0.5);

    tl.add(_Shared2.default.svgDecoratorIn('.svg-decorator'), '-=' + this.dur * 0.5);

    if (!mobile) {

      tl.add('Courters', '-=' + this.dur);

      tl.staggerFrom(['.lady', '.gentleman'], this.dur * 0.5, {
        autoAlpha: 0
      }, 0.15, 'Courters');

      tl.staggerFrom(['.lady', '.gentleman'], this.dur, {
        cycle: {
          xPercent: [-5, 5]
        }
      }, 0.15, 'Courters');
    }

    tl.add(_Shared2.default.paragraphsIn(), '-=' + this.dur * 0.5);

    // Breaks reactivity
    tl.add(_Shared2.default.splitText('h3'), '-=' + this.dur * 0.25);

    tl.from('button', this.dur * 2, {
      autoAlpha: 0,
      yPercent: 25,
      ease: Back.easeOut,
      clearProps: 'all'
    }, '-=' + this.dur * 0.25);

    requestAnimationFrame(function () {

      tl.play();
    });
  },
  enter: function enter(callback, mobile) {

    var tl = new TimelineLite({
      onComplete: callback,
      paused: true
    });

    tl.add(_Shared2.default.sectionIn());

    tl.add(_Shared2.default.paragraphsIn(), 0);

    requestAnimationFrame(function () {

      tl.play();
    });
  },
  leave: function leave(callback, mobile) {

    var tl = new TimelineLite({
      onComplete: callback,
      paused: true
    });

    tl.add(_Shared2.default.resetScroll());

    if (!mobile) {

      tl.to('.paragraphs', this.dur, {
        height: 0,
        ease: Power2.easeInOut
      }, 0);
    }

    tl.to('section', this.dur, {
      autoAlpha: 0,
      ease: Linear.easeNone
    }, 0);

    requestAnimationFrame(function () {

      tl.play();
    });
  }
};

});

require.register("components/BottomDecoration.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("footer[data-v-39f03028]{overflow:hidden;position:fixed;height:20vh;max-height:170px;bottom:0;width:100%;pointer-events:none;z-index:1}footer>img[data-v-39f03028],footer>span[data-v-39f03028]{position:absolute;bottom:-50%;height:140%}.lilly-left[data-v-39f03028]{left:-1.5%}.lilly-right[data-v-39f03028]{right:-1.5%}.lilly-right>img[data-v-39f03028]{height:100%}@media screen and (max-width:768px){footer[data-v-39f03028]{height:10vh}}@media screen and (max-width:1024px) and (orientation:landscape){footer[data-v-39f03028]{height:16vh}}")
;(function(){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _vm._m(0)}
__vue__options__.staticRenderFns = [function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('footer',[_c('img',{staticClass:"lilly lilly-left",attrs:{"src":"./imgs/shared/lilly.png"}}),_vm._v(" "),_c('span',{staticClass:"mirrorX lilly-right"},[_c('img',{staticClass:"lilly ",attrs:{"src":"./imgs/shared/lilly.png"}})])])}]
__vue__options__._scopeId = "data-v-39f03028"

});

;require.register("components/CoatOfArms.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("header[data-v-1fabfc3a]{text-align:center;display:flex;align-items:center;justify-content:center}header img[data-v-1fabfc3a]{width:15%;display:block;padding:2rem 0}@media screen and (max-width:420px){header img[data-v-1fabfc3a]{width:60%;padding:5rem 0 2rem}}")
;(function(){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {

  computed: {
    mobile: function mobile() {

      return this.$store.state.isMobile;
    }
  },

  methods: {
    beforeEnter: function beforeEnter(el) {

      TweenMax.set(el, {
        autoAlpha: 0
      });
    },
    enter: function enter(el, done) {

      TweenMax.to(el, 1, {
        autoAlpha: 1,
        ease: Linear.easeNone,
        onComplete: done
      });
    }
  }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"css":false},on:{"before-enter":_vm.beforeEnter,"enter":_vm.enter}},[_c('header',[(!_vm.mobile)?_c('img',{staticClass:"lines",attrs:{"src":"./imgs/shared/lines.png"}}):_vm._e(),_vm._v(" "),_c('img',{staticClass:"coat-of-arms",attrs:{"alt":"The Complete Guide to Courting","src":"./imgs/shared/coatOfArms.png","srcset":"./imgs/shared/coatOfArms.png 500w, ./imgs/shared/coatOfArms.png"}}),_vm._v(" "),(!_vm.mobile)?_c('img',{staticClass:"lines",attrs:{"src":"./imgs/shared/lines.png"}}):_vm._e()])])}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-1fabfc3a"

});

;require.register("components/HeroLogo.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("div[data-v-4058c7b2]{position:relative;padding-top:3vh}div img[data-v-4058c7b2]{display:block;margin:auto;height:auto}.penhaligons-logo[data-v-4058c7b2]{width:28%}.coat-of-arms[data-v-4058c7b2]{width:71%;margin-top:2.5%;padding-bottom:1%}.courter[data-v-4058c7b2]{position:absolute;bottom:0;z-index:1;margin:0}.lady[data-v-4058c7b2]{left:-3%;bottom:-5.6%;width:35%}.gentleman[data-v-4058c7b2]{right:9%;bottom:-1.4%;width:26%}@media screen and (max-width:768px){.coat-of-arms[data-v-4058c7b2]{margin-bottom:2rem;width:100%;padding:0 10vw;box-sizing:border-box}}")
;(function(){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {

  computed: {
    mobile: function mobile() {

      return this.$store.state.isMobile;
    }
  }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"hero-logo"},[_c('img',{staticClass:"penhaligons-logo",attrs:{"src":"./imgs/shared/penhaligons_logo.svg","alt":"Penhaligon's - EST. LONDON 1870"}}),_vm._v(" "),_c('img',{staticClass:"coat-of-arms",attrs:{"alt":"The Complete Guide to Courting","src":"./imgs/shared/coatOfArms.png","srcset":"./imgs/shared/coatOfArms.png 500w, ./imgs/shared/coatOfArms.png"}}),_vm._v(" "),(!_vm.mobile)?_c('img',{staticClass:"courter lady",attrs:{"src":"./imgs/landing/lady.png"}}):_vm._e(),_vm._v(" "),(!_vm.mobile)?_c('img',{staticClass:"courter gentleman",attrs:{"src":"./imgs/landing/gentleman.png"}}):_vm._e()])}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-4058c7b2"

});

;require.register("components/NavButton.vue", function(exports, require, module) {
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {

  name: 'navButton',

  props: ['dest', 'back'],

  methods: {

    navigateTo: function navigateTo() {

      if (this.back) {

        this.$router.go(-1);
      } else {

        this.$router.push(this.dest);
      }
    }

  }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('button',{attrs:{"type":"button"},on:{"click":_vm.navigateTo}},[_vm._t("default",[_vm._v("Button")])],2)}
__vue__options__.staticRenderFns = []

});

;require.register("components/Paragraphs.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert(".paragraphs[data-v-66804e72]{overflow:hidden}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {

  props: ['paragraphs', 'thiskey'],

  methods: {
    enter: function enter(el, done) {

      TweenMax.from(el, 1, {
        height: 0,
        autoAlpha: 0,
        rotation: 0.1,
        ease: Power2.easeInOut,
        clearProps: 'all',
        delay: 0.5,
        onComplete: function onComplete() {
          done();
        }
      });
    },
    leave: function leave(el, done) {

      TweenMax.to(el, 0.7, {
        height: 0,
        autoAlpha: 0,
        rotation: 0.1,
        ease: Power2.easeInOut,
        onComplete: function onComplete() {
          done();
        }
      });
    }
  }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"css":false},on:{"enter":_vm.enter,"leave":_vm.leave}},[_c('div',{key:_vm.thiskey,staticClass:"paragraphs"},_vm._l((_vm.paragraphs),function(paragraph){return _c('p',[_vm._v(_vm._s(paragraph.copy))])}))])}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-66804e72"

});

;require.register("components/Perfumes.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("ul[data-v-7d90719c]{list-style-type:none;margin:0;padding:0;display:flex;justify-content:space-around}li[data-v-7d90719c]{display:block;margin:1rem;width:33%;box-sizing:border-box}img[data-v-7d90719c]{height:30vh;max-height:345px}h3[data-v-7d90719c]{font-size:1.5rem;margin-bottom:.25rem;line-height:1.5rem}p[data-v-7d90719c]{margin:0 0 .5rem}h3[data-v-7d90719c],p[data-v-7d90719c]{text-transform:capitalize}@media screen and (max-width:420px){ul[data-v-7d90719c]{flex-direction:column;margin:2rem auto}li[data-v-7d90719c]{width:100%;margin:auto}}")
;(function(){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  data: function data() {

    return {
      perfumes: perfumes

    };
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('ul',_vm._l((_vm.perfumes),function(perfume){return _c('li',[_c('a',{attrs:{"href":perfume.clickUrl,"target":"_blank"}},[_c('img',{attrs:{"src":perfume.imgSrc,"alt":"Product 1"}})]),_vm._v(" "),_c('h3',[_vm._v(_vm._s(perfume.name))]),_vm._v(" "),_c('p',[_vm._v(_vm._s(perfume.tagline))]),_vm._v(" "),_c('a',{attrs:{"href":perfume.clickUrl,"target":"_blank"}},[_vm._v("Buy >")])])}))}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-7d90719c"

});

;require.register("components/Selector/SelectorAvatar.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert(".avatar[data-v-1bf9558b]{box-sizing:border-box;width:29.54%;padding:0}.avatar>img[data-v-1bf9558b]{width:80%;margin:auto}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {

  props: ['characters'],

  computed: {
    srcUrl: function srcUrl() {
      return this.characters[this.$store.state.active].avatar;
    },
    altText: function altText() {
      return this.characters[this.$store.state.active].name;
    }
  },

  updated: function updated() {

    this.enter();
  },


  methods: {
    enter: function enter(el, done) {

      var tl = new TimelineLite({
        paused: true,
        onComplete: done
      });

      tl.fromTo('.avatar > *', 0.5, {
        autoAlpha: 0,
        scale: 1.1,
        rotation: 0.1,
        transformOrigin: '50% 50%'
      }, {
        autoAlpha: 1,
        scale: 1,
        rotation: 0,
        ease: Power4.easeOut
      });

      requestAnimationFrame(function () {

        tl.play();
      });
    }
  }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"css":false},on:{"appear":_vm.enter,"enter":_vm.enter}},[_c('div',{staticClass:"avatar"},[_c('img',{attrs:{"id":"avatar","src":_vm.srcUrl,"alt":_vm.altText}})])])}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-1bf9558b"

});

;require.register("components/Selector/SelectorChoices.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("h4[data-v-2d50cdb0]{font-size:21px}.choices[data-v-2d50cdb0]{box-sizing:border-box;width:42.42%}.left[data-v-2d50cdb0]{text-align:left}@media screen and (max-width:768px){.choices[data-v-2d50cdb0]{width:100%}}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SvgDecorator = require('.././SvgDecorator');

var _SvgDecorator2 = _interopRequireDefault(_SvgDecorator);

var _SelectorPicker = require('./SelectorPicker');

var _SelectorPicker2 = _interopRequireDefault(_SelectorPicker);

var _SelectorChoicesSelected = require('./SelectorChoicesSelected');

var _SelectorChoicesSelected2 = _interopRequireDefault(_SelectorChoicesSelected);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  props: ['characters', 'copy', 'mobile'],

  components: {

    SvgDecorator: _SvgDecorator2.default,
    SelectorPicker: _SelectorPicker2.default,
    SelectorChoicesSelected: _SelectorChoicesSelected2.default

  }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"choices"},[(!_vm.mobile)?_c('h2',{staticClass:"left"},[_vm._v(_vm._s(_vm.copy.heading))]):_vm._e(),_vm._v(" "),(_vm.mobile)?_c('h2',{domProps:{"innerHTML":_vm._s(_vm.copy.mobileHeading)}}):_vm._e(),_vm._v(" "),(!_vm.mobile)?_c('svg-decorator'):_vm._e(),_vm._v(" "),(!_vm.mobile)?_c('h4',[_vm._v(_vm._s(_vm.copy.cta.text))]):_vm._e(),_vm._v(" "),_c('selector-picker',{attrs:{"characters":_vm.characters,"copy":_vm.copy}}),_vm._v(" "),_c('selector-choices-selected',{attrs:{"characters":_vm.characters}})],1)}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-2d50cdb0"

});

;require.register("components/Selector/SelectorChoicesSelected.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("ul[data-v-1280b6eb]{list-style-type:none;margin:0;padding:0;text-align:left;font-size:18px;padding:1rem 0}.bold[data-v-1280b6eb]{font-weight:700}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {

  props: ['characters'],

  computed: {
    totalSelected: function totalSelected() {

      return this.$store.state.answers;
    }
  },

  methods: {
    getMessage: function getMessage(i) {
      return this.totalSelected[i] ? '<span class=\"highlight bold\">' + this.getName(i) + ' :</span> <strong>' + this.getCopy(i) + '</strong></span>' : '<em>Click to select your chosen character</em>';
    },
    getName: function getName(i) {

      return this.characters[this.totalSelected[i].index].name;
    },
    getTagline: function getTagline(i) {

      return this.characters[this.totalSelected[i].index].tagline;
    },
    getCopy: function getCopy(i) {

      return this.totalSelected[i].copy;
    }
  }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('ul',{attrs:{"id":"selected"}},[_c('li',[_c('span',{staticClass:"highlight bold"},[_vm._v("1.")]),_vm._v(" "),_c('span',{domProps:{"innerHTML":_vm._s(_vm.getMessage(0))}})]),_vm._v(" "),_c('li',[_c('span',{staticClass:"highlight bold"},[_vm._v("2.")]),_vm._v(" "),_c('span',{domProps:{"innerHTML":_vm._s(_vm.getMessage(1))}})]),_vm._v(" "),_c('li',[_c('span',{staticClass:"highlight bold"},[_vm._v("3.")]),_vm._v(" "),_c('span',{domProps:{"innerHTML":_vm._s(_vm.getMessage(2))}})])])}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-1280b6eb"

});

;require.register("components/Selector/SelectorDetail.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("h2[data-v-13871efa]{text-align:left}h2>span[data-v-13871efa]{font-size:1.25rem;font-weight:400;text-transform:capitalize;font-family:Lovato,Arial,Helvetica,sans-serif}h6[data-v-13871efa]{text-transform:none;font-style:italic;margin:1.5rem 0 3rem}@media screen and (max-width:768px){h2[data-v-13871efa]{text-align:center;font-size:1.6rem}h2 span[data-v-13871efa]{text-transform:uppercase;font-weight:700;font-size:1.6rem}}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SvgDecorator = require('../SvgDecorator');

var _SvgDecorator2 = _interopRequireDefault(_SvgDecorator);

var _SelectorInput = require('./SelectorInput');

var _SelectorInput2 = _interopRequireDefault(_SelectorInput);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  props: ['character', 'index', 'copy'],

  components: {
    SvgDecorator: _SvgDecorator2.default,
    SelectorInput: _SelectorInput2.default
  },

  data: function data() {

    return {

      svgVisible: false

    };
  },


  computed: {
    active: function active() {

      return this.$store.state.active;
    }
  },

  methods: {
    enter: function enter(el, done) {

      this.svgVisible = true;

      var tl = new TimelineLite({
        paused: true,
        onComplete: done
      });

      tl.staggerFrom('.choice-detail > div > *', 0.25, {
        autoAlpha: 0
      }, 0.1);

      requestAnimationFrame(function () {

        tl.play();
      });
    }
  }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"css":false},on:{"enter":_vm.enter}},[_c('div',[_c('h2',[_vm._v(_vm._s(_vm.character.name)),_c('br'),_c('span',[_vm._v(_vm._s(_vm.character.tagline))])]),_vm._v(" "),_c('svg-decorator',{attrs:{"visible":_vm.svgVisible}}),_vm._v(" "),_c('h6',[_vm._v(_vm._s(_vm.character.question)),_c('br'),_c('span',[_vm._v("e.g. "+_vm._s(_vm.character.hints))])]),_vm._v(" "),_c('selector-input',{attrs:{"index":_vm.index,"copy":_vm.copy}})],1)])}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-13871efa"

});

;require.register("components/Selector/SelectorDetails.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert(".choice-details{box-sizing:border-box;text-align:left;width:28.04%;display:flex;flex-direction:row;align-items:center}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SelectorDetail = require('./SelectorDetail');

var _SelectorDetail2 = _interopRequireDefault(_SelectorDetail);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  props: ['characters', 'copy'],

  components: {
    SelectorDetail: _SelectorDetail2.default
  },

  computed: {
    active: function active() {

      return this.$store.state.active;
    }
  }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"choice-details"},_vm._l((_vm.characters),function(character,index){return _c('selector-detail',{directives:[{name:"show",rawName:"v-show",value:(_vm.active === index),expression:"active === index"}],key:'detail' + index,attrs:{"index":index,"character":character,"copy":_vm.copy}})}))}
__vue__options__.staticRenderFns = []

});

;require.register("components/Selector/SelectorInput.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("input[type=text][data-v-35ceb408]{background:none;border:none;border-bottom:1px solid #000;border-radius:3px;box-sizing:border-box;font-family:Lovato;font-size:22px;font-style:italic;font-weight:700;padding:0 6px;width:100%}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {

  name: 'selector-input',

  props: ['index', 'copy'],

  data: function data() {

    return {

      input: '',

      isClean: true,

      inputElement: null

    };
  },


  computed: {
    selectedTotal: function selectedTotal() {

      return this.$store.state.answers.length;
    },
    active: function active() {

      return this.$store.state.active;
    },
    selected: function selected() {

      return this.$store.state.selected;
    }
  },

  mounted: function mounted() {
    if (this.$store.state.answers.length > 0) {

      var vm = this;

      this.$store.state.answers.forEach(function (answer) {
        if (answer.index === vm.index) {
          vm.input = answer.copy;
        }
      });
    }

    this.inputElement = this.$el.querySelector('input');

    this.inputElement.focus();
  },
  updated: function updated() {
    if (this.active !== this.index) {
      return;
    }

    this.checkWords();

    if (this.input.length > 0 && this.selectedTotal < 3 && this.isClean) this.enableChoices();

    if (!this.isClean || this.input.length === 0 && this.selectedTotal !== 0 && this.index === this.selected) this.disableChoices();

    if (this.selectedTotal === 3 && this.input.length !== 0) {

      this.$store.commit('toggleProceed', true);
    } else if (this.selectedTotal === 3 && this.input.length === 0) {

      this.$store.commit('toggleProceed', false);
    }

    if (this.isClean) {

      this.addAnswerToStore();
    }
  },


  methods: {
    enableChoices: function enableChoices() {

      this.$store.commit('enableChoices');
    },
    disableChoices: function disableChoices() {

      this.$store.commit('disableChoices');
    },
    addAnswerToStore: function addAnswerToStore() {

      this.$store.commit({
        type: 'addAnswer',
        index: this.index,
        input: this.input
      });
    },
    focused: function focused() {

      this.addAnswerToStore();

      if (this.input.length > 0 && this.selectedTotal === 3) {

        this.$store.commit('toggleProceed', true);
      }

      if (this.input.length > 0 && this.selectedTotal < 3) {

        this.enableChoices();
      }
    },
    addSelected: function addSelected() {
      if (this.selected !== this.index && this.selectedTotal < 3) {

        this.$store.commit({
          type: 'addSelected',
          index: this.index
        });
      }
    },
    checkWords: function checkWords() {

      this.isClean = blacklist.every(this.checkInputs);

      if (!this.isClean) {

        this.inputElement.className = 'warning';
      } else {

        this.inputElement.classList.remove('warning');
      }
    },
    checkInputs: function checkInputs(word) {

      var inputs = this.input.split(' ');

      return inputs.every(function (input) {

        return word.toLowerCase() != input.toLowerCase();
      });
    }
  },

  watch: {
    selected: function selected() {

      if (this.selected === this.index) {

        this.inputElement.focus();
      }
    }
  }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',[_c('div',[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.input),expression:"input"}],attrs:{"type":"text","placeholder":"Answer","index":_vm.index},domProps:{"value":(_vm.input)},on:{"focus":_vm.focused,"click":_vm.addSelected,"input":function($event){if($event.target.composing){ return; }_vm.input=$event.target.value}}}),_vm._v(" "),_c('div',{directives:[{name:"show",rawName:"v-show",value:(!_vm.isClean),expression:"!isClean"}],staticClass:"warning"},[_vm._v("\n      "+_vm._s(_vm.copy.warning)+"\n    ")])])])}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-35ceb408"

});

;require.register("components/Selector/SelectorPicker.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("ul[data-v-416a0b80]{list-style-type:none;margin:0;padding:0;display:flex;flex-wrap:wrap}@media screen and (max-width:768px){ul[data-v-416a0b80]{flex-direction:column}}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SelectorPickerOption = require('./SelectorPickerOption');

var _SelectorPickerOption2 = _interopRequireDefault(_SelectorPickerOption);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  props: ['characters', 'copy'],

  components: {

    SelectorPickerOption: _SelectorPickerOption2.default

  }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('ul',_vm._l((_vm.characters),function(character,index){return _c('selector-picker-option',{key:'k' + index,attrs:{"index":index,"character":character,"copy":_vm.copy}})}))}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-416a0b80"

});

;require.register("components/Selector/SelectorPickerOption.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("li[data-v-0259be55]{width:calc(33.33% - 16px);margin:8px}li [data-v-0259be55]{cursor:pointer;box-sizing:border-box}label[data-v-0259be55]{border:0 solid transparent;display:block;box-sizing:border-box;transition:border .3s}input[type=checkbox][data-v-0259be55]{display:none;position:absolute}label[data-v-0259be55]:hover{border:3px solid #000}input[type=checkbox]:checked+label[data-v-0259be55]{border:3px solid #f17691}img[data-v-0259be55]{display:block;margin:0;width:100%;box-sizing:border-box}.disabled[data-v-0259be55]{opacity:.5;pointer-events:none}.hints[data-v-0259be55]{color:hsla(0,0%,40%,.5);font-style:italic;margin:0}@media screen and (max-width:768px){li[data-v-0259be55]{width:100%;height:auto;margin:0;margin-bottom:1rem}label[data-v-0259be55]{padding:.5rem;background:#fff;display:flex;align-items:flex-start}label>img[data-v-0259be55]{max-width:120px}label>div[data-v-0259be55]{text-align:left;padding-left:1rem;max-width:calc(100% - 120px)}h3[data-v-0259be55]{margin:0;line-height:1.25rem}h6[data-v-0259be55]{font-size:1rem;line-height:1.1rem;margin:.2rem 0 .7rem}input[data-v-0259be55]{max-width:100%}}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SelectorInput = require('./SelectorInput');

var _SelectorInput2 = _interopRequireDefault(_SelectorInput);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  props: ['character', 'index', 'copy'],

  components: {

    SelectorInput: _SelectorInput2.default

  },

  data: function data() {

    return {

      checked: false,

      enabledClass: 'enabled',
      disabledClass: 'disabled'

    };
  },


  computed: {
    isDisabled: function isDisabled() {

      return this.$store.state.choicesDisabled && !this.checked;
    },
    mobile: function mobile() {

      return this.$store.state.isMobile;
    },
    lastSelected: function lastSelected() {

      return this.$store.state.selected;
    }
  },

  mounted: function mounted() {
    if (this.$store.state.answers.length > 0) {

      var vm = this;

      this.$store.state.answers.forEach(function (answer) {
        if (answer.index === vm.index) {
          vm.checked = true;
        }
      });
    }
  },


  methods: {
    toggle: function toggle() {

      if (this.checked) {

        this.$store.commit({
          type: 'removeSelected',
          index: this.index
        });

        this.$store.commit('enableChoices');

        this.$store.commit('toggleProceed', false);
      } else {

        this.$store.commit({
          type: 'addSelected',
          index: this.index
        });

        this.$store.commit('disableChoices');
      }

      this.checked = !this.checked;
    },
    onEnter: function onEnter() {

      if (!this.checked) {}
      this.$store.commit('updateActive', this.index);
    }
  },

  watch: {
    lastSelected: function lastSelected(selected) {

      if (this.index === selected && !this.checked) {

        this.checked = true;

        this.$store.commit('disableChoices');
      }
    }
  }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('li',[_c('input',{attrs:{"type":"checkbox","id":'opt' + _vm.index},domProps:{"checked":_vm.checked},on:{"change":_vm.toggle}}),_c('label',{class:[_vm.isDisabled ? _vm.disabledClass : _vm.enabledClass],attrs:{"for":'opt' + _vm.index},on:{"mouseenter":_vm.onEnter}},[_c('img',{attrs:{"src":_vm.character.portrait,"alt":_vm.character.name}}),_vm._v(" "),(_vm.mobile)?_c('div',[_c('h3',[_vm._v(_vm._s(_vm.character.name))]),_vm._v(" "),_c('h6',[_vm._v(_vm._s(_vm.character.question))]),_vm._v(" "),(_vm.checked)?_c('selector-input',{attrs:{"index":_vm.index,"copy":_vm.copy}}):_vm._e(),_vm._v(" "),(!_vm.checked)?_c('h6',{staticClass:"hints"},[_vm._v(_vm._s(_vm.character.hints))]):_vm._e()],1):_vm._e()])])}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-0259be55"

});

;require.register("components/SideDecoration.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("aside[data-v-b59630d8]{display:block;position:fixed;overflow:hidden;width:20vw;max-width:300px;height:100%;top:0;left:0;pointer-events:none;z-index:1}img[data-v-b59630d8]{position:absolute;height:auto}.roses[data-v-b59630d8]{width:154%;bottom:-14%;left:-40%}.cupid[data-v-b59630d8]{width:80%}@media screen and (max-width:420px){aside[data-v-b59630d8]{width:50vw}}@media screen and (max-width:1024px) and (orientation:landscape){aside[data-v-b59630d8]{width:18vh}}")
;(function(){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {

  computed: {
    mobile: function mobile() {

      return this.$store.state.isMobile;
    }
  }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('aside',[_c('img',{staticClass:"cupid",attrs:{"src":"./imgs/shared/cupid.png"}}),_vm._v(" "),(!_vm.mobile)?_c('img',{staticClass:"roses",attrs:{"src":"./imgs/shared/rose.png"}}):_vm._e()])}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-b59630d8"

});

;require.register("components/SocialIcon.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("a[data-v-92e82a9a]{margin:2rem;display:inline-block}img[data-v-92e82a9a]{width:62px;height:62px;display:block}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {

  props: ['icon']

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('a',{attrs:{"href":_vm.icon.url,"target":"_blank"}},[_c('img',{attrs:{"src":_vm.icon.src,"alt":_vm.icon.name}})])}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-92e82a9a"

});

;require.register("components/SvgDecorator.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("svg[data-v-cbdf4cb8]{width:100%;height:10px;stroke:rgba(0,0,0,.55);stroke-width:1px;fill:none;display:block;margin:auto}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var throttle = function throttle(func, limit) {
  var inThrottle = void 0;
  var lastFunc = void 0;
  var lastRan = void 0;
  return function () {
    var context = this;
    var args = arguments;
    if (!inThrottle) {
      func.apply(context, args);
      lastRan = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

exports.default = {

  name: 'svgDecorator',

  props: ['flip', 'visible'],

  data: function data() {

    return {

      show: true,
      baseWidth: 200,
      baseHeight: 10,
      baseCurve: 5

    };
  },
  mounted: function mounted() {

    var vm = this;

    vm.setWidth();
    vm.tt = throttle(function () {
      vm.setWidth();
    }, 500);

    window.addEventListener('resize', vm.tt);
  },
  beforeDestroy: function beforeDestroy() {

    window.removeEventListener('resize', this.tt);
  },


  computed: {
    path: function path() {

      return 'M0 1              h' + (this.baseWidth * 0.5 - this.baseCurve) + '              q' + this.baseCurve + ' 0, ' + this.baseCurve + ' ' + this.baseHeight * 0.4 + '              q0 -' + this.baseHeight * 0.4 + ', ' + this.baseCurve + ' -' + this.baseHeight * 0.4 + '              h' + (this.baseWidth * 0.5 - this.baseCurve);
    },
    pathFlipped: function pathFlipped() {

      return 'M0 ' + (this.baseHeight - 1) + '              h' + (this.baseWidth * 0.5 - this.baseCurve) + '              q' + this.baseCurve + ' 0, ' + this.baseCurve + ' -' + this.baseHeight * 0.4 + '              q0 ' + this.baseHeight * 0.4 + ', ' + this.baseCurve + ' ' + this.baseHeight * 0.4 + '              h' + (this.baseWidth * 0.5 - this.baseCurve);
    }
  },

  methods: {
    setWidth: function setWidth() {

      this.baseWidth = this.$el.getBoundingClientRect().width;

      if (!this.show) {
        TweenMax.set('path', { clearProps: 'all' });
        TweenMax.set('path', { drawSVG: "50% 50%" });
      }
    }
  },

  watch: {
    visible: function visible(a, b) {

      this.setWidth();
    }
  }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"svg-decorator",attrs:{"viewBox":("0 0 " + _vm.baseWidth + " " + _vm.baseHeight),"preserveAspectRatio":"xMidYMin meet"}},[(!_vm.flip)?_c('g',[_c('path',{attrs:{"vector-effect":"non-scaling-stroke","d":("" + _vm.path)}}),_vm._v(" "),_c('path',{attrs:{"vector-effect":"non-scaling-stroke","d":("" + _vm.path),"transform":"translate(0 3)"}})]):_vm._e(),_vm._v(" "),(_vm.flip)?_c('g',[_c('path',{attrs:{"vector-effect":"non-scaling-stroke","d":("" + _vm.pathFlipped)}}),_vm._v(" "),_c('path',{attrs:{"vector-effect":"non-scaling-stroke","d":("" + _vm.pathFlipped),"transform":"translate(0 -3)"}})]):_vm._e()])}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-cbdf4cb8"

});

;require.register("components/Tagline.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("h3[data-v-2e201cb1]{overflow:hidden;margin:0}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {

  props: ['step'],

  methods: {
    enter: function enter(el, done) {

      TweenMax.from(el, 1, {
        height: 0,
        autoAlpha: 0,
        rotation: 0.1,
        ease: Power2.easeInOut,
        clearProps: 'all',
        onComplete: function onComplete() {
          done();
        }
      });
    },
    leave: function leave(el, done) {

      TweenMax.to(el, 0.7, {
        height: 0,
        autoAlpha: 0,
        rotation: 0.1,
        ease: Power2.easeInOut,
        onComplete: function onComplete() {
          done();
        }
      });
    }
  }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"css":false},on:{"enter":_vm.enter,"leave":_vm.leave}},[_c('h3',{key:_vm.step},[_vm._t("default")],2)])}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-2e201cb1"

});

;require.register("components/TermsConditions.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert(".terms p{font-family:Arial,Helvetica,sans-serif;font-size:.75rem;line-height:1rem;margin:.2rem 0}input[type=checkbox]{border:4px solid #000;background:transparent}.legal-link:after{content:\", \"}.legal-link:last-of-type:before{content:\"& \"}.legal-link:last-of-type:after{content:\"\"}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _subscribeUser = require('../helpers/subscribeUser');

var _subscribeUser2 = _interopRequireDefault(_subscribeUser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  props: ['copy'],

  data: function data() {

    return {

      checked: false

    };
  },


  methods: {
    toggleTerms: function toggleTerms() {

      (0, _subscribeUser2.default)({
        subscribe: this.checked,
        name: this.$store.state.data.sender.name,
        email: this.$store.state.data.sender.email
      });

      this.checked != this.checked;
    }
  }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"terms"},[_vm._l((_vm.copy.terms.paragraphs),function(paragraph){return _c('p',{domProps:{"innerHTML":_vm._s(paragraph.copy)}})}),_vm._v(" "),_c('p',[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.checked),expression:"checked"}],attrs:{"type":"checkbox","name":"terms","tabindex":"1"},domProps:{"checked":Array.isArray(_vm.checked)?_vm._i(_vm.checked,null)>-1:(_vm.checked)},on:{"change":_vm.toggleTerms,"__c":function($event){var $$a=_vm.checked,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=null,$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.checked=$$a.concat([$$v]))}else{$$i>-1&&(_vm.checked=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{_vm.checked=$$c}}}}),_vm._v(_vm._s(_vm.copy.terms.consent))]),_vm._v(" "),_c('p',[_vm._v(_vm._s(_vm.copy.terms.legals.copy)+" "),_vm._l((_vm.copy.terms.legals.choices),function(item,index){return _c('span',{staticClass:"legal-link"},[_c('a',{attrs:{"href":item.url,"target":"_blank"}},[_vm._v(_vm._s(item.name))])])}),_vm._v(".")],2)],2)}
__vue__options__.staticRenderFns = []

});

;require.register("helpers/subscribeUser.js", function(exports, require, module) {
'use strict';

var subscribeUser = function subscribeUser(opts) {

    console.log('subscribeUser', opts);

    // this.submitEmail()
    // 1. Setup the request
    // ================================
    // 1.1 Headers
    var headers = new Headers();
    // Tell the server we want JSON back
    headers.set('Accept', 'application/json');

    // 1.2 Form Data
    // We need to properly format the submitted fields.
    // Here we will use the same format the browser submits POST forms.
    // You could use a different format, depending on your server, such
    // as JSON or XML.
    var formData = new FormData();

    // Sender's details
    formData.append('NAME', opts.name);
    formData.append('email', opts.email);
    formData.append('status', opts.subscribe ? 'subscribed' : 'unsubscribed');

    // 2. Make the request
    // ================================
    var url = '/marketing-subscription.php';
    var fetchOptions = {
        method: 'POST',
        headers: headers,
        body: formData
    };

    var responsePromise = fetch(url, fetchOptions);

    // 3. Use the response
    // ================================
    responsePromise
    // 3.1 Convert the response into JSON-JS object.
    .then(function (response) {
        // console.log('[CONFIRM] response', response);
        return response.json();
    })
    // 3.2 Do something with the JSON data
    .then(function (jsonData) {
        // console.log('[CONFIRM] jsonData', jsonData);
    });
};

module.exports = subscribeUser;

});

require.register("main.js", function(exports, require, module) {
'use strict';

require('whatwg-fetch');

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _App = require('./App');

var _App2 = _interopRequireDefault(_App);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

var _vuexRouterSync = require('vuex-router-sync');

require('vueify/lib/insert-css');

var _vueAnalytics = require('vue-analytics');

var _vueAnalytics2 = _interopRequireDefault(_vueAnalytics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Fetch polyfill
(0, _vuexRouterSync.sync)(_store2.default, _router2.default);

/* Polyfill for Array.findIndex() as it's not supported by IE */
// https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
// required for .vue file <style> tags
if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    value: function value(predicate) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return k.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return k;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return -1.
      return -1;
    }
  });
}

_vue2.default.use(_vueAnalytics2.default, {
  id: 'UA-84546170-2',
  router: _router2.default,
  debug: {
    enabled: false
  }
});

/* eslint-disable no-new */
new _vue2.default({
  el: '#app',
  store: _store2.default,
  router: _router2.default,
  render: function render(h) {
    return h(_App2.default);
  }
});

});

require.register("router/index.js", function(exports, require, module) {
'use strict';

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vueRouter = require('vue-router');

var _vueRouter2 = _interopRequireDefault(_vueRouter);

var _Landing = require('../views/Landing');

var _Landing2 = _interopRequireDefault(_Landing);

var _Selector = require('../views/Selector');

var _Selector2 = _interopRequireDefault(_Selector);

var _Letter = require('../views/Letter');

var _Letter2 = _interopRequireDefault(_Letter);

var _Receiver = require('../views/Receiver');

var _Receiver2 = _interopRequireDefault(_Receiver);

var _Sender = require('../views/Sender');

var _Sender2 = _interopRequireDefault(_Sender);

var _Confirm = require('../views/Confirm');

var _Confirm2 = _interopRequireDefault(_Confirm);

var _ThankYou = require('../views/ThankYou');

var _ThankYou2 = _interopRequireDefault(_ThankYou);

var _Promo = require('../views/Promo');

var _Promo2 = _interopRequireDefault(_Promo);

var _Valentine = require('../views/Valentine');

var _Valentine2 = _interopRequireDefault(_Valentine);

var _Share = require('../views/Share');

var _Share2 = _interopRequireDefault(_Share);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Components
_vue2.default.use(_vueRouter2.default);

// TODO: Move the bellow data/copy into the assets/data/data.js for better decoupling of logic/content
var router = new _vueRouter2.default({
  routes: [{
    // Redirect any unkown route back to the start
    path: '*',
    redirect: '/'
  }, {
    name: 'landing',
    path: '/',
    component: _Landing2.default,
    props: {
      copy: data.landing,
      next: '/selector'
    }
  }, {
    name: 'selector',
    path: '/selector',
    component: _Selector2.default,
    props: {
      copy: data.selector,
      next: '/letter'
    }
  }, {
    name: 'letter',
    path: '/letter',
    component: _Letter2.default,
    props: {
      copy: data.letter,
      next: '/receiver',
      previous: data.letter.previous
    }
  }, {
    name: 'receiver',
    path: '/receiver',
    component: _Receiver2.default,
    props: {
      copy: data.receiver,
      next: '/sender'
    }
  }, {
    name: 'sender',
    path: '/sender',
    component: _Sender2.default,
    props: {
      copy: data.sender,
      next: '/confirm'
    }
  }, {
    name: 'confirm',
    path: '/confirm',
    component: _Confirm2.default,
    props: {
      copy: data.confirm,
      next: '/thank-you'
    }
  }, {
    name: 'thankYou',
    path: '/thank-you',
    component: _ThankYou2.default,
    props: {
      copy: data.thankYou
    }
  }, {
    name: 'promo',
    path: '/promo',
    component: _Promo2.default,
    props: {
      copy: data.promo
    }
  }, {
    name: 'valentine',
    path: '/valentine',
    component: _Valentine2.default,
    props: {
      copy: data.valentine,
      next: '/valentine/letter'
    }
  }, {
    name: 'valentineLetter',
    path: '/valentine/letter',
    component: _Letter2.default,
    props: {
      copy: data.valentineLetter,
      next: '/valentine/share'
    }
  }, {
    name: 'share',
    path: '/valentine/share',
    component: _Share2.default,
    props: {
      copy: data.share
    }
  }]
});

router.beforeEach(function (to, from, next) {

  // Stops the user going to any page without first loading the landing page
  if (from.name === null) {

    if (to.name === 'landing' || to.name === 'valentine') {

      next();
      return;
    }

    next('/');
  }

  next();
});

module.exports = router;

});

require.register("store/index.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vuex = require('vuex');

var _vuex2 = _interopRequireDefault(_vuex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vuex2.default);

exports.default = new _vuex2.default.Store({

  state: {

    isMobile: false,

    active: 0,

    answers: [],

    choicesDisabled: false,

    canProceed: false,

    selected: null,

    data: {

      sender: {
        name: '',
        email: '',
        subscribe: false
      },

      receiver: {
        name: '',
        email: '',
        subscribe: false
      }

    }

  },

  mutations: {
    addSelected: function addSelected(state, payload) {

      state.answers.push({ index: payload.index, copy: '' });

      state.selected = payload.index;
    },
    removeSelected: function removeSelected(state, payload) {

      // NOTE: IE does not support .findIndex()
      var _index = state.answers.findIndex(function (item, index) {

        return item.index === payload.index;
      });

      state.answers.splice(_index, 1);

      if (state.answers.length > 0) {

        state.selected = state.answers[state.answers.length - 1].index;
      } else {

        state.selected = null;
      }
    },
    enableChoices: function enableChoices(state) {

      state.choicesDisabled = false;
    },
    disableChoices: function disableChoices(state) {

      state.choicesDisabled = true;
    },
    addAnswer: function addAnswer(state, payload) {

      state.answers.forEach(function (answer, index) {

        if (answer.index === payload.index) {

          state.answers[index].copy = payload.input;
        }
      });
    },
    addAnswers: function addAnswers(state, payload) {

      payload.answers.forEach(function (copy, index) {

        state.answers[index].copy = copy;
      });
    },
    addEmail: function addEmail(state, payload) {

      state.data[payload.target].name = payload.name;
      state.data[payload.target].email = payload.email;
    },
    toggleIsMobile: function toggleIsMobile(state, payload) {

      state.isMobile = payload.boolean;
    },
    updateActive: function updateActive(state, index) {

      state.active = index;
    },
    toggleProceed: function toggleProceed(state, payload) {

      state.canProceed = payload;
    }
  }

});

});

require.register("views/Confirm.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("h3[data-v-6228e473]{border-bottom:1px solid #000;padding-bottom:1rem}p[data-v-6228e473]{font-weight:700;font-size:1.5rem;margin:2rem 0}P>span[data-v-6228e473]{color:#f17691}button[data-v-6228e473]{width:30%;margin-top:2rem}button[data-v-6228e473]:first-of-type{margin-right:3%}@media screen and (max-width:420px){button[data-v-6228e473]{width:auto}}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _NavButton = require('../components/NavButton');

var _NavButton2 = _interopRequireDefault(_NavButton);

var _SvgDecorator = require('../components/SvgDecorator');

var _SvgDecorator2 = _interopRequireDefault(_SvgDecorator);

var _TermsConditions = require('../components/TermsConditions');

var _TermsConditions2 = _interopRequireDefault(_TermsConditions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  name: 'confirm',

  props: ['copy', 'next'],

  components: {

    NavButton: _NavButton2.default,
    SvgDecorator: _SvgDecorator2.default,
    TermsConditions: _TermsConditions2.default

  },

  beforeRouteLeave: function beforeRouteLeave(to, from, next) {

    if (to.name === 'thankYou') {
      var headers = new Headers();

      headers.set('Accept', 'application/json');

      var formData = new FormData();

      formData.append('SNAME', this.$store.state.data.sender.name);
      formData.append('SEMAIL', this.$store.state.data.sender.email);

      formData.append('NAME', this.$store.state.data.receiver.name);
      formData.append('email', this.$store.state.data.receiver.email);

      this.$store.state.answers.forEach(function (answer, index) {
        formData.append('INDEX' + index, answer.index);
        formData.append('TEXT' + index, answer.copy);
      });

      var url = './mailchimp.php';
      var fetchOptions = {
        method: 'POST',
        headers: headers,
        body: formData
      };

      var responsePromise = fetch(url, fetchOptions);

      responsePromise.then(function (response) {
        return response.json();
      }).then(function (jsonData) {}).then(next);
    } else {

      next();
    }
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('h2',[_vm._v(_vm._s(_vm.copy.heading))]),_vm._v(" "),_c('svg-decorator'),_vm._v(" "),_c('h3',{staticClass:"to-stagger"},[_vm._v(_vm._s(_vm.copy.subheading))]),_vm._v(" "),_c('p',{staticClass:"to-stagger"},[_vm._v(_vm._s(_vm.copy.confirmation.prefix)+" "),_c('span',{staticClass:"highlight"},[_vm._v(_vm._s(this.$store.state.data.receiver.name))]),_vm._v(" "+_vm._s(_vm.copy.confirmation.suffix)+" "),_c('span',{staticClass:"highlight"},[_vm._v(_vm._s(this.$store.state.data.receiver.email))])]),_vm._v(" "),_c('terms-conditions',{attrs:{"copy":_vm.copy}}),_vm._v(" "),_c('nav-button',{staticClass:"to-stagger",attrs:{"back":"true","tabindex":"3"}},[_vm._v(_vm._s(_vm.copy.previous))]),_vm._v(" "),_c('nav-button',{staticClass:"to-stagger",attrs:{"dest":_vm.next,"tabindex":"2"}},[_vm._v(_vm._s(_vm.copy.button))])],1)}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-6228e473"

});

;require.register("views/Landing.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("@media screen and (max-width:768px){button[data-v-6b44b44a]{margin-top:2rem}}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _HeroLogo = require('../components/HeroLogo');

var _HeroLogo2 = _interopRequireDefault(_HeroLogo);

var _NavButton = require('../components/NavButton');

var _NavButton2 = _interopRequireDefault(_NavButton);

var _SvgDecorator = require('../components/SvgDecorator');

var _SvgDecorator2 = _interopRequireDefault(_SvgDecorator);

var _Paragraphs = require('../components/Paragraphs');

var _Paragraphs2 = _interopRequireDefault(_Paragraphs);

var _Tagline = require('../components/Tagline');

var _Tagline2 = _interopRequireDefault(_Tagline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  name: 'landing',

  props: ['copy', 'next'],

  components: {

    HeroLogo: _HeroLogo2.default,
    NavButton: _NavButton2.default,
    SvgDecorator: _SvgDecorator2.default,
    Paragraphs: _Paragraphs2.default,
    Tagline: _Tagline2.default

  },

  data: function data() {

    return {

      step: 0

    };
  },


  computed: {
    mobile: function mobile() {

      return this.$store.state.isMobile;
    },
    heading: function heading() {

      return this.$store.state.data.receiver.name;
    }
  }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('hero-logo'),_vm._v(" "),(!_vm.mobile)?_c('svg-decorator',{attrs:{"flip":"true"}}):_vm._e(),_vm._v(" "),(!_vm.mobile)?_c('div',[(_vm.step === 0)?_c('paragraphs',{key:_vm.copy[0].paragraphs[0].key,attrs:{"paragraphs":_vm.copy[0].paragraphs}}):_vm._e(),_vm._v(" "),(_vm.step === 1)?_c('paragraphs',{key:_vm.copy[1].paragraphs[0].key,attrs:{"paragraphs":_vm.copy[1].paragraphs}}):_vm._e()],1):_vm._e(),_vm._v(" "),_c('svg-decorator'),_vm._v(" "),_c('div',{staticStyle:{"padding":"1rem 0"}},[_c('tagline',{attrs:{"step":_vm.step}},[_vm._v(_vm._s(_vm.mobile ? _vm.copy[ _vm.step ].mobTagline : _vm.copy[ _vm.step ].tagline))])],1),_vm._v(" "),(_vm.mobile)?_c('svg-decorator',{attrs:{"flip":"true"}}):_vm._e(),_vm._v(" "),(_vm.step === 0)?_c('button',{attrs:{"type":"button","name":"button"},on:{"click":function($event){_vm.step = 1}}},[_vm._v(_vm._s(_vm.copy[ _vm.step ].button))]):_vm._e(),_vm._v(" "),(_vm.step === 1)?_c('nav-button',{attrs:{"dest":_vm.next}},[_vm._v(_vm._s(_vm.copy[ _vm.step ].button))]):_vm._e()],1)}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-6b44b44a"

});

;require.register("views/Letter.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("section[data-v-7f1b5943]{display:flex;flex-direction:row;align-items:center;max-width:1200px}.valentine[data-v-7f1b5943]{flex-direction:column}.valentine>.letter[data-v-7f1b5943]{margin-bottom:2rem}.letter[data-v-7f1b5943]{display:block;margin:auto;border:34px solid #f1e8dc;box-sizing:border-box;border-image:url(imgs/letter/border.jpg) fill 34 repeat;padding:12px 64px 64px;box-shadow:0 0 32px rgba(0,0,0,.5);text-align:left;max-width:700px}.letter p[data-v-7f1b5943]{font-size:1.5rem;line-height:2rem}button[data-v-7f1b5943]{white-space:nowrap;min-width:150px}button[data-v-7f1b5943]:first-child{margin-right:2.5%}button[data-v-7f1b5943]:last-child{margin-left:2.5%}p[data-v-7f1b5943]:last-of-type{display:inline-block}img[data-v-7f1b5943]{margin:1rem auto 3rem;width:80%;max-width:220px;display:block}.blur[data-v-7f1b5943]{-webkit-filter:blur(4px);filter:blur(4px);font-size:3rem}.reveal[data-v-7f1b5943]{background-color:#c374c4;float:right}@media screen and (max-width:768px){section[data-v-7f1b5943]{flex-wrap:wrap;justify-content:space-around}.letter[data-v-7f1b5943]{width:100%;padding:28px}button[data-v-7f1b5943]{position:relative;left:auto;top:auto;right:auto;bottom:auto;margin:0;margin-top:2rem}button[data-v-7f1b5943]:last-child{right:auto;top:auto}}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _NavButton = require('../components/NavButton');

var _NavButton2 = _interopRequireDefault(_NavButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  name: 'letter',

  props: ['next', 'previous', 'copy'],

  components: {

    NavButton: _NavButton2.default

  },

  computed: {
    selected: function selected() {

      return this.$store.state.answers;
    },
    sender: function sender() {

      return this.$store.state.data.sender;
    },
    receiver: function receiver() {

      return this.$store.state.data.receiver;
    },
    mobile: function mobile() {

      return this.$store.state.isMobile;
    }
  },

  data: function data() {

    return {
      characters: characters

    };
  },


  methods: {
    reveal: function reveal() {

      TweenMax.to('.blur', 1, {
        filter: 'blur(0px)'
      });

      TweenMax.to('.reveal', 1, {
        autoAlpha: 0,
        ease: Linear.easeNone
      });
    }
  }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',{class:[ _vm.sender.name ? 'valentine' : '']},[(!_vm.mobile && _vm.previous)?_c('nav-button',{attrs:{"back":"true","tabindex":"2"}},[_vm._v(_vm._s(_vm.previous))]):_vm._e(),_vm._v(" "),_c('div',{staticClass:"letter"},[_c('img',{staticClass:"penhaligons_logo",attrs:{"src":"./imgs/shared/penhaligons_logo.svg","alt":"Penhaligon's - EST. LONDON 1870"}}),_vm._v(" "),_c('p',{staticClass:"tk-relation-two"},[_vm._v(_vm._s(_vm.copy.greeting)+" "+_vm._s(this.receiver.name))]),_vm._v(" "),_vm._l((this.selected),function(item,index){return _c('p',{staticClass:"tk-relation-two"},[_vm._v(_vm._s(_vm.characters[ item.index ].prefix)+" "),_c('span',{staticClass:"highlight"},[_vm._v(_vm._s(item.copy))]),_vm._v(" "+_vm._s(_vm.characters[ item.index ].suffix))])}),_vm._v(" "),_c('p',{staticClass:"tk-relation-two",domProps:{"innerHTML":_vm._s(_vm.copy.signOff)}}),_vm._v(" "),(_vm.sender.name)?_c('p',{staticClass:"blur tk-relation-two"},[_vm._v(_vm._s(this.sender.name))]):_vm._e(),_vm._v(" "),(_vm.copy.reveal)?_c('button',{staticClass:"reveal",on:{"click":_vm.reveal}},[_vm._v(_vm._s(_vm.copy.reveal))]):_vm._e()],2),_vm._v(" "),(_vm.mobile && _vm.previous)?_c('nav-button',{attrs:{"back":"true","tabindex":"2"}},[_vm._v(_vm._s(_vm.previous))]):_vm._e(),_vm._v(" "),_c('nav-button',{attrs:{"dest":_vm.next,"tabindex":"1"}},[_vm._v(_vm._s(_vm.copy.button)+" ")])],1)}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-7f1b5943"

});

;require.register("views/Promo.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("h2[data-v-3d461202]{font-size:3.5rem;margin-bottom:1rem}h3[data-v-3d461202]{font-size:1.5rem;margin:1rem 0 0}@media screen and (max-width:420px){h3[data-v-3d461202]{font-size:1.2rem}}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SvgDecorator = require('../components/SvgDecorator');

var _SvgDecorator2 = _interopRequireDefault(_SvgDecorator);

var _Perfumes = require('../components/Perfumes');

var _Perfumes2 = _interopRequireDefault(_Perfumes);

var _ThankYouTransitions = require('../animations/ThankYouTransitions');

var _ThankYouTransitions2 = _interopRequireDefault(_ThankYouTransitions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  components: {

    SvgDecorator: _SvgDecorator2.default,
    Perfumes: _Perfumes2.default

  },

  props: ['copy']

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{staticClass:"perfumes"},[_c('h3',{domProps:{"innerHTML":_vm._s(_vm.copy.heading)}}),_vm._v(" "),_c('svg-decorator'),_vm._v(" "),_c('perfumes'),_vm._v(" "),_c('svg-decorator'),_vm._v(" "),_c('h3',[_vm._v(_vm._s(_vm.copy.cta.text)+" "),_c('a',{attrs:{"href":_vm.copy.cta.url,"target":"_blank"}},[_c('span',{staticClass:"highlight"},[_vm._v(_vm._s(_vm.copy.cta.productName))])])])],1)])}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-3d461202"

});

;require.register("views/Receiver.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("section[data-v-3b90c54c]{max-width:500px;text-align:center}input[data-v-3b90c54c]{width:100%;background:transparent;border:none;border-bottom:1px solid #000;color:#f17691;font-family:Lovato;font-weight:700;font-size:2rem}p[data-v-3b90c54c]{font-family:Lovato;font-weight:700;margin:2rem 0 0;text-align:left}button[data-v-3b90c54c]{width:45%;margin-top:2rem}.legals[data-v-3b90c54c]{text-align:center;font-size:.75rem;line-height:.8rem;margin:3rem 0 1rem;font-weight:400}@media screen and (max-width:768px){section[data-v-3b90c54c]{display:flex;flex-wrap:wrap}h2[data-v-3b90c54c]{width:100%}button[data-v-3b90c54c]:last-of-type{margin-left:auto;margin-right:0}}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _NavButton = require('../components/NavButton');

var _NavButton2 = _interopRequireDefault(_NavButton);

var _SvgDecorator = require('../components/SvgDecorator');

var _SvgDecorator2 = _interopRequireDefault(_SvgDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  components: {

    NavButton: _NavButton2.default,
    SvgDecorator: _SvgDecorator2.default

  },

  props: ['copy', 'next'],

  data: function data() {

    return {

      payload: {

        type: 'addEmail',
        target: '',
        name: '',
        email: ''

      },

      enabledClass: 'enabled',
      disabledClass: 'disabled'

    };
  },


  computed: {
    isEnabled: function isEnabled() {

      return this.payload.name.length !== 0 && this.isEmail(this.payload.email);
    },
    mobile: function mobile() {

      return this.$store.state.isMobile;
    }
  },

  methods: {
    isEmail: function isEmail(email) {

      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      return re.test(email.toLowerCase());
    }
  },

  beforeRouteEnter: function beforeRouteEnter(to, from, next) {

    next(function (vm) {
      vm.payload.name = vm.$store.state.data[vm.$route.name].name;
      vm.payload.email = vm.$store.state.data[vm.$route.name].email;

      vm.$el.querySelector('input[type=text]').focus();
    });
  },
  beforeRouteLeave: function beforeRouteLeave(to, from, next) {
    this.payload.target = this.$route.name;

    this.$store.commit(this.payload);

    next();
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('h2',[_vm._v(_vm._s(_vm.copy.heading))]),_vm._v(" "),_c('svg-decorator'),_vm._v(" "),_c('p',{staticClass:"to-stagger"},[_vm._v(_vm._s(_vm.copy.nameToolTip))]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.payload.name),expression:"payload.name"}],staticClass:"to-stagger",attrs:{"type":"text","autofocus":"","tabindex":"1"},domProps:{"value":(_vm.payload.name)},on:{"input":function($event){if($event.target.composing){ return; }_vm.payload.name=$event.target.value}}}),_vm._v(" "),_c('p',{staticClass:"to-stagger"},[_vm._v(_vm._s(_vm.copy.emailToolTip))]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.payload.email),expression:"payload.email"}],staticClass:"to-stagger",attrs:{"type":"email","tabindex":"2"},domProps:{"value":(_vm.payload.email)},on:{"input":function($event){if($event.target.composing){ return; }_vm.payload.email=$event.target.value}}}),_vm._v(" "),_c('nav-button',{staticClass:"to-stagger",attrs:{"back":"true","tabindex":"4"}},[_vm._v(_vm._s(_vm.copy.previous))]),_vm._v(" "),_c('nav-button',{class:[ _vm.isEnabled ? _vm.enabledClass : _vm.disabledClass, 'to-stagger' ],attrs:{"dest":_vm.next,"tabindex":"3"}},[_vm._v(_vm._s(_vm.copy.button))]),_vm._v(" "),(_vm.copy.legals)?_c('p',{staticClass:"legals to-stagger"},[_vm._v(_vm._s(_vm.copy.legals))]):_vm._e()],1)}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-3b90c54c"

});

;require.register("views/Selector.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("section[data-v-11d4573c]{max-width:1200px}.selector[data-v-11d4573c]{padding:1.25% 0}.selector>div[data-v-11d4573c]{display:inline-block;margin:0;float:left}.selector[data-v-11d4573c]:after{content:\"\";display:block;height:0;visibility:hidden;clear:both}.selector[data-v-11d4573c]{display:flex}@media screen and (max-width:768px){.selector[data-v-11d4573c]{flex-direction:column}}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _NavButton = require('../components/NavButton');

var _NavButton2 = _interopRequireDefault(_NavButton);

var _SelectorChoices = require('../components/Selector/SelectorChoices');

var _SelectorChoices2 = _interopRequireDefault(_SelectorChoices);

var _SelectorAvatar = require('../components/Selector/SelectorAvatar');

var _SelectorAvatar2 = _interopRequireDefault(_SelectorAvatar);

var _SelectorDetails = require('../components/Selector/SelectorDetails');

var _SelectorDetails2 = _interopRequireDefault(_SelectorDetails);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  name: 'selector',

  props: ['copy', 'next'],

  components: {

    NavButton: _NavButton2.default,
    SelectorChoices: _SelectorChoices2.default,
    SelectorAvatar: _SelectorAvatar2.default,
    SelectorDetails: _SelectorDetails2.default

  },

  data: function data() {

    return {

      choicesEnabled: true,

      characters: characters,

      enabledClass: 'enabled',
      disabledClass: 'disabled'

    };
  },


  computed: {
    mobile: function mobile() {

      return this.$store.state.isMobile;
    },
    canProceed: function canProceed() {

      return this.$store.state.canProceed;
    }
  }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('div',{staticClass:"selector"},[_c('selector-choices',{attrs:{"characters":_vm.characters,"copy":_vm.copy,"mobile":_vm.mobile}}),_vm._v(" "),(!_vm.mobile)?_c('selector-avatar',{attrs:{"characters":_vm.characters}}):_vm._e(),_vm._v(" "),(!_vm.mobile)?_c('selector-details',{attrs:{"characters":_vm.characters,"copy":_vm.copy}}):_vm._e()],1),_vm._v(" "),_c('nav-button',{class:[_vm.canProceed ? _vm.enabledClass : _vm.disabledClass],attrs:{"dest":_vm.next}},[_vm._v(_vm._s(_vm.copy.button))])],1)}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-11d4573c"

});

;require.register("views/Sender.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("section[data-v-6f72afd2]{text-align:center;max-width:500px}input[data-v-6f72afd2]{width:100%;background:transparent;border:none;border-bottom:1px solid #000;color:#f17691;font-family:Lovato;font-weight:700;font-size:2rem}p[data-v-6f72afd2]{font-family:Lovato;font-weight:700;margin:2rem 0 0;text-align:left}button[data-v-6f72afd2]{width:45%;margin-top:2rem}.legals[data-v-6f72afd2]{text-align:center;font-size:.75rem;line-height:.8rem;margin:3rem 0 1rem;font-weight:400}@media screen and (max-width:768px){section[data-v-6f72afd2]{display:flex;flex-wrap:wrap}h2[data-v-6f72afd2]{width:100%}button[data-v-6f72afd2]:last-of-type{margin-left:auto;margin-right:0}}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _NavButton = require('../components/NavButton');

var _NavButton2 = _interopRequireDefault(_NavButton);

var _SvgDecorator = require('../components/SvgDecorator');

var _SvgDecorator2 = _interopRequireDefault(_SvgDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  components: {

    NavButton: _NavButton2.default,
    SvgDecorator: _SvgDecorator2.default

  },

  props: ['copy', 'next'],

  data: function data() {

    return {

      payload: {

        type: 'addEmail',
        target: '',
        name: '',
        email: ''

      },

      enabledClass: 'enabled',
      disabledClass: 'disabled'

    };
  },


  computed: {
    isEnabled: function isEnabled() {

      return this.payload.name.length !== 0 && this.isEmail(this.payload.email);
    },
    mobile: function mobile() {

      return this.$store.state.isMobile;
    }
  },

  methods: {
    isEmail: function isEmail(email) {

      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      return re.test(email.toLowerCase());
    }
  },

  beforeRouteEnter: function beforeRouteEnter(to, from, next) {

    next(function (vm) {
      vm.payload.name = vm.$store.state.data[vm.$route.name].name;
      vm.payload.email = vm.$store.state.data[vm.$route.name].email;

      vm.$el.querySelector('input[type=text]').focus();
    });
  },
  beforeRouteLeave: function beforeRouteLeave(to, from, next) {
    this.payload.target = this.$route.name;

    this.$store.commit(this.payload);

    next();
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('h2',[_vm._v(_vm._s(_vm.copy.heading))]),_vm._v(" "),_c('svg-decorator'),_vm._v(" "),_c('p',{staticClass:"to-stagger"},[_vm._v(_vm._s(_vm.copy.nameToolTip))]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.payload.name),expression:"payload.name"}],staticClass:"to-stagger",attrs:{"type":"text","autofocus":"","tabindex":"1"},domProps:{"value":(_vm.payload.name)},on:{"input":function($event){if($event.target.composing){ return; }_vm.payload.name=$event.target.value}}}),_vm._v(" "),_c('p',{staticClass:"to-stagger"},[_vm._v(_vm._s(_vm.copy.emailToolTip))]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.payload.email),expression:"payload.email"}],staticClass:"to-stagger",attrs:{"type":"email","tabindex":"2"},domProps:{"value":(_vm.payload.email)},on:{"input":function($event){if($event.target.composing){ return; }_vm.payload.email=$event.target.value}}}),_vm._v(" "),_c('nav-button',{staticClass:"to-stagger",attrs:{"back":"true","tabindex":"4"}},[_vm._v(_vm._s(_vm.copy.previous))]),_vm._v(" "),_c('nav-button',{class:[ _vm.isEnabled ? _vm.enabledClass : _vm.disabledClass, 'to-stagger' ],attrs:{"dest":_vm.next,"tabindex":"3"}},[_vm._v(_vm._s(_vm.copy.button))]),_vm._v(" "),(_vm.copy.legals)?_c('p',{staticClass:"legals to-stagger"},[_vm._v(_vm._s(_vm.copy.legals))]):_vm._e()],1)}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-6f72afd2"

});

;require.register("views/Share.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert(".paragraphs[data-v-0eabb0d2]{overflow:hidden}h3[data-v-0eabb0d2]:last-of-type{margin-top:3rem}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SvgDecorator = require('../components/SvgDecorator');

var _SvgDecorator2 = _interopRequireDefault(_SvgDecorator);

var _SocialIcon = require('../components/SocialIcon');

var _SocialIcon2 = _interopRequireDefault(_SocialIcon);

var _subscribeUser = require('../helpers/subscribeUser');

var _subscribeUser2 = _interopRequireDefault(_subscribeUser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  name: 'share',

  props: ['copy'],

  components: {

    SvgDecorator: _SvgDecorator2.default,
    SocialIcon: _SocialIcon2.default

  },

  data: function data() {

    return {

      checked: false

    };
  },


  methods: {
    toggleTerms: function toggleTerms() {

      (0, _subscribeUser2.default)({
        subscribe: this.checked,
        name: this.$store.state.data.receiver.name,
        email: this.$store.state.data.receiver.email
      });

      this.checked != this.checked;
    }
  }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('h3',[_vm._v(_vm._s(_vm.copy.heading))]),_vm._v(" "),_c('svg-decorator'),_vm._v(" "),_c('div',{staticClass:"paragraphs"},[_c('p',[_vm._v(_vm._s(_vm.copy.tagline))]),_vm._v(" "),_c('p',[_vm._v("("),_c('a',{attrs:{"href":_vm.copy.legal.url,"target":"_blank"}},[_vm._v(_vm._s(_vm.copy.legal.text))]),_vm._v(")"),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.checked),expression:"checked"}],attrs:{"type":"checkbox","name":"subscribe"},domProps:{"checked":Array.isArray(_vm.checked)?_vm._i(_vm.checked,null)>-1:(_vm.checked)},on:{"change":_vm.toggleTerms,"__c":function($event){var $$a=_vm.checked,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=null,$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.checked=$$a.concat([$$v]))}else{$$i>-1&&(_vm.checked=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{_vm.checked=$$c}}}})]),_vm._v(" "),_vm._l((_vm.copy.social),function(icon){return _c('social-icon',{attrs:{"icon":icon}})})],2),_vm._v(" "),_c('svg-decorator',{attrs:{"flip":"true"}}),_vm._v(" "),_c('h3',[_c('a',{attrs:{"href":_vm.copy.cta.url,"target":"_blank"}},[_vm._v(_vm._s(_vm.copy.cta.text))])])],1)}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-0eabb0d2"

});

;require.register("views/ThankYou.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("h2[data-v-3a5f8d32]{font-size:3.5rem;margin-bottom:1rem}h3[data-v-3a5f8d32]{font-size:1.5rem;margin:1rem 0 0}@media screen and (max-width:420px){h2[data-v-3a5f8d32]{font-size:2rem}h3[data-v-3a5f8d32]{font-size:1.2rem}}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SvgDecorator = require('../components/SvgDecorator');

var _SvgDecorator2 = _interopRequireDefault(_SvgDecorator);

var _ThankYouTransitions = require('../animations/ThankYouTransitions');

var _ThankYouTransitions2 = _interopRequireDefault(_ThankYouTransitions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'thank-you',

  data: function data() {
    return {
      thanked: false
    };
  },


  components: {

    SvgDecorator: _SvgDecorator2.default

  },

  props: ['copy']

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[(!_vm.thanked)?_c('div',{staticClass:"thank"},[_c('h2',[_vm._v(_vm._s(_vm.copy.heading))]),_vm._v(" "),_c('svg-decorator'),_vm._v(" "),_c('h3',[_vm._v(_vm._s(_vm.copy.subheading))])],1):_vm._e()])}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-3a5f8d32"

});

;require.register("views/Valentine.vue", function(exports, require, module) {
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert(".paragraphs[data-v-19d1352e]{overflow:hidden}h2[data-v-19d1352e]{margin:0}h3[data-v-19d1352e]{font-size:1.5rem}@media screen and (max-width:768px){button[data-v-19d1352e]{margin-top:2rem}}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _HeroLogo = require('../components/HeroLogo');

var _HeroLogo2 = _interopRequireDefault(_HeroLogo);

var _NavButton = require('../components/NavButton');

var _NavButton2 = _interopRequireDefault(_NavButton);

var _SvgDecorator = require('../components/SvgDecorator');

var _SvgDecorator2 = _interopRequireDefault(_SvgDecorator);

var _Paragraphs = require('../components/Paragraphs');

var _Paragraphs2 = _interopRequireDefault(_Paragraphs);

var _Transitions = require('../animations/Transitions');

var _Transitions2 = _interopRequireDefault(_Transitions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  name: 'landing',

  props: ['copy', 'next'],

  components: {

    HeroLogo: _HeroLogo2.default,
    NavButton: _NavButton2.default,
    SvgDecorator: _SvgDecorator2.default,
    Paragraphs: _Paragraphs2.default

  },

  data: function data() {

    return {

      step: 0

    };
  },


  computed: {
    mobile: function mobile() {

      return this.$store.state.isMobile;
    },
    heading: function heading() {

      return this.$store.state.data.receiver.name;
    }
  },

  mounted: function mounted() {

    var vm = this;

    if (window.location.search === '') {
      this.$router.push('/');
      return;
    }

    if (vm.$store.state.answers.length > 0) {
      return;
    }

    var urlSearchData = function urlSearchData(searchString) {
      if (!searchString) return false;
      return searchString.substring(1).split('&').reduce(function (result, next) {
        var pair = next.split('=');
        result[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);

        return result;
      }, {});
    };

    var searchData = urlSearchData(window.location.search);

    var headers = new Headers();

    headers.set('Accept', 'application/json');

    var formData = new FormData();
    formData.append('MD5', searchData.i);

    var url = './mailchimp.php';
    var fetchOptions = {
      method: 'POST',
      headers: headers,
      body: formData
    };

    var responsePromise = fetch(url, fetchOptions);

    responsePromise.then(function (response) {
      return response.json();
    }).then(function (jsonData) {

      var thisData = jsonData.received;

      vm.$store.commit({
        type: 'addEmail',
        target: 'sender',
        name: thisData.merge_fields.SNAME,
        email: thisData.merge_fields.SEMAIL
      });

      vm.$store.commit({
        type: 'addEmail',
        target: 'receiver',
        name: thisData.merge_fields.NAME,
        email: thisData.email_address
      });

      var answers = [];

      answers.push({
        index: thisData.merge_fields.INDEX0,
        copy: thisData.merge_fields.TEXT0
      });
      answers.push({
        index: thisData.merge_fields.INDEX1,
        copy: thisData.merge_fields.TEXT1
      });
      answers.push({
        index: thisData.merge_fields.INDEX2,
        copy: thisData.merge_fields.TEXT2
      });

      answers.forEach(function (answer) {
        vm.$store.commit({
          type: 'addSelected',
          index: answer.index
        });
        vm.$store.commit({
          type: 'addAnswer',
          input: answer.copy,
          index: answer.index
        });
      });

      _Transitions2.default.valentine.firstEnter(vm.mobile);
    }).catch(function (err) {
      vm.$router.push('/');
    });
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',[_c('hero-logo'),_vm._v(" "),_c('svg-decorator',{attrs:{"flip":"true"}}),_vm._v(" "),_c('div',{staticClass:"paragraphs"},[(_vm.copy.heading)?_c('h2',[_vm._v(_vm._s(_vm.copy.heading)+" "+_vm._s(this.$store.state.data.receiver.name)+"...")]):_vm._e()]),_vm._v(" "),_c('svg-decorator'),_vm._v(" "),_c('h3',{domProps:{"innerHTML":_vm._s(_vm.copy.tagline)}}),_vm._v(" "),_c('nav-button',{attrs:{"dest":_vm.next}},[_vm._v(_vm._s(_vm.copy.button))])],1)}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-19d1352e"

});

;require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

