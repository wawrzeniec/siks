import requests
from http import retrieveURL
from error import YFINANCE_ERROR, PARSEERROR, HTTP_ERROR

# yahooticker='IUSC.SW'

marketsymbol = {'SWX': '.SW',
                'NASDAQ': '',
                'NYSE': '',
                'LSE': '.L',
                'ENX': '.NX',
                'ETR': '.DE',
                'FRA': '.F',
                'VTX': '.VX',

                }

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

    toks = re.findall('Trsdu[^>]+>([0-9\.]+)</span>', content)
    if len(toks) > 0:
        quote = toks[0]
    else:
        raise PARSEERROR()

    return float(quote)