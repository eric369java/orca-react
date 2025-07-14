import { NumberInput } from "@mantine/core";
import './CurrencyInput.css';

type CurrencyInputProps = {
    cost : Cost,
    userCurrencySetting : string,
    onChange : (cost: Cost) => void
}

// MOCK: Currently mocking user locale
const locale = 'en-US';

export default function CurrencyInput({cost, userCurrencySetting, onChange}: CurrencyInputProps) {

    // TODO: Conversion api instead of mock.
    const convertCurrency = (value : number, sourceCurrency: string, destCurrency: string) : string => {
        return new Intl.NumberFormat(locale, {style: 'currency', currency: userCurrencySetting}).format(value * 0.0095);
    }
    
    const getCurrencySymbolAndWidth = (currencyString: string) => {
        let symbol = new Intl.NumberFormat(locale, {style: 'currency', currency: cost.currencyString}).formatToParts(0)
        .find(p => p.type === 'currency')?.value;     
        
        if (!symbol) {
            symbol = currencyString;
        }

        // Hack: NumberInput's left section doesn't autosize. Have to estimate the width the section should take.
        const estimatedWidth = 16 + 8 * symbol.length;
        return [symbol, estimatedWidth] as const;
    }

    const [symbol, estimatedWidth] = getCurrencySymbolAndWidth(cost.currencyString);
    const leftSection = (
        <label className="dest-currency-label">{symbol}</label>
    )

    const rightSection = (
        <label className="source-currency-label">
            <span>{`(${convertCurrency(cost.value ?? 0, cost.currencyString, userCurrencySetting)})`}</span>
        </label>
    );

    return (
        <NumberInput value={cost.value} onChange={(value) => onChange({value: value, currencyString: cost.currencyString} as Cost)}
           allowNegative={false} maxLength={14} thousandSeparator=','
           leftSection={leftSection} leftSectionWidth={`${estimatedWidth}px`}
           decimalScale={2} rightSection={rightSection} rightSectionWidth={'50%'}/>
    );
}