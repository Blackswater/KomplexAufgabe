(function() {
  var DEFAULT_CONFIG, ns;

  ns = this.antsimulator;

  DEFAULT_CONFIG = {
    SCALE: 4,
    NUM_ANTS: 1000,
    STEPS_PER_FRAME: 1,
    ANT_TURN_SPEED: 0.7,
    SHOW_ANTS: 1,
    JITTER_MAGNITUDE: 0.5,
    NEST_FALLOFF_RATE: 0.01,
    FOOD_TRAIL_FALLOFF_RATE: 0.01,
    NEST_TRAIL_FADE_RATE: 0.01,
    FOOD_TRAIL_FADE_RATE: 0.005
  };

  ns.AntSim = (function() {
    function AntSim() {
      this.CONFIG = DEFAULT_CONFIG;
      this.frame = 0;
      this.layerScale = this.CONFIG.SCALE;
      this.createCanvas();
      this.createLayers();
      this.ants = [];
      this.update();
    }

    AntSim.prototype.createCanvas = function() {
      this.b = document.body;
      this.c = document.getElementsByTagName('canvas')[0];
      this.a = this.c.getContext('2d');
      this.w = this.c.width = this.c.clientWidth;
      this.h = this.c.height = this.c.clientHeight;
      return document.body.clientWidth;
    };

    AntSim.prototype.createLayers = function() {
      this.layers = {};
      this.layers.nesttrail = new ns.NestTrail(this);
      this.layers.foodtrail = new ns.FoodTrail(this);
      this.layers.food = new ns.Food(this);
      return this.compositor = new ns.LayerCompositor(this);
    };

    AntSim.prototype.createAndRemoveAnts = function() {
      while (this.ants.length < this.CONFIG.NUM_ANTS) {
        this.ants.push(new ns.Ant(this, new ns.Vec(this.w / 2, this.h)));
      }
      if (this.ants.length > this.CONFIG.NUM_ANTS) {
        return this.ants = this.ants.slice(0, this.CONFIG.NUM_ANTS);
      }
    };

    AntSim.prototype.drawLayers = function() {
      this.a.putImageData(this.compositor.getImageData(this.layers), 0, 0);
      return this.a.drawImage(this.c, 0, 0, this.layerScale * this.w, this.layerScale * this.h);
    };

    AntSim.prototype.update = function() {
      var ant, i, k, layer, _i, _j, _len, _ref, _ref1, _ref2;
      this.createAndRemoveAnts();
      for (i = _i = 0, _ref = this.CONFIG.STEPS_PER_FRAME; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _ref1 = this.layers;
        for (k in _ref1) {
          layer = _ref1[k];
          layer.update();
        }
        _ref2 = this.ants;
        for (_j = 0, _len = _ref2.length; _j < _len; _j++) {
          ant = _ref2[_j];
          ant.update();
        }
      }
      this.draw();
      return this.frame++;
    };

    AntSim.prototype.draw = function() {
      var ant, _i, _len, _raf, _ref;
      this.a.clearRect(0, 0, this.w, this.h);
      this.drawLayers();
      _ref = this.ants;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ant = _ref[_i];
        parseInt(this.CONFIG.SHOW_ANTS) && ant.draw(this.a);
      }
      _raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame;
      return _raf(((function(_this) {
        return function() {
          return _this.update();
        };
      })(this)));
    };

    return AntSim;

  })();

}).call(this);