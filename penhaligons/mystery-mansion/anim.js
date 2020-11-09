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
require.register("js/animation/ImageLoader.js", function(exports, require, module) {
'use strict';

var ImageLoader = function ImageLoader(callback) {
  this.count = 0;
  this.callback = callback;
};

ImageLoader.prototype.load = function (filenames, holder, opts) {
  // If no filenames, holder or callback, no cigar
  if (!filenames || !holder) throw 'Please provide filenames and holder';

  this._opts = opts || {};

  if (this.count === 0) this.showPreloader();

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

require.register("js/animation/IntroAnimation.js", function(exports, require, module) {
'use strict';

var Suspects = require('./Suspects');
var ImageLoader = require('./ImageLoader');

var IntroAnimation = {

  init: function init(parent) {
    // console.log('[introAnimation] init');
    this.parent = parent;

    var bt = document.querySelector('#introAnimation .foreground #next');

    var loader = new ImageLoader(this.animateIn.bind(this));

    // console.log(loader);

    loader.load(['introBg3-1920w.jpg', 'introPaper-1920w.png', 'introBg2-1920w.jpg', 'introBg1-1920w.jpg'], '#introAnimation .background .clipper', {
      path: 'imgs/introOutro/'
    });

    // Loading the maginfying glass here to piggyback on the ImageLoader
    loader.load(['zoomIn-1920w.png', 'zoomOut-1920w.png', 'zoomPointer-1920w.png'], '#zoomToggle > .ratio', {
      path: 'imgs/mansion/zoomToggle/'
    });

    Suspects.init();
  },

  animateIn: function animateIn() {
    var dur = 3;
    var hold = 9;
    var tl = new TimelineLite({
      onComplete: this.parent.startScreen,
      onCompleteScope: this.parent,
      paused: true
    });
    var spotLight = '#introBgMask > ellipse';
    var cardCount = 1;

    // Align assets with GSAP as we're using it to transform them later
    TweenMax.set('#introAnimation .background img', {
      xPercent: -50,
      yPercent: -50
    });
    TweenMax.set('#introAnimation .copy', {
      yPercent: -50
    });

    function countUp() {
      cardCount++;
    }

    function textIn(el) {
      TweenMax.set(el, { yPercent: -50 });
      return TweenMax.from(el, dur * 0.25, { autoAlpha: 0, ease: Power1.easeInOut });
    }

    function textOut(el) {
      return TweenMax.to(el, dur * 0.25, { autoAlpha: 0 });
    }

    function spotLightToggle(on) {
      if (on) {
        return TweenMax.fromTo(spotLight, dur * 0.5, { autoAlpha: 0 }, { autoAlpha: 1, ease: Power1.easeInOut });
        return;
      } else {
        return TweenMax.to(spotLight, dur * 0.25, { autoAlpha: 0, ease: Power1.easeInOut });
      }
    }

    function animateCard(bgImg, textEl, focus) {
      var _tl = new TimelineLite();

      _tl.call(countUp);
      // Animate In
      if (focus) {
        _tl.to(bgImg, 0.01, { autoAlpha: 1 });
        _tl.to(bgImg, dur + hold, { scale: 1.25, transformOrigin: focus, ease: Linear.easeNone });
      } else {
        _tl.to([bgImg, '#introPaper'], 0.01, { autoAlpha: 1 });
        // It is the newspaper shot
        _tl.to([bgImg, '#introPaper'], dur + hold, { scale: 1.25, transformOrigin: '25% 50%', ease: Linear.easeNone }, 'Paper');
        _tl.from('#introPaper', dur * 0.15, { rotation: '-=30deg', x: '-=30%', y: '+=80%', ease: Power1.easeOut }, 'Paper+=0.5');
      }
      _tl.add(spotLightToggle(true), 0).add(textIn(textEl), dur * 0.25)

      // Animate Out
      .add('Out', '-=' + dur * 0.25).add(textOut(textEl), 'Out').add(spotLightToggle(), 'Out').set(bgImg, { autoAlpha: 0 });

      return _tl;
    }

    tl.to(['#introAnimation', '#staticDecorators', '#next', '#introAnimation svg'], 0.5, { autoAlpha: 1, ease: Power1.easeInOut }, 0)

    //Screen one
    .add(animateCard('#introBg1', '#c1', "25% 50%"))

    // Screen two
    .set(spotLight, { attr: { cx: '68%' } }).add(animateCard('#introBg2', '#c2', "75% 50%"), 'Card2')

    // Screen three
    .set(spotLight, { attr: { cx: '25%' } }).add(animateCard('#introBg3', '#c3'), 'Card3')
    // Screen four
    .call(countUp).from('#suspects', dur * 0.25, { autoAlpha: 0, ease: Power1.easeInOut }, 'Card4').add(TweenMax.staggerTo(['#suspects #next', '#suspects #previous'], 0.5, {
      cycle: {
        xPercent: [20, -20]
      },
      ease: Power1.easeInOut,
      repeat: 3,
      yoyo: true
    }))
    // Put this back in later
    .addPause().to('#introAnimation', dur * 0.25, { autoAlpha: 0, ease: Power1.easeInOut }, 'Card5');

    // Next button
    var next = document.querySelector('#introAnimation .foreground #next');
    next.addEventListener('click', function () {
      // cardCount++
      // console.log('[IntroAnimation] next', 'Card' + cardCount);
      tl.seek('Card' + cardCount);
      tl.play();
    });

    // remove later
    // tl.timeScale(150)

    tl.play();
  }
};

module.exports = IntroAnimation;

});

require.register("js/animation/IntroOutro.js", function(exports, require, module) {
'use strict';

var Intro = require('./IntroAnimation');
var Outro = require('./OutroAnimation');

var IntroOutro = {
  intro: function intro(app) {
    Intro.init(app);
  },
  outro: function outro(app) {
    Outro.init(app);
  }
};

module.exports = IntroOutro;

});

require.register("js/animation/OutroAnimation.js", function(exports, require, module) {
'use strict';

// const makeButton = require('./../shared/makeButton')

var ImageLoader = require('./ImageLoader');

var outroAnimation = {

  init: function init(parent) {
    this.parent = parent;

    this.bt = document.querySelector('#outroAnimation #next');
    this.finish = document.querySelector('#outroAnimation #finish');

    var loader = new ImageLoader(this.animateIn.bind(this));

    loader.load(['introBg3-1920w.jpg', 'outroPaper-1920w.png', 'outroBg1-1920w.jpg', 'outroWill-1920w.png', 'outroClock-1920w.png', 'outroPendulum-1920w.png', 'outroPendulumFront-1920w.png', 'outroKey-1920w.png', 'outroChair-1920w.png'], '#outroAnimation .background .clipper', {
      path: 'imgs/introOutro/'
    });

    // piggyback the loader for the endScreen assets
    loader.load(['hero.png'], '#productHolder .card', {
      path: 'imgs/endScreen/'
    });
  },

  animateIn: function animateIn() {
    var dur = 0.3;
    var tl = new TimelineLite({
      paused: true
    });
    var spotLight = '#outroBgTexture #outroVignetteMask';

    TweenMax.set('#outroAnimation .background img', {
      xPercent: -50,
      yPercent: -50
    });
    TweenMax.set('#outroAnimation .copy', {
      yPercent: -50
    });
    TweenMax.set('#outroAnimation .background #outroPaper', {
      yPercent: 0
    });

    this.tween = TweenMax.fromTo('#outroAnimation #outroPendulum', 1, {
      rotation: '-4deg',
      transformOrigin: '50% 25%'
    }, {
      rotation: '4deg',
      ease: Power1.easeInOut,
      repeat: -1,
      yoyo: true
    });

    tl.to(['#outroAnimation #outroBg1', '#outroAnimation #outroWill', '#outroAnimation #outroClock', '#outroAnimation #outroPendulum', '#outroAnimation #outroPendulumFront', '#outroAnimation #outroKey', '#outroAnimation #outroChair'], 0.01, { autoAlpha: 1, ease: Power1.easeOut });

    tl.to('#outroAnimation', 2, { autoAlpha: 1, ease: Power1.easeOut }).to('#outroAnimation #outroKey', 1, {
      rotation: '-90deg',
      transformOrigin: '50% 82.5%',
      ease: Back.easeInOut
    })

    // Show the secret passage
    .to(['#outroAnimation #outroClock', '#outroAnimation #outroPendulum', '#outroAnimation #outroPendulumFront', '#outroAnimation #outroKey'], 4, {
      xPercent: '-=18',
      ease: Back.easeInOut.config(0.5)
    }, 'MoveClock').from('#outroAnimation #outroWill', 2, {
      x: '-=10',
      y: '+=50',
      ease: Power1.easeInOut
    }, 'MoveClock+=1.5')

    // Move stuff to the left
    .to(['#outroAnimation .background'], 2, {
      xPercent: '-=25',
      z: 0.1,
      rotation: 0.1,
      ease: Power1.easeInOut
    }, 'MoveRight')

    // Show text and next button
    .from(['.midground', '.foreground'], 1, {
      autoAlpha: 0,
      ease: Power1.easeInOut
    }).addPause().to(['.background', '.midground', '.foreground'], 1, {
      autoAlpha: 0,
      ease: Power1.easeInOut
    }, 'Questioned').set('.background', {
      xPercent: '+=25'
    }).set(['#outroAnimation #outroBg1', '#outroAnimation #outroWill', '#outroAnimation #outroClock', '#outroAnimation #outroPendulum', '#outroAnimation #outroPendulumFront', '#outroAnimation #outroKey', '#outroAnimation #outroChair', this.bt], {
      autoAlpha: 0
    });
    tl.to(['#outroAnimation #outroPaper', '#outroAnimation #introBg3'], 0.01, { autoAlpha: 1, ease: Power1.easeOut })

    // Blanche questioned
    .set('#outroAnimation #outroPaper', {
      transformOrigin: '50% 100%'
    }).to(['.background', '.foreground'], 1.5, {
      autoAlpha: 1,
      ease: Power1.easeInOut
    }, 'Paper').to(['#outroAnimation #introBg3', '#outroAnimation #outroPaper'], 12, {
      scale: 1.25,
      ease: Linear.easeNone
    }, 'Paper').from('#outroAnimation #outroPaper', 0.5, {
      rotation: '-=30deg',
      x: '-=30%',
      y: '+=50%'
    }, 'Paper').to('#outroAnimation #finish', 1, {
      autoAlpha: 1,
      ease: Power1.easeInOut
    }, 'Paper+=1.5');

    this.bt.addEventListener('click', function () {
      tl.seek('Questioned').play();
    });
    this.finish.addEventListener('click', function () {
      TweenMax.to('#outroAnimation', 1, {
        autoAlpha: 0,
        ease: Power1.easeInOut,
        onComplete: this.showProducts,
        onCompleteScope: this
      });
    }.bind(this));

    // tl.timeScale(15)
    tl.play();
  },

  showProducts: function showProducts() {
    // console.log('[outroAnimation] showProducts');
    this.tween.pause();
    this.parent.showProducts();
  }
};

module.exports = outroAnimation;

});

require.register("js/animation/Suspects.js", function(exports, require, module) {
'use strict';

// ************ //

var characters = [{
	title: 'The Ruthless Countess Dorothea',
	description: 'A most ferocious matriarch, known for her sharp mind, even sharper wit. Be careful what you say.',
	avatar: '<img id="dorothea" data-index="0" src="./imgs/suspects/dorothea.png">',
	url: './imgs/suspects/dorothea.png'
}, {
	title: 'Monsieur Beauregard',
	description: 'So suave. So sophisticated. So smooth. Be warned. There’s no going back.',
	avatar: '<img id="beauregard" data-index="1" src="./imgs/suspects/beauregard.png">',
	url: './imgs/suspects/beauregard.png'
}, {
	title: 'The Uncompromising Sohan',
	description: 'His business relationships have (al)most naturally turned into amicable ties. Everyone has a price.',
	avatar: '<img id="sohan" data-index="2" src="./imgs/suspects/sohan.png">',
	url: './imgs/suspects/sohan.png'
}, {
	title: 'The Bewitching Yasmine',
	description: 'She is by all appearances soft and quiet. She has one’s attention. (Often when one is male).',
	avatar: '<img id="yasmine" data-index="3" src="./imgs/suspects/yasmin.png">',
	url: './imgs/suspects/yasmin.png'
}, {
	title: 'The Tragedy of Lord George',
	description: 'Deceptively traditional, a perfect reminder that one should be aware of appearances.',
	avatar: '<img id="george" data-index="4" src="./imgs/suspects/george.png">',
	url: './imgs/suspects/george.png'
}, {
	title: 'The Revenge of Lady Blanche',
	description: 'A social butterfly with a dangerous bite one might say. (Cross her at your peril.) ',
	avatar: '<img id="blanche" data-index="5" src="./imgs/suspects/blanche.png">',
	url: './imgs/suspects/blanche.png'
}];
// ************ //


var Suspects = {

	init: function init() {
		this.holder = document.querySelector('#suspects');
		this.characters = characters;

		this.ttl = this.characters.length;
		this.prevIndex = this.ttl;
		this.index = 1;
		this.nextIndex = 2;
		this.direction = 0;

		this.prevButton = this.holder.querySelector('#previous');
		this.nextButton = this.holder.querySelector('#next');

		this.populateButtons();
		this.addEventListeners();
	},

	addFrame: function addFrame() {
		var path = './imgs/suspects/mirrorFrame';
		var src = path + '-1024w.png';
		var srcset = path + '-1024w.png 1024w, ' + path + '-1920w.png 1920w';
		var frame = document.createElement('img');
		frame.setAttribute('src', src);
		frame.setAttribute('srcset', srcset);

		this.holder.querySelector('.frame').appendChild(frame);
	},

	populateButtons: function populateButtons() {
		var focusArea = this.holder.querySelector('.left .portraits');
		var title = this.holder.querySelector('.right h2');
		var description = this.holder.querySelector('.right .small');

		this.addFrame();

		for (var i = 0; i < this.ttl; i++) {

			var portraitsHolder = this.holder.querySelector('.portraits g');
			var portrait = document.createElementNS('http://www.w3.org/2000/svg', 'image');
			portrait.setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.characters[i].url);
			portrait.setAttributeNS(null, 'x', 0);
			portrait.setAttributeNS(null, 'y', 0);
			portrait.setAttributeNS(null, 'width', '100%');
			portrait.setAttributeNS(null, 'height', '100%');

			portraitsHolder.appendChild(portrait);

			title.innerHTML = title.innerHTML + '<span>' + this.characters[i].title + '</span>';

			description.innerHTML = description.innerHTML + '<span>' + this.characters[i].description + '</span>';
		}

		// Spread the portraits along the x axis
		var last = this.ttl - 1;
		TweenMax.set('.portraits image', {
			xPercent: function xPercent(i) {
				// Expect the last one one
				if (i === last) {
					return -100;
				}
				return 100 * i;
			}
		});

		// Move all text on top of each other
		// This way we can have a fixed height based in the contained text
		TweenMax.set('.right h2 > span', {
			xPercent: function xPercent(i) {
				return -(100 * i);
			},
			autoAlpha: function autoAlpha(i) {
				if (i !== 0) {
					return 0;
				}
			}
		});
		TweenMax.set('.right p > span', {
			xPercent: function xPercent(i) {
				return -(100 * i);
			},
			autoAlpha: function autoAlpha(i) {
				if (i !== 0) {
					return 0;
				}
			}
		});
	},

	addEventListeners: function addEventListeners() {
		this.prevButton.addEventListener('click', this.onClick.bind(this), true);
		this.nextButton.addEventListener('click', this.onClick.bind(this), true);
	},

	onClick: function onClick(e) {
		e.stopPropagation();

		var prev = ' :nth-child(0n +' + this.prevIndex + ')';
		var curr = ' :nth-child(0n +' + this.index + ')';
		var next = ' :nth-child(0n +' + this.nextIndex + ')';

		// Find out which button was clicked
		var trg = e.currentTarget.id;
		// Change the direction
		if (trg === 'next') {
			this.direction = 1;
		} else {
			this.direction = -1;
		}
		// Only play the animation is none is playing
		if (!TweenMax.getTweensOf('.left .portraits image')[0]) {
			this.prevIndex += this.direction;
			this.index += this.direction;
			this.nextIndex += this.direction;

			if (this.prevIndex > this.ttl) {
				this.prevIndex = 1;
			}
			if (this.index > this.ttl) {
				this.index = 1;
			}
			if (this.nextIndex > this.ttl) {
				this.nextIndex = 1;
			}
			if (this.prevIndex < 1) {
				this.prevIndex = this.ttl;
			}
			if (this.index < 1) {
				this.index = this.ttl;
			}
			if (this.nextIndex < 1) {
				this.nextIndex = this.ttl;
			}

			var dur = 1;
			var length = (this.ttl - 1) * 100;
			var thisDirection = this.direction;

			if (thisDirection < 0) {
				TweenMax.to('.right h2' + prev, dur, { autoAlpha: 1 });
				TweenMax.to('.right h2' + curr, dur, { autoAlpha: 0 });
				TweenMax.to('.right h2' + next, dur, { autoAlpha: 0 });

				TweenMax.to('.right p' + prev, dur, { autoAlpha: 1 });
				TweenMax.to('.right p' + curr, dur, { autoAlpha: 0 });
				TweenMax.to('.right p' + next, dur, { autoAlpha: 0 });
			} else {
				TweenMax.to('.right h2' + prev, dur, { autoAlpha: 0 });
				TweenMax.to('.right h2' + curr, dur, { autoAlpha: 0 });
				TweenMax.to('.right h2' + next, dur, { autoAlpha: 1 });

				TweenMax.to('.right p' + prev, dur, { autoAlpha: 0 });
				TweenMax.to('.right p' + curr, dur, { autoAlpha: 0 });
				TweenMax.to('.right p' + next, dur, { autoAlpha: 1 });
			}

			TweenMax.to('.left .portraits image', dur, {
				xPercent: '+=' + thisDirection * -100,
				modifiers: {
					xPercent: function xPercent(x) {
						if (x < -100) {
							return 400;
						} else if (x >= length) {
							return -100;
						}
						return x;
					}
				},
				ease: Power2.easeInOut
			});
		}
	},

	onOver: function onOver(e) {},

	onOut: function onOut(e) {}
};

module.exports = Suspects;

});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=anim.js.map