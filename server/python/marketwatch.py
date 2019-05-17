import requests
from error import MARKETWATCH_ERROR, PARSEERROR, HTTP_ERROR
from shttp import retrieveURL


def makeQueryURL(ticker, countrycode=None):
    url = 'https://www.marketwatch.com/investing/stock/' + ticker
    if countrycode is not None:
        url += '?countrycode=' + countrycode
    return url

def parseURL(content):
    import re

    # this doesn't work anymore...
    # toks = re.findall('<b>([0-9]+\.[0-9]+)</b>', content)

    toks = re.findall('<span class="value">(\d{0,3})\D{0,3}(\d{1,3}[\.\,]\d{0,3})</span>', content, re.UNICODE)
    if len(toks) == 0:
        toks = re.findall('<bg-quote class="value"[^>]*?>(\d{0,3})\D{0,3}(\d{1,3}[\.\,]\d{0,3})</bg-quote>', content, re.UNICODE)

    if len(toks) > 0:
        quote = ''.join(toks[0]).replace(',', '')
    else:
        raise PARSEERROR

    return quote


def getQuote(ticker, countrycode=None):
    url = makeQueryURL(ticker, countrycode)
    content = retrieveURL(url)
    try:
        quote = parseURL(content)
    except PARSEERROR:
        raise MARKETWATCH_ERROR(ticker)

    return float(quote)


