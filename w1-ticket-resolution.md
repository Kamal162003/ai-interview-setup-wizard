# Week 1 : Order of Flags in Compilation Command

## 1. Problem Statement & Error

During project compilation, the build failed at the linking stage with the following error:

```text
run_main.cpp:(.text.startup.main+0x68): undefined reference to `Bvr::Math::sum(int, int)'
```

---

## 2. Relevant Context

In the original `Makefile`, the build recipe for the executable binary was defined as:

```makefile
dist/bin/run : src/bin/run_main.cpp 
	$(CXX) $(CXXFLAGS) $(CFLAGS) $(LDFLAGS) $(FLAGS) \
	       -lbvr_math -o $@ $^
```

When `make` executed, this generated the following compiler/linker command:

```shell
c++ -O2 -Wall -Wextra -fPIC -std=c++17 -Iinc \
    -Ldist/lib -lbvr_math -o dist/bin/run    \
    src/bin/run_main.cpp
```

---

## 3. Key Observation & Root Cause

### Why does this error occur? (Single-Pass Linker Rule)

The GCC/Clang linker (`ld`) processes input files and library flags sequentially from **left to right** in a single pass:

1. **When `-lbvr_math` comes first:**
   - The linker looks at `libbvr_math` to see if it provides any functions currently present in its *unresolved symbols list*.
   - At this moment, `src/bin/run_main.cpp` has not been scanned yet, so the unresolved symbols list is empty.
   - The linker assumes no functions from `libbvr_math` are needed and **discards the library**.

2. **When `src/bin/run_main.cpp` is processed next:**
   - The linker scans `run_main.cpp` and finds a call to `Bvr::Math::sum(int, int)`.
   - It adds `Bvr::Math::sum` to the unresolved symbols list.
   - Since `-lbvr_math` was already passed and discarded, `Bvr::Math::sum` remains unresolved, throwing:
     `undefined reference to 'Bvr::Math::sum(int, int)'`.

---

## 4. Solution

In the `Makefile`, place the library flag `-lbvr_math` **after** the source file dependencies (`$^`):

```makefile
dist/bin/run : src/bin/run_main.cpp 
	$(CXX) $(CXXFLAGS) $(CFLAGS) $(LDFLAGS) $(FLAGS) \
	       -o $@ $^ -lbvr_math
```

This translates to the corrected command:

```shell
c++ -O2 -Wall -Wextra -fPIC -std=c++17 -Iinc \
    -Ldist/lib -o dist/bin/run                \
    src/bin/run_main.cpp -lbvr_math
```

---

## 5. Summary / Teacher Explanation Guide

> **How to explain this to your teacher in 3 simple points:**
> 
> 1. **Left-to-Right Order**: Linkers process files sequentially from left to right in a single pass.
> 2. **Library Placement**: A library (`-l<lib>`) must always be placed **after** the source/object files (`.cpp` / `.o`) that depend on it.
> 3. **The Fix**: Putting `-lbvr_math` *after* `src/bin/run_main.cpp` allows the linker to first see what functions `run_main.cpp` needs, and then immediately resolve them from `-lbvr_math`.
