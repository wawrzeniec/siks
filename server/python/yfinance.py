import requests
from shttp import retrieveURL
from error import YFINANCE_ERROR, PARSEERROR, HTTP_ERROR

# yahooticker='IUSC.SW'

def makeQueryURL(yahooticker):
    url = 'https://finance.yahoo.com/quote/' + yahooticker
    return url

def getQuote(yahooticker):
    url = makeQueryURL(yahooticker)
    content = retrieveURL(url)
    try:
        quote = parseYahooURL(content)
    except PARSEERROR:
        raise YFINANCE_ERROR(yahooticker)
    return quote

def parseYahooURL(content):
    import re
    import numpy as np

    # This doesn't work anymore...
    # toks = re.findall('Trsdu[^>]+>([0-9\.]+)</span>', content)

    # This works but will break if they change the react-id="35"
    # toks = re.findall('<span.*?"35">(\d{0,3})\D{0,3}(\d{1,3}[\.\,]\d{0,3})</span>', content, re.UNICODE)
    # if len(toks) > 0:
    #     quote = ''.join(toks[0]).replace(',', '.')
    # else:
    #     raise PARSEERROR()
    # return float(quote)

    # This should be a bit more reliable as it extracts the number with the largest
    # Fx(**px) class which sets the font size
    toks = re.findall(r'<span.*?Fz\((\d+)px\).*?>(\d{0,3})(\D{0,3})(\d{0,3})(\D{0,3})(\d{0,3}).*?</span>', content, re.UNICODE)
    if len(toks) > 0:
        sizes = [int(x[0]) for x in toks]
        values = [''.join(x[1:]).replace(',', '') for x in toks]
        squote = values[np.argmax(sizes)]
        quote = parseNumber(squote)
    else:
        raise PARSEERROR()

    return float(quote)

def parseNumber(x):
    import re
    toks = re.findall('(\d{0,3})\D{0,3}(\d{1,3}[.,]\d{0,3})', x)
    if len(toks) > 0:
        return ''.join(toks[0])
    else:
        raise PARSEERROR