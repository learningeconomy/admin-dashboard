import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RenderCustomComponent from 'payload/dist/admin/components/utilities/RenderCustomComponent';
import useIntersect from 'payload/dist/admin/hooks/useIntersect';
import { RenderFieldProps as Props } from '../types';
import { fieldAffectsData, fieldIsPresentationalOnly } from 'payload/dist/fields/config/types';
import { useOperation } from 'payload/dist/admin/components/utilities/OperationProvider/index';
import { getTranslation } from 'payload/dist/utilities/getTranslation';
import { useAllFormFields, useForm } from 'payload/components/forms';
import { Fields } from 'payload/dist/admin/components/forms/Form/types';
import BatchPreviewSubmit from './BatchPreviewSubmit';

import './batch.scss';

const baseClass = 'render-fields';

const intersectionObserverOptions = { rootMargin: '1000px' };

import UploadCSV from './UploadCSV';
import useHorizontalPages from '../../hooks/useHorizontalPages';
import {
    getNavFunctions,
    getSimplePages,
    getUnnamedRefsFromArray,
} from '../../helpers/horizontalNav.helpers';
import HorizontalNavHeader from '../navigation/HorizontalNavHeader';
import HorizontalNavFooter from '../navigation/HorizontalNavFooter';
// hardcoded for now, but could be perhaps be defined in the database
const MAP_FIELDS_TO_STEPS = {
    1: ['title', 'description', 'internalNotes'],
    2: ['template'],
    3: [],
    4: ['emailTemplate'],
};

const getFieldsForStep = (step = 1, fieldSchema = []) => {
    const fieldsForStep = MAP_FIELDS_TO_STEPS[step] ?? [];
    const stepFields = fieldSchema.filter(field => fieldsForStep.includes(field.name));

    return stepFields;
};

const getInvalidFormFieldsForStep = (step: number, formFields: Fields) => {
    const fieldsForStep = MAP_FIELDS_TO_STEPS[step];
    const failedValidationFields = fieldsForStep.filter(field => {
        return !formFields[field].valid;
    });

    if (failedValidationFields?.length > 0) return false;
    return true;
};

type RenderSlideProps = {
    step: number;
    formProps: Props;
};

const RenderSlide = React.forwardRef<HTMLElement, RenderSlideProps>(function RenderSlide(
    { step, formProps },
    ref
) {
    const { t, i18n } = useTranslation('general');
    const operation = useOperation();

    const {
        fieldSchema,
        fieldTypes,
        filter,
        permissions,
        readOnly: readOnlyOverride,
        indexPath: incomingIndexPath,
    } = formProps;

    const stepFormFields = getFieldsForStep(step, fieldSchema);

    const renderFields = stepFormFields?.map((field, fieldIndex) => {
        const fieldIsPresentational = fieldIsPresentationalOnly(field);
        let FieldComponent = fieldTypes[field.type];

        if (fieldIsPresentational || (!field?.hidden && field?.admin?.disabled !== true)) {
            if ((filter && typeof filter === 'function' && filter(field)) || !filter) {
                if (fieldIsPresentational) {
                    return <FieldComponent {...field} key={fieldIndex} />;
                }

                if (field?.admin?.hidden) {
                    FieldComponent = fieldTypes.hidden;
                }

                const isFieldAffectingData = fieldAffectsData(field);

                const fieldPermissions = isFieldAffectingData
                    ? permissions?.[field.name]
                    : permissions;

                let { admin: { readOnly } = {} } = field;

                if (readOnlyOverride && readOnly !== false) readOnly = true;

                if (
                    (isFieldAffectingData &&
                        permissions?.[field?.name]?.read?.permission !== false) ||
                    !isFieldAffectingData
                ) {
                    if (
                        isFieldAffectingData &&
                        permissions?.[field?.name]?.[operation]?.permission === false
                    ) {
                        readOnly = true;
                    }

                    if (FieldComponent) {
                        return (
                            <RenderCustomComponent
                                key={fieldIndex}
                                CustomComponent={field?.admin?.components?.Field}
                                DefaultComponent={FieldComponent}
                                componentProps={{
                                    ...field,
                                    path: field.path || (isFieldAffectingData ? field.name : ''),
                                    fieldTypes,
                                    indexPath: incomingIndexPath
                                        ? `${incomingIndexPath}.${fieldIndex}`
                                        : `${fieldIndex}`,
                                    admin: {
                                        ...(field.admin || {}),
                                        readOnly,
                                    },
                                    permissions: fieldPermissions,
                                }}
                            />
                        );
                    }

                    return (
                        <div className="missing-field" key={fieldIndex}>
                            {t('error:noMatchedField', {
                                label: fieldAffectsData(field)
                                    ? getTranslation(field.label || field.name, i18n)
                                    : field.path,
                            })}
                        </div>
                    );
                }
            }

            return null;
        }
    });

    const getTitle = () => {
        if (step === 1) {
            return (
                <>
                    <h2 className="mt-5 text-[--theme-text] text-3xl font-semibold mb-5 font-inter">
                        Add Batch Details
                    </h2>
                    <p className="text-[--theme-text] text-xl font-medium font-inter mb-15">
                        Provide information about the credentials you’re uploading to this batch to
                        streamline the issuance process.
                    </p>
                </>
            );
        }

        if (step === 2) {
            return (
                <>
                    <h2 className="mt-5 text-[--theme-text] text-3xl font-semibold mb-5 font-inter">
                        Select Credential Template
                    </h2>
                    <p className="text-[--theme-text] text-xl font-medium font-inter mb-15">
                        Select from the published templates in the list.
                    </p>
                </>
            );
        }

        if (step === 4) {
            return (
                <>
                    <h2 className="mt-5 text-[--theme-text] text-3xl font-semibold mb-5 font-inter">
                        Select Email Template
                    </h2>
                    <p className="text-[--theme-text] text-xl font-medium font-inter mb-15">
                        Select an email template to be sent to the earners.
                    </p>
                </>
            );
        }
    };

    return (
        <section
            ref={ref}
            className="batch-flow-slide w-full h-full flex-shrink-0 px-20 pb-10 pt-15 overflow-y-auto"
        >
            {getTitle()}
            {renderFields}
        </section>
    );
});

