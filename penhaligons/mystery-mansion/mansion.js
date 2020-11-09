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
require.register("js/mansion/Mansion.js", function(exports, require, module) {
'use strict';

var threeMansion = require('./threeMansion');
var riddles = require('./riddles');
var answers = require('./answers');

var Mansion = {
  _name: 'Mansion',
  step: 0,

  init: function init(parent) {
    this.parent = parent;
    this.count = 0;

    var bt = document.querySelector('#startScreen #continue');
    bt.addEventListener('click', this.hideStartScreen.bind(this));

    // Wait until all the bellow is finished loading
    // maybe add a callback to this function so we can pass the showStartScreen into threeMansion
    riddles.init(this);
    answers.init(this);
    threeMansion.init(this);
  },

  showStartScreen: function showStartScreen() {
    TweenMax.to('#startScreen', 1, {
      autoAlpha: 1,
      ease: Power1.easeInOut,
      // For testing only
      // onComplete:this.hideStartScreen,
      onCompleteScope: this
    });
    TweenMax.to('canvas', 1, {
      autoAlpha: 1,
      delay: 0.75
    });
  },

  hideStartScreen: function hideStartScreen() {
    TweenMax.to('#startScreen', 1, {
      autoAlpha: 0,
      ease: Linear.easeNone,
      onComplete: this.introAnimation,
      onCompleteScope: this
    });
  },

  introAnimation: function introAnimation() {
    threeMansion.intro.play();
  },

  introAnimationComplete: function introAnimationComplete() {
    riddles.introAnimation();
    threeMansion.enableClick();
  },

  handleClick: function handleClick(child, hit) {
    var wasHit = answers.checkHit(hit);

    if (child._name === 'lock') {
      riddles.enable();
      return;
    }
    switch (wasHit) {
      case 'clue':
        threeMansion.disableClick();
        threeMansion.childAnimation(hit, wasHit);
        riddles.disable();
        answers.populate();
        break;

      case 'locked':
        riddles.disable();
        answers.lock.animateIn();
        break;

      case 'william':
        // console.log('[Mansion] found william');
        TweenMax.set('#draggable', { className: '-=keyCursor' });
        threeMansion.outroAnimation();
        break;

      default:
        // console.log('[Mansion] defaulted');
        threeMansion.childAnimation(hit, wasHit);
    }

    if (this.step === 5)
      // Kill any calls to the user nudge
      TweenMax.killDelayedCallsTo(answers.lock.animateIn);
  },

  showAnswer: function showAnswer() {
    answers.showAnswer();
    threeMansion.stopRender();
  },

  goToNext: function goToNext() {
    this.step++;
    if (this.step === 4) {
      // This is the step where I also show the key
      answers.populate();
      answers.showAnswer();
      return;
    }
    if (this.step === 5) {
      // We're looking for the grandfather clock. Wait 8 seconds, then show the lock screen as an encouragement
      TweenMax.delayedCall(8, answers.lock.animateIn, [], answers.lock);
    }
    threeMansion.enableClick();
    riddles.goToNext();
  },

  zoomIntoMansion: function zoomIntoMansion() {
    threeMansion.zoomIn();
  },

  shouldHideRiddle: function shouldHideRiddle() {
    // Hide the clue if showing
    if (riddles.showing) riddles.animateOut();
  }
};

module.exports = Mansion;

});

require.register("js/mansion/answers.js", function(exports, require, module) {
'use strict';

// const idb = require('idb')

var validateEmail = require('./../shared/validateEmail');
var lock = require('./lock');

var answers = {
  _name: 'answers',
  holder: document.querySelector('#answersHolder'),
  button: document.querySelector('#answersHolder #submit'),
  content: [{
    number: 'You\'ve found the 1<sup>st</sup> clue!',
    promo: 'You now have the chance to <span>WIN</span> the full<br><span>Penhaligon\'s Portraits collection</span>.',
    copy: 'Hidden behind the <span>Lion\'s portrait</span> you discovered a bottle of <span>poison</span>, used to render people unconscious!',
    image: 'chloroform.png',
    name: 'Poison'
  }, {
    number: 'You\'ve found the 2<sup>nd</sup> clue!',
    copy: 'Hidden <span>behind</span> the <span>mirror</span> you discover <span>William Truthbury\'s</span> Journal. This means he must have been in the mansion recently!',
    image: 'journal.png',
    name: 'Journal'
  }, {
    number: 'You\'ve found the 3<sup>rd</sup> clue!',
    copy: 'Hidden in <span>the bells</span> you discovered a <span>secret note</span>. From William\'s journal perhaps? What could it mean?',
    image: 'note.png',
    name: 'Note'
  }, {
    number: 'You\'ve found the 4<sup>th</sup> clue!',
    copy: 'A <span>wedding ring</span>! How curious.<br>Someone must of dropped their <span>wedding ring</span> in the teapot. <span>Who</span> could this belong to?',
    image: 'ring.png',
    name: 'Ring'
  }, {
    number: 'Oh and you\'ve found a key.',
    copy: 'On finding <span>William\'s Journal</span> you\'ve discovered a <span>key</span>. What would one use a key for I wonder? Tick tock…',
    image: 'key.png',
    name: 'Key'
  }],

  init: function init(parent, callback) {
    // console.log('[answers] init');
    this.parent = parent;

    this.button.addEventListener('click', this.hideAnswer.bind(this));

    this.lock = lock;

    this.populate();

    this.lock.init(parent);
  },

  populate: function populate() {
    var currStep = this.parent.step;

    var number = this.holder.querySelector('.form h2');
    number.innerHTML = this.content[currStep].number;

    var promo = this.holder.querySelector('.promo');
    if (this.content[currStep].promo) promo.innerHTML = this.content[currStep].promo;

    var copy = this.holder.querySelector('.copy');
    copy.innerHTML = this.content[currStep].copy;

    var image = this.holder.querySelector('.image');
    image.innerHTML = '<img src="./imgs/answers/' + this.content[currStep].image + '" >';

    var name = this.holder.querySelector('.name');
    name.innerHTML = this.content[currStep].name;
  },

  checkHit: function checkHit(hit) {
    // Force the lock out of view by default
    this.lock.animateOut();

    switch (hit) {
      case 'room02_answer':
        if (this.parent.step === 0) {
          return 'clue';
        }
        break;

      case 'room01_answer':
        if (this.parent.step === 1) {
          return 'clue';
        }
        break;

      case 'room05_answer':
        if (this.parent.step === 2) {
          return 'clue';
        }
        break;

      case 'room03_answer':
        if (this.parent.step === 3) {
          return 'clue';
        }
        break;

      case 'room04_answer':
        if (this.parent.step === 5) {
          return 'william';
        } else {
          return 'locked';
        }
        break;

      default:
        // console.log('handleClick defaulted');
    }
  },

  showAnswer: function showAnswer() {
    TweenMax.to(this.holder, 0.3, { autoAlpha: 1 });
  },

  hideAnswer: function hideAnswer(e) {
    // We're hijacking the form submission somewhere else
    e.preventDefault();

    // Check to see if there's an email address
    var email = document.querySelector('#email');

    // Have we got a valid email value?
    if (!validateEmail(email.value)) {
      // console.log('[answers] email is not valid');
      // No
      // Don't let the user continue
      // Highlight the error
      var tl = new TimelineLite();
      tl.set('.emailForm > #email', {
        borderColor: 'red'
      });
      tl.fromTo('.emailForm > #email', 0.025, {
        xPercent: -1
      }, {
        xPercent: 1,
        repeat: 5,
        repeatDelay: 0.025,
        yoyo: true,
        ease: Linear.easeNone
      });
      tl.set('.emailForm > #email', {
        xPercent: 0
      }, '+=0.025');

      return;
    } else {
      // We got a valid email or no text at all, hide the input field and promo message
      // console.log('[answers] valid email or no text');
      var hides = '.emailForm > .offer';
      TweenMax.to(hides, 0.3, {
        autoAlpha: 0,
        onComplete: function onComplete() {
          TweenMax.set(hides, { display: 'none' });
          TweenMax.set('#submit', { attr: { type: 'button' } });
        }
      });

      if (this.parent.step < this.content.length + 1) {
        // console.log('[answers] go to next');
        TweenMax.to(this.holder, 0.3, {
          autoAlpha: 0,
          onComplete: this.parent.goToNext,
          onCompleteScope: this.parent
        });
      } else {
        // console.log('[answers] end of questions');
        TweenMax.to(this.holder, 0.3, {
          autoAlpha: 0,
          onComplete: function onComplete() {
            // TODO: We've got to the end of the steps
            // console.log('[answers] end of questions', this);
            this.outroAnimation(); // hack!!!
          },
          onCompleteScope: this.parent
        });
      }
    }

    if (this.parent.step === 4) {
      // console.log('KEYS!!');
      // Show a key as the cursor
      // TODO: Find a way to make the cursor look nicer, currently too ugly, blurry, not visible enough
      TweenMax.set('#draggable', { className: '+=keyCursor' });
    }
  }
};

module.exports = answers;

});

require.register("js/mansion/controls.js", function(exports, require, module) {
'use strict';

var controls = {
  init: function init(canvas, parent) {
    // console.log('[controls] init', canvas);
    this.canvas = canvas;

    // Bin mouse/touch event handlers for future manipulation
    this.mousing = this.mouseMove.bind(this);
    this.touching = this.touchMove.bind(this);

    this.canvas.holder.addEventListener('mousedown', this.onStart.bind(this));
    this.canvas.holder.addEventListener('touchstart', this.onStart.bind(this));
    this.canvas.holder.addEventListener('mouseup', this.onEnd.bind(this));
    this.canvas.holder.addEventListener('touchend', this.onEnd.bind(this));
  },

  onStart: function onStart(e) {
    // console.log('[controls] Start', e);
    // Is it a mouse or touch event?
    if (e.type === 'mousedown') {
      window.addEventListener('mousemove', this.mousing);
    } else if (e.type === 'touchstart') {
      window.addEventListener('touchmove', this.touching);
    } else {
      throw 'Strange event happened';
    }
  },

  onEnd: function onEnd(e) {
    // console.log('[controls] End', e);
    // Is it a mouse or touch event?
    if (e.type === 'mouseup') {
      window.removeEventListener('mousemove', this.mousing);
    } else if (e.type === 'touchend') {
      window.removeEventListener('mousemove', this.touching);
    } else {
      throw 'Strange event happened';
    }
  },

  mouseMove: function mouseMove(e) {
    // console.log('mousing', e);
  },

  touchMove: function touchMove(e) {
    // console.log('touching', e);
  }
};

module.exports = controls;

});

require.register("js/mansion/lock.js", function(exports, require, module) {
'use strict';

var lock = {
  _name: 'lock',
  holder: document.querySelector('#lockHolder'),

  init: function init(parent) {
    this.parent = parent;
    this.holder.addEventListener('click', this.onClick.bind(this));

    this.tween = TweenMax.fromTo('#lockHolder #lockedPendulum', 1, {
      rotation: '-10deg'
    }, {
      rotation: '10deg',
      ease: Power1.easeInOut,
      transformOrigin: '28% 25%',
      repeat: -1,
      yoyo: true,
      paused: true
    });
  },

  onClick: function onClick() {
    this.animateOut();
    this.parent.handleClick(this);
  },

  animateIn: function animateIn() {
    // console.log(this);
    this.tween.play();
    TweenMax.to(this.holder, 0.3, { autoAlpha: 1 });
  },

  animateOut: function animateOut() {
    TweenMax.to(this.holder, 0.3, {
      autoAlpha: 0, onComplete: function onComplete() {
        this.tween.pause();
      },
      onCompleteScope: this
    });
  }
};

module.exports = lock;

});

