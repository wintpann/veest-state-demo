import React, { ChangeEvent, FC, memo } from 'react';
import { TextField } from '@mui/material';
import { countRenderedTimes } from '@/veest';

type NumberInputProps = {
    value: string | undefined;
    onChange: (value: string | undefined) => void;
    label: string;
};

const keepNumbers = (value: string) => value.replace(/[^0-9]/g, '');

export const NumberInput: FC<NumberInputProps> = memo(({ value, onChange, label }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(keepNumbers(e.target.value) || undefined);
    };
    countRenderedTimes('component');

    return (
        <TextField
            sx={{ textTransform: 'uppercase' }}
            label={label}
            variant="outlined"
            onChange={handleChange}
            value={value ?? ' '}
        />
    );
});
