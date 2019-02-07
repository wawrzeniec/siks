from __future__ import print_function
import sys
import json
from error import GETQUOTE_ERROR

def getQuote(method, ticker):
    try:
        if method == 'gf' or method == "0":
            import gfinance as gf
            quote = gf.getQuote(ticker)
        elif method == 'yf' or method == "1":
            import yfinance as yf
            quote = yf.getQuote(ticker)
        elif method == 'fch' or method == "2":
            import finanzench as fc
            quote = fc.getQuote(ticker)
        elif method == 'ov' or method == "3":
            import onvista as ov
            quote = ov.getQuote(ticker)
        elif method == 'gcur' or method == "100":
            import gcurrency as gc
            quote = gc.getQuote(ticker)
        elif method == 'ycur' or method == "101":
            import ycurrency as yc
            quote = yc.getQuote(ticker)
        else:
            raise GETQUOTE_ERROR(method, ticker, "Unknown method=%s" % method)

        return quote

    except Exception as e:
        raise GETQUOTE_ERROR(method, ticker, str(e))

def getAll():
    import sqlite3
    import datetime
    import numpy as np
    nErrors = 0
    errorLoc = []
    errorDesc = []

    timestamp = getts()
    print('[%s] Starting getAll()' % timestamp)

    #0. Connects to the database
    try:
        db = sqlite3.connect('../db/siksdb.db')
    except Exception as e:
        raise Exception('Error opening database: [%s]' % str(e))

    #1. Gets the list of securities
    try:
        rows = db.execute('SELECT * from securities').fetchall
    except Exception as e:
        raise Exception('Error retrieving list of securities: [%s]' % str(e))
    nrows = len(rows)

    currencies = np.unique(np.array([r[5] for r in rows]))

    for cur in currencies:
        try:
            quote = updateCurrency(cur)
        except Exception as e:
            nErrors += 1
            errorLoc.append('While getting quote for currency [%s]' % cur)
            errorDesc.append(str(e))
            continue

        ts = getts()
        try:
            db.execute('INSERT INTO currencies (timestamp, value) VALUES (:ts, :quote)', {"ts": ts, "quote": quote})
        except Exception as e:
            nErrors += 1
            errorLoc.append('While inserting quote for currency [%s] into DB' % cur)
            errorDesc.append(str(e))
            continue


def updateCurrency(cur):
    pass

def updateSecurity(ticker, methods):
    pass

def ftime(tstamp):
    return tstamp.strftime('%Y-%m-%d %H:%M:%S')

def getts():
    import datetime
    return ftime(datetime.datetime.now())