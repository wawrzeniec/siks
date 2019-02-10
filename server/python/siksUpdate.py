import watch
import sys

nErrors, errorLoc, errorDesc = watch.getAll()

if nErrors > 0:
    print('Errors occurred!')
    for i, (l, d) in enumerate(zip(errorLoc, errorDesc)):
        print('%d: %s [%s]' % (i, l, d))
    sys.exit(1)

sys.exit(0)