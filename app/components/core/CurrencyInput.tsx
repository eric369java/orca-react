import { ActionIcon, NumberInput, Tooltip } from "@mantine/core";
import './CurrencyInput.css';
import { Currency } from "lucide-react";

type CurrencyInputProps = {
    initialValue : string | undefined,
    onChange : (value: string | undefined) => void
}

export function CurrencyInput({initialValue, onChange}: CurrencyInputProps) {    
    const getCurrencySymbolAndWidth = (code: string | undefined) => {
        let symbol = code ? new Intl.NumberFormat('en-US', {style: 'currency', currency: code}).formatToParts(0)
        .find(p => p.type === 'currency')?.value : code;     
        
        // Hack: NumberInput's left section doesn't autosize. Have to estimate the width the section should take.
        const estimatedWidth = symbol ? 16 + 8 * symbol.length : 24;
        return [symbol, estimatedWidth] as const;
    }

    const [symbol, estimatedWidth] = getCurrencySymbolAndWidth(initialValue?.split(' ')[1]);
    const leftSection = (
        <label className="currency-symbol">{symbol}</label>
    )

    // TODO: click to add denomination select to drawer stack
    const rightSection = (
        <Tooltip label="Change currency">
            <ActionIcon className="change-currency-button" variant='subtle' size='md'>
                <Currency />
            </ActionIcon>
        </Tooltip>
    );

    return (
        <NumberInput value={initialValue?.split(' ')[0]} onChange={(value) => onChange(`${value.toString()} JPY`)}
            allowNegative={false} maxLength={14} thousandSeparator=','
            leftSection={leftSection} leftSectionWidth={`${estimatedWidth}px`}
            decimalScale={2} rightSection={rightSection} rightSectionWidth={'50%'}/>
    );
}