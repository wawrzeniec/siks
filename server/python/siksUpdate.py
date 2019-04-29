import watch
import sys

nErrors, errorLoc, errorDesc = watch.getAll()

if nErrors > 0:
    print('Errors occurred!')
    for i, (l, d) in enumerate(zip(errorLoc, errorDesc)):
        print('%d: %s [%s]' % (i, l, d))
    
    # Sends email
    import autoTaskReport as at
    import datetime
    r = at.autoTaskReport(recipient='autotaskreport@gmail.com')
    body = '<html><body><h2>SIKS report {:s}</h2>'.format(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    body += '<h3>{:d} errors occurred</h3>'.format(len(errorLoc))
    body += '<table border=1><tr><th>No</th><th>Location</th><th>Error</th></tr>'
    for i, (l, d) in enumerate(zip(errorLoc, errorDesc)):
        body += '<tr><td>{:d}</td><td>{:s}</td><td>{:s}</td></tr>'.format(i, l, d)
    body += '</table></body></html>'
    subject = 'SIKS report {:s} - {:d} errors'.format(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), len(errorLoc))
    r.send(body, subject=subject)
    sys.exit(1)

sys.exit(0)