require.register("js/mansion/riddles.js", function(exports, require, module) {
'use strict';

var riddles = {
	_name: 'Riddles',
	holder: document.querySelector('#riddlesHolder div'),
	hotspot: document.querySelector('#riddlesHolder .card'),
	showing: false,
	firstTime: true,
	copy: [{
		number: 'no.1',
		class: 'one',
		riddle: 'I\'m a <span>creature</span><br>hard to <span>ignore</span><br>because of my<br><span>mighty roar</span>'
	}, {
		number: 'no.2',
		class: 'two',
		riddle: 'I\'m made of <span>glass</span>,<br>this much is <span>true</span>.<br>But when <span>you</span><br>look, <span>you</span> won\'t<br><span>see through</span>'
	}, {
		number: 'no.3',
		class: 'three',
		riddle: 'I <span>have</span> a<br><span>ring</span> but<br><span>no finger</span>'
	}, {
		number: 'no.4',
		class: 'four',
		riddle: 'I <span>start</span> with<br><span>t</span>, <span>end</span> with <span>t</span><br>and I have <span>t</span><br>inside...'
	}],

	init: function init(parent) {
		// console.log('[riddles] init');
		this.parent = parent;

		CustomEase.create('ease', 'M0,0,C0.282,0,0.203,0.91,0.402,0.998,0.612,1.09,0.798,1,1,1');

		this.showRiddle = this.animateIn.bind(this);
		this.hideRiddle = this.animateOut.bind(this);
		this.handleClick = this.toggleRiddle.bind(this);

		this.populate(0);

		this.enable();
	},

	enable: function enable() {
		this.hotspot.addEventListener('click', this.handleClick);
		this.hotspot.addEventListener('mouseenter', this.showRiddle);
	},

	disable: function disable() {
		this.hotspot.removeEventListener('click', this.handleClick);
		this.hotspot.removeEventListener('mouseenter', this.showRiddle);

		this.animateOut();
	},

	populate: function populate(step) {
		var content = this.copy[step];
		var riddleNumber = this.holder.querySelector('h2 span span');
		riddleNumber.innerHTML = content.number;
		var copyHolder = this.holder.querySelector('#theRiddle');
		copyHolder.className = content.class;
		copyHolder.innerHTML = content.riddle;
	},

	goToNext: function goToNext() {
		if (this.parent.step < this.copy.length) {
			this.enable();
			this.populate(this.parent.step);
			this.animateIn();
			this.firstTime = true;
		} else {
			// console.log('[riddles] no more riddles');
			this.outroAnimation();
			this.parent.zoomIntoMansion();
		}
	},

	introAnimation: function introAnimation() {
		TweenMax.fromTo(this.holder, 1.5, {
			autoAlpha: 0,
			yPercent: 40,
			xPercent: -20,
			transformOrigin: '0% 100%'
		}, {
			yPercent: 0,
			xPercent: 0,
			autoAlpha: 1,
			ease: 'ease'
		});

		this.showing = true;
	},

	outroAnimation: function outroAnimation() {
		TweenMax.to(this.holder, 0.3, {
			yPercent: 50,
			xPercent: -200,
			ease: Power2.easeIn
		});

		this.showing = false;
	},

	animateIn: function animateIn() {
		if (!this.showing) {
			TweenMax.to(this.holder, 1, {
				yPercent: 0,
				xPercent: 0,
				rotation: 0,
				ease: 'ease'
			});

			this.showing = true;
		}
	},

	animateOut: function animateOut() {
		if (this.firstTime) {
			this.parent.zoomIntoMansion();
			this.firstTime = false;
		}

		TweenMax.to(this.holder, 0.5, {
			yPercent: 90,
			xPercent: -120,
			rotation: '4deg',
			ease: Power2.easeInOut
		});

		this.showing = false;
	},

	toggleRiddle: function toggleRiddle() {
		if (this.showing) {
			// console.log('Hide riddle');
			this.hideRiddle();
		} else {
			// console.log('Show riddle');
			this.showRiddle();
		}
	}
};

module.exports = riddles;

});

require.register("js/mansion/three/ThreeAnimals.js", function(exports, require, module) {
'use strict';

var Bilboard = require('./helpers/Bilboard');

var ThreeAnimals = function ThreeAnimals(parent) {

  var group = new THREE.Group();
  var bilboard = Bilboard;
  var path = './imgs/mansion/animals/';

  var fox = bilboard.create(path + 'fox-1920w.png', {
    width: 6,
    x: 7,
    y: -7,
    z: 16
  }, parent);
  group.add(fox);

  var leopard = bilboard.create(path + 'leopard-1920w.png', {
    width: 7,
    x: -10,
    y: -6,
    z: 18
  }, parent);
  group.add(leopard);

  return group;
};

module.exports = ThreeAnimals;

});

require.register("js/mansion/three/ThreeBackground.js", function(exports, require, module) {
'use strict';

var Bilboard = require('./helpers/Bilboard');

var ThreeBackground = function ThreeBackground(parent) {
  var group = new THREE.Group();
  var bilboard = Bilboard;
  var env = parent.environment;

  var background = bilboard.create('./imgs/mansion/environment/background-1920w.gif', {
    width: env.w * 6,
    ratio: 0.5
    // z:-10 // separate the background into layers later maybe
  }, parent);
  group.add(background);

  return group;
};

module.exports = ThreeBackground;

});

require.register("js/mansion/three/ThreeClickableItems.js", function(exports, require, module) {
'use strict';

var room01 = require('./rooms/room01');
var room02 = require('./rooms/room02');
var room03 = require('./rooms/room03');
var room04 = require('./rooms/room04');
var room05 = require('./rooms/room05');
var room06 = require('./rooms/room06');

var ThreeClickableItems = {

  init: function init(parent) {
    var group = new THREE.Group();
    var path = './imgs/mansion/answers/';

    // Room one items
    this.room01 = room01;
    this.room01.create(parent);
    group.add(this.room01.element);

    // Room two items
    this.room02 = room02;
    this.room02.create(parent);
    group.add(this.room02.element);

    // Room three items
    this.room03 = room03;
    this.room03.create(parent);
    group.add(this.room03.element);

    // Room four items
    this.room04 = room04;
    this.room04.create(parent);
    group.add(this.room04.element);

    // Room five items
    this.room05 = room05;
    this.room05.create(parent);
    group.add(this.room05.element);

    // Room six items
    this.room06 = room06;
    this.room06.create(parent);
    group.add(this.room06.element);

    group.position.z = 0.25;

    // return group;
    this.elements = group;
  },

  childAnimation: function childAnimation(hit, wasHit) {
    // console.log('[ThreeClickableItems] childAnimation\n>>>hit', hit, '\n>>>wasHit', wasHit);
    // Yes this is really bad but I am out of time to think this throught
    switch (hit) {
      case 'room01_dud01':
      case 'room01_dud02':
      case 'room01_dud03':
      case 'room01_dud04':
      case 'room01_dud05':
      case 'room01_dud06':
      case 'room01_answer':
        this.room01.animate(hit, wasHit);
        break;

      case 'room02_dud01':
      case 'room02_dud02':
      case 'room02_dud03':
      case 'room02_dud04':
      case 'room02_dud05':
      case 'room02_answer':
        this.room02.animate(hit, wasHit);
        break;

      case 'room03_dud01':
      case 'room03_dud02':
      case 'room03_dud03':
      case 'room03_dud04':
      case 'room03_answer':
        this.room03.animate(hit, wasHit);
        break;

      case 'room04_dud01':
      case 'room04_dud02':
      case 'room04_dud03':
      case 'room04_dud04':
      case 'room04_dud05':
      case 'room04_answer':
        this.room04.animate(hit, wasHit);
        break;

      case 'room05_dud01':
      case 'room05_dud02':
      case 'room05_dud03':
      case 'room05_answer':
        this.room05.animate(hit, wasHit);
        break;

      case 'room06_dud01':
      case 'room06_dud02':
      case 'room06_answer':
        this.room06.animate(hit, wasHit);
        break;
      default:
    }
  }
};

module.exports = ThreeClickableItems;

});

require.register("js/mansion/three/ThreeForeground.js", function(exports, require, module) {
'use strict';

var Bilboard = require('./helpers/Bilboard');

var ThreeForeground = function ThreeForeground(parent) {

  var group = new THREE.Group();
  var bilboard = Bilboard;
  var env = parent.environment;

  var foreground = bilboard.create('./imgs/mansion/environment/foreground-1024w.png', {
    width: env.w,
    ratio: env.h / env.w,
    y: env.h * 0.5,
    z: 24
  }, parent);

  group.add(foreground);

  var path = './imgs/mansion/animals/';
  var peacock = bilboard.create(path + 'peacock-1920w.png', {
    width: 2.5,
    x: -6.4,
    y: 0.55,
    z: 24
  }, parent);
  group.add(peacock);

  var stag = bilboard.create(path + 'stag-1920w.png', {
    width: 6,
    x: 7,
    y: -2.5,
    z: 24
  }, parent);
  group.add(stag);

  var flowers = bilboard.create('./imgs/mansion/environment/flowers-1920w.png', {
    width: env.w,
    ratio: 0.5,
    z: 25
  }, parent);
  group.add(flowers);

  return group;
};

module.exports = ThreeForeground;

});

require.register("js/mansion/three/ThreeHouse.js", function(exports, require, module) {
'use strict';

var Bilboard = require('./helpers/Bilboard');
var UserClick = require('./ThreeUserClick');
var ThreeClickableItems = require('./ThreeClickableItems');

var ThreeHouse = {

  init: function init(parent) {
    var group = new THREE.Group();
    group.name = 'ThreeHouse';
    var bilboard = Bilboard;
    var path = './imgs/mansion/house/';
    var env = parent.environment;

    var mansion = bilboard.create(path + 'background-1920w.png', {
      name: 'mansion',
      width: env.w,
      y: env.h * 0.25,
      z: 0.1
    }, parent);
    group.add(mansion);

    this.clickableElements = ThreeClickableItems;
    this.clickableElements.init(parent);
    group.add(this.clickableElements.elements);
    // Make them clickable
    parent.userClick = new THREE.UserClick(this.clickableElements.elements.children, parent.camera, parent.renderer.domElement);

    var left = bilboard.create(path + 'frontLeft-1920w.png', {
      name: 'mansionFrontLeft',
      width: env.w,
      y: env.h * 0.25,
      z: 1
    }, parent);
    group.add(left);

    var right = bilboard.create(path + 'frontRight-1920w.png', {
      name: 'mansionFrontRight',
      width: env.w,
      y: env.h * 0.25,
      z: 1
    }, parent);
    group.add(right);

    var mound = bilboard.create(path + 'mound-1920w.png', {
      width: env.w * 0.5,
      ratio: 0.25,
      y: -6.7,
      z: 1.1
    }, parent);
    group.add(mound);

    //   const assetLocation = bilboard.create('./imgs/mansion/assetLocation.png', {
    //     width:env.w,
    //     y:env.h*0.25,
    //     z:0.1
    //   },
    //   parent
    // )
    //   assetLocation.material.opacity = 0.33
    //   group.add(assetLocation)

    this.elements = group;
  },

  childAnimation: function childAnimation(hit, wasHit) {
    // console.log('[ThreeHouse] childAnimation\n>>hit', hit, '\n>>wasHit', wasHit);
    this.clickableElements.childAnimation(hit, wasHit);
  }
};

module.exports = ThreeHouse;

});

require.register("js/mansion/three/ThreeRoom.js", function(exports, require, module) {
'use strict';

var ThreeRoom = function ThreeRoom() {
  var room = new THREE.Group();
  var w = 19.2;
  var h = 10.8;
  var angle = Math.PI / 2;

  var widePanel = new THREE.PlaneBufferGeometry(w, h);
  var narrowPanel = new THREE.PlaneBufferGeometry(h, h);

  var textureLoader = new THREE.TextureLoader();
  var wallTexture = textureLoader.load('./mansion/room1/wallpaper.png');
  wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set(2, 2);
  var floorTexture = textureLoader.load('./mansion/room1/rug.jpg');

  var material = {
    floor: new THREE.MeshBasicMaterial({ map: floorTexture }),
    walls: new THREE.MeshBasicMaterial({ map: wallTexture })
  };

  var floor = new THREE.Mesh(widePanel.clone(), material.floor);
  floor.rotation.x = -angle; // Angle is in radians!

  var ceiling = new THREE.Mesh(widePanel.clone(), material.floor);
  ceiling.rotation.x = angle; // Angle is in radians!
  ceiling.position.y = h;

  var wall = new THREE.Mesh(widePanel.clone(), material.walls);
  wall.position.y = h / 2;
  wall.position.z = -h / 2;

  var left = new THREE.Mesh(narrowPanel.clone(), material.walls);
  left.position.y = h / 2;
  left.position.x = -w / 2;
  left.rotation.y = angle;

  var right = new THREE.Mesh(narrowPanel.clone(), material.walls);
  right.position.y = h / 2;
  right.position.x = w / 2;
  right.rotation.y = -angle;

  room.add(floor);
  room.add(ceiling);
  room.add(wall);
  room.add(left);
  room.add(right);

  return room;
};

module.exports = ThreeRoom;

});

require.register("js/mansion/three/ThreeUserClick.js", function(exports, require, module) {
'use strict';

THREE.UserClick = function (_objects, _camera, _domElement) {

  var _raycaster = new THREE.Raycaster();

  this.click = function (_mouse) {

    _raycaster.setFromCamera(_mouse, _camera);

    var intersects = _raycaster.intersectObjects(_objects, true);

    if (intersects.length > 0) {
      // grab the first one
      var _selected = intersects[0].object;
      // or loop over them all
      // intersects.forEach(function (element) {
      //   // console.log('hit', element.object);
      // });

      return _selected.name;
    } else {
      // console.log('ThreeUserClick null');
      return null;
    }
  };
};

});

