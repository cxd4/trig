mkdir -p obj
src="."

FLAGS_C="-masm=intel -Os -std=c89 -pedantic -ansi -Wall"

echo Compiling C sources...
cc -S $FLAGS_C -o obj/main.asm          $src/main.c
cc -S $FLAGS_C -o obj/triangle.asm      $src/triangle.c

echo Assembling compiled sources...
as -o obj/main.o                        obj/main.asm
as -o obj/triangle.o                    obj/triangle.asm

echo Linking assembled objects...
cc -s -o trig obj/main.o obj/triangle.o -lm
