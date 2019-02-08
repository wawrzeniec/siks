from __future__ import print_function
from error import GETQUOTE_ERROR

PAUSE_BETWEEN_REQUESTS = 2

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
    import numpy as np
    import json
    from numpy.random import permutation
    import time

    nErrors = 0
    errorLoc = []
    errorDesc = []

    timestamp = getts()
    print('[%s] Starting getAll()' % timestamp)

    #0. Connects to the database
    try:
        conn = sqlite3.connect('../db/siksdb.db')
        db = conn.cursor()
    except Exception as e:
        raise Exception('Error opening database: [%s]' % str(e))

    #1. Gets the list of securities
    try:
        rows = db.execute('SELECT * from securities').fetchall()
    except Exception as e:
        raise Exception('Error retrieving list of securities: [%s]' % str(e))
    nrows = len(rows)
    print('Found %d securities' % nrows)

    currencies = np.unique(np.array([r[5] for r in rows]))

    for cur in currencies:
        try:
            print('Getting quote for currency [%s]' % cur)
            quote = updateCurrency(cur)
            time.sleep(PAUSE_BETWEEN_REQUESTS)
        except Exception as e:
            nErrors += 1
            errorLoc.append('While getting quote for currency [%s]' % cur)
            errorDesc.append(str(e))
            continue

        ts = getts()
        try:
            print('Inserting data into DB...')
            db.execute('INSERT INTO currencies (timestamp, value) VALUES (:ts, :quote)', {"ts": ts, "quote": quote})
        except Exception as e:
            nErrors += 1
            errorLoc.append('While inserting quote for currency [%s] into DB' % cur)
            errorDesc.append(str(e))
            continue

    methods = np.unique(np.array([r[6] for r in rows]))
    secids = np.unique(np.array([r[0] for r in rows]))
    secnames = np.unique(np.array([r[1] for r in rows]))

    for thismethods, thisid, thisname in zip(methods, secids, secnames):
        try:
            method = json.loads(thismethods)
            nmethods = len(method)
            order = permutation(range(nmethods))

            for i in range(nmethods):
                try:
                    algo = method[order[i]]['methodid']
                    ticker = method[order[i]]['parameters']
                    print('Getting quote for %d [%s], method=%s' % (thisname, ticker, algo))
                    quote = getQuote(algo, ticker)
                    break
                except Exception as e:
                    nErrors += 1
                    errorLoc.append('While getting quote for %s [%s], method [%s]' % (thisname, ticker, algo))
                    errorDesc.append(str(e))
        except Exception as e:
            nErrors += 1
            errorLoc.append('While getting quote for [%s]' % ticker)
            errorDesc.append(str(e))
            continue

        ts = getts()
        try:
            print('Inserting data into DB...')
            db.execute('INSERT INTO history (securityid, timestamp, value) VALUES (:id, :ts, :quote)', {"id": thisid, "ts": ts, "quote": quote})
        except Exception as e:
            nErrors += 1
            errorLoc.append('While inserting quote for %s [%s] into DB' % (thisname, ticker))
            errorDesc.append(str(e))
            continue

    print('getAll() terminated. Committing and closing DB.')
    conn.commit()
    db.close()

    return nErrors, errorLoc, errorDesc

def updateCurrency(cur):
    from numpy.random import permutation

    methods = ['gcur', 'ycur']
    nmethods = len(methods)

    order = permutation(range(nmethods))

    quote = None

    for i in range(nmethods):
        try:
            quote = getQuote(methods[order[i]], cur)
        except Exception as e:
            pass
        break

    if quote is None:
        raise Exception('While updating currency %s' % cur)

    return quote

def updateSecurity(ticker, methods):
    pass

def ftime(tstamp):
    return tstamp.strftime('%Y-%m-%d %H:%M:%S')

def getts():
    import datetime
    return ftime(datetime.datetime.now())