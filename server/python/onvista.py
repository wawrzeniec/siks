import requests
from error import FINANZENCH_ERROR, PARSEERROR
from shttp import retrieveURL


def makeQueryURL(ticker):
    url = 'https://www.onvista.de/suche/?onvHeaderSearchBoxAction=true&doSubmit=Suchen&searchValue=' + ticker
    return url

def parseURL(content):
    import re

    # this doesn't work anymore...
    # toks = re.findall('<b>([0-9]+\.[0-9]+)</b>', content)

    toks = re.findall('<span\s+?class="price"[^>]*?>(\d{0,3})\D{0,3}(\d{1,3}[\.\,]\d{0,3})', content,
                      re.UNICODE)

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
        raise ONVISTA_ERROR(ticker)

    return float(quote)


