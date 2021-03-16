class Savings_Plan {
    initialInvestment = 0;
    dynamization = 0;

    constructor(savingsRate, interestRate, timeHorizon) {
        this.savingsRate = parseFloat(savingsRate) || 0;
        this.interestRate = parseFloat(interestRate) || 0;
        this.timeHorizon = parseFloat(timeHorizon) || 0;
    }

    createReturnVector() {
        var returnVector = new Array(parseInt(this.timeHorizon * 12 + 1));
        for (const i of returnVector.keys()) {
            returnVector[i] = (1 + this.interestRate) ** (i / 12);
        }
        this.returnVector = returnVector;
    }

    createInvestmentsVector() {
        var investments = new Array(parseInt(this.timeHorizon * 12 + 1));
        if (this.dynamization == 0) {
            investments.fill(this.savingsRate);
        } else {
            var dynsamicSavingsRate = this.savingsRate;
            for (var i = 1; i < investments.length; i++) {
                investments[i] = dynsamicSavingsRate;
                if (i % 12 == 0) {
                    dynsamicSavingsRate *= 1 + this.dynamization;
                }
            }
        }
        investments[0] = this.initialInvestment;
        this.investments = investments;
    }

    createGrossNavHistory() {
        this.createInvestmentsVector();
        this.createReturnVector();
        var grossNav = new Array(this.investments.length).fill(0);
        for (const i of grossNav.keys()) {
            for (var j = 0; j <= i; j++) {
                grossNav[i] += this.investments[j] * this.returnVector[i - j];
            }
        }     
        this.grossNav = grossNav;
    }
}

function cumsum(list) {
    let y = 0;
    return list.map(d => y += d);
}

function execute() {
    if (document.getElementById("Sparrate").value)
    var Sparplan = new Savings_Plan(document.getElementById("Sparrate").value, 
                                    document.getElementById("Zinsen").value / 100, 
                                    document.getElementById("horizon").value);
    Sparplan.initialInvestment = parseFloat(document.getElementById("Erstanlage").value) || 0;
    Sparplan.dynamization = parseFloat(document.getElementById("Dynamisierung").value) / 100 || 0;
    Sparplan.createGrossNavHistory();
    var invCum = cumsum(Sparplan.investments);
    // update chart
    navChart.data.datasets[0].data = math.round(invCum,2);
    navChart.data.datasets[1].data = math.round(math.subtract(Sparplan.grossNav, invCum),2);
    navChart.data.labels = Array.from(Array(invCum.length).keys());
    navChart.update();
}

document.addEventListener("keyup", function(event){
    if ([9,13,48,49,50,51,52,53,54,55,56,57].includes(event.keyCode)) {
        execute();
    }
});
