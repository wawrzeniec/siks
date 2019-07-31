from __future__ import print_function
from error import GETQUOTE_ERROR
import os
import numpy as np
import datetime

PAUSE_BETWEEN_REQUESTS = 2

dbpath = '../db'
dbname = 'siksdb.db'

query_interval_in_hours = 6
query_frequency_in_timedelta = datetime.timedelta(query_interval_in_hours/24.0)

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
        elif method == 'mw' or method == "4":
            import marketwatch as mw
            quote = mw.getQuote(ticker)
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

def getAll(securityid=None):
    import sqlite3
    import numpy as np
    import json
    from numpy.random import permutation
    import time
    import datetime
    from assets import currencySymbol, currencyName

    nErrors = 0
    errorLoc = []
    errorDesc = []

    timestamp = getts()
    print('[%s] Starting getAll()' % timestamp)

    #0. Connects to the database
    try:
        conn = sqlite3.connect(os.path.join(dbpath, dbname))
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
    types = np.array([r[2] for r in rows])
    secids = np.array([r[0] for r in rows])
    secnames = np.array([r[1] for r in rows])
    lastupdate = np.array([todate(r[9]) for r in rows])

    currenciesToWatch = []
    currenciesWatched = []
    nowdate = datetime.datetime.now()

    # First inserts the currencies if not yet watched
    for thismethods, thisid, thisname, thislast, thiscur, thistype in zip(methods, secids, secnames, lastupdate, currencies, types):
            currenciesToWatch.append(thiscur)
            if thistype == 1:
                currenciesWatched.append(thiscur)

    currenciesToInsert = np.unique(np.array(currenciesToWatch))
    currenciesToInsert = np.setdiff1d(currenciesToInsert, np.array(currenciesWatched))
    currencyInserted = False
    for cur in currenciesToInsert:
        try:
            name = currencyName[currencySymbol == cur][0]
            curmethods = '[{"methodid":"gcur","parameters":"%s"},{"methodid":"ycur","parameters":"%s"}]' % (cur, cur)
            print('Currency %s [%s] not yet watched. Adding to asset list.' % (cur, name))
            db.execute('INSERT INTO securities (identifier, typeid, currency, methods, watch) VALUES (:id, 1, :cur, :methods, 1)',
                       {"id": name, "cur": cur, "methods": curmethods})
            currencyInserted = True
        except Exception as e:
            nErrors += 1
            errorLoc.append('While inserting currency %s into securities DB' % cur)
            errorDesc.append(str(e))
            continue

    print('Finished checking currencies')
    conn.commit()
    # Commits and re - fetches the data
    if currencyInserted:
        try:
            rows = db.execute('SELECT * from securities').fetchall()
        except Exception as e:
            raise Exception('Error retrieving list of securities: [%s]' % str(e))
        nrows = len(rows)
        print('Found %d securities' % nrows)

        currencies = np.array([r[5] for r in rows])
        methods = np.array([r[6] for r in rows])
        types = np.array([r[2] for r in rows])
        secids = np.array([r[0] for r in rows])
        secnames = np.array([r[1] for r in rows])
        lastupdate = np.array([todate(r[9]) for r in rows])

    # Updates all the security entries
    if securityid is None:
        securityid = np.unique(secids)

    for thismethods, thisid, thisname, thislast, thiscur, thistype in zip(methods, secids, secnames, lastupdate, currencies, types):
        if thisid in securityid:
            try:
                if thisname == 'Swiss Franc':
                    checkCHF(db, thisid, getts())
                else:
                    dt = nowdate - thislast
                    print(dt)
                    if dt > query_frequency_in_timedelta:
                        print('Last update for %s [%s] ago. Re-queriying.' % (thisname, dt.__str__()))

                        method = json.loads(thismethods)
                        print(method)
                        nmethods = len(method)
                        print(nmethods)
                        order = permutation(range(nmethods))
                        print(order)
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
                            print(errorloc[-1])
                            print(errorDesc[-1])
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

                        time.sleep(PAUSE_BETWEEN_REQUESTS)
                    else:
                        print('Last update for %s [%s] ago. Skipping.' % (thisname, dt.__str__()))

            except Exception as e:
                nErrors += 1
                errorLoc.append('While getting quote for %s' % thisname)
                errorDesc.append(str(e))
                continue

    print('getAll() terminated. Committing and closing DB.')
    conn.commit()
    db.close()

    timestamp = getts()
    print('[%s] Returning from getAll()' % timestamp)

    return nErrors, errorLoc, errorDesc

def checkCHF(db, id, timestamp):
    print('Checking if CHF [%s] is in history...' % id)
    row = db.execute('SELECT 1 FROM history WHERE securityid=:id', {"id": id}).fetchone()
    if row:
        print('Already in.')
        return
    else:
        print('Nope. Adding...')
        db.execute('INSERT INTO history (securityid, timestamp, value) VALUES (:id, :ts, 1)',
               {"id": id, "ts": timestamp})

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


