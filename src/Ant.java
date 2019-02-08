public class Ant {

    private Double sim;
    private Vec pos;
    private Double angle;
    private Double speed;
    private int stomach;
    private int homeRecency;
    private int age;


    //sim ist die die Größte der UI
    public Ant(Double sim, Vec pos) {
        this.sim = sim;
        this.pos = pos != null ? pos : new Vec();
        this.angle = Math.random() * Math.PI * 2;
        this.speed = (Math.random() * 0.2 + 0.8) * Config.instance.getScale() * 0.4;
        this.stomach = 0;
        this.homeRecency = 0;
        this.age = 0;
    }

    public Double sniff(Layer layer) {
        Double antennaAngle, antennaDist, leftSample, rightSample;
        Vec antennaLeftPos, antennaRightPos;
        antennaDist = Double.valueOf(3) * Config.instance.getScale();
        antennaAngle = Math.PI / Double.valueOf(4);
        antennaLeftPos = this.pos.get().add(pos.fromAngleDist(this.angle + antennaAngle, antennaDist));
        antennaRightPos = this.pos.get().add(pos.fromAngleDist(this.angle - antennaAngle, antennaDist));
        leftSample = layer.sample(antennaLeftPos);
        rightSample = layer.sample(antennaRightPos);
        if (leftSample < 0.01) {
            leftSample = Double.valueOf(0);
        }
        if (rightSample < 0.01) {
            rightSample = Double.valueOf(0);
        }
        return leftSample - rightSample;
    }

    public Vec update() {
        Vec boundPos;
        Double jitterAmount, reading;
        int newStomach;

        this.age++;
        this.stomach *= 1 - Config.instance.getFoodTrailFalloffRate();
        this.homeRecency *= 1 - Config.instance.getNestFalloffRate();
        if(this.isInNest()) {
            this.stomach = 0;
            this.homeRecency = 1;

        }
        newStomach = this.stomach + this.sim.layer.food.take(this.pos, 1);
        if(this.isHunting()) {
            reading = this.sniff(this.sim.layer.food);
            if(reading == 0) {
                reading = this.sniff(this.sim.layer.food);
            }
        } else {
            reading = this.sniff(this.sim.layers.nesttrail);
        }
        this.sim.layers.foodtrail.mark(this.pos, this.stomach * 0.01);
        this.sim.layers.nesttrail.mark(this.pos, this.homeRecency * 0,1);
        if(reading > 0) {
            this.angle += Config.instance.getAntTurnSpeed();
        }
        if(reading < 0) {
            this.angle -= Config.instance.getAntTurnSpeed();
        }
        jitterAmount = Math.max(0, 1 - this.sim.layers.foodtrail.sample(this.pos));
        this.angle += (Math.random() - 0.5) * 2 * jitterAmount * Config.instance.getJitterMagnitude();
        this.pos.add(Vec.fromAngleDist(this.angle, this.speed));
        boundPos = this.pos.get().bound(0,0,0,this.sim.w, this.sim.h, 0);
        if(!boundPos.eq(this.pos)) {
            this.angle = Math.random() * Math.PI * 2;
            return this.pos = boundPos;
        }

        return boundPos;
    }

    public boolean isInNest() {
        return new Vec(this.sim.w / 2, this.sim.h).sub(this.pos).mag() < 10;
    }

    public boolean isHunting() {
        return this.stomach < 0.1 && this.homeRecency > 0.01;
    }




}
