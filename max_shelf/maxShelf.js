var SNOW = [1.2,1.18,1.18];
var GHOST_WHITE = [1.173,1.173,1.2];
var BLACK = [0,0,0];
var GREY = [0.2,0.2,0.2];
var T_WHITE = [2,2,2,0.5];
var RED = [0.698,0.13,0.13];
var YELLOW = [0.87,0.82,0.67];
var WHITE = [2,2,2];
var AZURE = [0,0.745,1];
var GOLD = [1,0.84,0];
var LIGHT_CORAL = [0.94,0.5,0.5];

var depth = 6.;

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

//UPPER PART
var section = [];

section[1] = SIMPLEX_GRID([[25],[1]])
section[2] = SIMPLEX_GRID([[-3,1,-8,1,-3,1,-7,1],[-1,5]])
section[3] = SIMPLEX_GRID([[-3,10,-3,1,-7,1],[-6,1]])
section[4] = SIMPLEX_GRID([[-5,1,-10,1,-7,1],[-7,2]])
section[5] = SIMPLEX_GRID([[-5,1,-10,9],[-9,1]])
section[6] = SIMPLEX_GRID([[-5,1,-10,1],[-10,4]])
section[7] = SIMPLEX_GRID([[-5,1,-6,11],[-14,1]])
section[8] = SIMPLEX_GRID([[-5,1,-6,1,-9,1],[-15,2]])
section[9] = SIMPLEX_GRID([[-6,6],[-16,1]])
section[10] = SIMPLEX_GRID([[-12,1,-9,1],[-17,2]])
section[11] = SIMPLEX_GRID([[-12,1,-5,5],[-19,1]])
section[12] = SIMPLEX_GRID([[-12,1,-5,1],[-20,1]])
section[13] = SIMPLEX_GRID([[-18,1],[-21,3]])
section[14] = SIMPLEX_GRID([[-3,22],[-24,1]])
section[15] = SIMPLEX_GRID([[-9,1,-14,1],[-25,5]])
section[16] = SIMPLEX_GRID([[-9,10,-5,1],[-30,1]])
section[17] = SIMPLEX_GRID([[-18,1,-5,1],[-31,1]])
section[18] = SIMPLEX_GRID([[-18,1],[-32,3]])
section[19] = SIMPLEX_GRID([[-9,10],[-35,1]])
section[20] = SIMPLEX_GRID([[-9,1],[-36,3]])

var face = STRUCT(section);

var body = COLOR(SNOW)(EXTRUDE([depth])(face));
var back = T([2])([-0.01])(
						   COLOR(BLACK)(
						   				face));
var front = T([2])([depth+0.02])(back);

var main_body = STRUCT([body, front, back]);

var drawer_big = T([0,1])([6,7])(
								 COLOR(GHOST_WHITE)(
								 					CUBOID([10,7,depth])));
var drawer_small = T([0,1])([19,20])(
									 COLOR(GHOST_WHITE)(
									 					CUBOID([8,2,depth])));
var drawer_small1 = T([1])([2])(
								drawer_small);

var pull = COLOR(GREY)(EXTRUDE([0.5])(DISK(0.2)(36)));
var pull1 = T([0,1,2])([11,12.5,depth])(pull);
var pull2 = T([0,1,2])([23,21,depth])(pull);
var pull3 = T([0,1,2])([23,23,depth])(pull);
var pulls = STRUCT([pull1,pull2,pull3]);

var column1 = T([0,1,2])([6,17,depth/2])(
										 R([1,2])([-PI/2])(
										 				   COLOR(T_WHITE)(
										 				   				  EXTRUDE([7])((CIRCLE(0.75)(36))))));
var column2 = T([0,1,2])([17,25,depth/2])(
										  R([1,2])([-PI/2])(
										  					COLOR(T_WHITE)(
										  								   EXTRUDE([5])((CIRCLE(0.75)(36))))));

var upper_part = STRUCT([main_body,
				    	 drawer_big, drawer_small, drawer_small1,
				    	 pulls,
				    	 column1, column2]);


//BASE
var points = [[3,0],[6,3],[3,6],[6,6],[6,0],[18,0],[18,6],[21,6],[18,3],[21,0]];
var cells = [[0,1,4],[1,2,3],[5,8,9],[6,7,8]];
var red_tile = COLOR(RED)(SIMPLICIAL_COMPLEX(points)(cells));

points = [[3,3],[3,6],[6,3],[9,0],[12,3],[15,0],[18,3],[21,6],[21,3]];
cells = [[0,1,2],[3,4,5],[6,7,8]];
var gold_tile = COLOR(GOLD)(SIMPLICIAL_COMPLEX(points)(cells));

points = [[3,0],[3,3],[6,3],[9,6],[12,6],[12,3],[15,6],[15,3],[18,3],[21,3],[21,0]];
cells = [[0,1,2],[3,4,5],[4,6,7],[8,9,10]];
var white_tile = COLOR(WHITE)(SIMPLICIAL_COMPLEX(points)(cells));

points = [[9,0],[9,6],[12,3],[12,6],[15,3],[15,0]];
cells = [[0,1,2],[2,3,4],[2,4,5]];
var coral_tile = COLOR(LIGHT_CORAL)(SIMPLICIAL_COMPLEX(points)(cells));

var azure_tile = COLOR(AZURE)(SIMPLEX_GRID([[-6,3,-6,3],[6]]));

var base_back = STRUCT([red_tile, gold_tile, white_tile, coral_tile, azure_tile]);
var base_front = T([2])([depth])(base_back);


points = [[3,3,0],[3,6,0],[3,3,3],[3,6,6],[3,3,6]];
cells = [[0,1,2],[2,3,4]];
var side_gold_tile = COLOR(GOLD)(SIMPLICIAL_COMPLEX(points)(cells));
var side_white_tile = COLOR(WHITE)(SIMPLICIAL_COMPLEX(translate_points(points, [0,-3,0]))(cells))

points = [[3,6,0],[3,6,6],[3,3,3]];
cells = [[0,1,2]];
var side_red_tile = COLOR(RED)(SIMPLICIAL_COMPLEX(points)(cells));
var side_coral_tile = COLOR(LIGHT_CORAL)(SIMPLICIAL_COMPLEX(translate_points(points, [0,-3,0]))(cells))

var base_left_side = STRUCT([side_coral_tile,side_red_tile,side_white_tile,side_gold_tile]);
var base_right_side = T([0])([18])(base_left_side);
var bottom = COLOR(BLACK)(SIMPLEX_GRID([[-3,18],[0],[depth]]))


var base = STRUCT([base_back,base_front,base_right_side,base_left_side, bottom]);

var model = STRUCT([base, T([1])([6])(upper_part)]);

DRAW(model);