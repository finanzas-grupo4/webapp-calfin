export function formatCurrency(amount, currency, abbreviated = false) {
    if (isNaN(amount)) return "N/A"

    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        notation: abbreviated ? "compact" : "standard",
    })

    return formatter.format(amount)
}
