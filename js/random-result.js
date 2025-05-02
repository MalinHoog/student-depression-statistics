let allresults = (await dbQuery(
  'SELECT * FROM results LIMIT 25'
));
tableFromData({ data: allresults });
console.log(allresults)
