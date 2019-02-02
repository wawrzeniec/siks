from __future__ import print_function
import sys
import json

method = sys.argv[1]
ticker = sys.argv[2]

try:
    if method == 'gf' or method == "0":
        import gfinance as gf
        quote = gf.getQuote(ticker)
    elif method == 'yf' or method == "1":
        import yfinance as yf
        quote = yf.getQuote(ticker)
    else:
        print('{"status": 500, "reason": "Unknown method=%s"' %
        method, file=sys.stderr)
        sys.exit(1)

    print ('{"status": 200, "data":%g}' % quote, file=sys.stdout)
    sys.exit(0)

except Exception as e:
    print ('{"status": 500, "reason": "Error occurred while getting quote for %s, method=%s", "err": "%s"' % (method, ticker, str(e)), file=sys.stderr)
    sys.exit(1)

