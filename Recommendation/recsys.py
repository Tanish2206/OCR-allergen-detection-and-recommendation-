# -*- coding: utf-8 -*-
CSV_PATH="..\\Recommendation\\new.csv"

#Basic Libraries
import numpy as np
import pandas as pd

#Visualization Libraries
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px

#Text Handling Libraries
import re
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.metrics.pairwise import linear_kernel, cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer




def get_recommendations_1(s):
    df=pd.read_csv(CSV_PATH)
    df=df.dropna()
    # s='sugar,cashew pieces,almond Pieces, stabilizers,artificial flavouring substances cardamom,honey,saffron,colour,Milk'
    df2=pd.DataFrame({'brand':['0'],'categories':['0'],'features.value':[s],'manufacturer':['0'],'name':['0']})
    df=pd.concat([df,df2])
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['features.value'])
    tfidf_matrix.shape

    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)
    cosine_sim

    indices = pd.Series(df.index, index=df['features.value']).drop_duplicates()
    recommend_product_list=[]
    

    idx = len(df)-1
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:11]
    movie_indices = [i[0] for i in sim_scores]
    print(movie_indices)
    for i in movie_indices:
        recommend_product_dict={}
        recommend_product_dict['name']=df['name'].iloc[i]
        recommend_product_dict['Ingredients']=df['features.value'].iloc[i]
        recommend_product_dict['Category']=df['categories'].iloc[i]
        recommend_product_dict['Manufacturer']=df['manufacturer'].iloc[i]
        recommend_product_list.append(recommend_product_dict)
    return recommend_product_list
