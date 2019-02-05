class HTTP_ERROR(Exception):
    def __init__(self, r):
        self.r = r

        self.msg = """Requested URL: {:s}
            Retrieved URL: {:s}
            HTTP Code: {:d}
            is_redirect = {:d}""".format(r.url, r.request.url, r.status_code, r.is_redirect)

        self.args = (self.msg, self.r)

    def __str__(self):
        print(self.msg)


class YFINANCE_ERROR(Exception):
    def __init__(self, yahooticker):
        self.msg = """Error parsing yahoo finance result for ticker {:s}""".format(yahooticker)
        self.args = (self.msg, )

    def __str__(self):
        print(self.msg)

class GFINANCE_ERROR(Exception):
    def __init__(self, ticker):
        self.msg = """Error parsing google finance result for ticker {:s}""".format(ticker)
        self.args = (self.msg, )

    def __str__(self):
        print(self.msg)

class FINANZENCH_ERROR(Exception):
    def __init__(self, ticker):
        self.msg = """Error parsing finanzen.ch result for ticker {:s}""".format(ticker)
        self.args = (self.msg, )

    def __str__(self):
        print(self.msg)

class FUNDINFO_ERROR(Exception):
    def __init__(self, ticker):
        self.msg = """Error parsing fundinfo.com result for ticker {:s}""".format(ticker)
        self.args = (self.msg, )

    def __str__(self):
        print(self.msg)

class ONVISTA_ERROR(Exception):
    def __init__(self, ticker):
        self.msg = """Error parsing onvista.de result for ticker {:s}""".format(ticker)
        self.args = (self.msg, )

    def __str__(self):
        print(self.msg)

class PARSEERROR(Exception):
    def __init__(self):
        self.msg = """Error parsing content."""
        self.args = (self.msg, )

    def __str__(self):
        print(self.msg)