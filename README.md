# OCR-allergen-detection-and-recommendation- 

### OCR Module:
Install Tesseract
Paste your .exe path in pytesseract.pytesseract.tesseract_cmd variable
(eg: pytesseract.pytesseract.tesseract_cmd = r'.exe_path_of_tessercat')

### Add .env file in backend folder
--->SQLALCHEMY_DATABASE_URI
--->SECRET_KEY

### Dependencies
--->Flask
---->PYJWT
---->Flasksqlalchemy

### initialize database steps
--> python
-->from app import db
-->db.create_all()

### Run flask application
--->flask run 

