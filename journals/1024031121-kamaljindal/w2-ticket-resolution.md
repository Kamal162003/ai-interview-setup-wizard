# Week 2 : Dynamic Library Runtime Resolution (RPATH & LD_LIBRARY_PATH)

## 1. Problem Statement & Error

After resolving the compilation and linking issues in Week 1, attempting to execute the compiled binary (`./dist/bin/run`) resulted in the following runtime error:

```text
./dist/bin/run: error while loading shared libraries: libbvr_math.so: cannot open shared object file: No such file or directory
```

---

## 2. Relevant Context

The dynamic shared library `libbvr_math.so` was compiled successfully into `dist/lib/`.

During build time, the executable linked cleanly using:

```shell
c++ -O2 -Wall -std=c++17 -Iinc -Ldist/lib -o dist/bin/run src/bin/run_main.cpp -lbvr_math
```


However, when executing `./dist/bin/run` in the terminal, the operating system's dynamic loader (`ld.so`) failed to locate `libbvr_math.so` at runtime.

---

## 3. Key Observation & Root Cause

### Why does this error occur? (Build-time vs Runtime Linking)

1. **`-Ldist/lib` is a Build-Time Flag Only**:
   - The `-L` flag tells the compiler linker *where to find libraries during compilation*.
   - Once compilation completes, the build-time linker does **not** automatically embed `dist/lib` into the executable's runtime search paths unless explicitly told to do so.

2. **How the OS Dynamic Loader Finds Libraries at Runtime**:
   - When launching `./dist/bin/run`, the OS dynamic loader searches standard system directories (such as `/lib`, `/usr/lib`, `/etc/ld.so.conf`).
   - Because `dist/lib/libbvr_math.so` is located in a custom project directory, the OS cannot find it.

---

## 4. Solution

There are two ways to resolve this issue:

### Solution A: Setting `LD_LIBRARY_PATH` (Temporary Environment Fix)
Set the environment variable in your terminal before running the binary:

```shell
export LD_LIBRARY_PATH=dist/lib:$LD_LIBRARY_PATH
./dist/bin/run
```

### Solution B: Embedding RPATH in Makefile (Permanent Build Fix)
Add the `-Wl,-rpath` flag to the `Makefile` recipe so the executable permanently stores its dynamic library search path:

```makefile
dist/bin/run : src/bin/run_main.cpp 
	$(CXX) $(CXXFLAGS) $(CFLAGS) $(LDFLAGS) $(FLAGS) \
	       -o $@ $^ -Ldist/lib -lbvr_math -Wl,-rpath,'$$ORIGIN/../../lib'
```

---

## 5. Summary / Teacher Explanation Guide

> **How to explain this to your teacher in 3 simple points:**
> 
> 1. **`-L` vs `rpath`**: `-L` only tells the compiler where libraries are *during build time*. It does not tell the OS where to find them at *runtime*.
> 2. **Runtime Loader Behavior**: By default, the OS dynamic loader searches standard system folders (`/usr/lib`) and misses project-local libraries in `dist/lib/`.
> 3. **The Fix**: Adding `-Wl,-rpath` embeds the runtime search directory directly into the binary's ELF header (using `$ORIGIN`), making the executable self-contained and portable.
