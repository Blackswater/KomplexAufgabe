public enum Config {
    instance;

    private int scale = 4;
    private int num_ants = 1000;
    private int stepsPerFrame = 1;
    private double antTurnSpeed = 0.7;
    private int showAnts = 1;
    private double jitterMagnitude = 0.5;
    private double nestFalloffRate = 0.01;
    private double foodTrailFalloffRate = 0.01;
    private double nestTrailFadeRate = 0.01;
    private double foodTrailFadeRate = 0.005;


    public int getScale() {
        return scale;
    }

    public int getNum_ants() {
        return num_ants;
    }

    public int getStepsPerFrame() {
        return stepsPerFrame;
    }

    public double getAntTurnSpeed() {
        return antTurnSpeed;
    }

    public int getShowAnts() {
        return showAnts;
    }

    public double getJitterMagnitude() {
        return jitterMagnitude;
    }

    public double getNestFalloffRate() {
        return nestFalloffRate;
    }

    public double getFoodTrailFalloffRate() {
        return foodTrailFalloffRate;
    }

    public double getNestTrailFadeRate() {
        return nestTrailFadeRate;
    }

    public double getFoodTrailFadeRate() {
        return foodTrailFadeRate;
    }
}
