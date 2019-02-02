import requests
from error import GFINANCE_ERROR, PARSEERROR
from shttp import retrieveURL


def makeQueryURL(ticker):
    url = 'https://www.google.com/search?q=' + ticker
    return url

def parseGoogleURL(content):
    import re

    # this doesn't work anymore...
    # toks = re.findall('<b>([0-9]+\.[0-9]+)</b>', content)

    toks = re.findall('<span class="[^"]+">(\d{0,3})\D{0,3}(\d{1,3}[\.\,]\d{0,3})</span>', content, re.UNICODE)

    if len(toks) > 0:
        quote = ''.join(toks[0]).replace(',', '.')
    else:
        raise PARSEERROR

    return quote


def getQuote(ticker):
    url = makeQueryURL(ticker)
    content = retrieveURL(url)
    try:
        quote = parseGoogleURL(content)
    except PARSEERROR:
        raise GFINANCE_ERROR(ticker, market)

    return float(quote)


