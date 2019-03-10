const sqlite3 = require('sqlite3');

function getSummary(db, session, callback) {
    console.log('Getting summary');

    const stmt = `
    SELECT identifier, number, intrinsicvalue, currency, intrinsicvalue*currencyvalue AS chfvalue, securityid, typeid, typename FROM (
        SELECT * FROM (
            SELECT * FROM (
                SELECT * FROM (
                    SELECT securityid, number, number*value AS intrinsicvalue FROM (
                        SELECT securityid, SUM(number) AS number FROM 
                            investments 
                        WHERE userid=$userid
                        GROUP BY securityid
                    ) 
                    JOIN (
                    SELECT securityid, value, MAX(timestamp) FROM 
                        history 
                    GROUP BY securityid
                    ) USING(securityid)
                )
                JOIN (
                SELECT 
                    securityid, identifier, currency, typeid 
                FROM 
                    securities
                ) 
                USING (securityid)
            )
            JOIN (
            SELECT 
                securityid AS currencyid, currency 
            FROM 
                securities 
            WHERE typeid=1
            ) 
            USING(currency)
        )
        JOIN (
        SELECT 
            securityid AS currencyid, value AS currencyvalue, MAX(timestamp) AS timestamp 
        FROM 
            history 
        GROUP BY 
            securityid
        ) 
        USING(currencyid)
    )
    JOIN 
        types 
    USING (typeid)`

    db.all(stmt, {
        $userid: session.userid
        }, (err, rows) => {
        if (err) {
            return callback({
                status: 500,
                reason: 'failed to get summary FROM DB',
                err: err
            });
        }
        else {
            // Formats the data for the front-end
            data = {
                total: 0,
                identifier: [],
                securityid: [],
                number: [],
                value: [],
                currency: [],
                typeid: [],
                typename: []
            }
            for (d in rows) {
                if (rows[d].typeid == 1) {
                    data.total += rows[d].intrinsicvalue;
                    data.value.push(rows[d].intrinsicvalue);
                }
                else {
                    data.total += rows[d].chfvalue;
                    data.value.push(rows[d].chfvalue);
                }
                data.identifier.push(rows[d].identifier);
                data.securityid.push(rows[d].securityid);
                data.number.push(rows[d].number);     
                data.typeid.push(rows[d].typeid);
                data.typename.push(rows[d].typename);
                data.currency.push(rows[d].currency)
            }
            return callback({
                status: 200,
                data: data
            })
        }
    });

}


// Here is a nice statement that returns the whole history:
// The resulting array hAS columns
//  1. securityid
//  2. typeid
//  3. categoryid
//  4. timestamp        (YYYY-MM-DD)
//  5. value            (the intrinsic value of the ASset, in the currency it is traded)
//  6. total            (the total number owned of the given ASset at the given date)
//  7. currencyid       (the id of the currency (=> securities table) in which the ASset is traded
//  8. currencyvalue    (the value of the currency in CHF)
//  9. totalvalue       (= total * value * currencyvalue)
//

