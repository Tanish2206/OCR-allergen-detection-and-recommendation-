from flask import Flask
from flask_restful import Resource,Api
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS,cross_origin
from dotenv import load_dotenv
import os

load_dotenv()

app=Flask(__name__)
cors=CORS(app)
app.config['CORS_HEADERS']='Content-Type'

api = Api(app)
bcrypt = Bcrypt(app)
app.app_context().push()

app.config['SQLALCHEMY_DATABASE_URI']=os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key=os.getenv('SECRET_KEY')


db = SQLAlchemy(app)

from User_api import Create_User,Login,User_Methods
from ImageUpload import UploadResult
api.add_resource(Create_User, '/users')
api.add_resource(Login,'/login')
api.add_resource(User_Methods, "/user/<u_name>")
api.add_resource(UploadResult, "/upload/<u_name>")
  


if __name__ == '__main__':
    app.run(debug=True)