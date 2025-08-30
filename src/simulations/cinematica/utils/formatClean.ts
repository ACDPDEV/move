function formatClean(num: number, maxDecimals: number = 2): string {
    return parseFloat(num.toFixed(maxDecimals)).toString();
}

export { formatClean };
