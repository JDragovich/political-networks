function createRange(split){
    let newMap = new Map();

    for(let i =0; i<=1; i+= 1/split){
        newMap.set(i.toFixed(Math.log10(split)), 0);
    }

    return newMap;
}

function histogramHashmapToArray(bins){
    let binArray = [];

    for(let bin of bins.keys()){
        binArray.push({
            key:bin,
            keyString:bin.toString(),
            value:bins.get(bin)
        })
    }

    return binArray;
}

//make a distribution of nodes based on average of issues
function sortNodes(bins, node){
    let total = 0;
    let numIssues = 0;
    let decimalPlaces = Math.log10(bins.size);


    for(let issue of node.issues.keys()){
        total += node.issues.get(issue);
        numIssues++;
    }

    let binNumber = (total/numIssues).toFixed(decimalPlaces);

    if(bins.has(binNumber)){
        bins.set(binNumber,bins.get(binNumber) + 1);
    }
    else{
        bins.set(binNumber, 1);
    }

    return bins;
}

export { createRange, histogramHashmapToArray, sortNodes};
