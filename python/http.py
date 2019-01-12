from config import (HTTP_TIMEOUT, MAX_HTTP_REQUESTS, SLEEP_BETWEEN_REQUESTS)
from error import HTTP_ERROR
import time
import requests

def retrieveURL(url):
    trials = 0
    retrieved = False
    while trials < MAX_HTTP_REQUESTS:
        try:
            r = requests.get(url, timeout=HTTP_TIMEOUT)
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
