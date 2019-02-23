import watch
import sys

if len(sys.argv) > 1:
    dbname = sys.argv[1]
    watch.dbname = dbname

print('Starting checknew with db name %s' % watch.dbname)
nErrors, errorLoc, errorDesc = watch.checkNew()

if nErrors > 0:
    print('Errors occurred!')
    for i, (l, d) in enumerate(zip(errorLoc, errorDesc)):
        print('%d: %s [%s]' % (i, l, d))
    sys.exit(1)

sys.exit(0)