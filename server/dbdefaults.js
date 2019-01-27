// The default users
// The password for 'Demo' is "Demo"
const defaultusers = [
    {id: 1, username: 'Demo', emailaddress: '', hash: '$2b$10$SxjccZLjafQaY6jgUD.3eODNF9579yleFZlXutfMWl0XKtmNAeGEi'}
];

// The different types of securities
const types = ['Cash', 'Security', 'Other'];

// The various categories of each secuity 
const categories = {
    'Security': ['Stock', 'ETF', 'Fund'],
    'Other': ['Real estate']
};

// The various markets for each security is 
const markets = {
    'Security': {
        'Region': ['America', 'Europe', 'Asia'],
        'Country': ['USA', 'Canada', 'France', 'Germany', 'UK', 'Japan', 'China', 'Russia', 'India'],
        'Industry': ['Technology', 'Energy', 'Healthcare', 'IT', 
             'Telecommunications', 'Materials']
    }
};

// Default config
const defaultconfig = {
    currentuser: 1
};

module.exports = {
    defaultusers: defaultusers, 
    types: types, 
    categories: categories, 
    markets: markets, 
    defaultconfig: defaultconfig
};