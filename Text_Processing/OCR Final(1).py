#!/usr/bin/env python
# coding: utf-8

# In[343]:


import cv2 as cv
import numpy as np
from PIL import Image

import pytesseract

main_image='realtimeImage5.jpg'

# Set the path to the Tesseract executable
pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'

def extractTextFromImage(image):
    custom_config = r'--oem 3 -l eng'
    extractedText = pytesseract.image_to_string(image,config=custom_config)
    return extractedText
input_image_path = main_image
extracted_text = extractTextFromImage(input_image_path)

# Now you can work with the extracted text
print(extracted_text)


# In[344]:


import pytesseract

# Set the path to the Tesseract executable
pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'


# In[345]:


import cv2 as cv
from PIL import Image

def preprocess_image(image_path, output_path, threshold_methods):
    img = cv.imread(image_path)

    if img is not None:
        gray_image = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
        blurred_image = cv.GaussianBlur(gray_image, (5, 5), 0)
        im = Image.fromarray(blurred_image)
        im.save("test-300.png", dpi=(300, 300))

        alpha = 1  # Contrast control (1.0-3.0)
        beta = 1  # Brightness control (0-100)
        adjusted = cv.convertScaleAbs(blurred_image, alpha=alpha, beta=beta)

        best_text = ""
        best_method = ""
        best_length = 0

        for method_name, threshold_method in threshold_methods.items():
            _, im_threshold = threshold_method(adjusted)

            # Save the preprocessed image as a new file
            cv.imwrite(f"{method_name}_threshold.png", im_threshold)

            # Compress the image
            compressed_image = compress_image(f"{method_name}_threshold.png", target_size=1024 * 1024)

            # Extract text from the compressed image
            extracted_text = extract_text_from_image(compressed_image)

            # Compare the length of the extracted text
            if len(extracted_text) > best_length:
                best_length = len(extracted_text)
                best_text = extracted_text
                best_method = method_name

        # Save the best preprocessed image
        cv.imwrite(output_path, cv.imread(f"{best_method}_threshold.png"))

        return best_text, best_method

# Define the thresholding methods
threshold_methods = {
    "global": lambda img: cv.threshold(img, 150, 255, cv.THRESH_BINARY_INV),
    "otsu": lambda img: cv.threshold(img, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU),
    "binary": lambda img: cv.threshold(img, 128, 255, cv.THRESH_BINARY),
    "binary_inv": lambda img: cv.threshold(img, 128, 255, cv.THRESH_BINARY_INV),
    "truncate": lambda img: cv.threshold(img, 128, 255, cv.THRESH_TRUNC),
    "tozero": lambda img: cv.threshold(img, 128, 255, cv.THRESH_TOZERO),
    "tozero_inv": lambda img: cv.threshold(img, 128, 255, cv.THRESH_TOZERO_INV),
}

# Provide the path to your input image and output image
input_image_path = main_image
output_image_path = 'best_preprocessed_image.png'

# Call the preprocess_image function to preprocess and save the image using the best thresholding method
best_text, best_method = preprocess_image(input_image_path, output_image_path, threshold_methods)

# Check if the preprocessing and saving were successful
print(f"Best preprocessed image saved as {output_image_path}")
print(f"Best thresholding method: {best_method}, Extracted Text: \n{best_text}")


# In[347]:


from PIL import Image, ImageOps
import os

image_path = r"best_preprocessed_image.png"

def compress_image(input_path, target_size):
    image = Image.open(input_path)
    image = ImageOps.exif_transpose(image)  # Correct the image orientation
   
    quality = 100
    while os.path.exists(input_path) and os.path.getsize(input_path) > target_size:
        print("Compressing Image")
        print(os.path.getsize(input_path))
        # Save the image with the current quality level
        image.save(input_path, optimize=True, quality=quality)

        # Break the loop if the quality level reaches 0
        if quality <= 0:
            break
    # Optionally, you can reapply the EXIF transpose if needed
    image = ImageOps.exif_transpose(image)
    
    # Return the compressed image
    return image

# Define the target size you want and call the function with it
target_size = 1024 * 1024  # For example, 1 MB
compressed_image = compress_image(image_path, target_size)

# You can now use the 'compressed_image' for further processing or saving
if compressed_image is not None:
    # You can use 'compressed_image' for further processing or display
    compressed_image.show()
else:
    print(f"Error: Unable to load the image at '{image_path}'")


# In[348]:


def extractTextFromImage(image):
    custom_config = r'--oem 3 -l eng'
    extractedText = pytesseract.image_to_string(image,config=custom_config)
    return extractedText

extracted_text = extractTextFromImage(compressed_image)
input_image_path = main_image

# Now you can work with the extracted text
print(extracted_text)


# In[350]:


# List of image paths
image_paths = [ "realtimeImage5.jpg"]

for image_path in image_paths:
    print(f"\nProcessing image: {image_path}")

    # Original image OCR
    original_image = cv.imread(image_path)
    original_text = extract_text_from_image(original_image)
    print("Original Image OCR Result:")
    print(original_text)

    # Preprocess and compress the image
    preprocess_image(image_path, "preprocessed_image.png", threshold_methods)
    compressed_image = compress_image("preprocessed_image.png", target_size=1024 * 1024)

    # OCR on preprocessed image
    print("\nPreprocessed Image OCR Result:")
    print(extracted_text)

    # Choose the result with better OCR accuracy
    chosen_source, chosen_text = ("Original Image", original_text) if len(original_text) > len(extracted_text) else ("Preprocessed Image", extracted_text)
    print(f"\nChosen Source: {chosen_source}, Extracted Text: \n {chosen_text}")


# In[351]:


with open("OCR_TEXT.txt","w") as fp:
    fp.write(chosen_text)


# In[ ]:





# In[ ]:




