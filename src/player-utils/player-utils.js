// lifted softmax function
function softmax(arr) {
    return arr.map(function(value,index) {
      return Math.exp(value) / arr.map( function(y /*value*/){ return Math.exp(y) } ).reduce( function(a,b){ return a+b })
    })
}

function issueDifference(candidate){
    let total = 0;
    let issues = this.issues.size > 5 ? this.getTopFiveIssues : this.issues;

    for(let issue of this.issues.keys()){
        if(this.issues.has(issue) && candidate.issues.has(issue)){
            total += Math.abs(this.element.issues.get(issue) - candidate.issues.get(issue));
        }
    }
    return total;
}

function determineVoteShare(candidates, node){

    let results = [];

    let differenceTotals = candidates.map(issueDifference, node);
    let totalDifference = differenceTotals.reduce((total,element)=>{
        return total + element
    },0);

    let percentageRawDifference = differenceTotals.reduce((total,element)=>{
        return total +  element/totalDifference
    },0);

    let percentageDifference = differenceTotals.map((element)=>{
        return totalDifference/element
    });

    // set the election total to 0
    results = candidates.map(e => { return {uuid:e.uuid, votes:0}});

    // caculate voter turnout based on min difference
    // using tanh for a sigmoid function, cause why not, i just need to make an idelogical difference into a proportion of 1
    let turnout = node.population * (1 - Math.tanh(Math.min(...differenceTotals)));
    turnout = node.population;
    // console.log(`Turnout for ${node.name} was ${Math.floor((1 - Math.tanh(Math.min(...differenceTotals))) * 100)}%`);
    // distribute voter turnout by share
    softmax(percentageDifference).forEach((candidate, index)=>{
        results[index].votes += Math.floor(turnout * candidate);
        //console.log(`candidate ${election[index].name} received ${Math.floor(turnout * candidate)} (${Math.floor(100 * candidate)}%) votes from ${node.name}`)
    });

    return results;
};



// simple campaign function where changes propogate through the network
// influence willbounce around with diminishing returns until its less than 0.001
function campaignOnNode(issue, target){

    return function(node){
        let amount = target - node.issues.get(issue)
        node.issues.set(issue, shiftAndClip(node.issues.get(issue), amount));
    }

}

// change node issue vlaues but clips values between 0 and 1
function shiftAndClip(base, shift){
    base += shift;

    if(base > 1){
        base = 1;
    }

    if( base < 0){
        base = 0;
    }

    return base;
}

export { shiftAndClip, campaignOnNode,  determineVoteShare, softmax, issueDifference}
