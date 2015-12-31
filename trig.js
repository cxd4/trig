var coordinates_per_vertex = 4;
var triangle = [];

var direction = 0;
var interval = 3;

var base_angle = 45;
var frames_per_second = 4;

function display() {
    "use strict";

    set_theta(base_angle);
    if (direction < 0) {
        base_angle += interval;
        if (base_angle >= 90) {
            base_angle = 90;
            direction = 0;
        }
    } else {
        base_angle -= interval;
        if (base_angle < 0) {
            base_angle = 0;
            direction = -1;
        }
    }
    glDrawArrays(GL_LINE_LOOP, 0, 3);
    return;
}

function set_theta(degrees) {
    "use strict";
    var i, j;
    var x, y;
    var radians;
    var X = 0, Y = 1, Z = 2, W = 3;

    while (degrees < 0) {
        degrees += 360;
    }
    while (degrees > 90) {
        degrees -= 90; // Viewport is maximized to focus on Quadrant I.
    }
    radians = Math.PI * (degrees / 180);

    x = Math.cos(radians);
    y = Math.sin(radians);

    triangle[0 * coordinates_per_vertex + X] = 0;
    triangle[0 * coordinates_per_vertex + Y] = 0;

    triangle[1 * coordinates_per_vertex + X] = x;
    triangle[1 * coordinates_per_vertex + Y] = y;

    triangle[2 * coordinates_per_vertex + X] = x;
    triangle[2 * coordinates_per_vertex + Y] = 0;

    for (i = 0; i < 3; i += 1) { // Adjust origin(0, 0) to (-1, -1).
        triangle[i * coordinates_per_vertex + X] *= 2.0;
        triangle[i * coordinates_per_vertex + Y] *= 2.0;
        triangle[i * coordinates_per_vertex + X] -= 1.0;
        triangle[i * coordinates_per_vertex + Y] -= 1.0;
    }
    for (i = 0; i < 3; i += 1) { // in case OpenGL is using 4-D coordinates
        if (coordinates_per_vertex > Z) {
            triangle[coordinates_per_vertex * i + Z] = 0.0;
        }
        if (coordinates_per_vertex > W) {
            triangle[coordinates_per_vertex * i + W] = 1.0;
        }
    }

    glVertexPointer(coordinates_per_vertex, GL_FLOAT, 0, triangle);
    glEnableClientState(GL_VERTEX_ARRAY);

    glEnable(GL_BLEND);
    glDisable(GL_CULL_FACE);

    glDisableClientState(GL_COLOR_ARRAY);
    glColor4f(1, 1, 1, 1.00);

    glClearColor(0.00, 0.00, 0.00, 0.00);
    glClear(GL_COLOR_BUFFER_BIT);

    glPointSize(1.0);
    glLineWidth(1);

    glColorMask(GL_TRUE, GL_TRUE, GL_TRUE, GL_TRUE);
    return;
}

function main_GL() {
    "use strict";
    var error_code;

    if (GL_get_context(document, "GL_canvas") === null) {
        alert("Failed to initialize WebGL.");
        return;
    }

    setInterval(display, 1000 / frames_per_second);
    do {
        error_code = glGetError();
        console.log("OpenGL error status:  " + error_code);
    } while (error_code !== GL_NO_ERROR);
    return;
}
