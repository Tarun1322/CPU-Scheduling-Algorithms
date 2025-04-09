# Compiler and Flags
CC = g++
CFLAGS = -std=c++17 -Wall -O2

# Detect NumPy include path dynamically
NUMPY_INC = -I$(shell python3 -c "import numpy; print(numpy.get_include())")

# Python Include and Library Paths
PYTHON_INC = $(shell python3-config --includes) -I$(shell python3 -c "import numpy; print(numpy.get_include())")
PYTHON_LIB = -L$(shell python3 -c "import sysconfig; print(sysconfig.get_config_var('LIBDIR'))") -lpython3.13 -Wl,-undefined,dynamic_lookup

# Directories
SRC_DIR = src
OBJ_DIR = obj

# Find Source Files and Convert to Object File Paths
SRCS = $(wildcard $(SRC_DIR)/*.cpp)
OBJS = $(patsubst $(SRC_DIR)/%.cpp, $(OBJ_DIR)/%.o, $(SRCS))

# Output Binary
TARGET = scheduler

# Default Rule
all: $(TARGET)

# Compile Each .cpp File into .o (Ensuring obj/ Directory Exists)
$(OBJ_DIR)/%.o: $(SRC_DIR)/%.cpp | $(OBJ_DIR)
	$(CC) $(CFLAGS) $(PYTHON_INC) -c $< -o $@

# Create obj/ Directory if Not Exists
$(OBJ_DIR):
	mkdir -p $(OBJ_DIR)

# Link Object Files into Final Executable
$(TARGET): $(OBJS)
	$(CC) $(CFLAGS) -o $@ $^ $(PYTHON_LIB) -ldl -framework CoreFoundation

# Clean Compiled Files
clean:
	rm -rf $(OBJ_DIR) $(TARGET)
