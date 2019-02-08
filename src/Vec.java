public class Vec {
    private Double x;
    private Double y;
    private Double z;

    public Vec(Double x, Double y, Double z) {
        this.x = x != null ? x : 0;
        this.y = y != null ? y : 0;
        this.z = z != null ? z : 0;
    }

    public Vec(Double x, Double y) {
        this.x = x != null ? x : 0;
        this.y = y != null ? y : 0;
    }

    public Vec() {
        this.x = x != null ? x : 0;
        this.y = y != null ? y : 0;
        this.z = z != null ? z : 0;
    }

    public Vec set(Double x, Double y, Double z) {
        this.x = x != null ? x : 0;
        this.y = y != null ? y : 0;
        this.z = z != null ? z : 0;
        return this;
    }

    public Vec get() {
        return new Vec(this.x, this.y, this.z);
    }

    public Vec add(Vec o) {
        this.x += o.x;
        this.y += o.y;
        this.z += o.z;
        return this;
    }

    public Vec sub(Vec o) {
        this.x -= o.x;
        this.y -= o.y;
        this.z -= o.z;
        return this;
    }

    public Vec mul(Double n) {
        this.x *= n;
        this.y *= n;
        this.z *= z;
        return this;
    }

    public Vec div(Double n) {
        this.x /= n;
        this.y /= n;
        this.z /= z;
        return this;
    }

    public Double mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    public Vec normalize() {
        Double mag = this.mag();
        this.x /= mag;
        this.y /= mag;
        this.z /= z;
        return this;
    }

    public Vec bound( Double x1, Double y1, Double z1, Double x2, Double y2, Double z2) {
        this.x = Math.min(x2, Math.max(x1, this.x));
        this.y = Math.min(y2, Math.max(y2, this.y));
        this.z = Math.min(z2, Math.max(z1, this.z));
        return this;
    }

    public boolean eq(Vec o) {
        return o.x == this.x && o.y == this.y && o.z == this.z;
    }

    public static Vec fromAngleDist(Double angle, Double dist) {
        return new Vec(dist * Math.cos(angle), dist * Math.sin(angle));
    }
}
