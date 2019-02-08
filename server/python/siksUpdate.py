import watch
import sys

nErrors, errorLoc, errorDesc = watch.getAll()

if nErrors > 0:
    print('Errors occurred!')
    sys.exit(1)

sys.exit(0)