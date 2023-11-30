from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    firstname = db.Column(db.String(80), nullable=False)
    lastname = db.Column(db.String(80), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    occupation = db.Column(db.String(200), nullable=False)
    gender=db.Column(db.String(10), nullable=False)


class AllergenCategory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    allergytype = db.Column(db.String(80), unique=True, nullable=False)

class UserAllRelation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    allergen_category_id = db.Column(db.Integer, db.ForeignKey('allergen_category.id'))

class AllergenSubCategory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    allergen_category_id = db.Column(db.Integer, db.ForeignKey('allergen_category.id'))
   
