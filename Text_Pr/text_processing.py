import re
from autocorrect import Speller
spell = Speller(lang='en')

##NUTRIENTS

def process_text(txt):

    nutrition_pat={
        "Calories":r'(?<=Calories)[\s.,\(\)|a-zA-Z]*(\d+.{0,1}\d*\w{0,2})',
        "Energy":r'(?<=Energy)[\s.,\(\)\|a-zA-Z]*(\d+.{0,1}\d*\w{0,2})',
        "Sodium":r'(?<=Sodium)[\s.,\(\)\|a-zA-Z]*(\d+.{0,1}\d*\w{0,2})',
        "TotalFat":r'(?<=Total Fat)[\s.,\(\)\|a-zA-Z]*(\d+.{0,1}\d*\w{0,2})',
        "SaturatedFat":r'(?<=Saturated Fat)[\s.,\(\)\|a-zA-Z]*(\d+.{0,1}\d*\w{0,2})',
        "TransFat":r'(?<=Trans Fat)[\s.,\(\)\|a-zA-Z]*(\d+.{0,1}\d*\w{0,2})',
        "Cholesterol":r'(?<=Cholesterol)[\s.,\(\)\|a-zA-Z]*(\d+.{0,1}\d*\w{0,2})',
        "TotalCarb":r'(?<=Total Carb)[\s.,\(\)\|a-zA-Z]*(\d+.{0,1}\d*\w{0,2})',
        "Carbohydrate":r'(?<=Carbohydrate)[\s.,\(\)\|a-zA-Z]*(\d+.{0,1}\d*\w{0,2})',
        "Calcium":r'(?<=Calcium)[\s.,\(\)\|a-zA-Z]*(\d+.{0,1}\d*\w{0,2})',
        "Protein":r'(?<=Protein)[\s.,\(\)\|a-zA-Z]*(\d+.{0,1}\d*\w{0,2})',
        "Sugars":r'(?<=Sugars)[\s.,\(\)\|a-zA-Z]*(\d+.{0,1}\d*\w{0,2})'
    }

    #txt=open("OCR_TEXT.txt").read()

    nutrient_out={}

    for pat in nutrition_pat:

        tt=None   
        for i in txt.split("\n"):
        
            i=re.sub(r'\(.*\)','',i)
            i=re.sub(r'[^\w.]',' ',i)

            pp=re.compile(nutrition_pat[pat])
            res=re.search(pp,i)
            if res:
                tt=res.group(1)
        
        if tt:
            tt=re.sub(r'[^\d.]','',tt)
        nutrient_out[pat]=tt


    if nutrient_out["Energy"]:
        nutrient_out["Calories"]=nutrient_out["Energy"]
        del nutrient_out["Energy"]


    ##INGREDIENTS

    ingredients=re.sub(r'[^\w,. ]',' ',txt)
    ingredients=re.sub(r'[\d]+\.*[\d]*',',',ingredients)
    ingredients=re.sub(r'and',',',ingredients)
    ingredients=re.sub(r'from|From','',ingredients)
    ingredients=re.sub(r'[ ]+',' ',ingredients)

    ingredients_regex=r'(Ingredients|INGREDIENTS|ingredients):*([\w\[\]\(\),\s]*)[\n]*'
    res=re.search(ingredients_regex,ingredients)
    ingredients=[]

    for i in list(range(1,3))[::-1]:
        try:
            ingredients=res.group(i)
            break
        except:
            continue

    if ingredients:
        ingredients=ingredients.split(",")
        ingredients=list(map(lambda x:re.sub(r'[\s+]',' ',x),ingredients))

        #spell check
        #ingredients=list(map(lambda x:spell(x),ingredients))
        ingredients=list(filter(len,ingredients))
        ingredients=list(filter(lambda x:not re.match(r'[ ]+$',x),ingredients))

    #allergens part
    allergens=re.sub(r'[\[\]\(\)]',',',txt)
    allergens=re.sub(r'and',',',allergens)

    allergen_regex=r'(Contains|CONTAINS|May Contain|contain)(.*)'
    res=re.search(allergen_regex,allergens)
    allergens=[]

    for i in range(1,3)[::-1]:
        try:
            allergens=res.group(i)    
            break
        except:
            continue

    if allergens:
        allergens=allergens.split(',')
        allergens=list(map(lambda x:re.sub('[\W]','',x),allergens))

    out_obj={"Nutrients":nutrient_out,"Ingredients":ingredients,"Allergens":allergens}

    #print OUTPUT
    # pp = pprint.PrettyPrinter(indent=2)
    # pp.pprint(out_obj)

    return out_obj