require.register("js/mansion/three/helpers/Bilboard.js", function(exports, require, module) {
'use strict';

var Bilboard = {

  create: function create(path, opts, parent) {
    // console.log('[Bilboard] create', parent._name, parent.count);
    var _opts = opts || {};
    var textureLoader = new THREE.TextureLoader();
    var width = _opts.width || 1;
    var ratio = _opts.ratio || 1;
    var x = _opts.x || 0;
    var y = _opts.y || 0;
    var z = _opts.z || 0;

    this.parent = parent;
    this.parent.count++;

    var geometry = new THREE.PlaneBufferGeometry(width, width * ratio);
    var texture = textureLoader.load(path, this.ready.bind(this));
    var material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    if (_opts.doubleFace) material.side = THREE.DoubleSide;

    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;
    mesh.name = _opts.name || '';

    return mesh;
  },

  ready: function ready() {
    // console.log('[Bilboard] texture ready', this.parent._name, this.parent.count);
    this.parent.countReady();
  }
};

module.exports = Bilboard;

});

require.register("js/mansion/three/helpers/pivotBottomCenter.js", function(exports, require, module) {
'use strict';

var Bilboard = require('./Bilboard');

var pivotTopCenter = {

  create: function create(path, opts, parent) {
    var _opts = opts || {};
    var bilboard = Bilboard;
    var group = new THREE.Group();
    // position the group at the defined position
    group.position.x = _opts.x || 0;
    group.position.y = _opts.y || 0;

    // override the x position for the element
    _opts.x = 0;
    _opts.y = 0;

    var mesh = bilboard.create(path, _opts, parent);
    // offset the bilboard by its own height/width
    mesh.position.y = +(_opts.width || 1) / 2 * (_opts.ratio || 1);

    group.add(mesh);

    return group;
  }
};

module.exports = pivotTopCenter;

});

require.register("js/mansion/three/helpers/pivotTopCenter.js", function(exports, require, module) {
'use strict';

var Bilboard = require('./Bilboard');

var pivotTopCenter = {

  create: function create(path, opts, parent) {
    var _opts = opts || {};
    var bilboard = Bilboard;
    var group = new THREE.Group();
    // position the group at the defined position
    group.position.x = _opts.x || 0;
    group.position.y = _opts.y || 0;

    // override the x position for the element
    _opts.x = 0;
    _opts.y = 0;

    var mesh = bilboard.create(path, _opts, parent);
    // offset the bilboard by its own height/width
    mesh.position.y = -(_opts.width || 1) / 2 * (_opts.ratio || 1);

    group.add(mesh);

    return group;
  }
};

module.exports = pivotTopCenter;

});

require.register("js/mansion/three/rooms/room01.js", function(exports, require, module) {
'use strict';

var riddleAnswer = require('./room01/riddleAnswer');
var lipstick = require('./room01/lipstick');
var jewels = require('./room01/jewels');
var bedMirror = require('./room01/bedMirror');
var perfumeSmall = require('./room01/perfumeSmall');
var perfumeLarge = require('./room01/perfumeLarge');
var handMirror = require('./room01/handMirror');

var room01 = {
  create: function create(parent) {
    var group = new THREE.Group();
    var path = './imgs/mansion/duds/';

    this.answer = riddleAnswer({
      name: 'room01_answer',
      width: 1.15,
      x: -4.9,
      y: 4.55
    }, parent);
    group.add(this.answer.element);

    this.dud01 = lipstick({
      name: 'room01_dud01',
      width: 0.4,
      x: -5.5,
      y: 2.2,
      z: 0.1
    }, parent);
    group.add(this.dud01.element);

    this.dud02 = jewels({
      name: 'room01_dud02',
      width: 1.4,
      x: -3.8,
      y: 5,
      z: 0.1
    }, parent);
    group.add(this.dud02.element);

    this.dud03 = bedMirror({
      name: 'room01_dud03',
      width: 0.8,
      x: -3.15,
      y: 4
    }, parent);
    group.add(this.dud03.element);

    this.dud04 = perfumeSmall({
      name: 'room01_dud04',
      width: 0.8,
      x: -3,
      y: 2.6
    }, parent);
    group.add(this.dud04.element);

    this.dud05 = perfumeLarge({
      name: 'room01_dud05',
      width: 0.8,
      x: -2,
      y: 3
    }, parent);
    group.add(this.dud05.element);

    this.element = group;
  },

  animate: function animate(hit, wasHit) {
    switch (hit) {
      case 'room01_answer':
        if (wasHit) {
          this.answer.animate();
        }
        break;

      case 'room01_dud01':
        this.dud01.animate();
        break;

      case 'room01_dud02':
        this.dud02.animate();
        break;

      case 'room01_dud03':
        this.dud03.animate();
        break;

      case 'room01_dud04':
        this.dud04.animate();
        break;

      case 'room01_dud05':
        this.dud05.animate();
        break;

      default:

    }
  }
};

module.exports = room01;

});

require.register("js/mansion/three/rooms/room01/bedMirror.js", function(exports, require, module) {
'use strict';

var pivotTopCenter = require('../../helpers/pivotTopCenter');

var jewels = function jewels(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = pivotTopCenter;
  var path = './imgs/mansion/duds/';

  var element = bilboard.create(path + 'bedMirror.png', {
    name: _opts.name,
    width: _opts.width
  }, parent);
  group.add(element);

  var animate = function animate() {
    TweenMax.to(element.rotation, 0.5, {
      z: Math.PI / 8,
      repeat: 1,
      yoyo: true
    });
  };

  return {
    element: group,
    animate: animate
  };
};

module.exports = jewels;

});

require.register("js/mansion/three/rooms/room01/handMirror.js", function(exports, require, module) {
'use strict';

var Bilboard = require('../../helpers/Bilboard');

var handMirror = function handMirror(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = Bilboard;
  var path = './imgs/mansion/duds/';

  var element = bilboard.create(path + 'handMirror.png', {
    name: _opts.name,
    width: _opts.width,
    ratio: 0.5
  }, parent);
  group.add(element);

  var animate = function animate() {
    var dur = 0.5;
    TweenMax.to(element.rotation, dur, {
      z: -Math.PI / 2.5,
      repeat: 1,
      yoyo: true
    });
    TweenMax.to(element.position, dur, {
      x: '+=0.5',
      y: '+=0.7',
      repeat: 1,
      yoyo: true
    });
  };

  return {
    element: group,
    animate: animate
  };
};

module.exports = handMirror;

});

require.register("js/mansion/three/rooms/room01/jewels.js", function(exports, require, module) {
'use strict';

var pivotTopCenter = require('../../helpers/pivotTopCenter');

var jewels = function jewels(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = pivotTopCenter;
  var path = './imgs/mansion/duds/';

  var jewel1 = bilboard.create(path + 'jewel.png', {
    name: _opts.name,
    width: _opts.width
  }, parent);
  group.add(jewel1);

  var jewel2 = bilboard.create(path + 'jewel.png', {
    name: _opts.name,
    width: _opts.width * 0.6,
    x: _opts.width * 0.3
  }, parent);
  group.add(jewel2);

  CustomEase.create('jewelsEase', 'M0,0,C0.112,0.036,-0.016,1.086,0.2,1,0.367,0.933,0.309,-0.202,0.4,-0.3,0.484,-0.39,0.465,0.104,0.556,0.204,0.63,0.286,0.613,-0.062,0.7,-0.1,0.76,-0.126,0.749,0.075,0.8,0.1,0.842,0.12,0.876,-0.034,0.9,-0.034,0.924,-0.034,0.966,0,1,0');

  var tl = new TimelineLite({ paused: true });

  tl.to([jewel1.rotation, jewel2.rotation], 3, {
    z: function z(i) {
      if (i % 2) {
        return Math.PI * 0.25;
      }
      return -Math.PI * 0.25;
    },
    ease: 'jewelsEase'
  });

  var animate = function animate() {
    if (!tl.isActive()) {
      tl.play(0);
    }
  };

  return {
    element: group,
    animate: animate
  };
};

module.exports = jewels;

});

require.register("js/mansion/three/rooms/room01/lipstick.js", function(exports, require, module) {
'use strict';

var Bilboard = require('../../helpers/Bilboard');

var lipstick = function lipstick(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = Bilboard;
  var path = './imgs/mansion/duds/lipstick/';
  var r = 4.5;
  var y = _opts.width * r + _opts.width * 0.25;

  var neckBack = bilboard.create(path + 'neckBack.png', {
    name: _opts.name,
    width: _opts.width,
    ratio: 1,
    y: y
  }, parent);
  group.add(neckBack);

  var tip = bilboard.create(path + 'tip.png', {
    name: _opts.name,
    width: _opts.width,
    ratio: 1,
    y: y + _opts.width * 0.75
  }, parent);
  group.add(tip);

  var neckFront = bilboard.create(path + 'neckFront.png', {
    name: _opts.name,
    width: _opts.width,
    ratio: 1,
    y: y
  }, parent);
  group.add(neckFront);

  var body = bilboard.create(path + 'body.png', {
    name: _opts.name,
    width: _opts.width,
    ratio: r,
    y: _opts.width * r * 0.5
  }, parent);
  group.add(body);

  var tl = new TimelineLite({ paused: true });

  tl.to(tip.position, 0.5, {
    y: '-=' + _opts.width * 0.75,
    ease: Bounce.easeOut
  }).to([tip.position, neckFront.position, neckBack.position], 0.5, {
    y: '-=' + _opts.width * 0.75,
    ease: Bounce.easeOut
  }).to(group.position, 0.5, {
    y: '+=0.75',
    ease: Power3.easeOut
  }).to(group.position, 0.75, {
    y: '-=0.75',
    ease: Bounce.easeOut
  }, 'Down').to([tip.position, neckFront.position, neckBack.position], 0.5, {
    y: '+=' + _opts.width * 0.75,
    ease: Power1.easeOut
  }).to([tip.position], 0.5, {
    y: '+=' + _opts.width * 0.75,
    ease: Power1.easeOut
  });

  var animate = function animate() {
    if (!tl.isActive()) {
      tl.play(0);
    }
  };

  return {
    element: group,
    animate: animate
  };
};

module.exports = lipstick;

});

require.register("js/mansion/three/rooms/room01/perfumeLarge.js", function(exports, require, module) {
'use strict';

var Bilboard = require('../../helpers/Bilboard');

var perfumeLarge = function perfumeLarge(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = Bilboard;
  var path = './imgs/mansion/duds/';

  var element = bilboard.create(path + 'perfumeLarge.png', {
    name: _opts.name,
    width: _opts.width,
    ratio: 2
  }, parent);
  group.add(element);

  var tl = new TimelineLite({ paused: true });
  tl.to(group.position, 0.5, {
    y: '+=0.75',
    ease: Power3.easeOut
  }).to(group.position, 0.75, {
    y: '-=0.75',
    ease: Bounce.easeOut
  });

  var animate = function animate() {
    if (!tl.isActive()) {
      tl.play(0);
    }
  };

  return {
    element: group,
    animate: animate
  };
};

module.exports = perfumeLarge;

});

require.register("js/mansion/three/rooms/room01/perfumeSmall.js", function(exports, require, module) {
'use strict';

var Bilboard = require('../../helpers/Bilboard');

var perfumeSmall = function perfumeSmall(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = Bilboard;
  var path = './imgs/mansion/duds/';

  var element = bilboard.create(path + 'perfumeSmall.png', {
    name: _opts.name,
    width: _opts.width
  }, parent);
  group.add(element);

  var tl = new TimelineLite({ paused: true });
  tl.to(group.position, 0.5, {
    y: '+=0.75',
    ease: Power3.easeOut
  }).to(group.position, 0.75, {
    y: '-=0.75',
    ease: Bounce.easeOut
  });

  var animate = function animate() {
    if (!tl.isActive()) {
      tl.play(0);
    }
  };

  return {
    element: group,
    animate: animate
  };
};

module.exports = perfumeSmall;

});