const FormSteps = (props: Props) => {
    const history = useHistory();

    const { submit, setSubmit } = useForm();

    const refs = getUnnamedRefsFromArray([1, 2, 3, 4, 5]);
    const { on, scrollTo } = useHorizontalPages({ refs });
    const {
        goBack,
        goForward,
        currentPage,
        headerPages: pages,
    } = getNavFunctions({ on, scrollTo, pages: getSimplePages(refs) });
    // the `fields` const will be equal to all fields' state,
    // and the `dispatchFields` method is usable to send field state up to the form
    const [fields, _dispatchFields] = useAllFormFields();

    const handleNextStep = async () => {
        const formStepValid = getInvalidFormFieldsForStep(currentPage + 1, fields);

        if (!formStepValid) await submit();

        if (formStepValid) {
            // await saveDraft();
            setSubmit(false);
            goForward(false);
        }
    };

    return (
        <>
            <section className="h-full w-full overflow-x-hidden flex-shrink flex">
                <RenderSlide ref={refs[0]} formProps={props} step={1} />
                <RenderSlide ref={refs[1]} formProps={props} step={2} />
                <UploadCSV ref={refs[2]} />
                <RenderSlide ref={refs[3]} formProps={props} step={4} />
                <BatchPreviewSubmit ref={refs[4]} />
            </section>

            <HorizontalNavHeader
                currentPage={currentPage}
                pages={pages}
                className="absolute top-0 right-0 w-auto mt-15 mr-20"
            />

            <HorizontalNavFooter
                mainAction={handleNextStep}
                goBack={currentPage > 0 ? () => goBack(false) : undefined}
                mainText={currentPage === 4 ? 'Sign & Send' : 'Continue'}
                quitText="Save as Draft & Quit"
                quit={() => history.push('/admin/collections/credential-batch')}
            />
        </>
    );
};

const RenderBatchFlowFields: React.FC<Props> = props => {
    const { fieldSchema, className, forceRender } = props;

    const [hasRendered, setHasRendered] = useState(Boolean(forceRender));
    const [intersectionRef, entry] = useIntersect(intersectionObserverOptions);
    const isIntersecting = Boolean(entry?.isIntersecting);
    const isAboveViewport = entry?.boundingClientRect?.top < 0;
    const shouldRender = forceRender || isIntersecting || isAboveViewport;

    useEffect(() => {
        if (shouldRender && !hasRendered) {
            setHasRendered(true);
        }
    }, [shouldRender, hasRendered]);

    const classes = [baseClass, className].filter(Boolean).join(' ');

    if (fieldSchema) {
        return (
            <div ref={intersectionRef} className={classes}>
                {hasRendered && <FormSteps {...props} />}
            </div>
        );
    }

    return null;
};

export default RenderBatchFlowFields;
