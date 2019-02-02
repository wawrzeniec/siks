from config import (HTTP_TIMEOUT, MAX_HTTP_REQUESTS, SLEEP_BETWEEN_REQUESTS)
from error import HTTP_ERROR
import time
import requests

headers={'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0'}

def retrieveURL(url):
    trials = 0
    retrieved = False
    while trials < MAX_HTTP_REQUESTS:
        try:
            r = requests.get(url, timeout=HTTP_TIMEOUT, headers=headers)
            retrieved = True
        except Exception:
            pass

        if retrieved:
            if r.status_code != 200:
                trials += 1
            elif r.url != r.request.url:
                trials += 1
            elif r.is_redirect:
                trials += 1
            else:
                return r.content.decode(errors='replace')
        else:
            trials += 1

        time.sleep(SLEEP_BETWEEN_REQUESTS)

    raise HTTP_ERROR(r)

def getStyleSheets(content):
    # This finds all the style sheets in the HTML content
    from bs4 import BeautifulSoup as BS
    bs = BS(content)
    return [x.get('href') for x in bs.find_all('link') if 'stylesheet' in x.get('rel')]

# Have a look at tinycss2 for parsing the stylesheets