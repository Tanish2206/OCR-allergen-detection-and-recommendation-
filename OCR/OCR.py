import pytesseract
import cv2 
import numpy as np
import sys
from PIL import Image,ImageOps
from Text_Pr.text_processing import process_text
import base64

# Set the path to the Tesseract executable
pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'

def get_grayscale(image_path):
    img = cv2.imread(image_path)
    img_hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV)
    return img_hsv
    
# noise removal
def remove_noise(image_path):
    img = cv2.imread(image_path)
    image_rn=cv2.medianBlur(img,5)
    return image_rn
    
    #return image_rn
 
'''threshold'''
def thresholding(image_path):
    image = cv2.imread(image_path)
    ret, thresh1 = cv2.threshold(image, 120, 255, cv2.THRESH_BINARY) 
    #preprocessed_image=cv2.threshold(img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
    return thresh1

def extract_text_from_image(image):
    custom_config = r'--oem 3 -l eng'
    extractedText = pytesseract.image_to_string(image,config=custom_config)

def extractTextFromImage(image_path):
    custom_config = r'--oem 3 -l eng'
    extractedText = pytesseract.image_to_string(image_path,config=custom_config)
    return extractedText

def finalfunc(image_path):
    
    # Preprocess and compress the image
    #compressed_image = compress_image(image_path, target_size=1024 * 1024)
    gray = get_grayscale(image_path)
    
    rn= remove_noise(image_path)
    thresh= thresholding(image_path)
    
    
    # OCR on compressed image
    extracted_text_preprocessed = extractTextFromImage(image_path)
    original_image_text=extract_text_from_image(image_path)

    # Choose the result with better OCR accuracy
    chosen_source, chosen_text = ("Original Image", original_image_text) if original_image_text and (not extracted_text_preprocessed or len(original_image_text) > len(extracted_text_preprocessed)) else ("Preprocessed Image", extracted_text_preprocessed)

    return chosen_text