function getHistory(db, session, mindate, callback) {
    
    if (!mindate) {
        mindate = '1970-01-01';    
    } 
    console.log(mindate);
    
    let userid = session.userid;
    console.log(userid);

    let userclause = ' ';
    if (userid == 0) {
        userclause = ' '; 
    }
    else {
        userclause = ' WHERE userid=$userid ';
    }
    console.log(userclause);
    
    let stmt = `WITH usec AS ( 
        SELECT 
            DISTINCT(securityid) FROM investments` + userclause + 
       `UNION
        SELECT 
            DISTINCT(securityid) FROM (
                SELECT 
                    DISTINCT(n.securityid) as iid, o.currency 
                FROM 
                    (SELECT * FROM	investments` + userclause + `) n 
                JOIN 
                    securities o         
            )
            JOIN (
                SELECT 
                    securityid, currency 
                FROM 
                    securities 
                WHERE typeid = 1
            )
            USING(currency)
        ),
    
    history2 AS (
        SELECT * FROM (
            SELECT * FROM
                (SELECT DISTINCT(date(timestamp)) AS timestamp FROM history WHERE date(timestamp)>=$mindate)
            JOIN
                usec
            ORDER BY timestamp, securityid
            ) n
        LEFT JOIN (
            SELECT securityid, date(timestamp) AS timestamp, value FROM history
            ) o
        USING(timestamp, securityid) ORDER BY timestamp
        ),
    
        history3 AS (
        SELECT o.timestamp, o.securityid, o.value, coalesce(o.value,
            (SELECT n.value FROM history2 AS n WHERE n.value IS NOT NULL AND o.securityid=n.securityid AND o.timestamp > n.timestamp order by timestamp desc)
            ) AS fvalue
        FROM history2 AS o
        ORDER BY securityid, timestamp),
    
        history4 AS (
        SELECT n.*, o.typeid FROM history3 n JOIN securities o USING(securityid)),
    
        totalnumber AS (
        SELECT n.securityid securityid, n.creditaccount accountid, n.dnumber number, n.date date, n.currency currency, sum(o.dnumber) AS total FROM (
            SELECT *, sum(number) dnumber FROM investments` + userclause + 
        `GROUP BY securityid, creditaccount, date) n
        LEFT JOIN
            (SELECT *, sum(number) dnumber FROM investments` + userclause + 
        `GROUP BY securityid, creditaccount, date) o
        ON (o.securityid = n.securityid AND o.creditaccount=n.creditaccount AND n.date >= o.date)
        GROUP BY n.securityid, n.creditaccount, n.date
        ),
    
		totalnumber2 AS ( 
		SELECT n.*, o.portfolioid FROM totalnumber n JOIN accounts o USING(accountid)
		),
	
        tvalue AS (
        SELECT * FROM
            (SELECT
                n.securityid 		AS securityid,
				o.accountid			AS accountid,
				o.portfolioid		AS portfolioid,
                date(n.timestamp) 	AS timestamp,
                CASE n.typeid WHEN 1 THEN 1 ELSE n.fvalue END AS value,
                max(total) 			AS total
            FROM history4 n
            JOIN totalnumber2 o
            ON(n.securityid = o.securityid AND date(n.timestamp) >= o.date) GROUP BY n.securityid, o.accountid, n.timestamp)
        JOIN
            (SELECT
                n.securityid 		AS securityid,
                n.typeid 			AS typeid,
                n.categoryid		AS categoryid,
                o.securityid 		AS currencyid
            FROM (SELECT * FROM securities) n JOIN (SELECT * FROM securities WHERE typeid=1) o ON (n.currency=o.currency))
        USING(securityid)),
    
        ownings2 AS
        (SELECT o.timestamp, o.securityid, o.value, COALESCE(o.value,
            (SELECT n.value FROM history2 AS n WHERE
                n.value IS NOT NULL AND o.securityid=n.securityid AND o.timestamp > n.timestamp ORDER BY timestamp DESC)
            ) AS fvalue
        FROM history2 AS o
        ORDER BY securityid, timestamp),
    
    
        cvalue AS
        (SELECT
            securityid 				AS currencyid,
            date(timestamp) 		AS timestamp,
            fvalue 					AS value
        FROM
            ownings2
        JOIN
            securities
        USING(securityid) WHERE typeid = 1)
    
    SELECT 	securityid,
			n.accountid							AS accountid,
			n.portfolioid						AS portfolioid,
            n.typeid							AS typeid,
            n.categoryid 						AS categoryid,
            n.timestamp 						AS timestamp,
            value,
            total,
            n.currencyid 						AS currencyid,
            currencyvalue,
            total * value * currencyvalue 		AS totalvalue
    FROM
        tvalue AS n
    JOIN
        (SELECT
            currencyid,
            timestamp,
            value 								AS currencyvalue
        FROM cvalue) o
    ON (n.currencyid = o.currencyid AND n.timestamp=o.timestamp)
    ORDER BY securityid, accountid, timestamp;`;
    
    /*
    let stmt = `
    WITH usec AS ( 
        SELECT 
            DISTINCT(securityid) FROM investments` + userclause + 
       `UNION
        SELECT 
            DISTINCT(securityid) FROM (
                SELECT 
                    DISTINCT(n.securityid) as iid, o.currency 
                FROM 
                    (SELECT * FROM	investments` + userclause + `) n 
                JOIN 
                    securities o         
            )
            JOIN (
                SELECT 
                    securityid, currency 
                FROM 
                    securities 
                WHERE typeid = 1
            )
            USING(currency)
        ),
    
    history2 AS (
        SELECT * FROM (
            SELECT * FROM
                (SELECT DISTINCT(date(timestamp)) AS timestamp FROM history WHERE date(timestamp)>=$mindate)
            JOIN
                usec
            ORDER BY timestamp, securityid
            ) n
        LEFT JOIN (
            SELECT securityid, date(timestamp) AS timestamp, value FROM history
            ) o
        USING(timestamp, securityid) ORDER BY timestamp
        ),
    
        history3 AS (
        SELECT o.timestamp, o.securityid, o.value, coalesce(o.value,
            (SELECT n.value FROM history2 AS n WHERE n.value IS NOT NULL AND o.securityid=n.securityid AND o.timestamp > n.timestamp order by timestamp desc)
            ) AS fvalue
        FROM history2 AS o
        ORDER BY securityid, timestamp),
    
        history4 AS (
        SELECT n.*, o.typeid FROM history3 n JOIN securities o USING(securityid)),
    
        totalnumber AS (
        SELECT n.securityid securityid, n.dnumber number, n.date date, n.currency currency, sum(o.dnumber) AS total FROM (
            SELECT *, sum(number) dnumber FROM investments` + userclause + 
        `GROUP BY securityid, date) n
        LEFT JOIN
            (SELECT *, sum(number) dnumber FROM investments` + userclause + 
        `GROUP BY securityid, date) o
        ON (o.securityid = n.securityid AND n.date >= o.date)
        GROUP BY n.securityid, n.date
        ),
    
        tvalue AS (
        SELECT * FROM
            (SELECT
                n.securityid 		AS securityid,
                date(n.timestamp) 	AS timestamp,
                CASE n.typeid WHEN 1 THEN 1 ELSE n.fvalue END AS value,
                max(total) 			AS total
            FROM history4 n
            JOIN totalnumber o
            ON(n.securityid = o.securityid AND date(n.timestamp) >= o.date) GROUP BY n.securityid, n.timestamp)
        JOIN
            (SELECT
                n.securityid 		AS securityid,
                n.typeid 			AS typeid,
                n.categoryid		AS categoryid,
                o.securityid 		AS currencyid
            FROM (SELECT * FROM securities) n JOIN (SELECT * FROM securities WHERE typeid=1) o ON (n.currency=o.currency))
        USING(securityid)),
    
        ownings2 AS
        (SELECT o.timestamp, o.securityid, o.value, COALESCE(o.value,
            (SELECT n.value FROM history2 AS n WHERE
                n.value IS NOT NULL AND o.securityid=n.securityid AND o.timestamp > n.timestamp ORDER BY timestamp DESC)
            ) AS fvalue
        FROM history2 AS o
        ORDER BY securityid, timestamp),
    
    
        cvalue AS
        (SELECT
            securityid 				AS currencyid,
            date(timestamp) 		AS timestamp,
            fvalue 					AS value
        FROM
            ownings2
        JOIN
            securities
        USING(securityid) WHERE typeid = 1)
    
    SELECT 	securityid,
            n.typeid							AS typeid,
            n.categoryid 						AS categoryid,
            n.timestamp 						AS timestamp,
            value,
            total,
            n.currencyid 						AS currencyid,
            currencyvalue,
            total * value * currencyvalue 		AS totalvalue
    FROM
        tvalue AS n
    JOIN
        (SELECT
            currencyid,
            timestamp,
            value 								AS currencyvalue
        FROM cvalue) o
    ON (n.currencyid = o.currencyid AND n.timestamp=o.timestamp)
    ORDER BY securityid, timestamp;`;*/
    
    console.log(stmt);
    db.all(stmt, {
        $userid: userid,
        $mindate: mindate
        },
        (err, rows) => {
            if (err) {
                console.log(err);
                return callback({
                    status: 500,
                    reASon: 'failed to get history data for userid ' + userid,
                    err: err
                });
            }
            else {
                // Format the rows here for ngx-charts
                // The format is:
                // - Each line in the graph has a "name" AND a "series" property.
                // - Each "series" is made up of {"name":name, "value":value} objects
                //
                // However we might want to do some processing on the front end - for example,
                // if we want to change the display breakdown from "typeid" to "categoryid" or something
                // similar. In this case it might be more useful to return all the columns and let the
                // front-end do the calculation.

                
                /*
                // For now we return all the rows - probably it makes more sense to deal with it directly on the front end

                let securityid = [];
                let typeid = [];
                let categoryid = [];
                let timestamp = [];
                let value = [];
                let total = [];
                let currencyid = [];
                let currencyvalue = [];
                let totalvalue = [];

                for (i in rows) {
                    securityid.push(rows[i].securityid);
                    typeid.push(rows[i].typeid);
                    categoryid.push(rows[i].categoryid);
                    timestamp.push(rows[i].timestamp);
                    value.push(rows[i].value);
                    total.push(rows[i].total);
                    currencyid.push(rows[i].currencyid);
                    currencyvalue.push(rows[i].currencyvalue);
                    totalvalue.push(rows[i].totalvalue);
                }

                let data = {
                    securityid: securityid,
                    typeid: typeid,
                    categoryid: categoryid,
                    timestamp: timestamp,
                    value: value,
                    total: total,
                    currencyid: currencyid,
                    currencyvalue: currencyvalue,
                    totalvalue: totalvalue
                }
                */

                return callback({
                    status: 200,
                    data: rows
                });
            }
        }
    );
}

