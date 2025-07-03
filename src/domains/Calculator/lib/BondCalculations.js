import { addMonths } from "date-fns"

// Helper function to get the number of payments per year
export function getPaymentsPerYear(frequency) {
    switch (frequency) {
        case "monthly":
            return 12
        case "quarterly":
            return 4
        case "semi-annual":
            return 2
        case "annual":
            return 1
        default:
            return 12
    }
}

// Helper function to get the compounding factor
function getCompoundingFactor(frequency) {
    if (!frequency) return 1
    switch (frequency) {
        case "monthly":
            return 12
        case "quarterly":
            return 4
        case "semi-annual":
            return 2
        case "annual":
            return 1
        case "continuous":
            return Number.POSITIVE_INFINITY
        default:
            return 12
    }
}

// Convert nominal rate to effective rate based on compounding
function nominalToEffective(nominalRate, compoundingFrequency) {
    const m = getCompoundingFactor(compoundingFrequency)

    if (m === Number.POSITIVE_INFINITY) {
        // Continuous compounding: e^r - 1
        return Math.exp(nominalRate / 100) - 1
    } else {
        // Discrete compounding: (1 + r/m)^m - 1
        return Math.pow(1 + nominalRate / 100 / m, m) - 1
    }
}

// Calculate the periodic interest rate
function getPeriodicRate(bond) {
    const paymentsPerYear = getPaymentsPerYear(bond.paymentFrequency)

    let effectiveAnnualRate

    if (bond.isEffectiveRate) {
        effectiveAnnualRate = bond.interestRate / 100
    } else {
        effectiveAnnualRate = nominalToEffective(bond.interestRate, bond.compoundingFrequency)
    }

    // Convert annual effective rate to periodic rate
    return Math.pow(1 + effectiveAnnualRate, 1 / paymentsPerYear) - 1
}

// Calculate the payment amount using the American method
function calculatePaymentAmount(principal, periodicRate, numberOfPayments) {
    // For American method, we use the standard amortization formula
    return (principal * periodicRate) / (1 - Math.pow(1 + periodicRate, -numberOfPayments))
}

// Calculate the bond cash flow using American (Bullet) Method
export function calculateBondCashFlow(bond) {
    console.log('Calculando flujo de caja con MÉTODO AMERICANO (BULLET) para:', bond);

    // 1. Validar datos de entrada críticos
    if (!bond.nominalValue || !bond.interestRate || !bond.termInMonths) {
        console.error('Datos del bono incompletos para el cálculo:', bond);
        return [];
    }

    // 2. Calcular la tasa de interés periódica efectiva (i_m)
    const periodicRate = getPeriodicRate(bond);
    console.log('Tasa periódica efectiva (i_m):', periodicRate);

    // 3. Calcular el número total de pagos
    const paymentsPerYear = getPaymentsPerYear(bond.paymentFrequency);
    const totalPayments = Math.ceil(bond.termInMonths / (12 / paymentsPerYear));
    console.log('Total de pagos (n):', totalPayments);

    // 4. Definir valores para el método americano
    const principal = parseFloat(bond.nominalValue);
    const periodicInterestPayment = principal * periodicRate;
    console.log('Pago de interés periódico (Cupón):', periodicInterestPayment);

    const cashFlows = [];
    let currentDate = new Date(bond.issueDate || new Date());
    const paymentIntervalMonths = 12 / paymentsPerYear;

    // 5. Iterar para generar cada período del flujo de caja
    for (let period = 1; period <= totalPayments; period++) {
        currentDate = addMonths(currentDate, paymentIntervalMonths);

        let interestPayment = periodicInterestPayment;
        let principalPayment = 0;

        // En el último período, se paga el capital completo
        if (period === totalPayments) {
            principalPayment = principal; // Amortización total al vencimiento
        }

        const totalPayment = interestPayment + principalPayment;
        const beginningBalance = principal; // El saldo es siempre el nominal hasta el final
        const endingBalance = (period === totalPayments) ? 0 : principal;

        cashFlows.push({
            period,
            date: new Date(currentDate),
            beginningBalance: beginningBalance,
            interestPayment: interestPayment,
            principalPayment: principalPayment,
            totalPayment: totalPayment,
            endingBalance: endingBalance,
        });
    }

    console.log('Flujos de caja (Método Americano) generados:', cashFlows);
    return cashFlows;
}

// IRR calculation using Newton's method for TCEA
function irr(flows, guess = 0.05, maxIter = 100, tolerance = 1e-7) {
    let x0 = guess;
    for (let i = 0; i < maxIter; i++) {
        let npv = 0;
        let dnpv = 0; // Derivative of NPV

        for (let t = 0; t < flows.length; t++) {
            npv += flows[t] / Math.pow(1 + x0, t);
            if (t > 0) {
                dnpv += -t * flows[t] / Math.pow(1 + x0, t + 1);
            }
        }

        if (dnpv === 0) { return null; }
        const x1 = x0 - npv / dnpv;
        if (Math.abs(x1 - x0) <= tolerance) {
            return x1; // Converged
        }
        x0 = x1;
    }
    return null; // Failed to converge
}

// Calculate TCEA (Effective Annual Cost Rate) from cash flows
export function calculateTCEA(cashFlows, initialInvestment, paymentsPerYear) {
    if (!initialInvestment || initialInvestment <= 0) return 0;
    const flows = [-initialInvestment, ...cashFlows.map(cf => cf.totalPayment)];
    const periodicIRR = irr(flows);
    if (periodicIRR === null) return 0;
    return Math.pow(1 + periodicIRR, paymentsPerYear) - 1;
}

// Calculate Macaulay Duration
export function calculateMacaulayDuration(cashFlows, bondPrice, periodicDiscountRate, paymentsPerYear) {
    if (!bondPrice || bondPrice === 0) return 0;
    let weightedTime = 0;
    cashFlows.forEach((flow) => {
        const period = flow.period;
        const pv_cf = flow.totalPayment / Math.pow(1 + periodicDiscountRate, period);
        weightedTime += period * pv_cf;
    });
    return (weightedTime / bondPrice) / paymentsPerYear; // Return in years
}

// Calculate Convexity
export function calculateConvexity(cashFlows, bondPrice, periodicDiscountRate, paymentsPerYear) {
    if (!bondPrice || bondPrice === 0) return 0;
    let convexityTerm = 0;
    cashFlows.forEach((flow) => {
        const t = flow.period;
        const pv_cf = flow.totalPayment / Math.pow(1 + periodicDiscountRate, t);
        convexityTerm += pv_cf * t * (t + 1);
    });
    return convexityTerm / (bondPrice * Math.pow(1 + periodicDiscountRate, 2) * Math.pow(paymentsPerYear, 2));
}


// Calculate the present value of the bond
export function calculateBondPrice(cashFlows, discountRate, paymentsPerYear) {
    if (!discountRate) return 0

    const ppy = paymentsPerYear || 12; // Fallback to monthly
    const periodicDiscountRate = discountRate / 100 / ppy;

    let presentValue = 0

    cashFlows.forEach((flow) => {
        const discountFactor = Math.pow(1 + periodicDiscountRate, -flow.period)
        presentValue += flow.totalPayment * discountFactor
    })

    return presentValue
}
