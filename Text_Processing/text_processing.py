import re
import pprint
from autocorrect import Speller
spell = Speller(lang='en')

##NUTRIENTS

nutrition_pat={
    "Calories":r'(?<=Calories)[\s.,\(\)|a-zA-Z]*(\d+.{0,1}\d*\w{0,2})',
    "Energy":r'(?<=Energy)[\s.,\(\)\|a-zA-Z]*(\d+.{0,1}\d*\w{0,2})',
    "Sodium":r'(?<=Sodium)[\s.,\(\)\|a-zA-Z]*(\d+.{0,1}\d*\w{0,2})',
    "Total Fat":r'(?<=Total Fat)[\s.,\(\)\|a-zA-Z]*(\d+.{0,1}\d*\w{0,2})',
    "Saturated Fat":r'(?<=Saturated Fat)[\s.,\(\)\|a-zA-Z]*(\d+.{0,1}\d*\w{0,2})',
    "Trans Fat":r'(?<=Trans Fat)[\s.,\(\)\|a-zA-Z]*(\d+.{0,1}\d*\w{0,2})',
    "Cholesterol":r'(?<=Cholesterol)[\s.,\(\)\|a-zA-Z]*(\d+.{0,1}\d*\w{0,2})',
    "Total Carb":r'(?<=Total Carb)[\s.,\(\)\|a-zA-Z]*(\d+.{0,1}\d*\w{0,2})',
    "Carbohydrate":r'(?<=Carbohydrate)[\s.,\(\)\|a-zA-Z]*(\d+.{0,1}\d*\w{0,2})',
    "Calcium":r'(?<=Calcium)[\s.,\(\)\|a-zA-Z]*(\d+.{0,1}\d*\w{0,2})',
    "Protein":r'(?<=Protein)[\s.,\(\)\|a-zA-Z]*(\d+.{0,1}\d*\w{0,2})',
}

txt=open("OCR_TEXT.txt").read()

nutrient_out={}

for pat in nutrition_pat:

    tt=None
    
    for i in txt.split("\n"):
        pp=re.compile(nutrition_pat[pat])
        res=re.search(pp,i)
        if res:
            tt=res.group(1)
    
    nutrient_out[pat]=tt


if nutrient_out["Energy"]:
    nutrient_out["Calories"]=nutrient_out["Energy"]
    del nutrient_out["Energy"]


##INGREDIENTS

ingredients=re.sub(r'[\[\]\(\)]',',',txt)
ingredients=re.sub(r'and',',',ingredients)
ingredients=re.sub(r'from|From','',ingredients)
#print(ingredients)
ingredients_regex=r'(Ingredients|INGREDIENTS|ingredients):([\w\[\]\(\),\s]*)[\n]*'
ingredients=re.search(ingredients_regex,ingredients).group(2)

ingredients=ingredients.split(",")

#remove invalid elements, strip whitespaces and auto correct
ingredients=list(filter(lambda x:not re.search(r'\d',x),ingredients))
ingredients=list(map(lambda x:re.sub(r'[\s+]',' ',x),ingredients))
#ingredients=list(map(lambda x:re.sub(r' ','',x),ingredients))

#spell check

#ingredients=list(map(lambda x:spell(x),ingredients))
ingredients=list(filter(len,ingredients))

#allergens part
allergens=re.sub(r'[\[\]\(\)]',',',txt)
allergens=re.sub(r'and',',',allergens)

allergen_regex=r'(Contains|CONTAINS|May Contain|contain)(.*)'
allergens=re.search(allergen_regex,allergens).group(2)

allergens=allergens.split(',')

out_obj={"Nutrients":nutrient_out,"Ingredients":ingredients,"Allergens":allergens}

#print OUTPUT
pp = pprint.PrettyPrinter(indent=2)
pp.pprint(out_obj)