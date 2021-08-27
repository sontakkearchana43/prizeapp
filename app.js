const express = require("express");
const app = express();
const fs = require('fs');
const rawdata = fs.readFileSync('prizes.json');
const prizesList = JSON.parse(rawdata).prizes.map(item => {
    item.winners = item.laureates.map(la => la.firstname).toString();
    return item;
});

const filterData = (filter) => {
    return prizesList.filter((item) => {
        for (var key in filter) {
            if (key == 'name' && !item.winners.includes(filter[key]))
              return false;
              if (key == 'year' && !item.year.includes(filter[key]))
              return false;
              if (key == 'category' && !item.category.includes(filter[key]))
              return false;
          }
          return true;
    })
}

app.set('view engine', 'ejs');

app.get("/prizes", (req, res) => {
    let pList = []
    const queryParams = req.query;
    if(Object.keys(queryParams).length){
        pList = filterData(queryParams);
    }else{
        pList = prizesList;
    }
    res.render('index', {
        prizes: pList.sort(function (a, b) {
            if(a.category < b.category) { return -1; }
            if(a.category > b.category) { return 1; }
            return 0;
          }) || []
    });
})


app.listen(process.env.PORT || 4444, () => {
    console.log(`listening at ${process.env.PORT || 4444}`)
})