import requests
from error import GFINANCE_ERROR, PARSEERROR, HTTP_ERROR
from shttp import retrieveURL


def makeQueryURL(currency):
    url = 'https://www.google.com/search?q=' + currency + 'CHF'
    return url

def parseURL(content):
    import re

    # this doesn't work anymore...
    # toks = re.findall('<b>([0-9]+\.[0-9]+)</b>', content)

    toks = re.findall('<span.*?data-value="([\d\.]+)"', content)

    if len(toks) > 0:
        quote = ''.join(toks[0]).replace(',', '.')
    else:
        raise PARSEERROR

    return quote


def getQuote(currency):
    url = makeQueryURL(currency)
    content = retrieveURL(url)
    try:
        quote = parseURL(content)
    except PARSEERROR:
        raise GFINANCE_ERROR(currency)

    return float(quote)


