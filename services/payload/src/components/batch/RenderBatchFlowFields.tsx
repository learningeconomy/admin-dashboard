import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import RenderCustomComponent from "payload/dist/admin/components/utilities/RenderCustomComponent";
import useIntersect from "payload/dist/admin/hooks/useIntersect";
import { RenderFieldProps as Props } from "../types";
import {
  fieldAffectsData,
  fieldIsPresentationalOnly,
} from "payload/dist/fields/config/types";
import { useConfig } from "payload/components/utilities";
import { useLocale } from "payload/components/utilities";
import { useDocumentInfo } from "payload/components/utilities";
import { useOperation } from "payload/dist/admin/components/utilities/OperationProvider/index";
import { getTranslation } from "payload/dist/utilities/getTranslation";
import { Swiper as SwiperInterface } from "swiper";
import { useAllFormFields, useForm } from "payload/components/forms";
import { Fields } from "payload/dist/admin/components/forms/Form/types";

const baseClass = "render-fields";

const intersectionObserverOptions = {
  rootMargin: "1000px",
};

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/swiper.scss";
import UploadCSV from "./UploadCSV";
// hardcoded for now, but could be perhaps be defined in the database
const MAP_FIELDS_TO_STEPS = {
  1: ["title", "description", "internalNotes"],
  2: ["template"],
  3: [],
  4: ["emailTemplate"],
};

const getFieldsForStep = (step: number = 1, fieldSchema) => {
  const fieldsForStep = MAP_FIELDS_TO_STEPS[step];
  const stepFields = fieldSchema.filter((field) =>
    fieldsForStep.includes(field.name)
  );

  return stepFields;
};

const getInvalidFormFieldsForStep = (step: number, formFields: Fields) => {
  const fieldsForStep = MAP_FIELDS_TO_STEPS[step];
  const failedValidationFields = fieldsForStep.filter((field) => {
    return !formFields[field].valid;
  });

  if (failedValidationFields?.length > 0) return false;
  return true;
};

type RenderSlideProps = {
  step: number;
  formProps: Props;
};

const RenderSlide: React.FC<RenderSlideProps> = ({ step, formProps }) => {
  const { t, i18n } = useTranslation("general");
  const operation = useOperation();

  const {
    fieldSchema,
    fieldTypes,
    filter,
    permissions,
    readOnly: readOnlyOverride,
    className,
    forceRender,
    indexPath: incomingIndexPath,
  } = formProps;

  const stepFormFields = getFieldsForStep(step, fieldSchema);

  const renderFields = stepFormFields?.map((field, fieldIndex) => {
    const fieldIsPresentational = fieldIsPresentationalOnly(field);
    let FieldComponent = fieldTypes[field.type];

    if (
      fieldIsPresentational ||
      (!field?.hidden && field?.admin?.disabled !== true)
    ) {
      if (
        (filter && typeof filter === "function" && filter(field)) ||
        !filter
      ) {
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
                  path: field.path || (isFieldAffectingData ? field.name : ""),
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
              {t("error:noMatchedField", {
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

  return renderFields;
};

const FormSteps = (props: Props) => {
  // ref storing swiper instance
  const [slidesRef, setSlidesRef] = useState<SwiperInterface>();
  const { submit, reset, getData, setSubmit, validateForm } = useForm();
  // the `fields` const will be equal to all fields' state,
  // and the `dispatchFields` method is usable to send field state up to the form
  const [fields, dispatchFields] = useAllFormFields();
  const { collection, global, id } = useDocumentInfo();
  const {
    serverURL,
    routes: { api },
  } = useConfig();
  const locale = useLocale();

  const saveDraft = useCallback(() => {
    const search = `?locale=${locale}&depth=0&fallback-locale=null&draft=true`;
    let action;
    let method = 'POST';
    if (collection) {
      action = `${serverURL}${api}/${collection.slug}${id ? `/${id}` : ''}${search}`;
      if (id) method = 'PATCH';
    }
    console.log('///action',action);

    submit({
      skipValidation: true,
      method,
      overrides: {
        _status: "draft",
      },
      action
    });
  }, [submit, collection, global, serverURL, api, locale, id]);

  const handleNextStep = async (e) => {
    e.preventDefault();

    const formStepValid = getInvalidFormFieldsForStep(
      slidesRef.activeIndex + 1,
      fields
    );
    if (!formStepValid) {
      await submit();
    }
    if (formStepValid) {
      // await saveDraft();
      setSubmit(false);
      slidesRef?.slideNext();
    }
  };

  const handlePrevStep = (e) => {
    e.preventDefault();

    slidesRef?.slidePrev();
  };

  return (
    <>
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        allowTouchMove={false}
        touchStartPreventDefault={false}
        preventClicksPropagation={false}
        preventClicks={false}
        simulateTouch={false}
        allowSlideNext={true}
        allowSlidePrev={true}
        effect={"fade"}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => setSlidesRef(swiper)}
      >
        <SwiperSlide>
          <RenderSlide formProps={props} step={1} />
        </SwiperSlide>
        <SwiperSlide>
          <RenderSlide formProps={props} step={2} />
        </SwiperSlide>
        <SwiperSlide>
          <UploadCSV />
        </SwiperSlide>
        <SwiperSlide>
          <RenderSlide formProps={props} step={4} />
        </SwiperSlide>
        ...
      </Swiper>
      <div>
        <button className="form-steps-button" onClick={handlePrevStep}>Prev Step</button>
        <button className="form-steps-button" onClick={handleNextStep}>Next Step</button>
      </div>
    </>
  );
};

const RenderBatchFlowFields: React.FC<Props> = (props) => {
  const {
    fieldSchema,
    fieldTypes,
    filter,
    permissions,
    readOnly: readOnlyOverride,
    className,
    forceRender,
    indexPath: incomingIndexPath,
  } = props;

  const { t, i18n } = useTranslation("general");
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

  const classes = [baseClass, className].filter(Boolean).join(" ");

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
