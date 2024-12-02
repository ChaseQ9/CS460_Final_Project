# this file calculates the rgb of the pixels of a provided image and returns the colors, and x and y locations (normalized)
# to 0-1 of the pixels

from PIL import Image
import numpy as np

image_path = "/Users/chasequigley/Desktop/sample_image.jpg"

image = Image.open(image_path)

image = image.convert('RGB')

pixel_vals = list(image.getdata())

count = 1
max_val = 255
dimensions = 1024
np.set_printoptions(threshold=np.inf, suppress=True)

x_inds = np.arange(dimensions, dtype=np.float32)
y_inds = np.arange(dimensions, dtype=np.float32)
x_grid, y_grid = np.meshgrid(x_inds, y_inds)

for r in range(dimensions):
    x_inds[r] = x_inds[r]/(dimensions-1)
    y_inds[r] = y_inds[r]/(dimensions-1)

file = open("imgcoords.txt", "w")
file.write("")
file.close()

file = open("imgcoords.txt", "a")
file.write("\n".join(map(str, list(x_inds))))
file.write("\n")
file.write("\n".join(map(str, list(y_inds))))
file.write("\n")

for pix in pixel_vals:
    file.write(str(pix))
    file.write("\n")
file.close()