/*
// Here is an extended form of this statement that
// returns the grAND total AS well, with securityid=0
var stmtx = `
with history2 AS (
	SELECT * FROM (
		SELECT * FROM
			(SELECT DISTINCT(date(timestamp)) AS timestamp FROM history)
		JOIN
			(SELECT DISTINCT(securityid) FROM investments WHERE userid=$userid)
		ORDER BY timestamp, securityid
		) n
	LEFT JOIN (
		SELECT securityid, date(timestamp) AS timestamp, value FROM history
		) o
	USING(timestamp, securityid) ORDER BY timestamp
	),
	
	history3 AS (
	SELECT o.timestamp, o.securityid, o.value, coalesce(o.value,
		(SELECT n.value FROM history2 AS n WHERE n.value IS NOT NULL AND o.securityid=n.securityid AND o.timestamp > n.timestamp order by timestamp desc)
		) AS fvalue
	FROM history2 AS o
	order by securityid, timestamp),
	
	history4 AS (
	SELECT n.*, o.typeid FROM history3 n JOIN securities o USING(securityid)),

	totalnumber AS (
	SELECT n.securityid securityid, n.dnumber number, n.date date, n.currency currency, sum(o.dnumber) AS total FROM (
		SELECT *, sum(number) dnumber FROM investments WHERE userid=$userid GROUP BY securityid, date) n
	LEFT JOIN
		(SELECT *, sum(number) dnumber FROM investments WHERE userid=$userid GROUP BY securityid, date) o
	ON (o.securityid = n.securityid AND n.date >= o.date)
	GROUP BY n.securityid, n.date
	),
	
	tvalue AS (
	SELECT * FROM
		(SELECT 
			n.securityid 		AS securityid, 
			date(n.timestamp) 	AS timestamp, 
			CASE n.typeid WHEN 1 THEN 1 ELSE n.fvalue END AS value, 
			max(total) 			AS total 
		FROM history4 n 
		JOIN totalnumber o 
		ON(n.securityid = o.securityid AND date(n.timestamp) >= o.date) GROUP BY n.securityid, n.timestamp)
	JOIN
		(SELECT 
			n.securityid 		AS securityid, 
			n.typeid 			AS typeid, 
			o.securityid 		AS currencyid 
		FROM (SELECT * FROM securities) n JOIN (SELECT * FROM securities WHERE typeid=1) o ON (n.currency=o.currency))
	USING(securityid)),

	ownings2 AS
	(SELECT o.timestamp, o.securityid, o.value, COALESCE(o.value,
	    (SELECT n.value FROM history2 AS n WHERE
	        n.value IS NOT NULL AND o.securityid=n.securityid AND o.timestamp > n.timestamp ORDER BY timestamp DESC)
	    ) AS fvalue
    FROM history2 AS o
    ORDER BY securityid, timestamp),

	cvalue AS
	(SELECT 
		securityid 				AS currencyid, 
		date(timestamp) 		AS timestamp, 
		fvalue 					AS value 
	FROM
		ownings2
	JOIN
		securities
	USING(securityid) WHERE typeid = 1),
	
	historyall AS 	
	(SELECT 	securityid, 
			n.timestamp 						AS timestamp, 
			value, 
			total, 
			n.currencyid 						AS currencyid, 
			currencyvalue, 
			total * value * currencyvalue 		AS totalvalue 
	FROM 
		tvalue AS n 
	JOIN 
		(SELECT 
			currencyid, 
			timestamp, 
			value 								AS currencyvalue 
		FROM cvalue) o 
	ON (n.currencyid = o.currencyid AND n.timestamp=o.timestamp)),

	historytot AS
	(SELECT 
		0 				AS securityid, 
		timestamp,
		NULL 			AS value,
		NULL			AS total,
		NULL 			AS currencyid,
		NULL			AS currencyvalue,
		SUM(totalvalue) AS totalvalue
	FROM historyall
	GROUP BY timestamp)

SELECT * FROM historytot
UNION ALL 
SELECT * FROM historyall;
`;

*/ 


module.exports = {
    getSummary,
    getHistory
}