require.register("js/mansion/three/rooms/room01/riddleAnswer.js", function(exports, require, module) {
'use strict';

var pivotTopCenter = require('../../helpers/pivotTopCenter');

var riddleAnswer = function riddleAnswer(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = pivotTopCenter;
  var path = './imgs/mansion/answers/';

  var mirror = bilboard.create(path + 'wallMirror.png', {
    name: _opts.name,
    width: _opts.width
  }, parent);
  group.add(mirror);

  var animate = function animate() {
    TweenMax.killDelayedCallsTo(shouldNag);
    TweenMax.killDelayedCallsTo(nag);
    nagTween.pause(0);

    TweenMax.to(mirror.rotation, 1, {
      z: -Math.PI * 0.3,
      ease: Back.easeInOut.config(0.75),
      onComplete: parent.zoomCheck,
      onCompleteScope: parent
    });
  };

  var dur = 0.05;
  var nagTween = TweenMax.to(group.rotation, dur, {
    z: Math.PI / 128,
    repeat: 3,
    repeatDelay: dur,
    yoyo: true,
    paused: true
  });

  var nag = function nag() {
    nagTween.play(0);
    TweenMax.delayedCall(3, shouldNag);
  };

  var shouldNag = function shouldNag() {
    if (parent.parent.step === 1) {
      TweenMax.delayedCall(3, nag);
    } else if (parent.parent.step > 1) {
      // console.log('Do nothing');
    } else {
      TweenMax.delayedCall(3, shouldNag);
    }
  };

  TweenMax.delayedCall(3, shouldNag);

  return {
    element: group,
    animate: animate
  };
};

module.exports = riddleAnswer;

});

require.register("js/mansion/three/rooms/room02.js", function(exports, require, module) {
'use strict';

var riddleAnswer = require('./room02/riddleAnswer');
var chandelier = require('./room02/chandelier');
var bird = require('./room02/bird');
var dogPortrait = require('./room02/dogPortrait');
var latern = require('./room02/latern');
var candles = require('./room02/candles');

var room02 = {
  create: function create(parent) {
    var group = new THREE.Group();
    var path = './imgs/mansion/duds/';

    this.answer = riddleAnswer({
      name: 'room02_answer',
      width: 1.5,
      x: 5.2,
      y: 3.7
    }, parent);
    group.add(this.answer.element);

    this.dud01 = chandelier({
      name: 'room02_dud01',
      width: 2.25,
      x: 1.8,
      y: 5.4
    }, parent);
    group.add(this.dud01.element);

    this.dud02 = bird({
      width: 1.3,
      x: 2.5,
      y: 3,
      z: 0.1
    }, parent);
    group.add(this.dud02.element);

    this.dud03 = dogPortrait({
      name: 'room02_dud03',
      width: 1.3,
      x: 3.9,
      y: 4
    }, parent);
    group.add(this.dud03.element);

    this.dud04 = latern({
      name: 'room02_dud04',
      width: 0.6,
      x: 4.2,
      y: 2.2
    }, parent);
    group.add(this.dud04.element);

    this.dud05 = candles({
      name: 'room02_dud05',
      width: 1.2,
      x: 6.2,
      y: 2.2
    }, parent);
    group.add(this.dud05.element);

    this.element = group;
  },

  animate: function animate(hit, wasHit) {
    switch (hit) {
      case 'room02_answer':
        if (wasHit) {
          this.answer.animate();
        }
        break;

      case 'room02_dud01':
        this.dud01.animate();
        break;

      case 'room02_dud03':
        this.dud03.animate();
        break;

      case 'room02_dud04':
        this.dud04.animate();
        break;

      case 'room02_dud05':
        this.dud05.animate();
        break;

      default:

    }
  }
};

module.exports = room02;

});

require.register("js/mansion/three/rooms/room02/bird.js", function(exports, require, module) {
'use strict';

var pivotBottomCenter = require('../../helpers/pivotBottomCenter');

var bird = function bird(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = pivotBottomCenter;
  var path = './imgs/mansion/duds/';

  var element = bilboard.create(path + 'bird1.png', {
    name: _opts.name,
    width: _opts.width,
    doubleFace: true
  }, parent);
  group.add(element);

  var dur = 0.25;

  function hop(back) {
    var _tl = new TimelineLite();
    _tl.to(element.position, dur, {
      x: function x() {
        if (back) return '-=0.75';
        return '+=0.75';
      },
      ease: Linear.easeNone
    }, 0);

    if (back) {
      _tl.to(element.position, dur, {
        y: '+=0.9',
        ease: Power2.easeOut
      }, 0);
    } else {
      _tl.to(element.position, dur, {
        y: '-=0.9',
        ease: Power2.easeIn
      }, 0);
    }

    _tl.add(TweenMax.to(element.rotation, dur * 0.25, {
      z: -Math.PI / 64,
      repeat: 1,
      yoyo: true,
      ease: Linear.easeNone
    }));

    return _tl;
  }

  function turn() {
    var _tl = new TimelineLite();
    _tl.set(element.rotation, {
      y: '+=' + Math.PI,
      ease: Linear.easeNone
    }, dur);

    return _tl;
  }

  function getRandom(min, max) {
    return Math.random() * (max - min + 1) + min;
  }
  function repeat() {
    TweenMax.delayedCall(getRandom(8, 20), function () {
      tl.restart();
    });
  }

  var tl = new TimelineLite({
    onComplete: repeat
  });

  tl.add(hop()).add(turn()).add(hop(true), '+=3').add(turn());

  var animate = function animate() {
    // if(!tl.isActive()) {
    //   tl.play()
    // }
  };

  return {
    element: group,
    animate: animate
  };
};

module.exports = bird;

});

require.register("js/mansion/three/rooms/room02/candles.js", function(exports, require, module) {
'use strict';

var pivotBottomCenter = require('../../helpers/pivotBottomCenter');

var candles = function candles(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = pivotBottomCenter;
  var path = './imgs/mansion/duds/candles/';

  var candles = bilboard.create(path + 'candles.png', {
    name: _opts.name,
    width: _opts.width,
    ratio: 2,
    z: 0.1
  }, parent);
  group.add(candles);

  var flames = bilboard.create(path + 'flames.png', {
    width: _opts.width,
    ratio: 2
  }, parent);
  group.add(flames);

  var tween = TweenMax.to(flames.children[0].material, 0.25, {
    opacity: 0,
    paused: true,
    ease: Power1.easeInOut
  });

  var animate = function animate() {
    if (tween.progress() === 1) {
      tween.reverse();
    } else {
      tween.play();
    }
  };

  return {
    element: group,
    animate: animate
  };
};

module.exports = candles;

});

require.register("js/mansion/three/rooms/room02/chandelier.js", function(exports, require, module) {
'use strict';

var pivotTopCenter = require('../../helpers/pivotTopCenter');

var chandelier = function chandelier(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = pivotTopCenter;
  var path = './imgs/mansion/duds/';

  var chandelier = bilboard.create(path + 'chandelier.png', {
    name: _opts.name,
    width: _opts.width
  }, parent);
  group.add(chandelier);

  CustomEase.create('chandelierEase', 'M0,0,C0.112,0.036,-0.016,1.086,0.2,1,0.367,0.933,0.309,-0.812,0.4,-0.91,0.484,-1,0.465,0.104,0.556,0.204,0.63,0.286,0.613,-0.062,0.7,-0.1,0.76,-0.126,0.749,0.075,0.8,0.1,0.842,0.12,0.876,-0.034,0.9,-0.034,0.924,-0.034,0.966,0,1,0');

  var animate = function animate() {
    TweenMax.to(chandelier.rotation, 3, {
      z: -Math.PI * 0.1,
      ease: 'chandelierEase'
    });
  };

  return {
    element: group,
    animate: animate
  };
};

module.exports = chandelier;

});

require.register("js/mansion/three/rooms/room02/dogPortrait.js", function(exports, require, module) {
'use strict';

var Bilboard = require('../../helpers/Bilboard');

var dogPortrait = function dogPortrait(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = Bilboard;
  var path = './imgs/mansion/duds/';

  var element = bilboard.create(path + 'dogPortrait.png', {
    name: _opts.name,
    width: _opts.width
  }, parent);
  group.add(element);

  CustomEase.create('dogEase', 'M0,0,C0.662,0.074,0.7,1,0.7,1,0.7,1,0.748,0.936,0.85,0.936,0.95,0.936,1,1,1,1');

  var tl = new TimelineLite({ paused: true });
  tl.to(group.position, 0.5, {
    y: '-=1.25',
    ease: 'dogEase'
  });

  var animate = function animate() {
    tl.play();
  };

  return {
    element: group,
    animate: animate
  };
};

module.exports = dogPortrait;

});

require.register("js/mansion/three/rooms/room02/latern.js", function(exports, require, module) {
'use strict';

var pivotBottomCenter = require('../../helpers/pivotBottomCenter');

var lantern = function lantern(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = pivotBottomCenter;
  var path = './imgs/mansion/duds/lantern/';

  var lantern = bilboard.create(path + 'lantern.png', {
    name: _opts.name,
    width: _opts.width,
    ratio: 2
  }, parent);
  group.add(lantern);

  var light = bilboard.create(path + 'light.png', {
    name: _opts.name,
    width: _opts.width,
    y: _opts.width * 0.5,
    z: 0.1
  }, parent);
  group.add(light);

  var tween = TweenMax.to(light.children[0].material, 0.25, {
    opacity: 0,
    paused: true,
    ease: Power1.easeInOut
  });

  var animate = function animate() {
    if (tween.progress() === 1) {
      tween.reverse();
    } else {
      tween.play();
    }
  };

  return {
    element: group,
    animate: animate
  };
};

module.exports = lantern;

});

require.register("js/mansion/three/rooms/room02/riddleAnswer.js", function(exports, require, module) {
'use strict';

var Bilboard = require('../../helpers/Bilboard');

var riddleAnswer = function riddleAnswer(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = Bilboard;
  var path = './imgs/mansion/answers/';

  var element = bilboard.create(path + 'lionPortrait.png', {
    name: _opts.name,
    width: _opts.width
  }, parent);
  group.add(element);

  var animate = function animate() {
    TweenMax.killDelayedCallsTo(shouldNag);
    TweenMax.killDelayedCallsTo(nag);
    nagTween.pause(0);

    TweenMax.to(element.position, 1, {
      x: '+=1',
      ease: Power1.easeInOut,
      onComplete: parent.zoomCheck,
      onCompleteScope: parent
    });
  };

  var dur = 0.05;
  var nagTween = TweenMax.to(group.rotation, dur, {
    z: Math.PI / 128,
    repeat: 3,
    repeatDelay: dur,
    yoyo: true,
    paused: true
  });

  var nag = function nag() {
    nagTween.play(0);
    TweenMax.delayedCall(3, shouldNag);
  };

  var shouldNag = function shouldNag() {
    if (parent.parent.step === 0) {
      TweenMax.delayedCall(3, nag);
    } else if (parent.parent.step > 0) {
      // console.log('Do nothing');
    } else {
      TweenMax.delayedCall(3, shouldNag);
    }
  };

  TweenMax.delayedCall(3, shouldNag);

  return {
    element: group,
    animate: animate,
    nag: nag
  };
};

module.exports = riddleAnswer;

});

require.register("js/mansion/three/rooms/room03.js", function(exports, require, module) {
'use strict';

var riddleAnswer = require('./room03/riddleAnswer');
var teacups = require('./room03/teacups');
var chandelier = require('./room03/chandelier');
var chair = require('./room03/chair');
var table = require('./room03/table');

var room03 = {
  create: function create(parent) {
    var group = new THREE.Group();
    var path = './imgs/mansion/duds/';

    this.answer = riddleAnswer({
      name: 'room03_answer',
      width: 1.25,
      x: -1.15,
      y: -0.6
    }, parent);
    group.add(this.answer.element);

    this.dud01 = teacups({
      name: 'room03_dud01',
      width: 2.3,
      x: -5.7,
      y: -1.35
    }, parent);
    group.add(this.dud01.element);

    this.dud04 = table({
      name: 'room03_dud04',
      width: 2,
      x: -2.7,
      y: -1.4
    }, parent);
    group.add(this.dud04.element);

    this.element = group;
  },

  animate: function animate(hit, wasHit) {
    switch (hit) {
      case 'room03_answer':
        if (wasHit) {
          this.answer.animate();
        }
        break;

      case 'room03_dud01':
        this.dud01.animate();
        break;

      case 'room03_dud04':
        this.dud04.animate();
        break;

      default:

    }
  }
};

module.exports = room03;

});

require.register("js/mansion/three/rooms/room03/chair.js", function(exports, require, module) {
'use strict';

var Bilboard = require('../../helpers/Bilboard');

var chair = function chair(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = Bilboard;
  var path = './imgs/mansion/duds/';

  var element = bilboard.create(path + 'chairSmall.png', {
    name: _opts.name,
    width: _opts.width
  }, parent);
  group.add(element);

  var animate = function animate() {
    TweenMax.to(element.rotation, 0.5, {
      z: Math.PI / 8,
      repeat: 1,
      yoyo: true
    });
  };

  return {
    element: group,
    animate: animate
  };
};

module.exports = chair;

});

