#ifndef _POLYGON_H_
#define _POLYGON_H_

/*
 * geometric properties of the polygon meant for solving
 *
 * The default C pre-processor configuration here is to solve triangles.
 */
#ifndef POLYGON_DEPTH
#define POLYGON_DEPTH           3
#endif

#if (POLYGON_DEPTH < 3)
#error You cannot have a polygon with fewer than 3 sides!
#endif
#if (POLYGON_DEPTH > 'Z' - 'A')
#error Angle labels are currently lettered.  Sorry for this limitation.
#endif

/*
 * All polygons have a fixed limit to the total measure of their angles.
 * For example, the angles of a triangle always sum up to 180 degrees.
 */
#define INTERIOR_DEGREES        (180 * ((POLYGON_DEPTH) - 2))

/*
 * Geometric lengths cannot be negative or zero.
 * We will reserve non-positive measures to indicate un-solved "unknowns".
 */
#define KNOWN(measure)          ((measure) > 0)

extern int solve_polygon(double * angles, double * sides);
extern int already_solved(double * angels, double * sides);

extern int find_angle(double * angles);
extern int find_side(double * sides, const double * angles);
extern int arc_find_angles(double * angles, const double * sides);

#endif
