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
    import datetime

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

    currencies = np.array([r[5] for r in rows])
    methods = np.array([r[6] for r in rows])
    secids = np.array([r[0] for r in rows])
    secnames = np.array([r[1] for r in rows])
    lastupdate = np.array([todate(r[9]) for r in rows])

    currenciesToWatch = []
    nowdate = datetime.datetime.now()

    for thismethods, thisid, thisname, thislast, thiscur in zip(methods, secids, secnames, lastupdate, currencies):
        try:
            dt = nowdate - thislast
            print('Last update for %s: %s' % (thisname, str(thislast)))
            print(dt)
            if dt > datetime.timedelta(0.9):
                print('Last update for %s [%s] ago. Re-queriying.' % (thisname, dt.__str__()))

                method = json.loads(thismethods)
                nmethods = len(method)
                order = permutation(range(nmethods))

                for i in range(nmethods):
                    try:
                        algo = method[order[i]]['methodid']
                        ticker = method[order[i]]['parameters']
                        print('Getting quote for %s [%s], method=%s' % (thisname, ticker, algo))
                        quote = getQuote(algo, ticker)
                        break
                    except Exception as e:
                        nErrors += 1
                        errorLoc.append('While getting quote for %s [%s], method [%s]' % (thisname, ticker, algo))
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

                try:
                    print('Setting last update time...')
                    db.execute('UPDATE securities SET lastupdate=:ts WHERE securityid=:id',
                               {"ts": ts, "id": thisid})
                except Exception as e:
                    nErrors += 1
                    errorLoc.append('While setting last update time for %s [%s] into DB' % (thisname, ticker))
                    errorDesc.append(str(e))
                    continue

                # If updated successfully, add currency to list of to-watch
                currenciesToWatch.append(thiscur)
                time.sleep(PAUSE_BETWEEN_REQUESTS)
            else:
                print('Last update for %s [%s] ago. Skipping.' % (thisname, dt.__str__()))

        except Exception as e:
            nErrors += 1
            errorLoc.append('While getting quote for %s [%s], method [%s]' % (thisname, ticker, algo))
            errorDesc.append(str(e))
            continue

    currencies = np.unique(np.array(currenciesToWatch))
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
            print(cur)
            db.execute('INSERT INTO currencies (symbol, timestamp, value) VALUES (:symbol, :ts, :quote)',
                       {"symbol": cur, "ts": ts, "quote": quote})
        except Exception as e:
            nErrors += 1
            errorLoc.append('While inserting quote for currency [%s] into DB' % cur)
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

def todate(str):
    import datetime
    try:
        return datetime.datetime.strptime(str, '%Y-%m-%d %H:%M:%S')
    except Exception as e:
        return datetime.datetime(1970, 1, 1)