require.register("js/mansion/three/rooms/room03/chandelier.js", function(exports, require, module) {
'use strict';

var pivotTopCenter = require('../../helpers/pivotTopCenter');

var chandelier = function chandelier(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = pivotTopCenter;
  var path = './imgs/mansion/duds/';

  var chandelier = bilboard.create(path + 'chandelier2.png', {
    name: _opts.name,
    width: _opts.width
  }, parent);
  group.add(chandelier);

  var animate = function animate() {
    TweenMax.to(chandelier.rotation, 1, {
      z: -Math.PI * 0.1,
      ease: Back.easeInOut.config(0.75),
      repeat: 1,
      yoyo: true
    });
  };

  return {
    element: group,
    animate: animate
  };
};

module.exports = chandelier;

});

require.register("js/mansion/three/rooms/room03/riddleAnswer.js", function(exports, require, module) {
'use strict';

var pivotBottomCenter = require('../../helpers/pivotBottomCenter');

var riddleAnswer = function riddleAnswer(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = pivotBottomCenter;
  var path = './imgs/mansion/answers/teapot/';

  var body = bilboard.create(path + 'teapot.png', {
    name: _opts.name,
    width: _opts.width
  }, parent);
  group.add(body);

  var lid = bilboard.create(path + 'lid.png', {
    name: _opts.name,
    width: _opts.width * 0.5,
    ratio: 0.5,
    y: _opts.width * 0.7
  }, parent);
  group.add(lid);

  var animate = function animate() {
    TweenMax.killDelayedCallsTo(shouldNag);
    TweenMax.killDelayedCallsTo(nag);
    nagTween.pause(0);

    TweenMax.to(lid.position, 1, {
      y: '+=0.5',
      ease: Power1.easeInOut,
      onComplete: parent.zoomCheck,
      onCompleteScope: parent
    });
  };

  var dur = 0.05;
  var nagTween = TweenMax.to(group.rotation, dur, {
    z: Math.PI / 128,
    repeat: 3,
    repeatDelay: dur,
    yoyo: true,
    paused: true
  });

  var nag = function nag() {
    nagTween.play(0);
    TweenMax.delayedCall(3, shouldNag);
  };

  var shouldNag = function shouldNag() {
    if (parent.parent.step === 3) {
      TweenMax.delayedCall(3, nag);
    } else if (parent.parent.step > 3) {
      // console.log('Do nothing');
    } else {
      TweenMax.delayedCall(3, shouldNag);
    }
  };

  TweenMax.delayedCall(3, shouldNag);

  return {
    element: group,
    animate: animate
  };
};

module.exports = riddleAnswer;

});

require.register("js/mansion/three/rooms/room03/table.js", function(exports, require, module) {
'use strict';

var pivotBottomCenter = require('../../helpers/pivotBottomCenter');

var table = function table(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = pivotBottomCenter;
  var path = './imgs/mansion/duds/sweetsTable/';

  var table = bilboard.create(path + 'table.png', {
    name: _opts.name,
    width: _opts.width
  }, parent);
  group.add(table);

  var jellyJump = bilboard.create(path + 'jellyJump.png', {
    name: _opts.name,
    width: _opts.width * 0.4,
    x: -_opts.width * 0.2,
    y: _opts.width * 0.75
  }, parent);
  group.add(jellyJump);

  var iceCream = bilboard.create(path + 'iceCream.png', {
    name: _opts.name,
    width: _opts.width * 0.15,
    ratio: 2,
    x: _opts.width * 0.21,
    y: _opts.width * 0.965
  }, parent);
  group.add(iceCream);

  var jelly = bilboard.create(path + 'jelly.png', {
    name: _opts.name,
    width: _opts.width * 0.3,
    x: _opts.width * 0.1,
    y: _opts.width * 0.7,
    z: 0.01
  }, parent);
  group.add(jelly);

  var tl = new TimelineLite({ paused: true });
  tl.to([jelly.scale, jellyJump.scale, iceCream.scale], 0.15, {
    y: 0.8
  });
  tl.staggerTo([jelly.scale, jellyJump.scale, iceCream.scale], 2, {
    y: 1,
    ease: Elastic.easeOut.config(3, 0.1)
  }, 0.075);

  var animate = function animate() {
    if (!tl.isActive()) {
      tl.play(0);
    }
  };

  return {
    element: group,
    animate: animate
  };
};

module.exports = table;

});

require.register("js/mansion/three/rooms/room03/teacups.js", function(exports, require, module) {
'use strict';

var pivotBottomCenter = require('../../helpers/pivotBottomCenter');

var teacups = function teacups(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = pivotBottomCenter;
  var path = './imgs/mansion/duds/teacup/';

  var base = new THREE.Group();
  var baseBack = bilboard.create(path + 'cupBaseBack.png', {
    name: _opts.name,
    width: _opts.width,
    ratio: 0.5
  }, parent);

  var baseFront = bilboard.create(path + 'cupBaseFront.png', {
    name: _opts.name,
    width: _opts.width,
    ratio: 0.5,
    z: 0.05
  }, parent);

  var cup1 = new THREE.Group();
  cup1.position.y = _opts.width * 0.3;

  var cup1Back = bilboard.create(path + 'cupBack.png', {
    name: _opts.name,
    width: _opts.width,
    ratio: 0.5
  }, parent);

  var cup1Front = bilboard.create(path + 'cupFront.png', {
    name: _opts.name,
    width: _opts.width,
    ratio: 0.5,
    z: 0.04
  }, parent);

  var cup2 = new THREE.Group();
  cup2.position.y = _opts.width * 0.25;
  cup2.rotation.y = Math.PI;

  var cup2Back = bilboard.create(path + 'cupBack.png', {
    name: _opts.name,
    width: _opts.width,
    ratio: 0.5,
    doubleFace: true
  }, parent);

  var cup2Front = bilboard.create(path + 'cupFront.png', {
    name: _opts.name,
    width: _opts.width,
    ratio: 0.5,
    doubleFace: true,
    z: -0.01
  }, parent);

  var cup3 = new THREE.Group();
  cup3.position.y = _opts.width * 0.21;
  cup3.rotation.y = Math.PI;

  var cup3Back = bilboard.create(path + 'cupBack.png', {
    name: _opts.name,
    width: _opts.width,
    ratio: 0.5,
    doubleFace: true
  }, parent);

  var cup3Front = bilboard.create(path + 'cupFront.png', {
    name: _opts.name,
    width: _opts.width,
    ratio: 0.5,
    doubleFace: true
  }, parent);

  cup3.add(cup3Back);
  cup3.add(cup3Front);

  cup2.add(cup2Back);
  cup2.add(cup3);
  cup2.add(cup2Front);

  cup1.add(cup1Back);
  cup1.add(cup2);
  cup1.add(cup1Front);

  base.add(baseBack);
  base.add(cup1);
  base.add(baseFront);

  group.add(base);

  var swing = function swing(el) {
    var _tl = new TimelineLite();

    _tl.staggerTo(el, 1, {
      cycle: {
        z: [Math.PI / 32, -Math.PI / 32]
      },
      ease: Power1.easeInOut
    }, 0.25);
    _tl.staggerTo(el, 1, {
      cycle: {
        z: [-Math.PI / 32, Math.PI / 32]
      },
      ease: Power1.easeInOut
    }, 0.25);
    _tl.staggerTo(el, 1, {
      cycle: {
        z: [Math.PI / 64, -Math.PI / 64]
      },
      ease: Power1.easeInOut
    }, 0.25);
    _tl.staggerTo(el, 0.75, {
      cycle: {
        z: [-Math.PI / 64, Math.PI / 64]
      },
      ease: Power1.easeInOut
    }, 0.25);
    _tl.staggerTo(el, 0.75, {
      z: 0,
      ease: Power1.easeInOut
    }, 0.25);

    return _tl;
  };

  var tl = new TimelineLite({ paused: true });
  // tl.to(base.position, 1, {
  //   x:'+=0.125',
  //   ease:Power1.easeInOut
  // })
  // .to(base.position, 1, {
  //   x:'-=0.25',
  //   ease:Power1.easeInOut
  // })
  // .to(base.position, 1, {
  //   x:'+=0.125',
  //   ease:Power1.easeInOut
  // })
  tl.add(swing([cup1.rotation, cup2.rotation, cup3.rotation]), 0);

  var animate = function animate() {
    if (!tl.isActive()) {
      tl.play(0);
    }
  };

  return {
    element: group,
    animate: animate
  };
};

module.exports = teacups;

});

require.register("js/mansion/three/rooms/room04.js", function(exports, require, module) {
'use strict';

var riddleAnswer = require('./room04/riddleAnswer');
var chair = require('./room04/chair');
var owl = require('./room04/owl');
var glass = require('./room04/glass');
var hat = require('./room04/hat');
var barrel = require('./room04/barrel');

var room04 = {
  create: function create(parent) {
    var group = new THREE.Group();
    var path = './imgs/mansion/duds/';

    this.answer = riddleAnswer({
      name: 'room04_answer',
      width: 0.85,
      x: 2.4,
      y: -1.3
    }, parent);
    group.add(this.answer.element);

    this.dud01 = chair({
      name: 'room04_dud01',
      width: 2.25,
      x: 1.7,
      y: -0.3
    }, parent);
    group.add(this.dud01.element);

    this.dud02 = owl({
      width: 1.25,
      x: 3.1,
      y: -0.55,
      z: 0.1
    }, parent);
    group.add(this.dud02.element);

    this.dud03 = glass({
      name: 'room04_dud03',
      width: 1.8,
      x: 4.3,
      y: -1.35
    }, parent);
    group.add(this.dud03.element);

    this.dud04 = hat({
      name: 'room04_dud04',
      width: 1.5,
      x: 5.4,
      y: 1.3,
      z: 0.1
    }, parent);
    group.add(this.dud04.element);

    this.element = group;
  },

  animate: function animate(hit, wasHit) {
    switch (hit) {
      case 'room04_answer':
        if (wasHit) {
          this.answer.animate();
        }
        break;

      case 'room04_dud01':
        this.dud01.animate();
        break;

      case 'room04_dud03':
        this.dud03.animate();
        break;

      case 'room04_dud04':
        this.dud04.animate();
        break;

      default:

    }
  }
};

module.exports = room04;

});

require.register("js/mansion/three/rooms/room04/barrel.js", function(exports, require, module) {
'use strict';

var Bilboard = require('../../helpers/Bilboard');

var barrel = function barrel(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = Bilboard;
  var path = './imgs/mansion/duds/';

  var element = bilboard.create(path + 'tobacco.png', {
    name: _opts.name,
    width: _opts.width
  }, parent);
  group.add(element);

  var animate = function animate() {
    TweenMax.to(element.rotation, 0.5, {
      z: Math.PI / 8,
      repeat: 1,
      yoyo: true
    });
  };

  return {
    element: group,
    animate: animate
  };
};

module.exports = barrel;

});

require.register("js/mansion/three/rooms/room04/chair.js", function(exports, require, module) {
'use strict';

var Bilboard = require('../../helpers/Bilboard');

var chair = function chair(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = Bilboard;
  var path = './imgs/mansion/duds/';

  var element = bilboard.create(path + 'chairGreen.png', {
    width: _opts.width
  }, parent);
  group.add(element);

  var animate = function animate() {
    // TweenMax.to(element.rotation, 0.5, {
    //   z:Math.PI/8,
    //   repeat:1,
    //   yoyo:true
    // })
  };

  return {
    element: group,
    animate: animate
  };
};

module.exports = chair;

});

require.register("js/mansion/three/rooms/room04/glass.js", function(exports, require, module) {
'use strict';

var pivotBottomCenter = require('../../helpers/pivotBottomCenter');

var glass = function glass(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = pivotBottomCenter;
  var path = './imgs/mansion/duds/';

  var glass = bilboard.create(path + 'glass.png', {
    name: _opts.name,
    width: _opts.width
  }, parent);
  group.add(glass);

  var bird = bilboard.create(path + 'bird3.png', {
    name: _opts.name,
    width: _opts.width * 0.7,
    y: _opts.width * 0.85
  }, parent);
  group.add(bird);

  function getRandom(min, max) {
    return Math.random() * (max - min + 1) + min;
  }
  function repeat() {
    TweenMax.delayedCall(getRandom(8, 20), function () {
      tl.restart();
    });
  }

  var tl = new TimelineLite({
    onComplete: repeat
  });

  tl.to(bird.position, 0.5, {
    y: '+=1',
    ease: Power1.easeOut
  }).to(bird.position, 0.5, {
    y: '-=1',
    ease: Power1.easeIn
  });

  var animate = function animate() {};

  return {
    element: group,
    animate: animate
  };
};

module.exports = glass;

});

