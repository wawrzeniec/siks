import yfinance as yf
import shttp as ht
import gfinance as gf

url = yf.makeQueryURL('GOOG')
r = ht.retrieveURL(url)
ss = [ht.retrieveURL(x) for x in ht.getStyleSheets(r)]

ss = [removeComments(x) for x in ss]

def findFontSizeStyles(content):
    import re


def removeComments(x):
    import re

    y = re.sub('/\*.*?\*/', '', x, re.DOTALL | re.MULTILINE | re.UNICODE)
    return y

def findFontSizes(x):
    import re

    y = re.findall('([^{]*?){[^}]*?font-size:\s*?(\d+)([^;}\n]+).*?}', x,  re.DOTALL | re.UNICODE | re.MULTILINE)
    return y


###########
style = """

abc {
    width: 50px;
    height: 20px;
    font-size: 20px;
    display: inline
    }

def {
    width: 20px;
    font-size: 4px;
    }

ghi { width: 12px }
"""


