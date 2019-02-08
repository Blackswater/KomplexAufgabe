(function() {
    var ns;
  
    ns = this.antsimulator;
  
    ns.Ant = (function() {
      function Ant(_at_sim, _at_pos) {
        this.sim = _at_sim;
        this.pos = _at_pos != null ? _at_pos : new ns.Vec;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = (Math.random() * 0.2 + 0.8) * this.sim.layerScale * 0.4;
        this.stomach = 0;
        this.homeRecency = 0;
        this.age = 0;
      }
  
      Ant.prototype.sniff = function(layer) {
        var antennaAngle, antennaDist, antennaLeftPos, antennaRightPos, leftSample, rightSample;
        antennaDist = 3 * this.sim.layerScale;
        antennaAngle = Math.PI / 4;
        antennaLeftPos = this.pos.get().add(ns.Vec.fromAngleDist(this.angle + antennaAngle, antennaDist));
        antennaRightPos = this.pos.get().add(ns.Vec.fromAngleDist(this.angle - antennaAngle, antennaDist));
        leftSample = layer.sample(antennaLeftPos);
        rightSample = layer.sample(antennaRightPos);
        if (leftSample < 0.01) {
          leftSample = 0;
        }
        if (rightSample < 0.01) {
          rightSample = 0;
        }
        return leftSample - rightSample;
      };
  
      Ant.prototype.update = function() {
        var boundPos, jitterAmount, newStomach, reading;
        this.age++;
        this.stomach *= 1 - this.sim.CONFIG.FOOD_TRAIL_FALLOFF_RATE;
        this.homeRecency *= 1 - this.sim.CONFIG.NEST_FALLOFF_RATE;
        if (this.isInNest()) {
          this.stomach = 0;
          this.homeRecency = 1;
        }
        newStomach = this.stomach + this.sim.layers.food.take(this.pos, 1);
        this.stomach = newStomach;
        if (this.isHunting()) {
          reading = this.sniff(this.sim.layers.food);
          if (reading === 0) {
            reading = this.sniff(this.sim.layers.foodtrail);
          }
        } else {
          reading = this.sniff(this.sim.layers.nesttrail);
        }
        this.sim.layers.foodtrail.mark(this.pos, this.stomach * 0.01);
        this.sim.layers.nesttrail.mark(this.pos, this.homeRecency * 0.1);
        if (reading > 0) {
          this.angle += parseFloat(this.sim.CONFIG.ANT_TURN_SPEED);
        }
        if (reading < 0) {
          this.angle -= parseFloat(this.sim.CONFIG.ANT_TURN_SPEED);
        }
        jitterAmount = Math.max(0, 1 - this.sim.layers.foodtrail.sample(this.pos));
        this.angle += (Math.random() - 0.5) * 2 * jitterAmount * this.sim.CONFIG.JITTER_MAGNITUDE;
        this.pos.add(ns.Vec.fromAngleDist(this.angle, this.speed));
        boundPos = this.pos.get().bound(0, 0, 0, this.sim.w, this.sim.h, 0);
        if (!boundPos.eq(this.pos)) {
          this.angle = Math.random() * Math.PI * 2;
          return this.pos = boundPos;
        }
      };
  
      Ant.prototype.isInNest = function() {
        return new ns.Vec(this.sim.w / 2, this.sim.h).sub(this.pos).mag() < 10;
      };
  
      Ant.prototype.isHunting = function() {
        return this.stomach < 0.1 && this.homeRecency > 0.01;
      };
  
      Ant.prototype.draw = function(a) {
        a.fillStyle = "#fff";
        a.save();
        a.beginPath();
        a.translate(this.pos.x, this.pos.y);
        a.arc(0, 0, 0.25 * this.sim.layerScale, 0, Math.PI * 2);
        a.fill();
        return a.restore();
      };
  
      return Ant;
  
    })();
  
  }).call(this);