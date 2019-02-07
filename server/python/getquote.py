from __future__ import print_function
import sys
from watch import getQuote
from error import GETQUOTE_ERROR

method = sys.argv[1]
ticker = sys.argv[2]

try:
    quote = getQuote(method, ticker)
    print('{"status": 200, "data":%g}' % quote, file=sys.stdout)
    sys.exit(0)

except GETQUOTE_ERROR as e:
    print('{"status": 500, "reason": "%s", "err": "%s"}' %
          (e.message, e.reason), file=sys.stderr)
    sys.exit(1)
