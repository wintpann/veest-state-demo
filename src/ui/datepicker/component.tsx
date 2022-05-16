import React, { FC, memo } from 'react';
import { DesktopDatePicker } from '@mui/lab';
import { TextField } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { isValidDate } from '@/utils';
import { countRenderedTimes } from '@/veest';

type DatepickerProps = {
    label: string;
    value: string | undefined;
    onChange: (value: string | undefined) => void;
};

export const Datepicker: FC<DatepickerProps> = memo(({ value, onChange, label }) => {
    const handleChange = (date: Date | null) => {
        onChange(date && isValidDate(date) ? date.toISOString() : undefined);
    };
    countRenderedTimes('component');
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
                label={label}
                inputFormat="MM/dd/yyyy"
                value={value || null}
                onChange={handleChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        sx={{ ...params.sx, textTransform: 'uppercase', width: '100%' }}
                        inputProps={{ ...params.inputProps, placeholder: 'Enter a date' }}
                    />
                )}
            />
        </LocalizationProvider>
    );
});
