export class Calculator {
    constructor({
        bondName = '',
        additionalCosts = 0.0,
        nominalValue = 0.0,
        currency = 'USD',
        term = 0,
        termUnit = 'MONTHS',
        interestRate = 0.0,
        isEffectiveRate = true,
        paymentFrequency = 'MENSUAL',
        compoundingFrequency = 'MENSUAL',
        issueDate = '',
        hasGracePeriod = false,
        gracePeriodType = 'PARCIAL',
        gracePeriodLength = 0,
        discountRate = 0.0
    } = {}) {
        this.bondName = bondName;
        this.additionalCosts = additionalCosts;
        this.nominalValue = nominalValue;
        this.currency = currency;
        this.term = term;
        this.termUnit = termUnit;
        this.interestRate = interestRate;
        this.isEffectiveRate = isEffectiveRate;
        this.paymentFrequency = paymentFrequency;
        this.compoundingFrequency = compoundingFrequency;
        this.issueDate = issueDate;
        this.hasGracePeriod = hasGracePeriod;
        this.gracePeriodType = gracePeriodType;
        this.gracePeriodLength = gracePeriodLength;
        this.discountRate = discountRate;
    }
}

