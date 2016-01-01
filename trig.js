var triangle = [
    0, 0, 0, 1,
    0, 0, 0, 1,
    0, 0, 0, 1
];
var X = 0, Y = 1, Z = 2, W = 3;

var A, B, C;
var a, b, c;

function known(measure) {
    "use strict";
    if (measure === null || measure === undefined || measure === NaN) {
        return false;
    }
    if (!measure) {
        return false;
    }
    if (measure <= 0) {
        return false;
    }
    return true;
}

function to_rads(degrees) {
    "use strict";
    return (degrees / 180 * Math.PI);
}
function to_degs(radians) {
    "use strict";
    return (radians * 180 / Math.PI);
}

function sin(x) {
    "use strict";
    return Math.sin(x);
}
function cos(x) {
    "use strict";
    return Math.cos(x);
}
function arcsin(x) {
    "use strict";
    return Math.asin(x);
}
function arccos(x) {
    "use strict";
    return Math.acos(x);
}

function construct_triangle(A, B, C) {
    "use strict";
    var theta;
    var distance;
    var x1, x2, y1, y2;
    var aspect_ratio_adjustment = 0; // Try 1 if GL viewport is 2:1.

    theta = (known(A) ? A : 60);
    if (known(C) && C > 90) {
        alert("Warning:  C > 90 causes a bug.  Try switching C with A.");
    }

    y1 = sin(to_rads(theta));
    x1 = cos(to_rads(theta));
    distance = sin(to_rads(theta)) / sin(to_rads(known(C) ? C : 60));
    y2 = 0;
    x2 = x1 + Math.sqrt(Math.pow(distance, 2) - Math.pow(y2 - y1, 2));

 // Try to center the triangle horizontally on the canvas screen.
    distance = 0; //(1 + (x1 < 0 ? x1 : 0)) + (1 - x2);
    x1 -= distance / 2;
    x2 -= distance / 2;

 // Construct the triangle by its 3 angles to be flat on a horizontal side.
    triangle[4*0 + X] = 0 - distance / 2;
    triangle[4*0 + Y] = 0 - aspect_ratio_adjustment;
    triangle[4*1 + X] = x1;
    triangle[4*1 + Y] = y1;
    triangle[4*2 + X] = x2;
    triangle[4*2 + Y] = y2 - aspect_ratio_adjustment;

    glVertexPointer(4, GL_FLOAT, 0, triangle);
    glEnableClientState(GL_VERTEX_ARRAY);
    return;
}

function solve_triangle() {
 // Triangle Sum Theorem:  A + B + C = 180 [degrees]
    if (known(A) && known(B) && !known(C)) {
        C = 180 - A - B;
        return true;
    }
    if (known(A) && known(C) && !known(B)) {
        B = 180 - A - C;
        return true;
    }
    if (known(B) && known(C) && !known(A)) {
        A = 180 - B - C;
        return true;
    }

 // opposite sides of congruent angles in an isosceles
    if (known(A) && known(B) && A === B) {
        if (known(a) && !known(b)) {
            b = a;
            return true;
        }
        if (known(b) && !known(a)) {
            a = b;
            return true;
        }
    }
    if (known(A) && known(C) && A === C) {
        if (known(a) && !known(c)) {
            c = a;
            return true;
        }
        if (known(c) && !known(a)) {
            a = c;
            return true;
        }
    }
    if (known(B) && known(C) && B === C) {
        if (known(b) && !known(c)) {
            c = b;
            return true;
        }
        if (known(c) && !known(b)) {
            b = c;
            return true;
        }
    }

 // opposite angles of congruent sides in an isosceles
    if (known(a) && known(b) && a === b) {
        if (known(A) && !known(B)) {
            B = A;
            return true;
        }
        if (known(B) && !known(A)) {
            A = B;
            return true;
        }
        if (known(C) && !known(A) && !known(B)) {
            A = B = (180 - C) / 2;
            return true;
        }
    }
    if (known(a) && known(c) && a === c) {
        if (known(A) && !known(C)) {
            C = A;
            return true;
        }
        if (known(C) && !known(A)) {
            A = C;
            return true;
        }
        if (known(B) && !known(A) && !known(C)) {
            A = C = (180 - B) / 2;
            return true;
        }
    }
    if (known(b) && known(c) && b === c) {
        if (known(B) && !known(C)) {
            C = B;
            return true;
        }
        if (known(C) && !known(B)) {
            B = C;
            return true;
        }
        if (known(A) && !known(B) && !known(C)) {
            B = C = (180 - A) / 2;
            return true;
        }
    }

 // Law of Cosines
    if (known(c) && known(a) && known(b)) {
        if (!known(C)) {
            C = to_degs(arccos((a * a + b * b - c * c) / (2 * a * b)));
            return true;
        }
        if (!known(B)) {
            B = to_degs(arccos((c * c + a * a - b * b) / (2 * a * c)));
            return true;
        }
        if (!known(A)) {
            A = to_degs(arccos((c * c - a * a + b * b) / (2 * b * c)));
            return true;
        }
    }

 // Law of Sines
    if (known(c) && known(C) && known(A) && !known(a)) {
        a = c / sin(to_rads(C)) * sin(to_rads(A));
        return true;
    }
    if (known(c) && known(C) && known(B) && !known(b)) {
        b = c / sin(to_rads(C)) * sin(to_rads(B));
        return true;
    }
    if (known(a) && known(A) && known(C) && !known(c)) {
        c = a / sin(to_rads(A)) * sin(to_rads(C));
        return true;
    }
    if (known(b) && known(B) && known(C) && !known(c)) {
        c = b / sin(to_rads(B)) * sin(to_rads(C));
        return true;
    }
    if (known(a) && known(A) && known(B) && !known(b)) {
        b = a / sin(to_rads(A)) * sin(to_rads(B));
        return true;
    }
    if (known(b) && known(B) && known(A) && !known(a)) {
        a = b / sin(to_rads(B)) * sin(to_rads(A));
        return true;
    }
    return false;
}

