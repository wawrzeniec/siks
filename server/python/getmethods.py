import sys

methods = {
  'Stock': [
    ['gf', 'Google finance', 'Google finance ticker'],
    ['yf', 'Yahoo finance', 'Yahoo finance ticker'],
    ['mw', 'Marketwatch', 'Matketwatch ticker']
  ],
  'ETF': [
    ['gf', 'Google finance', 'Google finance ticker'],
    ['yf', 'Yahoo finance', 'Yahoo finance ticker'],
    ['mw', 'Marketwatch', 'Matketwatch ticker']
  ],
  'Fund': [
    ['fch', 'Finanzen.ch', 'Valor or ISIN'],
    ['ov', 'Onvista.de', 'ISIN']
  ]
}

sys.stdout(str(methods))
