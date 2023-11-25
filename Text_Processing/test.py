from text_processing import process_text
import pprint

txt=open("OCR_TEXT.txt").read()

pp = pprint.PrettyPrinter(indent=2)
pp.pprint(process_text(txt))