require.register("js/mansion/three/rooms/room04/hat.js", function(exports, require, module) {
'use strict';

var pivotBottomCenter = require('../../helpers/pivotBottomCenter');

var hat = function hat(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = pivotBottomCenter;
  var path = './imgs/mansion/duds/';

  var element = bilboard.create(path + 'tophat.png', {
    name: _opts.name,
    width: _opts.width
  }, parent);
  group.add(element);

  var tween = TweenMax.to(element.rotation, 0.5, {
    z: -Math.PI / 4,
    paused: true,
    ease: Power1.easeInOut
  });

  var animate = function animate() {
    if (tween.progress() === 1) {
      tween.reverse();
    } else {
      tween.play();
    }
  };

  return {
    element: group,
    animate: animate
  };
};

module.exports = hat;

});

require.register("js/mansion/three/rooms/room04/owl.js", function(exports, require, module) {
'use strict';

var pivotBottomCenter = require('../../helpers/pivotBottomCenter');

var bird = function bird(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = pivotBottomCenter;
  var path = './imgs/mansion/duds/';

  var element = bilboard.create(path + 'owl.png', {
    name: _opts.name,
    width: _opts.width,
    doubleFace: true
  }, parent);
  group.add(element);

  function hopDown(el) {
    var _tl = new TimelineLite();

    _tl.to(el, dur * 0.5, {
      y: '+=0.2',
      ease: Power1.easeOut
    }).to(el, dur, {
      y: '-=1.4',
      ease: Power1.easeIn
    }).to(el, dur, {
      y: '+=1.3',
      ease: Power1.easeOut
    }).to(el, dur * 0.5, {
      y: '-=0.2',
      ease: Power1.easeIn
    });

    return _tl;
  }

  function getRandom(min, max) {
    return Math.random() * (max - min + 1) + min;
  }
  function repeat() {
    TweenMax.delayedCall(getRandom(8, 20), function () {
      tl.restart();
    });
  }

  var tl = new TimelineLite({
    onComplete: repeat
  });
  var dur = 0.25;

  tl.set(element.rotation, {
    y: Math.PI
  }).add('Hopdown', 0.15).add(hopDown(element.position), 'Hopdown').to(element.position, dur * 3, {
    x: '-=1.8',
    ease: Linear.easeNone
  }, 'Hopdown').set(element.rotation, {
    y: 0
  }, '+=0.25').add('Hopup', '+=0.5').to(element.position, dur * 2, {
    x: '+=1.8',
    ease: Linear.easeNone
  }, 'Hopup').to(element.position, dur, {
    y: '+=1',
    ease: Power1.easeOut
  }, 'Hopup').to(element.position, dur, {
    y: '-=0.9',
    ease: Power1.easeIn
  }, 'Hopup+=' + dur).add(TweenMax.to(element.rotation, dur * 0.25, {
    z: -Math.PI / 32,
    repeat: 1,
    yoyo: true,
    ease: Linear.easeNone
  }));

  var animate = function animate() {};

  return {
    element: group,
    animate: animate
  };
};

module.exports = bird;

});

require.register("js/mansion/three/rooms/room04/riddleAnswer.js", function(exports, require, module) {
'use strict';

var pivotBottomCenter = require('../../helpers/pivotBottomCenter');
var pivotTopCenter = require('../../helpers/pivotTopCenter');

var riddleAnswer = function riddleAnswer(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = pivotBottomCenter;
  var pivotTop = pivotTopCenter;
  var path = './imgs/mansion/answers/clock/';

  var bottom = bilboard.create(path + 'bottom.png', {
    name: _opts.name,
    width: _opts.width,
    ratio: 4
  }, parent);
  group.add(bottom);

  var pendulum = pivotTop.create(path + 'pendulum.png', {
    name: _opts.name,
    width: _opts.width * 0.5,
    ratio: 2,
    x: _opts.width * 0.05,
    y: _opts.width * 2.5
  }, parent);
  group.add(pendulum);

  var top = bilboard.create(path + 'top.png', {
    name: _opts.name,
    width: _opts.width,
    ratio: 2,
    y: _opts.width * 2.2,
    z: 0.1
  }, parent);
  group.add(top);

  var angle = Math.PI / 64;
  TweenMax.fromTo(pendulum.rotation, 1, {
    z: -angle
  }, {
    z: angle,
    repeat: -1,
    yoyo: true,
    ease: Power1.easeInOut
  });

  var animate = function animate() {
    TweenMax.killDelayedCallsTo(shouldNag);
    TweenMax.killDelayedCallsTo(nag);
    nagTween.pause(0);
  };

  var dur = 0.05;
  var nagTween = TweenMax.to(group.position, dur, {
    y: '+=0.025',
    repeat: 3,
    repeatDelay: dur,
    yoyo: true,
    paused: true
  });

  var nag = function nag() {
    nagTween.play(0);
    TweenMax.delayedCall(3, shouldNag);
  };

  var shouldNag = function shouldNag() {
    if (parent.parent.step === 5) {
      TweenMax.delayedCall(3, nag);
    } else if (parent.parent.step > 5) {
      // console.log('Do nothing');
    } else {
      TweenMax.delayedCall(3, shouldNag);
    }
  };

  TweenMax.delayedCall(3, shouldNag);

  return {
    element: group,
    animate: animate
  };
};

module.exports = riddleAnswer;

});

require.register("js/mansion/three/rooms/room05.js", function(exports, require, module) {
'use strict';

var riddleAnswer = require('./room05/riddleAnswer');
var bird = require('./room05/bird');
var sewingMachine = require('./room05/sewingMachine');
var fox = require('./room05/fox');

var room05 = {
  create: function create(parent) {
    var group = new THREE.Group();
    var path = './imgs/mansion/duds/';

    this.answer = riddleAnswer({
      name: 'room05_answer',
      width: 1.75,
      x: -5,
      y: -2
    }, parent);
    group.add(this.answer.element);

    this.dud01 = sewingMachine({
      name: 'room05_dud01',
      width: 1.15,
      x: -3.6,
      y: -5.45
    }, parent);
    group.add(this.dud01.element);

    this.dud02 = bird({
      width: 1.3,
      x: -5.5,
      y: -4.7,
      z: 0.12
    }, parent);
    group.add(this.dud02.element);

    this.dud03 = fox({
      width: 2,
      x: -1.35,
      y: -3.6
    }, parent);
    group.add(this.dud03.element);

    this.element = group;
  },

  animate: function animate(hit, wasHit) {
    switch (hit) {
      case 'room05_answer':
        if (wasHit) {
          this.answer.animate();
        }
        break;

      case 'room05_dud01':
        this.dud01.animate();
        break;

      default:

    }
  }
};

module.exports = room05;

});

require.register("js/mansion/three/rooms/room05/bell.js", function(exports, require, module) {
'use strict';

var pivotTopCenter = require('../../helpers/pivotTopCenter');

var bell = function bell(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = pivotTopCenter;
  var path = './imgs/mansion/answers/bell/';

  var back = bilboard.create(path + 'back.png', {
    name: _opts.name,
    width: _opts.width
  }, parent);
  group.add(back);

  var middle = bilboard.create(path + 'middle.png', {
    name: _opts.name,
    width: _opts.width
  }, parent);
  group.add(middle);

  var front = bilboard.create(path + 'front.png', {
    name: _opts.name,
    width: _opts.width
  }, parent);
  group.add(front);

  CustomEase.create('bellsEase', 'M0,0,C0.102,0,0.07,1,0.2,1,0.328,1,0.27,-0.75,0.4,-0.75,0.524,-0.75,0.498,0.5,0.6,0.5,0.702,0.5,0.688,-0.5,0.788,-0.5,0.892,-0.5,0.9,0,1,0');

  var tl = new TimelineLite({
    paused: true
  });

  if (!_opts.direction) _opts.direction = 1;

  tl.to([group.rotation, middle.rotation], 3, {
    z: function z(i) {
      if (i % 2) {
        return _opts.direction * (Math.PI * 0.07);
      }
      return _opts.direction * (-Math.PI * 0.07);
    },
    ease: 'bellsEase'
  });

  return {
    element: group,
    tween: tl
  };
};

module.exports = bell;

});

require.register("js/mansion/three/rooms/room05/bird.js", function(exports, require, module) {
'use strict';

var Bilboard = require('../../helpers/Bilboard');

var bird = function bird(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = Bilboard;
  var path = './imgs/mansion/duds/';

  var element = bilboard.create(path + 'bird4.png', {
    name: _opts.name,
    width: _opts.width,
    doubleFace: true
  }, parent);
  group.add(element);

  CustomEase.create('birdEase', 'M0,0,C0,0,0.23,1,0.5,1,0.769,1,1,0,1,0');
  var dur = 0.25;

  function hop(back) {
    var _tl = new TimelineLite();
    _tl.to(element.position, dur, {
      x: function x() {
        if (back) return '-=0.75';
        return '+=0.75';
      },
      ease: Linear.easeNone
    }, 0).to(element.position, dur, {
      y: '+=0.3',
      ease: 'birdEase'
    }, 0);

    return _tl;
  }

  function turn() {
    var _tl = new TimelineLite();
    _tl.set(element.rotation, {
      y: '+=' + Math.PI,
      ease: Linear.easeNone
    }, dur);

    return _tl;
  }

  function getRandom(min, max) {
    return Math.random() * (max - min + 1) + min;
  }
  function repeat() {
    TweenMax.delayedCall(getRandom(8, 20), function () {
      tl.restart();
    });
  }

  var tl = new TimelineLite({
    onComplete: repeat
  });

  tl.add(hop()).add(hop()).add(hop()).add(turn()).add(hop(true), '+=1').add(hop(true)).add(hop(true)).add(turn());

  var animate = function animate() {};

  return {
    element: group,
    animate: animate
  };
};

module.exports = bird;

});

require.register("js/mansion/three/rooms/room05/fox.js", function(exports, require, module) {
'use strict';

var Bilboard = require('../../helpers/Bilboard');

var fox = function fox(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = Bilboard;
  var path = './imgs/mansion/duds/';

  var element = bilboard.create(path + 'fox.png', {
    name: _opts.name,
    width: _opts.width
  }, parent);
  group.add(element);

  var jump = function jump(height) {
    var _tl = new TimelineLite();

    _tl.to(element.position, 0.15, {
      y: '+=' + height,
      ease: Power1.easeOut
    });
    _tl.to(element.position, 0.15, {
      y: '-=' + height,
      ease: Power1.easeIn
    });

    return _tl;
  };

  function getRandom(min, max) {
    return Math.random() * (max - min + 1) + min;
  }
  function repeat() {
    TweenMax.delayedCall(getRandom(8, 20), function () {
      tl.restart();
    });
  }

  var tl = new TimelineLite({
    onComplete: repeat
  });

  tl.add(jump(0.1));
  tl.add(jump(0.15));
  tl.add(jump(0.2));
  tl.add(jump(0.3));
  tl.add(jump(0.4));

  var animate = function animate() {
    if (!tl.isActive()) tl.play(0);
  };

  return {
    element: group,
    animate: animate
  };
};

module.exports = fox;

});

require.register("js/mansion/three/rooms/room05/riddleAnswer.js", function(exports, require, module) {
'use strict';

var bell = require('./bell');

var riddleAnswer = function riddleAnswer(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();

  var bell1 = bell(_opts, parent);
  group.add(bell1.element);

  var bell2 = bell({
    name: _opts.name,
    width: _opts.width * 0.4,
    x: _opts.x + 0.9,
    y: _opts.y,
    z: _opts.z,
    direction: -1
  }, parent);
  group.add(bell2.element);

  var bell3 = bell({
    name: _opts.name,
    width: _opts.width * 0.3,
    x: _opts.x + 1.5,
    y: _opts.y,
    z: _opts.z
  }, parent);
  group.add(bell3.element);

  var bell4 = bell({
    name: _opts.name,
    width: _opts.width * 0.4,
    x: _opts.x + 2,
    y: _opts.y,
    z: _opts.z,
    direction: -1
  }, parent);
  group.add(bell4.element);

  var animate = function animate() {
    TweenMax.killDelayedCallsTo(shouldNag);
    TweenMax.killDelayedCallsTo(nag);
    nagTween.pause(0);

    TweenMax.to([bell1.tween, bell4.tween, bell3.tween, bell2.tween], 2, {
      progress: 1,
      ease: Linear.easeNone,
      onComplete: parent.zoomCheck,
      onCompleteScope: parent
    });
  };

  var dur = 0.05;
  var nagTween = TweenMax.to([bell1.element.rotation, bell2.element.rotation, bell3.element.rotation, bell4.element.rotation], dur, {
    z: function z(i) {
      if (i % 2) return Math.PI / 128;
      return -Math.PI / 128;
    },
    repeat: 3,
    repeatDelay: dur,
    yoyo: true,
    paused: true
  });

  var nag = function nag() {
    nagTween.play(0);
    TweenMax.delayedCall(3, shouldNag);
  };

  var shouldNag = function shouldNag() {
    if (parent.parent.step === 2) {
      TweenMax.delayedCall(3, nag);
    } else if (parent.parent.step > 2) {
      // console.log('Do nothing');
    } else {
      TweenMax.delayedCall(3, shouldNag);
    }
  };

  TweenMax.delayedCall(3, shouldNag);

  return {
    element: group,
    animate: animate
  };
};

module.exports = riddleAnswer;

});

