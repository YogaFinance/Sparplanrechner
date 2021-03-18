class Savings_Plan {
    initialInvestment = 0;
    dynamization = 0;

    constructor(savingsRate, interestRate, timeHorizon) {
        this.savingsRate = parseFloat(savingsRate) || 0;
        this.interestRate = parseFloat(interestRate) || 0;
        this.timeHorizon = parseFloat(timeHorizon) || 0;
    }

    // createReturnVector() {
    //     var returnVector = new Array(parseInt(this.timeHorizon * 12 + 1));
    //     for (const i of returnVector.keys()) {
    //         returnVector[i] = (1 + this.interestRate) ** (i / 12);
    //     }
    //     this.returnVector = returnVector;
    // }

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
        var grossNav = new Array(this.investments.length);
        grossNav[0] = this.investments[0];
        const monthlyReturn = (1 + this.interestRate) ** (1 / 12);
        for (var i = 1; i < grossNav.length; i++) {
            grossNav[i] = grossNav[i-1] * monthlyReturn + this.investments[i];
        }     
        this.grossNav = grossNav;
    }
}

var inputs = document.getElementsByTagName("input");
var log = document.getElementById("error-message");

function check() {
    const fieldsToCheck = ["Erstanlage", "Sparrate", "Dynamisierung", "Ansparzeitraum", "Zinsen"]
    for (field of fieldsToCheck) {
        if (parseFloat(inputs[field].value) > parseFloat(inputs[field].max) ||
            parseFloat(inputs[field].value) < parseFloat(inputs[field].min)) {
            // styling the number format
            var minimum = parseFloat(inputs[field].min).toLocaleString();
            var maximum = parseFloat(inputs[field].max).toLocaleString();
            log.textContent = `Der Wert "${field}" muss zwischen ${minimum} und ${maximum} liegen.`;
            return
        }
    }
    // check successful
    log.textContent = ""
    execute();
}

function cumsum(list) {
    let y = 0;
    return list.map(d => y += d);
}

function execute() {
    var Sparplan = new Savings_Plan(document.getElementById("Sparrate").value, 
                                    document.getElementById("Zinsen").value / 100, 
                                    document.getElementById("Ansparzeitraum").value);
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