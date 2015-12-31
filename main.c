#include <stdlib.h>
#include <stdio.h>

#include "polygon.h"
static double angles[POLYGON_DEPTH];
static double sides[POLYGON_DEPTH];

static const char* help_triangle = {
    "    B \n"\
    "   /| \n"\
    " c/ |a\n"\
    " /  | \n"\
    "A---C \n"\
    "  b   \n"
};

int main(int argc, char* argv[])
{
    register int i;

    if (argc - 1 <= 0) {
#if (POLYGON_DEPTH == 3)
        fputs(help_triangle, stdout);
#endif
        fputs(argv[0], stdout);
        for (i = 0; i < POLYGON_DEPTH; i++)
            printf(" [%c]", 'A' + i);
        for (i = 0; i < POLYGON_DEPTH; i++)
            printf(" [%c]", 'a' + i);
        putchar('\n');
        getchar();
        return -1;
    }
    puts("Attempting to solve triangle ABC...");
    for (i = 0; i < POLYGON_DEPTH; i++) {
        if (i < argc - 1)
            angles[i] = strtod(argv[i + 1], NULL);
        if (i < argc - 1 - POLYGON_DEPTH)
            sides[i]  = strtod(argv[i + 1 + POLYGON_DEPTH], NULL);
    }

    solve_polygon(&angles[0], &sides[0]);
    for (i = 0; i < POLYGON_DEPTH; i++)
        printf("angle %c:  %g degrees\n", 'A' + i, angles[i]);
    for (i = 0; i < POLYGON_DEPTH; i++)
        printf("%c = %g\n", 'a' + i, sides[i]);
    return 0;
}
