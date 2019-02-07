import requests
from error import FUNDINFO_ERROR, PARSEERROR
from shttp import retrieveURL


def makeQueryURL(ticker):
    url = 'https://www.fundinfo.com/fr/product/' + ticker
    return url

def parseURL(content):
    import re

    # this doesn't work anymore...
    # toks = re.findall('<b>([0-9]+\.[0-9]+)</b>', content)

    toks = re.findall('<table class=.*?pricebox[^>]*?>.*?tr.*?th.*?(\d{0,3})\D{0,3}(\d{1,3}[\.\,]\d{0,3})', content,
                      re.UNICODE | re.DOTALL)

    if len(toks) > 0:
        quote = ''.join(toks[0]).replace(',', '.')
    else:
        raise PARSEERROR

    return quote


def getQuote(ticker):
    url = makeQueryURL(ticker)
    content = retrieveURL(url)
    try:
        quote = parseURL(content)
    except PARSEERROR:
        raise FINANZENCH_ERROR(ticker)

    return float(quote)


