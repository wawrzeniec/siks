class HTTP_ERROR(Exception):
    def __init__(self, r):
        self.r = r

        self.message = """Requested URL: {:s}
            Retrieved URL: {:s}
            HTTP Code: {:d}
            is_redirect = {:d}""".format(r.url, r.request.url, r.status_code, r.is_redirect)

        self.args = (self.message, self.r)

    def __str__(self):
        return self.message

class YFINANCE_ERROR(Exception):
    def __init__(self, yahooticker):
        self.message = """Error parsing yahoo finance result for ticker {:s}""".format(yahooticker)
        self.args = (self.message, )

    def __str__(self):
        return self.message

class GFINANCE_ERROR(Exception):
    def __init__(self, ticker):
        self.message = """Error parsing google finance result for ticker {:s}""".format(ticker)
        self.args = (self.message, )

    def __str__(self):
        return self.message

class FINANZENCH_ERROR(Exception):
    def __init__(self, ticker):
        self.message = """Error parsing finanzen.ch result for ticker {:s}""".format(ticker)
        self.args = (self.message, )

    def __str__(self):
        return self.message

class FUNDINFO_ERROR(Exception):
    def __init__(self, ticker):
        self.message = """Error parsing fundinfo.com result for ticker {:s}""".format(ticker)
        self.args = (self.message, )

    def __str__(self):
        return self.message

class ONVISTA_ERROR(Exception):
    def __init__(self, ticker):
        self.message = """Error parsing onvista.de result for ticker {:s}""".format(ticker)
        self.args = (self.message, )

    def __str__(self):
        return self.message

class PARSEERROR(Exception):
    def __init__(self):
        self.message = """Error parsing content."""
        self.args = (self.message, )

    def __str__(self):
        return self.message