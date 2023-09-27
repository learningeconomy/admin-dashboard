import React, { useState, useEffect } from 'react';
import { useAllFormFields } from 'payload/components/forms';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { CredentialTemplate } from 'payload/generated-types';

const BatchPreviewSubmit = React.forwardRef<HTMLElement>(function BatchPreviewSubmit(_props, ref) {
    const [template, setTemplate] = useState<CredentialTemplate | undefined>();
    const [fields] = useAllFormFields();

    useEffect(() => {
        if (fields.template.value) {
            fetch(`/api/credential-template/${fields.template.value}`)
                .then(res => res.json())
                .then(setTemplate);
        } else {
            setTemplate(undefined);
        }
    }, [fields?.template?.value]);

    return (
        <section className="w-full h-full flex-shrink-0 p-10 overflow-y-auto" ref={ref}>
            <h2 className="mt-5 text-slate-900 text-3xl font-semibold mb-5 font-inter">
                Confirmation
            </h2>
            <p className="text-slate-900 text-xl font-medium font-inter mb-15">
                Review and confirm the batch details before sending credentials to earners.
            </p>

            <Accordion type="single" collapsible className="mb-5">
                <AccordionItem value="batch">
                    <AccordionTrigger>Batch: {fields.title.value}</AccordionTrigger>
                    <AccordionContent>
                        <section className="p-5 rounded-lg bg-white flex flex-col items-start gap-2 mb-5">
                            <h5 className="text-slate-600 font-inter text-lg">Description</h5>
                            <p className="m-0 text-slate-900 font-inter font-normal text-base">
                                {fields.description.value}
                            </p>
                        </section>

                        <section className="p-5 rounded-lg bg-white flex flex-col items-start gap-2">
                            <h5 className="text-slate-600 font-inter text-lg">Internal Notes</h5>
                            <p className="m-0 text-slate-900 font-inter font-normal text-base">
                                {fields.internalNotes.value}
                            </p>
                        </section>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible className="mb-5">
                <AccordionItem value="template">
                    <AccordionTrigger>Template: {template?.title}</AccordionTrigger>
                    <AccordionContent>
                        <section className="p-5 rounded-lg bg-white flex flex-col items-start gap-2 mb-5">
                            <h5 className="text-slate-600 font-inter text-lg">Details</h5>
                            <p className="m-0 text-slate-900 font-inter font-normal text-base">
                                {template?.description}
                            </p>
                        </section>

                        <section className="p-5 rounded-lg bg-white flex flex-col items-start gap-2">
                            <h5 className="text-slate-600 font-inter text-lg">Internal Notes</h5>
                            <p className="m-0 text-slate-900 font-inter font-normal text-base">
                                {template?.internalNotes}
                            </p>
                        </section>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </section>
    );
});

export default BatchPreviewSubmit;