def currenciesToSecurities():
    import sqlite3
    import numpy as np
    import json
    from numpy.random import permutation
    import time
    import datetime
    from assets import currencySymbol, currencyName

    nErrors = 0
    errorLoc = []
    errorDesc = []

    timestamp = getts()
    print('[%s] Starting getAll()' % timestamp)

    # 0. Connects to the database
    try:
        conn = sqlite3.connect(os.path.join(dbpath, dbname))
    except Exception as e:
        raise Exception('Error opening database: [%s]' % str(e))

    with conn:
        db = conn.cursor()
        # 1. Gets the list of securities
        try:
            rows = db.execute('SELECT * from securities').fetchall()
        except Exception as e:
            raise Exception('Error retrieving list of securities: [%s]' % str(e))
        nrows = len(rows)
        print('Found %d securities' % nrows)

        currencies = np.array([r[5] for r in rows])
        methods = np.array([r[6] for r in rows])
        types = np.array([r[2] for r in rows])
        secids = np.array([r[0] for r in rows])
        secnames = np.array([r[1] for r in rows])
        lastupdate = np.array([todate(r[9]) for r in rows])

        currenciesToWatch = []
        currenciesWatched = []
        nowdate = datetime.datetime.now()

        # First inserts the currencies if not yet watched
        for thismethods, thisid, thisname, thislast, thiscur, thistype in zip(methods, secids, secnames, lastupdate,
                                                                              currencies, types):
            currenciesToWatch.append(thiscur)
            if thistype == 1:
                currenciesWatched.append(thiscur)

        currenciesToInsert = np.unique(np.array(currenciesToWatch))
        currenciesToInsert = np.setdiff1d(currenciesToInsert, np.array(currenciesWatched))
        currencyInserted = False
        print('to Insert: %s' % str(currenciesToInsert))
        for cur in currenciesToInsert:
            try:
                name = currencyName[currencySymbol == cur][0]
                curmethods = '[{"methodid":"gcur","parameters":"%s"},{"methodid":"ycur","parameters":"%s"}]' % (
                cur, cur)
                print('Currency %s [%s] not yet watched. Adding to asset list.' % (cur, name))
                db.execute(
                    'INSERT INTO securities (identifier, typeid, currency, methods, watch) VALUES (:id, 1, :cur, :methods, 1)',
                    {"id": name, "cur": cur, "methods": curmethods})
                currencyInserted = True
            except Exception as e:
                nErrors += 1
                errorLoc.append('While inserting currency %s into securities DB' % cur)
                errorDesc.append(str(e))
                continue

        print('Finished checking currencies')
        conn.commit()
        # Commits and re - fetches the data
        if currencyInserted:
            try:
                rows = db.execute('SELECT * from securities').fetchall()
            except Exception as e:
                raise Exception('Error retrieving list of securities: [%s]' % str(e))
            nrows = len(rows)
            print('Found %d securities' % nrows)

            currencies = np.array([r[5] for r in rows])
            methods = np.array([r[6] for r in rows])
            types = np.array([r[2] for r in rows])
            secids = np.array([r[0] for r in rows])
            secnames = np.array([r[1] for r in rows])
            lastupdate = np.array([todate(r[9]) for r in rows])

        # Now we read the currencies table and write it back to the history table
        names = currencies[types == 1]
        ids = secids[types == 1]
        for n, id in zip(names, ids):
            print('Getting currency data for %s, %s' % (n, id))
            rows = db.execute('SELECT timestamp, value FROM currencies WHERE symbol=:name', {'name': n}).fetchall()
            for k in rows:
                print('Inserting row')
                db.execute('INSERT INTO history (securityid, timestamp, value) VALUES (:id, :ts, :val)',
                           {'id': id, 'ts': k[0], 'val': k[1]})

        print('All done, dropping currencies table...')
        db.execute('DROP TABLE currencies');

        print('Committing and closing DB.')

    conn.commit()
    db.close()

    return nErrors, errorLoc, errorDesc

def checkNew():
    import sqlite3
    import numpy as np
    import datetime
    from assets import currencySymbol, currencyName

    nErrors = 0
    errorLoc = []
    errorDesc = []

    timestamp = getts()
    print('[%s] Starting checkNew()' % timestamp)

    # 0. Connects to the database
    try:
        print(os.getcwd())
        dbfile = os.path.join(dbpath, dbname)
        print(dbfile)
        conn = sqlite3.connect(dbfile)
        db = conn.cursor()
    except Exception as e:
        raise Exception('Error opening database %s: [%s]' % (dbfile, str(e)))

    # 1. Gets the list of securities
    try:
        # NICE query but this is not necessary
        # stmt = 'SELECT securityid, mt FROM (SELECT securityid, max(timestamp) AS mt FROM securities LEFT JOIN history USING(securityid) GROUP BY securityid) WHERE mt IS NULL'
        stmt = 'SELECT securityid FROM securities WHERE lastupdate IS NULL'
        rows = db.execute(stmt).fetchall()
    except Exception as e:
        raise Exception('Error retrieving unwatched securities: [%s]' % str(e))
    nrows = len(rows)
    print('Found %d securities' % nrows)

    conn.close()

    if nrows > 0:
        securityid = [r[0] for r in rows]
        nErrors, errorLoc, errorDesc = getAll(securityid=securityid)
        return nErrors, errorLoc, errorDesc
    else:
        return 0, [], []
