import requests
from error import CURRENCY_ERROR, PARSEERROR, HTTP_ERROR
from shttp import retrieveURL


def makeQueryURL(currency):
    url = 'https://finance.yahoo.com/quote/' + currency + 'CHF=x/'
    return url

def parseURL(content):
    import re
    import numpy as np
    from yfinance import parseNumber

    toks = re.findall(r'<span.*?Fz\((\d+)px\).*?>(\d{0,3})(\D{0,3})(\d{0,3})(\D{0,3})(\d{0,5}).*?</span>', content,
                      re.UNICODE)
    if len(toks) > 0:
        sizes = [int(x[0]) for x in toks]
        values = [''.join(x[1:]).replace(',', '') for x in toks]
        squote = values[np.argmax(sizes)]
        quote = parseNumber(squote)
    else:
        raise PARSEERROR()

    return float(quote)


def getQuote(currency):
    url = makeQueryURL(currency)
    content = retrieveURL(url)
    try:
        quote = parseURL(content)
    except PARSEERROR:
        raise CURRENCY_ERROR(currency)

    return float(quote)




