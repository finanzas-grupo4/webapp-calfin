import { addMonths } from "date-fns"

// Helper function to get the number of payments per year
function getPaymentsPerYear(frequency) {
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

// Calculate the bond cash flow
export function calculateBondCashFlow(bond) {
    const paymentsPerYear = getPaymentsPerYear(bond.paymentFrequency)
    const periodicRate = getPeriodicRate(bond)

    // Calculate total number of payments
    const totalPayments = Math.ceil(bond.termInMonths / (12 / paymentsPerYear))

    // Calculate payment interval in months
    const paymentIntervalMonths = 12 / paymentsPerYear


    const gracePeriodPayments = bond.hasGracePeriod ? bond.gracePeriodLength : 0

    // Calculate regular payment amount (after grace period)
    const remainingPayments = totalPayments - gracePeriodPayments
    const paymentAmount = calculatePaymentAmount(bond.nominalValue, periodicRate, remainingPayments)

    const cashFlows = []
    let balance = bond.nominalValue
    let currentDate = new Date(bond.issueDate)

    for (let period = 1; period <= totalPayments; period++) {
        // Add months to the date based on payment frequency
        currentDate = addMonths(currentDate, paymentIntervalMonths)

        // Calculate interest for this period
        const interestPayment = balance * periodicRate

        let principalPayment = 0
        let totalPayment = 0

        // Handle grace period
        if (period <= gracePeriodPayments) {
            if (bond.gracePeriodType === "total") {
                // Total grace period: no payments
                principalPayment = 0
                totalPayment = 0
            } else {
                // Partial grace period: only interest payments
                principalPayment = 0
                totalPayment = interestPayment
            }
        } else {
            // Regular payment period
            totalPayment = paymentAmount
            principalPayment = totalPayment - interestPayment

            // Handle last payment rounding issues
            if (balance - principalPayment < 0.01) {
                principalPayment = balance
                totalPayment = principalPayment + interestPayment
            }
        }

        // Update balance
        const endingBalance = Math.max(0, balance - principalPayment)

        cashFlows.push({
            period,
            date: new Date(currentDate),
            beginningBalance: balance,
            interestPayment,
            principalPayment,
            totalPayment,
            endingBalance,
        })

        balance = endingBalance

        // Break if balance is zero
        if (balance === 0) break
    }

    return cashFlows
}

// Calculate the present value of the bond
export function calculateBondPrice(cashFlows, discountRate) {
    if (!discountRate) return 0

    const periodicDiscountRate = discountRate / 100 / getPaymentsPerYear("semi-annual")

    let presentValue = 0

    cashFlows.forEach((flow, index) => {
        const periodNumber = index + 1
        const discountFactor = Math.pow(1 + periodicDiscountRate, -periodNumber)
        presentValue += flow.totalPayment * discountFactor
    })

    return presentValue
}
