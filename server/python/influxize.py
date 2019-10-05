#! /usr/bin/python3

from __future__ import print_function
import os
import numpy as np
import datetime
from influxdb import InfluxDBClient
import sqlite3

dbpath = '../db'
dbname = 'siksdb.db'

#0. Connects to the databases
print('Connecting to databases')
try:
    client = InfluxDBClient(host='localhost', port=8086, username='siks', password='siks')
    client.switch_database('siks')
except Exception as e:
    raise Exception('Error opening InfluxDB database: [%s]' % str(e))

try:
    conn = sqlite3.connect(os.path.join(dbpath, dbname))
    db = conn.cursor()
except Exception as e:
    raise Exception('Error opening SQLite database: [%s]' % str(e))

# 1. Queries all historical data from sqlite and dumps it into influx
print('Dumping points...')
query = 'SELECT * FROM history'
nwritten = 0
for row in db.execute(query):
    # The schema is "securityid", "timestamp", "value"
    securityid = row[0]
    timestamp = row[1]
    value = row[2]
    point = [
    {
        "measurement": "history",
        "tags": {
            "securityid": securityid,
        },
        "time": timestamp,
        "fields": {
            "value": value
        }
    }]

    client.write_points(point)

    nwritten += 1
    if not nwritten % 100:
        print('Wrote {:d} points'.format(nwritten))

db.close()

print('Done.')
