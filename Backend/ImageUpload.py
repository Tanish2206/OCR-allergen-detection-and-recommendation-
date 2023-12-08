from flask import Flask, request, jsonify, make_response
from flask_restful import Resource
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
import app
from app import bcrypt
from app import db
from functools import wraps
from Models import User,AllergenCategory,UserAllRelation,AllergenSubCategory
import sys
import os
from dotenv import load_dotenv
load_dotenv()
from werkzeug.utils import secure_filename
sys.path.append("../")
from Backend.User_api import token_required
from Recommendation.recsys import get_recommendations_1
from Allergen_Detector.IsAllergic import allowed_file,compare_allergens
from Text_Pr.text_processing import process_text
from OCR.OCR import finalfunc




class UploadResult(Resource):
   @token_required
   def post(self,u_name):
    if "file1" not in request.files or "file2" not in request.files:
        return {'message':  'Invalid input'},400
    try:
       file=request.files['file1']
       file2=request.files['file2']
       if file.filename ==''or file2.filename=='':
            return {'message':'no file selected'},400
       if file and allowed_file(file.filename) and file2 and allowed_file(file2.filename):
            filename=secure_filename(file.filename)
            # image_path=(os.path.join(os.getenv('IMAGE_PATH'),filename))
            image_path=filename
            file.save(image_path)
            # /////////////////////////////////////////////////
            filename2=secure_filename(file2.filename)
            # image_path2=(os.path.join(os.getenv('IMAGE_PATH'),filename2))
            image_path2=filename2
            file2.save(image_path2)
            # ///////////////////////////////////
            user=User.query.filter_by(username=u_name).first()
            allergy_cat_id=[]
            user_aller_rel=UserAllRelation.query.filter_by(user_id=user.id)
            for i in user_aller_rel:
                allergy_cat_id.append(i.allergen_category_id)
            User_allergen_list=[]
            for i in allergy_cat_id:
                Temp_list=AllergenSubCategory.query.filter_by( allergen_category_id=i)
                for j in Temp_list:
                    User_allergen_list.append(j.name)
            Ocr_image_text=finalfunc(image_path)
            # print(Ocr_image_text)
            Text_Process_result=process_text(Ocr_image_text)
            # print(Text_Process_result)
            if len(Text_Process_result["Ingredients"])==0 or Text_Process_result["Ingredients"] is None :
                return {'message':'Reupload Ingredients Image'},400
            else:
                Is_Allergic=compare_allergens(Text_Process_result['Ingredients'],User_allergen_list)
            os.remove(image_path)
            Ocr_image_text2=finalfunc(image_path2)
            Text_Process_result2=process_text(Ocr_image_text2)

            # print(Ocr_image_text2)
            if Text_Process_result2['Nutrients']['Protein'] is None or  Text_Process_result2['Nutrients']['Carbohydrate'] is None or Text_Process_result2['Nutrients']['TotalFat'] is None:
                 return {'message':'Reupload Nutrient Table Image'},400
            else:
                os.remove(image_path2)
                Input_Ingredients=""
                if Is_Allergic:
                    for i in Text_Process_result["Ingredients"]:
                        Input_Ingredients+=i

                    recommendation_list=get_recommendations_1(Input_Ingredients)
                    return{'isAllergic':Is_Allergic,'Protein':Text_Process_result2['Nutrients']['Protein'],'Carbs':Text_Process_result2['Nutrients']['Carbohydrate'],'Fats':Text_Process_result2['Nutrients']['TotalFat'],'Recommended_Products':recommendation_list}
                else:
                    return{'isAllergic':Is_Allergic,'Protein':Text_Process_result2['Nutrients']['Protein'],'Carbs':Text_Process_result2['Nutrients']['Carbohydrate'],'Fats':Text_Process_result2['Nutrients']['TotalFat'],'Recommended_Products':None}
            

        
    except Exception as e:
            return {"error": str(e)}, 400



