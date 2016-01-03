# Triangle Solver

I started but never finished writing an interactive, graphical program to solve any triangle back in 2012 using JavaScript.  Due to continued research to find [exact trigonometric ratios](http://cxd4.github.io/trig), I have ended up writing a modern C version from pure scratch.  Fortunately, it seems to work successfully with all tested cases.

### Solving A Triangle

When geometicians speak of "solving" triangles, they don't mean stuff like, "Find _x_."  "Solved" triangles always have every angle measure and side length known, without any emphasis on any particular measure.

To use this program to solve any triangle for you, simply execute:

`trig [A (degrees)] [B (degrees)] [C (degrees)] [y] [x] [r]`

... where, preferably (but not necessarily...more of an optional assumption):

* _A_ measures the base angle of the triangle, when graphed in quadrant I.
* _B_ measures the angle opposite of angle A.
* _C_ measures the angle opposite of the longest of the triangle's three sides.
* _y_ measures the side opposite of angle A (possibly triangle ABC's height)
* _x_ measures the side opposite of angle B (possibly triangle ABC's width)
* _r_ measures the radius of the circle inscribing triangle ABC.  If ABC is a right triangle, then _r_ is also the resultant of vector components _x_ and _y_, from a Physics point of view.

To specify any of these measures as unknown, enter 0 or a negative value.

### Example Usage
```
trig 0 0 0 3 4 5
# outputs all 3 mystery angle measures:  ~36.87 deg., ~53.13 deg. and 90 deg.
```

## Manually Solving A Triangle

If you have the necessary experience and need to know the "exact" answers (but not always favorable ones, in some cases of relative arbitration), you can certainly solve any triangle by yourself without relying on this program, given a sufficient amount of specification.

### Solving Equilateral Triangles

Solving triangles where all three sides are congruent is easy.

There is only one necessary piece of information needed for solving these regular triangles, and that is merely the length of even just a single side--at which point, the other two sides are known to be congruent with such.

Furthermore, no angles need to be given to solve equilateral triangles, as they are also automatically "equiangular".  It has long since been established that all angle measures of any triangle at all will always total to 180 degrees.  Therefore, in the case of equilateral triangles, _A_ + _A_ + _A_ = 3_A_ = 180, where _A_ = 60 degrees in all angles.

### Solving Isosceles Triangles

Also easy to solve are triangles with two congruent sides--but not all three!

Similarly to the shortcut applied with equilateral triangles, isosceles triangles have not only two equal side lengths but two equal angle measures as well.  Therefore, in the case of isosceles triangles, _A_ + _A_ + _C_ = 2_A_ + _C_ = 180, where _C_ measures the angle opposite of the exclusive side of the triangle--the one not congruent to the two congruent sides.

It is impossible to solve a triangle just by knowing it is an isosceles one, without additionally knowing either of these combinations:

* at least one angle measure and at least one side length
* at least two of the three side lengths, such that both are not equal

There is only one possibility of isosceles triangle which is also a right triangle:  the 45-45-90 special right triangle, in which the non-congruent hypotenuse side (opposite from the right angle) always measures to exactly `sqrt(2)` times the length of either of the two congruent "leg" sides.

### Solving Scalene Triangles

Hardest to solve, of course, are triangles where every side length is unique.  Consequentially, none of the three angles are congruent, either.

Two lone theorems are sufficient to solve any solvable triangle:

* the Law of Sines:  sin(_A_)/_a_ = sin(_B_)/_b_ = sin(_C_)/_c_
* the Law of Co-Sines, which ultimately simplifies to the "Pythagorean Theorem" if the triangle is a right triangle (i.e., one of its angles is 90 degrees)

The Law of Sines can be used to define any unknown side given the measure of its opposite angle, or it can be used to define any unknown angle given the length of its opposite side.  Either way, one of the two remaining "angle-to-opposite-side" ratios must be known.

The Law of Co-Sines can be used to define an unknown side given two known side lengths and one angle measure, or it can be used to define any of the unknown angles if all three side lengths are known.

For those uninitiated with these theorems or the inverse functions arcsin() and arccos(), it may be easiest to prevent needing to use them by simply carving the triangle into two right triangles.  Any triangle can be disected in this fashion, and it is by this process through which those laws were proven.

Once you are set up to work with right triangles, scalene or otherwise:

* Let _C_ represent the 90-degree, right angle, and _c_ the longest side.
* sin(_A_) = _a_ / _c_ = cos(_B_)
* sin(_B_) = _b_ / _c_ = cos(_A_)
* tan(_A_) = _a_ / _b_ = cot(_B_)
* tan(_B_) = _b_ / _a_ = cot(_A_)

Right triangles are so important because you have simple one-dimensional magnitudes of "width" and "height", thanks to both dimensions being perpendicular to each other and forming the right angle in the triangle.

### Impossible Triangles

Aside from combinations of collectively insufficient information needed to solve a triangle, there are also combinations of conflicting, self-contradicting information that make drawing a legitimate, actual triangle impossible.  These tests are done responsively by the [JavaScript port of this program](http://cxd4.github.io/trig).

* By the Triangle Sum Theorem, all three angle measures must total 180 degrees.
* The angles opposite from the two congruent sides in an isosceles triangle must be acute and congruent.
* For an equilateral triangle, each and every angle measure must be 60 degrees.
* If the Law of Sines fails, the given data cannot represent a valid triangle.
* Each angle of any triangle must be greater than arccos(+1) (0) and less than arccos(-1) (180 degrees).
* The combination of any two sides must always be longer than the third, remaining side.  The Law of Co-Sines can be used to prove this by minimizing and maximizing the domain of arccos() to the range limits -1 and +1, which will simplify to a perfect square trinomial set equal to the square of the third side.