require.register("js/mansion/three/rooms/room05/sewingMachine.js", function(exports, require, module) {
'use strict';

var pivotBottomCenter = require('../../helpers/pivotBottomCenter');

var sewingMachine = function sewingMachine(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = pivotBottomCenter;
  var path = './imgs/mansion/duds/sewingMachine/';

  var table = bilboard.create(path + 'table.png', {
    name: _opts.name,
    width: _opts.width,
    ratio: 2
  }, parent);
  group.add(table);

  var machine = bilboard.create(path + 'machine.png', {
    name: _opts.name,
    width: _opts.width * 2,
    ratio: 0.5,
    y: _opts.width * 1.35
  }, parent);
  group.add(machine);

  var tl = new TimelineLite({ paused: true });

  tl.to(machine.rotation, 0.1, {
    z: Math.PI / 64,
    ease: Linear.easeNoe
  });
  tl.to(machine.rotation, 0.1, {
    z: -Math.PI / 64,
    ease: Linear.easeNoe
  });
  tl.to(machine.rotation, 0.1, {
    z: Math.PI / 64,
    ease: Linear.easeNoe
  });
  tl.to(machine.rotation, 0.1, {
    z: -Math.PI / 64,
    ease: Linear.easeNoe
  });
  tl.to(machine.rotation, 0.1, {
    z: 0,
    ease: Linear.easeNoe
  });
  var animate = function animate() {
    if (!tl.isActive()) tl.play(0);
  };

  return {
    element: group,
    animate: animate
  };
};

module.exports = sewingMachine;

});

require.register("js/mansion/three/rooms/room05/wardrobe.js", function(exports, require, module) {
'use strict';

var Bilboard = require('../../helpers/Bilboard');

var wardrobe = function wardrobe(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = Bilboard;
  var path = './imgs/mansion/duds/';

  var element = bilboard.create(path + 'wardrobe.png', {
    name: _opts.name,
    width: _opts.width,
    ratio: 2
  }, parent);
  group.add(element);

  var animate = function animate() {
    TweenMax.to(element.rotation, 0.5, {
      z: Math.PI / 8,
      repeat: 1,
      yoyo: true
    });
  };

  return {
    element: group,
    animate: animate
  };
};

module.exports = wardrobe;

});

require.register("js/mansion/three/rooms/room06.js", function(exports, require, module) {
'use strict';

var bird = require('./room06/bird');
var bird2 = require('./room06/bird2');
var flowerPot = require('./room06/flowerPot');

var room05 = {
  create: function create(parent) {
    var group = new THREE.Group();
    var path = './imgs/mansion/duds/';

    this.dud01 = bird({
      width: 1.35,
      x: 2.6,
      y: -4,
      z: 0.1
    }, parent);
    group.add(this.dud01.element);

    this.dud02 = flowerPot({
      name: 'room06_dud02',
      width: 1.7,
      x: 3.7,
      y: -5.31
    }, parent);
    group.add(this.dud02.element);

    this.dud03 = bird2({
      width: 1.3,
      x: 6,
      y: -3
    }, parent);
    group.add(this.dud03.element);

    this.element = group;
  },

  animate: function animate(hit, wasHit) {
    switch (hit) {

      case 'room06_dud02':
        this.dud02.animate();
        break;

      default:

    }
  }
};

module.exports = room05;

});

require.register("js/mansion/three/rooms/room06/bird.js", function(exports, require, module) {
'use strict';

var pivotBottomCenter = require('../../helpers/pivotBottomCenter');

var bird = function bird(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = pivotBottomCenter;
  var path = './imgs/mansion/duds/';

  var element = bilboard.create(path + 'bird5.png', {
    name: _opts.name,
    width: _opts.width,
    doubleFace: true
  }, parent);
  group.add(element);

  function getRandom(min, max) {
    return Math.random() * (max - min + 1) + min;
  }
  function repeat() {
    TweenMax.delayedCall(getRandom(8, 20), function () {
      tl.restart();
    });
  }

  var tl = new TimelineLite({
    onComplete: repeat
  });
  var dur = 0.25;

  tl.to(element.position, dur * 2, {
    x: '+=2.5',
    ease: Linear.easeNone
  });
  tl.to(element.position, dur, {
    y: '+=1',
    ease: Power1.easeOut
  }, 0);
  tl.to(element.position, dur, {
    y: '-=0.5',
    ease: Power1.easeIn
  }, dur);

  tl.add(TweenMax.to(element.rotation, dur * 0.25, {
    z: -Math.PI / 32,
    repeat: 1,
    yoyo: true,
    ease: Linear.easeNone
  }));
  tl.add(TweenMax.to(element.rotation, dur * 0.35, {
    z: -Math.PI / 32,
    repeat: 1,
    yoyo: true,
    ease: Linear.easeNone
  }), '+=1');

  tl.set(element.rotation, {
    y: -Math.PI
  }, '+=0.5');

  tl.to(element.position, dur * 2, {
    x: '-=2.5',
    ease: Linear.easeNone
  }, 'JumpBack');
  tl.to(element.position, dur, {
    y: '+=0.5',
    ease: Power1.easeOut
  }, 'JumpBack');
  tl.to(element.position, dur, {
    y: '-=1',
    ease: Power1.easeIn
  }, 'JumpBack+=' + dur);
  tl.add(TweenMax.to(element.rotation, dur * 0.25, {
    z: -Math.PI / 32,
    repeat: 1,
    yoyo: true,
    ease: Linear.easeNone
  }));
  tl.set(element.rotation, {
    y: 0
  }, '+=0.5');

  var animate = function animate() {
    // if(!tl.isActive()) tl.play(0)
  };

  return {
    element: group,
    animate: animate
  };
};

module.exports = bird;

});

require.register("js/mansion/three/rooms/room06/bird2.js", function(exports, require, module) {
'use strict';

var pivotBottomCenter = require('../../helpers/pivotBottomCenter');

var bird2 = function bird2(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = pivotBottomCenter;
  var path = './imgs/mansion/duds/';

  var element = bilboard.create(path + 'bird6.png', {
    name: _opts.name,
    width: _opts.width,
    doubleFace: true
  }, parent);
  group.add(element);

  function getRandom(min, max) {
    return Math.random() * (max - min + 1) + min;
  }
  function repeat() {
    TweenMax.delayedCall(getRandom(8, 20), function () {
      tl.restart();
    });
  }

  var tl = new TimelineLite({
    onComplete: repeat
  });
  var dur = 0.05;

  tl.add(TweenMax.to(element.rotation, dur, {
    z: -Math.PI / 64,
    repeat: 6,
    repeatDelay: dur,
    yoyo: true,
    ease: Linear.easeNone
  }));
  tl.to(element.rotation, dur, {
    z: 0,
    repeat: 1,
    yoyo: true,
    ease: Linear.easeNone
  }, '+=' + dur);

  var animate = function animate() {};

  return {
    element: group,
    animate: animate
  };
};

module.exports = bird2;

});

require.register("js/mansion/three/rooms/room06/flowerPot.js", function(exports, require, module) {
'use strict';

var pivotBottomCenter = require('../../helpers/pivotBottomCenter');

var flowerPot = function flowerPot(opts, parent) {
  var _opts = opts || {};
  var group = new THREE.Group();
  group.position.x = _opts.x || 0;
  group.position.y = _opts.y || 0;
  group.position.z = _opts.z || 0;
  var bilboard = pivotBottomCenter;
  var path = './imgs/mansion/duds/flowerPot/';

  var flower = bilboard.create(path + 'flower.png', {
    name: _opts.name,
    width: _opts.width,
    ratio: 2
  }, parent);
  group.add(flower);

  var pot = bilboard.create(path + 'pot.png', {
    name: _opts.name,
    width: _opts.width,
    ratio: 2
  }, parent);
  group.add(pot);

  var tl = new TimelineLite({ paused: true });

  tl.to(flower.position, 1, {
    y: '-=0.35',
    ease: Power2.easeInOut
  });
  tl.to(flower.position, 1, {
    y: 0,
    ease: Elastic.easeOut
  }, '+=0.5');

  var animate = function animate() {
    if (!tl.isActive()) tl.play(0);
  };

  return {
    element: group,
    animate: animate
  };
};

module.exports = flowerPot;

});

