(function() {
  var ns,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  ns = this.antsimulator;

  ns.Layer = (function() {
    function Layer(_at_sim) {
      var i, _i, _ref;
      this.sim = _at_sim;
      this.w = ~~(this.sim.w / this.sim.layerScale);
      this.h = ~~(this.sim.h / this.sim.layerScale);
      this.buffer = [];
      for (i = _i = 0, _ref = this.w * this.h; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.buffer.push(this.initCell(i % this.w, Math.floor(i / this.h)));
      }
    }

    Layer.prototype.initCell = function(x, y) {
      return 0;
    };

    Layer.prototype.update = function() {};

    Layer.prototype.mul = function(n) {
      var i, v, _i, _len, _ref, _results;
      _ref = this.buffer;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        v = _ref[i];
        _results.push(this.buffer[i] = v * n);
      }
      return _results;
    };

    Layer.prototype.add = function(n) {
      var i, v, _i, _len, _ref, _results;
      _ref = this.buffer;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        v = _ref[i];
        _results.push(this.buffer[i] = v - n);
      }
      return _results;
    };

    Layer.prototype.blur = function(n) {
      var i, newBuffer, sumNeighbors, v, x, y, _i, _j, _k, _len, _ref, _ref1, _ref2, _ref3, _ref4, _x, _y;
      newBuffer = [];
      _ref = this.buffer;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        v = _ref[i];
        x = i % this.w;
        y = (i - x) / this.h;
        sumNeighbors = 0;
        for (_x = _j = _ref1 = Math.max(0, x - 1), _ref2 = Math.min(this.w - 1, x + 1); _ref1 <= _ref2 ? _j <= _ref2 : _j >= _ref2; _x = _ref1 <= _ref2 ? ++_j : --_j) {
          for (_y = _k = _ref3 = Math.max(0, y - 1), _ref4 = Math.min(this.h - 1, y + 1); _ref3 <= _ref4 ? _k <= _ref4 : _k >= _ref4; _y = _ref3 <= _ref4 ? ++_k : --_k) {
            sumNeighbors += this.buffer[_x + _y * this.w] * n;
          }
        }
        sumNeighbors += v * (1 - n);
        newBuffer[i] = sumNeighbors / (9 * n + (1 - n)) || 0;
      }
      return this.buffer = newBuffer;
    };

    Layer.prototype.mark = function(pos, n) {
      var i;
      i = this.posToIndex(pos);
      if (this.buffer[i] != null) {
        return this.buffer[i] += n;
      }
    };

    Layer.prototype.sample = function(pos) {
      var i;
      i = this.posToIndex(pos);
      return this.buffer[i] || 0;
    };

    Layer.prototype.take = function(pos, max) {
      var i, takeAmount;
      i = this.posToIndex(pos);
      if (this.buffer[i] != null) {
        takeAmount = Math.min(this.buffer[i], max);
        this.buffer[i] -= takeAmount;
        return takeAmount;
      } else {
        return 0;
      }
    };

    Layer.prototype.posToIndex = function(pos) {
      pos = pos.get().mul(1 / this.sim.layerScale);
      return Math.floor(pos.x) + Math.floor(pos.y) * this.w;
    };

    return Layer;

  })();

  ns.NestTrail = (function(_super) {
    __extends(NestTrail, _super);

    function NestTrail() {
      return NestTrail.__super__.constructor.apply(this, arguments);
    }

    NestTrail.prototype.update = function() {
      this.mul(1 - this.sim.CONFIG.NEST_TRAIL_FADE_RATE);
      return this.buffer[this.w / 2 + this.h / 2 * this.w] = 1000;
    };

    return NestTrail;

  })(ns.Layer);

  ns.FoodTrail = (function(_super) {
    __extends(FoodTrail, _super);

    function FoodTrail() {
      return FoodTrail.__super__.constructor.apply(this, arguments);
    }

    FoodTrail.prototype.update = function() {
      return this.mul(1 - this.sim.CONFIG.FOOD_TRAIL_FADE_RATE);
    };

    return FoodTrail;

  })(ns.Layer);

  ns.Food = (function(_super) {
    __extends(Food, _super);

    function Food() {
      return Food.__super__.constructor.apply(this, arguments);
    }

    Food.prototype.initCell = function(x, y) {
      if (Math.random() < 0.0002) {
        return 100;
      } else {
        return 0;
      }
    };

    Food.prototype.update = function() {
      if (this.sim.frame % 10 === 0) {
        this.blur(0.002);
      }
      if (Math.random() < 0.01) {
        return this.mark(new ns.Vec(Math.random() * this.w * this.sim.layerScale, Math.random() * this.h * this.sim.layerScale), 100);
      }
    };

    return Food;

  })(ns.Layer);

  ns.LayerCompositor = (function() {
    function LayerCompositor(_at_sim) {
      this.sim = _at_sim;
      this.w = ~~(this.sim.w / this.sim.layerScale);
      this.h = ~~(this.sim.h / this.sim.layerScale);
      this.imageData = document.createElement('CANVAS').getContext('2d').createImageData(this.w, this.h);
    }

    LayerCompositor.prototype.getImageData = function(layers) {
      var b, d, g, i, j, r, _i, _ref;
      d = this.imageData.data;
      for (i = _i = 0, _ref = this.w * this.h; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        j = i * 4;
        r = 0.13;
        g = 0.11;
        b = 0.10;
        r += 0.5 * layers.nesttrail.buffer[i];
        g += 0.1 * layers.nesttrail.buffer[i];
        r += 0.65 * layers.food.buffer[i];
        g += 1.0 * layers.food.buffer[i];
        b += 2.5 * layers.foodtrail.buffer[i];
        g += 1.7 * layers.foodtrail.buffer[i];
        d[j + 0] = 255 * r;
        d[j + 1] = 255 * g;
        d[j + 2] = 255 * b;
        d[j + 3] = 255;
      }
      return this.imageData;
    };

    return LayerCompositor;

  })();

}).call(this);