function DOM_callback() {
    var retval, old_retval;
    A = parseFloat(document.getElementById("A").value);
    B = parseFloat(document.getElementById("B").value);
    C = parseFloat(document.getElementById("C").value);
    a = parseFloat(document.getElementById("a").value);
    b = parseFloat(document.getElementById("b").value);
    c = parseFloat(document.getElementById("c").value);

 // Invalidate side inputs if they violate the Law of Sines.
    if (sin(to_rads(A)) / a != sin(to_rads(B)) / b) {
        if (known(A) && known(a) && known(B) && known(b)) {
            a = b = null;
        }
    }
    if (sin(to_rads(A)) / a != sin(to_rads(C)) / c) {
        if (known(A) && known(a) && known(C) && known(c)) {
            a = c = null;
        }
    }
    if (sin(to_rads(B)) / b != sin(to_rads(C)) / c) {
        if (known(B) && known(b) && known(C) && known(c)) {
            b = c = null;
        }
    }

 // Invalidate all angle inputs if they violate the sum rule.
    if (A + B + C !== 180 && known(A) && known(B) && known(C)) {
        A = B = C = null;
    }

    while (solve_triangle() !== false) {
        retval = solve_triangle();
        if (retval == false && old_retval == retval) {
            break; // Consecutive failure indicates no way for further progress.
        }
        old_retval = retval;
    }
    construct_triangle(A, B, C);

    document.getElementById("A").value = known(A) ? A : "";
    document.getElementById("B").value = known(B) ? B : "";
    document.getElementById("C").value = known(C) ? C : "";
    document.getElementById("a").value = known(a) ? a : "";
    document.getElementById("b").value = known(b) ? b : "";
    document.getElementById("c").value = known(c) ? c : "";
    return;
}

var frames_per_second = 10, interval = 1 / frames_per_second;
var channel_fraction = 0, rainbow_cycle = 0;
function color_refresh() {
    switch (rainbow_cycle) {
    case 0: // from red to yellow   (+G)
        glColor4f(1, channel_fraction, 0, 1);
        break;
    case 1: // from yellow to green (-R)
        glColor4f(channel_fraction, 1, 0, 1);
        break;
    case 2: // from green to cyan   (+B)
        glColor4f(0, 1, channel_fraction, 1);
        break;
    case 3: // from cyan to blue    (-G)
        glColor4f(0, channel_fraction, 1, 1);
        break;
    case 4: // from blue to magenta (+R)
        glColor4f(channel_fraction, 0, 1, 1);
        break;
    case 5: // from magenta to red  (-B)
        glColor4f(1, 0, channel_fraction, 1);
        break;
    }
    if (rainbow_cycle % 2 === 1) {
        channel_fraction -= interval;
        if (channel_fraction <= 0) {
            rainbow_cycle = (rainbow_cycle + 1) % 6;
        }
    } else {
        channel_fraction += interval;
        if (channel_fraction >= 1) {
            rainbow_cycle = (rainbow_cycle + 1) % 6;
        }
    }
    glDrawArrays(GL_LINE_LOOP, 0, 3);
}

function main_GL() {
    "use strict";
    var error_code;

    if (GL_get_context(document, "GL_canvas") === null) {
        alert("Failed to initialize WebGL.");
        return;
    }
    glLineWidth(3);

    construct_triangle(A, B, C);
    setInterval(color_refresh, 1000 / frames_per_second);
    do {
        error_code = glGetError();
        console.log("OpenGL error status:  " + error_code);
    } while (error_code !== GL_NO_ERROR);
    return;
}