require.register("js/mansion/threeMansion.js", function(exports, require, module) {
'use strict';

var throttle = require('./throttle');
var ThreeBackground = require('./three/ThreeBackground');
var ThreeHouse = require('./three/ThreeHouse');
var ThreeAnimals = require('./three/ThreeAnimals');
var ThreeForeground = require('./three/ThreeForeground');
var controls = require('./controls');

var threeMansion = {
  _name: 'threeMansion',
  canvas: {
    holder: document.getElementById('canvasHolder'),
    width: 0,
    height: 0,
    left: 0,
    top: 0
  },
  mouse: new THREE.Vector2(),
  environment: { w: 20, h: 10 },
  cameraZoom: {
    start: 30,
    out: {
      x: 0,
      y: 0,
      z: 25
    },
    in: {
      x: 3,
      y: 3,
      z: 10
    },
    speed: 1
  },
  cameraZoomTargets: [{
    x: -3,
    y: 3,
    z: 10
  }, {
    x: -3,
    y: -3,
    z: 10
  }, {
    x: -3,
    y: 0,
    z: 10
  }, {
    x: 3,
    y: 0,
    z: 10
  }],
  isZoomed: false,
  count: 0, // to keep track of the assets being loaded
  shouldNag: true,

  init: function init(parent) {
    // console.log('[threeMansion] init');

    this.parent = parent;

    window.addEventListener('resize', throttle(this.resize.bind(this), 50));

    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Set the initial size of elements
    this.resize();

    this.camera = new THREE.PerspectiveCamera(50, this.canvas.width / this.canvas.height, 1, 1000);
    this.camera.position.z = 30;
    // this.camera.setFocalLength(30)// zoomed in
    this.camera.setFocalLength(10); // default


    this.canvas.holder.appendChild(this.renderer.domElement);

    // this.controls = controls.init(this.canvas, this)

    this.setupToggleZoom();

    // Show the preloader
    TweenMax.to('.preloader', 0.3, {
      autoAlpha: 1,
      ease: Power1.easeInOut,
      onComplete: this.createScene,
      onCompleteScope: this
    });
  },

  setupDraggable: function setupDraggable() {
    this.clickDelayedCall = TweenLite.delayedCall(this.doubleClickTime / 1000, this.triggerSingleClick, [], this).pause();

    this.draggable = Draggable.create('#draggable', {
      type: 'x,y',
      throwProps: true,
      cursor: 'pointer',
      zIndexBoost: false,
      onPress: this.onPress,
      onDrag: this.moveCamera,
      onDragScope: this,
      onClick: this.onClick,
      onClickScope: this,
      onDragEnd: function onDragEnd() {
        // Reset the dummy
        this.tween.kill();
        TweenMax.set('#draggable', { x: 0, y: 0 });
      }
    });
  },

  // onPress: function (e) {
  //   // console.log('press', e);
  // },


  moveCamera: function moveCamera() {
    var velX = ThrowPropsPlugin.getVelocity(this.draggable[0].target, 'x') / 100;
    var velY = ThrowPropsPlugin.getVelocity(this.draggable[0].target, 'y') / 100;

    ThrowPropsPlugin.to(this.camera.position, {
      throwProps: {
        x: {
          velocity: -velX,
          max: this.environment.w * 0.25,
          min: -this.environment.w * 0.25
        },
        y: {
          velocity: velY,
          max: this.environment.h * 0.35,
          min: -this.environment.h * 0.3
        }
      },
      ease: Power4.easeOut
    });
  },

  createScene: function createScene() {
    // console.log('[threeMansion] createScene');
    // each object in this function will call this.countReady when loaded
    this.house = ThreeHouse;
    this.house.init(this);
    var bg = ThreeBackground(this);
    var animals = ThreeAnimals(this);
    var fg = ThreeForeground(this);
    //
    this.scene.add(bg);
    this.scene.add(this.house.elements);
    this.scene.add(animals);
    this.scene.add(fg);
  },

  countReady: function countReady() {
    this.count--;
    // console.log('[threeMansion] countReady', this.count);
    if (this.count === 0) {
      // console.log('[threeMansion] all ready', this.parent._name);

      // Set the animation out
      this.intro = this.introAnimation();

      // Continuous rendering for THREE
      this.startRender();

      // hide preloader
      TweenMax.to('.preloader', 0.3, {
        autoAlpha: 0,
        ease: Power1.easeInOut,
        onComplete: this.parent.showStartScreen,
        onCompleteScope: this.parent
      });
    }
  },

  enableClick: function enableClick() {
    this.setupDraggable();

    // Show the zoom toggle
    TweenMax.to('#zoomToggle', 0.5, { autoAlpha: 1, ease: Power1.easeInOut });
    this.nag.play(0);

    // resume rendering
    this.startRender();
  },

  disableClick: function disableClick() {
    if (this.draggable) this.draggable[0].kill();
    TweenMax.set('#draggable', { clearProps: 'all' });

    // Hide the zoom toggle
    TweenMax.to('#zoomToggle', 0.5, { autoAlpha: 0, ease: Power1.easeInOut });
    this.nag.pause(0);
  },

  onClick: function onClick(e) {
    e.preventDefault();

    // Work out where in the screen the center of the canvas is in normalised values
    this.mouse.x = ((e.clientX || e.pageX) - this.canvas.left) / this.canvas.width * 2 - 1;
    this.mouse.y = ((e.clientY || e.pageY) - this.canvas.top) / this.canvas.height * -2 + 1;
    this.triggerSingleClick();
  },

  setupToggleZoom: function setupToggleZoom() {
    var zoomIn = document.querySelector('#zoomIn');
    var zoomOut = document.querySelector('#zoomOut');

    zoomIn.addEventListener('click', this.zoomIn.bind(this));
    zoomOut.addEventListener('click', this.zoomOut.bind(this));

    TweenMax.set('#zoomPointer', { rotation: '-25deg' });

    this.nag = new TimelineLite({
      paused: true,
      onComplete: this.nagZoom,
      onCompleteScope: this
    });

    this.nag.to('#zoomPointer', 0.5, {
      xPercent: -25,
      yPercent: 10,
      ease: Power1.easeInOut
    }, "+=2");
    this.nag.add(TweenMax.to('#zoomPointer', 0.5, {
      xPercent: 0,
      yPercent: 0,
      repeat: 2,
      yoyo: true,
      ease: Power1.easeIn
    }));
  },

  zoomIn: function zoomIn() {
    if (this.shouldNag) this.shouldNag = false;
    this.nagZoom();
    TweenMax.set('#zoomIn', { autoAlpha: 0 });
    TweenMax.set('#zoomOut', { autoAlpha: 1 });
    this.zoom(this.cameraZoom.in);
    this.isZoomed = true;
  },

  zoomOut: function zoomOut(isAnswer) {
    TweenMax.set('#zoomIn', { autoAlpha: 1 });
    TweenMax.set('#zoomOut', { autoAlpha: 0 });
    this.zoom(this.cameraZoom.out, isAnswer);
    this.isZoomed = false;
  },

  zoom: function zoom(position, isAnswer) {
    TweenMax.to(this.camera.position, this.cameraZoom.speed, {
      x: position.x,
      y: position.y,
      z: position.z,
      ease: Power3.easeInOut,
      onComplete: function onComplete() {
        if (isAnswer === true) {
          this.showAnswer();
        }
      },
      onCompleteScope: this
    });
  },

  zoomCheck: function zoomCheck() {
    if (this.isZoomed) {
      this.zoomOut(true);
    } else {
      this.showAnswer();
    }
  },

  nagZoom: function nagZoom() {
    if (this.shouldNag) {
      this.nag.play(0);
    } else {
      // Fade out
      TweenMax.to('#zoomPointer', 1, {
        autoAlpha: 0,
        ease: Power1.easeInOut,
        onComplete: function onComplete() {
          this.nag.pause(0);
        },
        onCompleteScope: this
      });
    }
  },

  showAnswer: function showAnswer() {
    this.parent.showAnswer();
    this.cameraZoom.in = this.cameraZoomTargets[this.parent.step];
  },

  triggerSingleClick: function triggerSingleClick(e) {
    var hit = this.userClick.click(this.mouse);

    if (hit) {
      this.parent.handleClick(this, hit);
    }
  },

  introAnimation: function introAnimation() {
    var focalLength = { value: 10 }; // intial value
    var tl = new TimelineLite({
      paused: true,
      onComplete: this.introAnimationComplete,
      onCompleteScope: this
    });
    var dur = 5;

    tl.to(focalLength, dur, {
      value: 30,
      ease: Power4.easeInOut,
      onUpdate: function onUpdate() {
        this.camera.setFocalLength(focalLength.value);
      },
      onUpdateScope: this
    }, 'Zoom');
    tl.fromTo(this.camera.position, dur, {
      z: this.cameraZoom.start
    }, {
      z: this.cameraZoom.out.z,
      ease: Power4.easeInOut
    }, 'Zoom');

    var left = this.scene.getObjectByName('mansionFrontLeft');
    var right = this.scene.getObjectByName('mansionFrontRight');

    tl.staggerTo([left.material, right.material], 1, {
      opacity: 0
    }, 0.125);

    // Remove later
    // tl.timeScale(15)
    return tl;
  },

  introAnimationComplete: function introAnimationComplete() {
    this.parent.introAnimationComplete();

    TweenMax.staggerTo(['#zoomIn', '#zoomPointer'], 1, {
      autoAlpha: 1,
      ease: Power1.easeInOut,
      onComplete: this.nagZoom,
      onCompleteScope: this
    }, 0.15);
  },

  outroAnimation: function outroAnimation() {
    // console.log('[threeMansion] outroAnimation', this._name);
    this.disableClick();
    this.stopRender();
    TweenMax.to('canvas', 1, {
      autoAlpha: 0,
      ease: Power1.easeInOut,
      onComplete: this.parent.parent.outroAnimation,
      onCompleteScope: this.parent.parent
    });
  },

  childAnimation: function childAnimation(hit, wasHit) {
    // console.log('[threeMansion] childAnimation', hit, wasHit);
    this.house.childAnimation(hit, wasHit);
  },

  startRender: function startRender() {
    TweenMax.ticker.addEventListener("tick", this.render, this);
  },

  stopRender: function stopRender() {
    TweenMax.ticker.removeEventListener("tick", this.render, this);
  },

  render: function render() {
    this.renderer.render(this.scene, this.camera);
  },

  resize: function resize() {

    var bounds = this.canvas.holder.getBoundingClientRect();

    // When on portrait mode, need to invert the measuring of the canvas
    if (bounds.width > bounds.height) {
      // Landscape
      this.canvas.width = bounds.width;
      this.canvas.height = bounds.height;
    } else {
      // Portrait
      this.canvas.width = bounds.height;
      this.canvas.height = bounds.width;
    }
    this.canvas.left = bounds.left;
    this.canvas.top = bounds.top;

    this.renderer.setSize(this.canvas.width, this.canvas.height);
  }
};

module.exports = threeMansion;

});

require.register("js/mansion/throttle.js", function(exports, require, module) {
'use strict';

/* 'Borrowed' from underscore */

function _now() {
	return Date.now() || function () {
		return new Date().getTime();
	};
}

/* 'Borrowed' from underscore */
var throttle = function throttle(func, wait, options) {
	var context, args, result;
	var timeout = null;
	var previous = 0;
	if (!options) options = {};
	var later = function later() {
		previous = options.leading === false ? 0 : _now();
		timeout = null;
		result = func.apply(context, args);
		if (!timeout) context = args = null;
	};
	return function () {
		var now = _now();
		if (!previous && options.leading === false) previous = now;
		var remaining = wait - (now - previous);
		context = this;
		args = arguments;
		if (remaining <= 0 || remaining > wait) {
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
			previous = now;
			result = func.apply(context, args);
			if (!timeout) context = args = null;
		} else if (!timeout && options.trailing !== false) {
			timeout = setTimeout(later, remaining);
		}
		return result;
	};
};

module.exports = throttle;

});

require.register("js/shared/ImageLoader.js", function(exports, require, module) {
'use strict';

var ImageLoader = function ImageLoader(callback) {
  // console.log('[ImageLoader] init');
  this.count = 0;
  // this.callback = callback
};

ImageLoader.prototype.load = function (filenames, holder, opts) {
  // If no filenames or holder, no cigar
  if (!filenames || !holder) throw 'Please provide filenames and holder';

  this._opts = opts || {};

  if (this.count === 0) this.showPreloader();

  if (this._opts.callback) this.callback = this._opts.callback;

  // Grab the html tag based on the string provided using its id or tag name
  var container = document.getElementById(holder) || document.querySelector(holder);

  // Check to see what has been passed as an url
  var param = Object.prototype.toString.call(filenames);

  if (param === '[object Array]') {
    if (filenames.length > 0) {
      for (var i = 0; i < filenames.length; i++) {
        container.appendChild(this.createImage(filenames[i]));
      }
    } else {
      throw 'Empty array';
    }
  } else if (param === '[object String]') {
    container.appendChild(this.createImage(filenames));
  } else {
    throw 'Please enter a string or an array as value';
  }
};

ImageLoader.prototype.createImage = function (_filename) {
  // Add one to the count of images loading
  this.count++;
  // Create the element tag
  var image = document.createElement("img");
  image.onload = this.countReady.bind(this);
  // If a path was provided, use it
  image.src = this._opts.path ? this._opts.path + _filename : _filename;
  // If an id was provided, use it - Otherwise, use the original filename cutting off the unnecessary parts
  image.id = this._opts.id ? this._opts.id : _filename.split('-')[0];

  // console.log('[ImageLoader] load', _filename, this.count);

  return image;
};

ImageLoader.prototype.countReady = function () {
  this.count--;

  // console.log('[ImageLoader] countReady', this.count);
  if (this.count === 0) {
    this.hidePreloader();
  }
};

ImageLoader.prototype.showPreloader = function () {
  // console.log('[ImageLoader] showPreloader');
  TweenMax.to('.preloader', 1, {
    autoAlpha: 1,
    ease: Power1.easeInOut
  });
};

ImageLoader.prototype.hidePreloader = function () {
  // console.log('[ImageLoader] hidePreloader');
  TweenMax.to('.preloader', 1, {
    autoAlpha: 0,
    ease: Power1.easeInOut,
    onComplete: this.callback,
    onCompleteScope: this
  });
};

module.exports = ImageLoader;

});

require.register("js/shared/assetLoader.js", function(exports, require, module) {
"use strict";

});

require.register("js/shared/preloader.js", function(exports, require, module) {
'use strict';

var preloader = function preloader() {
  // console.log('[preloader] init');

  var loop = function loop(el, origin) {
    return TweenMax.to(el, 1, {
      rotation: 360,
      ease: Linear.easeNone,
      transformOrigin: origin,
      repeat: -1
    });
  };

  var tl = new TimelineLite();
  tl.add(loop('.preloader #seconds', '36% 50%'), 0);
  tl.add(loop('.preloader #minutes', '0% 50%').timeScale(0.5), 0);
  tl.add(loop('.preloader #hours', '100% 50%').timeScale(0.25), 0);
  tl.add(loop('.preloader #feathers', '50% 50%').timeScale(0.125), 0);

  var tween = TweenMax.to('.preloader', 1, {
    autoAlpha: 0,
    ease: Power1.easeInOut,
    paused: true,
    onComplete: tl.pause,
    onCompleteScope: tl,
    onReverseComplete: tl.play,
    onReverseCompleteScope: tl
  });

  var show = function show() {
    tween.reverse();
  };

  var hide = function hide() {
    tween.play();
  };

  return {
    show: show,
    hide: hide
  };
};

module.exports = preloader;

});

require.register("js/shared/validateEmail.js", function(exports, require, module) {
'use strict';

var validateEmail = function validateEmail(string) {
  // Was it empty
  if (!string) {
    // Return true because we want to allow the user to proceed without inputing his email address
    return true;
  } else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(string)) {
    return true;
  }
  return false;
};

module.exports = validateEmail;

});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=mansion.js.map