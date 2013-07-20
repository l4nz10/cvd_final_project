var GRAY = [0.745,0.745,0.745,];
var AZURE = [0,0.745,1];

var torus = function(R, r, start, end) {

	var dom = DOMAIN([[0, 2*PI],[start,end]])([72,72]);

	var torus0 = function (v) {
		a = v[0]
		b = v[1]

		u = (r*COS(a)+R)*COS(b)
		v = (r*COS(a)+R)*SIN(b)
		w = (r*SIN(a))

		return [u,v,w]
	}
	return MAP(torus0)(dom);
}

var translate_points = function (points, shift) {
	var a = [];
	var x, y, z;
	for (var i = 0; i<points.length; i++) {
		x = points[i][0] + shift[0];
		y = points[i][1] + shift[1];
		z = points[i][2] + shift[2];
		a.push([x,y,z]);
	}
	return a;
}

var scale_points = function(points, factors) {
	var a = [];
	var x, y, z;
	for (var i = 0; i<points.length; i++) {
		x = points[i][0] * factors[0];
		y = points[i][1] * factors[1];
		z = points[i][2] * factors[2];
		a.push([x,y,z]);
	}
	return a;
}

var bezier_translated = function (points, shift) {
	return BEZIER(S0)(translate_points(points, shift));
}

var bezier_scaled = function(points, factors) {
	return BEZIER(S0)(scale_points(points, factors));
}


//shell
var back_leg = EXTRUDE([4])(DISK(0.5)(36));
var back_corner = T([0,2])([4,4])(R([1,2])([PI/2])(torus(4,0.5,PI/2,PI)));
var down = T([0,2])([4,8])(R([0,2])([PI/2])(EXTRUDE([34])(CIRCLE(0.5)(36))));
var front_leg = T([0])([38])(EXTRUDE([14])(DISK(0.5)(36)));
var front_corner = T([0,2])([30,14])(R([1,2])([PI/2])(torus(8,0.5,0,PI/2)));
var back = T([0,2])([6,8])(EXTRUDE([10])(CIRCLE(0.5)(36)));
var ring = T([0,2])([6,22])(R([1,2])([PI/2])(torus(4,0.5,0,2*PI)))
var up = T([0,2])([10,22])(R([0,2])([PI/2])(EXTRUDE([20])(CIRCLE(0.5)(36))));
var base1 = T([0,2])([13,8])(R([1,2])([-PI/2])(EXTRUDE([15])(CIRCLE(0.5)(36))));
var base2 = T([0])([19])(base1);
var pin1 = T([0,1,2])([13,3,8])(EXTRUDE([2])(CIRCLE(0.5)(36)));
var pin2 =T([0])([19])(pin1);

var half1 = STRUCT([back_corner, back_leg, down, front_leg, front_corner, back, ring, up, base1, base2, pin1, pin2]);
var half2 = T([1])([30])(S([1])([-1])(half1));

shell = COLOR(GRAY)(STRUCT([half1, half2]));

//back_pillow
var pillow_cilinder = T([0,2])([6,22])(R([1,2])([-PI/2])(EXTRUDE([30])(CIRCLE(3.5)([72]))));

var profile = CUBIC_HERMITE(S0)([[0,0,0.5],[3.5,0,0],[3,0,0],[2,0,-1]]);
var pillow_edge = MAP(ROTATIONAL_SURFACE(profile))(DOMAIN([[0,1],[0,2*PI]])([20,72]));

var pillow_edge1 = T([0,2])([6,22])(R([1,2])([PI/2])(pillow_edge));
var pillow_edge2 = T([1])([30])(S([1])([-1])(pillow_edge1));

var back_pillow = COLOR(AZURE)(STRUCT([pillow_cilinder, pillow_edge1, pillow_edge2]));


//base_pillow
var points = [[0,0,0],[-2,0,5],[3,0,9],[15,0,3],[27,0,9],[32,0,5],[30,0,0]];
points = translate_points(points, [-15,0,0]);
points_line = [[-15,0,0],[15,0,0]];
points_line1 = [[-15,0],[15,0]];

var curve = bezier_scaled(points_line,[0.2,1,0.2]);
var curve1 = bezier_scaled(points,[0.2,1,0.2]);
var curve2 = BEZIER(S0)(points);
var curve3 = bezier_translated(points, [0,9,0]);
var curve4 = bezier_translated(points, [0,17,0]);
var curve5 = bezier_translated(points, [0,26,0]);
var curve6 = bezier_scaled(translate_points(points, [0,26,0]), [0.2,1,0.2]);
var curve7 = bezier_scaled(translate_points(points_line, [0,26,0]), [0.2,1,0.2]);
var wrong_curve = bezier_scaled(points_line1,[0.2,1,0.2]);

var surface = BEZIER(S1)([curve, curve1, curve2, curve2, curve2, curve3, curve4, curve5, curve5, curve5, curve6, curve7]);
var surface1 = BEZIER(S1)([wrong_curve, curve1, curve2, curve2, curve2, curve3, curve4, curve5, curve5, curve5, curve6, curve7]);

var dom = DOMAIN([[0,1],[0,1]])([76,76]);

var pillow_top = MAP(surface)(dom);
var pillow_bottom = MAP(surface1)(dom);

pillow_bottom = S([0])([0.975])(pillow_bottom);

pillow_top = COLOR(AZURE)(T([0,1,2])([9.5,15,9])(R([0,1])([-PI/2])(pillow_top)));

model = STRUCT([shell, back_pillow, pillow_top]);
model = T([2])([-9])(model);

pillow_bottom = COLOR(AZURE)(T([0,1,2])([9.5,15,9])(R([0,1])([-PI/2])(pillow_bottom)));

model = STRUCT([model, pillow_bottom]);

DRAW(model);