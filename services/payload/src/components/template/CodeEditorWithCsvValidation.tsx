import React, { useCallback, useEffect, useState } from 'react';

import Error from 'payload/dist/admin/components/forms/Error';
import FieldDescription from 'payload/dist/admin/components/forms/FieldDescription';
import { json } from 'payload/dist/fields/validations';
import Label from 'payload/dist/admin/components/forms/Label';
import { Props } from 'payload/dist/admin/components/forms/field-types/JSON/types';
import { useField } from 'payload/components/forms';
import withCondition from 'payload/dist/admin/components/forms/withCondition';
import { CodeEditor } from 'payload/dist/admin/components/elements/CodeEditor';
import ValidateWithCsv from './ValidateWithCsv';

const baseClass = 'json-field';

const JSONField: React.FC<Props> = props => {
    const {
        path: pathFromProps,
        name,
        required,
        validate = json,
        admin: { readOnly, style, className, width, description, condition, editorOptions } = {},
        label,
    } = props;

    const path = pathFromProps || name;
    const [stringValue, setStringValue] = useState<string>();
    const [jsonError, setJsonError] = useState<string>();

    const memoizedValidate = useCallback(
        (value, options) => {
            return validate(value, { ...options, required, jsonError });
        },
        [validate, required, jsonError]
    );

    const { value, initialValue, showError, setValue, errorMessage } = useField<string>({
        path,
        validate: memoizedValidate,
        condition,
    });

    const handleChange = useCallback(
        val => {
            if (readOnly) return;
            setStringValue(val);

            try {
                setValue(JSON.parse(val.trim() || '{}'));
                setJsonError(undefined);
            } catch (e) {
                setJsonError(e);
            }
        },
        [readOnly, setValue, setStringValue]
    );

    useEffect(() => {
        setStringValue(JSON.stringify(initialValue, null, 2));
    }, [initialValue]);

    const classes = [
        baseClass,
        'field-type',
        className,
        showError && 'error',
        readOnly && 'read-only',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            className={classes}
            style={{
                ...style,
                width,
            }}
        >
            <Error showError={showError} message={errorMessage} />
            <Label htmlFor={`field-${path}`} label={label} required={required} />
            <FieldDescription value={value} description={description} className="text-black" />
            <CodeEditor
                options={editorOptions}
                defaultLanguage="json"
                value={stringValue}
                onChange={handleChange}
                readOnly={readOnly}
            />
            {stringValue && <ValidateWithCsv path={path} />}
        </div>
    );
};

export default withCondition(JSONField);
