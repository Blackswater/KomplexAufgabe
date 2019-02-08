import java.util.ArrayList;
import java.util.List;

public class Layer {
    private AntSim sim;
    private Double w;
    private Double h;
    private List<Double> buffer = new ArrayList();

    //sim ist die Größe von der UI
    public Layer(AntSim sim) {
        double ref;
        int _i, i;
        this.sim = sim;
        this.w = ~~(this.sim.w / Config.instance.getScale());
        this.h = ~~(this.sim.h / Config.instance.getScale());

        for( i = _i = 0, ref = this.w * this.h; 0 <= ref ? _i < ref : _i > ref; i = 0 <= ref ? ++_i : --_i) {
            this.buffer.add(this.initCell(i % this.w, Math.floor(i / this.h)));
        }
    }

    public double initCell(double v, double floor) {
        return 0;
    }

    public void update () {

    }

    public List mul(Double n) {
        List _ref = new ArrayList(this.buffer);
        List _results = new ArrayList();
        int i, v,_i,_len;
        for (i = _i = 0, _len = _ref.size(); _i < _len; i = ++_i) {
            v = (int) _ref.get(i);
            Object a = this.buffer.get(i);
            _results.add(a = (int) (v *n));
        }

        return _results;
    }

    public List<Double> add(Double n) {
        List<Double> _ref = new ArrayList(this.buffer);
        List<Double> _results = new ArrayList();
        int i,_i,_len;
        Double v;
        for (i = _i = 0, _len = _ref.size(); _i < _len; i = ++_i) {
            v = _ref.get(i);
            Double a = this.buffer.get(i);
            _results.add(a =  v - n);
        }

        return _results;
    }

    public List<Double> blur(double n) {
        List<Double> newBuffer = new ArrayList();
        List<Double> _ref = new ArrayList(this.buffer);
        int i, _i, _len;
        double sumNeighbors;
        Double x, y, _x, _j, _ref1,_ref2, _y, _k, _ref3, _ref4, index,v;
        for( i = _i = 0, _len = _ref.size(); _i < _len; i = ++_i) {
            v =  _ref.get(i);
            x = i % this.w;
            y = (i - x) / this.h;
            sumNeighbors = 0;
            for( _x = _j = _ref1 = Math.max(0, x - 1), _ref2 = Math.min(this.w -1, x +1); _ref1 <= _ref2 ? _j <= _ref2 : _j >= _ref2;
            _x = _ref1 <= _ref2 ? ++ _j : --_j) {
                for(_y = _k = _ref3 = Math.max(0, y -1), _ref4 = Math.min(this.h - 1, y +1); _ref3 <= _ref4 ? _k <= _ref4: _k >= _ref4; _y = _ref3 <= _ref4 ? ++_k : --_k ) {
                    index = this.buffer.get((int) (_x + _y * this.w));
                    sumNeighbors += index * n;
                }
            }
            sumNeighbors += v * (1 -n);
            newBuffer.get(i) = sumNeighbors / (9 * n + (1 - n)) || 0);
        }
        return this.buffer = newBuffer;
    }
}
