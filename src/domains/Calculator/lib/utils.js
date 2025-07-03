export function formatCurrency(amount, currency, abbreviated = false) {
    // Verificar si amount es undefined, null, NaN o no es un número
    if (amount === undefined || amount === null || isNaN(amount) || typeof amount !== 'number') {
        console.warn('formatCurrency recibió un valor inválido:', amount);
        return "N/A";
    }

    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        notation: abbreviated ? "compact" : "standard",
    })

    return formatter.format(amount)
}
