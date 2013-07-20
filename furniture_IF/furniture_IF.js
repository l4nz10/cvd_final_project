var generate_sin_points = function (total, degree) {
	var a = [];
	for (var i = 0; i<=total; i++) {
		a[i] = [SIN(i*2*PI/total)/degree,i/degree,0];
	}
	return a;
}

var replica_position_object = function (points, object) {
	var a = [];
	for (var i = 0; i<points.length; i++) {
		a.push(T([0,1,2])(points[i])(object))
	}
	return a;
}

var generate_knots = function (pointsNumber, degree) {
	var tot = pointsNumber + degree + 1;
	var knots = [0,0,0,0];
	for (var i = 1; i<tot-7; i++)
		knots.push(i);
	return knots.concat([tot-7,tot-7,tot-7,tot-7]);
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

var scale_points = function(points, factor) {
	var a = [];
	var x, y, z;
	for (var i = 0; i<points.length; i++) {
		x = points[i][0];
		y = points[i][1];
		z = points[i][2] * factor;
		a.push([x,y,z]);
	}
	return a;
}

var switch_coord = function (points, first, second) {
	var tmp;
	var a = [];
	for (i in points) {
		tmp = points[i][first];
		points[i][first] = points[i][second];
		points[i][second] = tmp;
		a.push(points[i]);
	};
	return a;
}

var BLACK = [0.17,0.18,0.18];
var WHITE = [2,2,2];

var dom1D = DOMAIN([[0,1]])([36]);
var dom2D = DOMAIN([[0,1],[0,1]])([36,36]);

var height = 18;
var width = 1.2;
var depth = 1.5;
var degree = 3;

//FIRST DRAWER

var line = POLYLINE([[0,0],[width,0]])

var points = generate_sin_points(height, degree);

var lines = STRUCT(replica_position_object(points, line));

var knots = generate_knots(height+1,degree);

var frontLeft_corner = NUBS(S0)(3)(knots)(points);
var backLeft_corner = NUBS(S0)(3)(knots)(translate_points(points, [0,0,-depth]));
var frontRight_corner = NUBS(S0)(3)(knots)(translate_points(points, [width,0,0]));
var backRight_corner = NUBS(S0)(3)(knots)(translate_points(points, [width,0,-depth]));
var frontLeft_borderline = NUBS(S0)(3)(knots)(translate_points(points, [0.03,0,0]));
var frontRight_borderline = NUBS(S0)(3)(knots)(translate_points(points, [width-0.03,0,0]));

var left_side = MAP(BEZIER(S1)([frontLeft_corner, backLeft_corner]))(dom2D);
var right_side = MAP(BEZIER(S1)([frontRight_corner, backRight_corner]))(dom2D);
var back = MAP(BEZIER(S1)([backLeft_corner, backRight_corner]))(dom2D);
var front = MAP(BEZIER(S1)([frontLeft_corner, frontRight_corner]))(dom2D);

var left_border = MAP(BEZIER(S1)([frontLeft_corner,frontLeft_borderline]))(dom2D);
var right_border = MAP(BEZIER(S1)([frontRight_corner,frontRight_borderline]))(dom2D);

var down = R([1,2])([-PI/2])(CUBOID([width, depth]));
var up = T([1])([height/degree])(down);

wheel = R([0,2])([PI/6])(R([0,2])([PI/2])(EXTRUDE([0.05])(DISK(0.05)(36))));

//colors and tweaking
left_side = COLOR(BLACK)(left_side);
right_side = COLOR(BLACK)(right_side);
back = COLOR(BLACK)(back);
front = COLOR(WHITE)(T([2])([-0.01])(front));
lines = COLOR(BLACK)(lines);
left_border = COLOR(BLACK)(left_border);
right_border = COLOR(BLACK)(right_border);
down = COLOR(BLACK)(down);
up = COLOR(BLACK)(up);
wheel = COLOR(BLACK)(wheel);

var body = STRUCT([left_side, right_side, back, front, left_border, right_border, lines, up, down]);
body = T([1])([0.05])(body);

var pull = EXTRUDE([0.1])(DISK(0.025)(36));
var pulls_array = (replica_position_object(points, pull));
pulls_array.pop();
var pulls = T([0,1])([width/2,height/degree/18/2])(STRUCT(pulls_array));

var wheels = STRUCT([T([0,2])([width/8,depth/8])(wheel),
					 T([0,2])([7*width/8,depth/8])(wheel),
					 T([0,2])([width/8,7*depth/8])(wheel), 
					 T([0,2])([7*width/8,7*depth/8])(wheel)]);

wheels = T([2])([-depth])(wheels);

var drawer1 = STRUCT([body, pulls, wheels]);



//SECOND DRAWER

points = switch_coord(points, 0, 2);

lines = STRUCT(replica_position_object(points, line));
frontLeft_corner = NUBS(S0)(3)(knots)(points);
frontRight_corner = NUBS(S0)(3)(knots)(translate_points(points, [width,0,0]));
backLeft_corner = BEZIER(S0)([[0,0,-depth],[0,height/degree,-depth]]);
backRight_corner = BEZIER(S0)([[width,0,-depth],[width,height/degree,-depth]]);

left_side = MAP(BEZIER(S1)([frontLeft_corner, backLeft_corner]))(dom2D);
right_side = MAP(BEZIER(S1)([frontRight_corner, backRight_corner]))(dom2D);
back = MAP(BEZIER(S1)([backLeft_corner, backRight_corner]))(dom2D);
front = MAP(BEZIER(S1)([frontLeft_corner, frontRight_corner]))(dom2D);

frontLeft_borderline = NUBS(S0)(3)(knots)(translate_points(points, [0.03,0,0]));
frontRight_borderline = NUBS(S0)(3)(knots)(translate_points(points, [width-0.03,0,0]));
left_border = MAP(BEZIER(S1)([frontLeft_corner,frontLeft_borderline]))(dom2D);
right_border = MAP(BEZIER(S1)([frontRight_corner,frontRight_borderline]))(dom2D);

down = R([1,2])([-PI/2])(CUBOID([width, depth]));
up = T([1])([height/degree])(down);

//colors and tweaking
left_side = COLOR(BLACK)(left_side);
right_side = COLOR(BLACK)(right_side);
back = COLOR(BLACK)(back);
front = COLOR(WHITE)(T([2])([-0.01])(front));
lines = COLOR(BLACK)(lines);
left_border = COLOR(BLACK)(left_border);
right_border = COLOR(BLACK)(right_border);
down = COLOR(BLACK)(down);
up = COLOR(BLACK)(up);

body = STRUCT([left_side, right_side, back, front, lines, left_border, right_border, up, down]);
body = T([1])([0.05])(body);

pull = EXTRUDE([0.15])(DISK(0.025)(36));
pulls_array = (replica_position_object(points, pull));
pulls_array.pop();
pulls = T([0,1,2])([width/2,height/degree/18/2,-0.05])(STRUCT(pulls_array));

var drawer2 = STRUCT([body, pulls, wheels]);

//final positioning...
drawer1 = T([0])([1])(drawer1);
drawer2 = T([2])([1+width])(R([0,2])([PI/2])(drawer2));

var model = STRUCT([drawer1, drawer2]);

DRAW(model);