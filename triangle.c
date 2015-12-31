#include <math.h>
#include <stddef.h>
#include "polygon.h"

static double to_radians(double degrees)
{
    double radians;

    radians = degrees / 180;
/*
 * to do
 *
 * Emulate this Archimedian constant by doing the degrees-to-radians
 * conversion in the same way "pi" itself is derived, without defining "pi".
 */
    return (radians *= 3.141592653589793116);
}
static double to_degrees(double radians)
{
    double degrees;

    degrees = radians * 180;
    return (degrees /= 3.141592653589793116);
}

int solve_polygon(double * angles, double * sides)
{
    unsigned int new_discovery, new_discovery_old;

    new_discovery_old = 0;
    while (!already_solved(angles, sides)) {
        new_discovery  = 0;

        new_discovery |= find_angle(angles);
#if (POLYGON_DEPTH == 3)
        new_discovery |= find_side(sides, angles);
        new_discovery |= arc_find_angles(angles, sides);
#endif

        if (new_discovery == new_discovery_old && new_discovery == 0)
            return 0; /* early exit from repeated failure in the loop */
        new_discovery_old = new_discovery;
    }
    return 1;
}

int find_angle(double * angles)
{
    double * missing_angle;
    double sum_of_known_angles;
    register int i, given;

    missing_angle = NULL;
    sum_of_known_angles = 0;
    given = 0;

    for (i = 0; i < POLYGON_DEPTH; i++) {
        if (!KNOWN(angles[i])) {
            missing_angle = &(angles[i]); /* last (hopefully "only") unknown */
            continue;
        }
        ++given;
        sum_of_known_angles += angles[i];
    }

    if (given != POLYGON_DEPTH - 1)
        return 0;
    *(missing_angle) = INTERIOR_DEGREES - sum_of_known_angles;
    return 1; /* successfully found:  missing = total - sum_of_not_missing */
}

int find_side(double * sides, const double * angles)
{
    double a, b, c;
    register int i;

    a = b = c = 0;
    for (i = 0; i < POLYGON_DEPTH; i++) {
        const double A = to_radians(angles[(i + 0)]);
        const double B = to_radians(angles[(i + 1) % POLYGON_DEPTH]);
        const double C = to_radians(angles[(i + 2) % POLYGON_DEPTH]);

        a = sides[(i + 0)];
        b = sides[(i + 1) % POLYGON_DEPTH];
        c = sides[(i + 2) % POLYGON_DEPTH];

/*
 * Try applying the Law of Sines.
 */
        if (!KNOWN(a) && KNOWN(A) && KNOWN(b) && KNOWN(B)) {
            a = sin(A) * b / sin(B);
            goto new_info;
        }
        if (!KNOWN(a) && KNOWN(A) && KNOWN(c) && KNOWN(C)) {
            a = sin(A) * c / sin(C);
            goto new_info;
        }
        if (!KNOWN(b) && KNOWN(B) && KNOWN(a) && KNOWN(A)) {
            b = sin(B) * a / sin(A);
            goto new_info;
        }
        if (!KNOWN(b) && KNOWN(B) && KNOWN(c) && KNOWN(C)) {
            b = sin(B) * c / sin(C);
            goto new_info;
        }
        if (!KNOWN(c) && KNOWN(C) && KNOWN(a) && KNOWN(A)) {
            c = sin(C) * a / sin(A);
            goto new_info;
        }
        if (!KNOWN(c) && KNOWN(C) && KNOWN(b) && KNOWN(B)) {
            c = sin(C) * b / sin(B);
            goto new_info;
        }

/*
 * There is also the Law of Co-Sines....
 * For right triangles, that simplifies to:  c^2 = a^2 + b^2
 *
 * Even the "Pythagorean Theorem" risks extra precision round-off, however.
 *
 * Given a 0-degree angle, cos(0) is 1 and the sqrt() simplifies to (a - b).
 */
        if (!KNOWN(c) && KNOWN(C) && KNOWN(a) && KNOWN(b)) {
            c = sqrt(a*a + b*b - 2*a*b*cos(C));
            goto new_info;
        }
        if (!KNOWN(b) && KNOWN(B) && KNOWN(a) && KNOWN(c)) {
            b = sqrt(a*a + c*c - 2*a*c*cos(B));
            goto new_info;
        }
        if (!KNOWN(a) && KNOWN(A) && KNOWN(a) && KNOWN(b)) {
            a = sqrt(b*b + c*c - 2*b*c*cos(A));
            goto new_info;
        }
    }
    return 0;
new_info:
    sides[(i + 0) % POLYGON_DEPTH] = a;
    sides[(i + 1) % POLYGON_DEPTH] = b;
    sides[(i + 2) % POLYGON_DEPTH] = c;
    return 1;
}

int arc_find_angles(double * angles, const double * sides)
{
    double A, B, C;
    register int i;

    A = B = C = 0;
    for (i = 0; i < POLYGON_DEPTH; i++) {
        const double a = sides[(i + 0)];
        const double b = sides[(i + 1) % POLYGON_DEPTH];
        const double c = sides[(i + 2) % POLYGON_DEPTH];

        A = to_radians(angles[(i + 0)]);
        B = to_radians(angles[(i + 1) % POLYGON_DEPTH]);
        C = to_radians(angles[(i + 2) % POLYGON_DEPTH]);

/*
 * Try applying the Law of Sines.
 */
        if (!KNOWN(A) && KNOWN(a) && KNOWN(C) && KNOWN(c)) {
            A = asin(a/c * sin(C));
            goto new_info;
        }
        if (!KNOWN(B) && KNOWN(b) && KNOWN(C) && KNOWN(c)) {
            B = asin(b/c * sin(C));
            goto new_info;
        }

/*
 * Try applying the Law of Co-Sines.
 */
        if (!KNOWN(C) && KNOWN(a) && KNOWN(b) && KNOWN(c)) {
            C = acos((a*a + b*b - c*c) / (2*a*b));
            goto new_info;
        }
    }
    return 0;
new_info:
    angles[(i + 0) % POLYGON_DEPTH] = to_degrees(A);
    angles[(i + 1) % POLYGON_DEPTH] = to_degrees(B);
    angles[(i + 2) % POLYGON_DEPTH] = to_degrees(C);
    return 1;
}

int already_solved(double * angles, double * sides)
{
    double sum_of_all_angles;
    register int i;

    for (i = 0; i < POLYGON_DEPTH; i++)
        if (!KNOWN(angles[i]))
            return 0;
    for (i = 0; i < POLYGON_DEPTH; i++)
        if (!KNOWN(sides[i]))
            return 0;

    sum_of_all_angles = 0;
    for (i = 0; i < POLYGON_DEPTH; i++)
        sum_of_all_angles += angles[i];
    if (sum_of_all_angles != INTERIOR_DEGREES)
        return -1; /* should not be possible without a bug... */
    return 1;
}
