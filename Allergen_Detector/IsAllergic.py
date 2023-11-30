ALLOWED_EXTENSION=set(['jpeg','png','jpg'])
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.',1)[1].lower() in ALLOWED_EXTENSION 

def compare_allergens(list1, list2):
    # Convert all elements to lowercase in both lists
    lower_list1 = [str(item).lower() for item in list1]
    lower_list2 = [str(item).lower() for item in list2]

    lower_list1=[element.replace(" ", "") for element in lower_list1]
    lower_list2=[element.replace(" ", "") for element in lower_list2]

    common_element=set(lower_list1) & set(lower_list2)
    return(bool(common_element))




