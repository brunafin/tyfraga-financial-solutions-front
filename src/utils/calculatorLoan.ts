const calculatorLoan = (amount: number, installments: number, tax: number, discount: number) => {
    const totalWithoutDiscount = amount * (1 + tax / 100);
    const totalWithDiscount = totalWithoutDiscount - discount;
    const installmentValue = totalWithDiscount / installments;
    return {
        total: totalWithDiscount,
        installmentValue,
    };
};

export default calculatorLoan;