from flask import Flask, request, jsonify, make_response
from flask_restful import Resource
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
import app
from app import bcrypt
from app import db
from functools import wraps
from Models import User,AllergenCategory,UserAllRelation





def token_required(f):
    @wraps(f)
    def decorated(self, *args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return {'message': 'Token is missing!'}, 401

        try:
          
            data = jwt.decode(token, "verybadbackend",'HS256')
            user = User.query.filter_by(username=data['Username']).first()
            if user:
                self.is_name = data['Username']
            else:
                return {'message':  'Please login '}, 401

        except Exception as e:
            return {"error": str(e)}, 400

        return f(self, *args, **kwargs)

    return decorated


class Login(Resource):
    # Login for the user
    def post(self):
        try:
            _json = request.json
            _username = _json['Username'].lower()
            _password = _json['Password']

            if not _json or not _username or not _password:
                return make_response('Bad Input'), 400
            

            user = User.query.filter_by(username=_username).first()
            if user and user.password == _password:
                token = jwt.encode({'Username': _username.lower(), 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, "verybadbackend")
                return {'token': str(token)}, 201
            else:
                return make_response('Invalid credentials', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})
        except Exception as e:
            return {"error": str(e)}, 400


class Create_User(Resource):
    @token_required
    def get(self):
        try:
            total_aller=[]
            all_allergen=AllergenCategory.query.all()
            for i in all_allergen:
                d={'id':i.id,'name':i.allergytype}
                total_aller.append(d)
            return {'allergyType':total_aller},200

        except Exception as e:
            return {"error": str(e)}, 400


    def post(self):
        try:
                data = request.get_json()
                if not data:
                    return make_response('Bad Input'), 400
                
                username = data['Username'].lower()
                is_null=db.session.query(db.exists().where(User.username == username)).scalar()
                # print(is_null)
                if is_null is False:
                    

                    new_user = User(
                    username=data['Username'].lower(),
                    password=data['Password'], 
                    email=data['email'],
                    firstname=data['Firstname'],
                    lastname=data['Lastname'],
                    gender=data['Gender'],
                    location=data['Location'],
                    occupation=data['Occupation']
                    )
                    db.session.add(new_user)
                    db.session.commit()
                    return {'message': 'New user created!'}, 201
                else:
                    return {'message': 'User already created'}, 409
        except Exception as e:
            return {"error": str(e)}, 400


class User_Methods(Resource):
    @token_required
    def get(self, u_name):
        try:
            user=User.query.filter_by(username=u_name).first()
            allergen_list=[]
            if user:
                user_aller=UserAllRelation.query.filter_by(user_id=user.id).all()
                for i in user_aller:
                    result= AllergenCategory.query.filter_by(id=i.allergen_category_id).first()
                    allergen_list.append(result.allergytype)

                d = {'Username': u_name, 'FirstName': user.firstname, 'LastName': user.lastname, 'Email':user.email,'allergen_list':allergen_list,'Gender':user.gender,'Location':user.location,'Occupation':user.occupation}
                return ({'users': d}), 200
            else:
                return {'message': 'No user found!'}, 404
        except Exception as e:
            return {"error": str(e)}, 400
    @token_required
    def post(self,u_name):
        try:
            data=request.get_json()
            if not data:
                return make_response('Bad Input'), 400
            user=User.query.filter_by(username=u_name).first()
            new_aller=UserAllRelation(
            user_id=user.id,
            allergen_category_id=data['allergenid']
            )
            db.session.add(new_aller)
            db.session.commit()
            return {'message': 'added Successfully'}, 201
        except Exception as e:
            return {"error": str(e)}, 400

    @token_required
    def patch(self,u_name):
        try:
            data=request.get_json()
            if not data:
                return make_response('Bad Input'),400

            user_to_update = User.query.filter_by(username=u_name).first()
            if user_to_update:
                user_to_update.firstname = data['Firstname']
                user_to_update.lastname = data['Lastname']
                user_to_update.email = data['email']
                user_to_update.location = data['Location']
                user_to_update.occupation = data['Occupation']

                db.session.commit()
         
            return {'message':'successfully Updated'},201

        except Exception as e:
            return {"error": str(e)}, 400
        


