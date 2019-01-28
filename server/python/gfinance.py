import requests
from error import GFINANCE_ERROR, PARSEERROR
from http import retrieveURL


def makeQueryURL(ticker, market):
    url = 'https://www.google.com/search?q=' + market + '%3A' + ticker
    return url

def parseGoogleURL(content):
    import re

    toks = re.findall('<b>([0-9]+\.[0-9]+)</b>', content)
    if len(toks) > 0:
        quote = toks[0]
    else:
        raise PARSEERROR

    return quote


def getQuote(ticker, market):
    url = makeQueryURL(ticker, market)
    content = retrieveURL(url)
    try:
        quote = parseGoogleURL(content)
    except PARSEERROR:
        raise GFINANCE_ERROR(ticker, market)

    return float(quote)


