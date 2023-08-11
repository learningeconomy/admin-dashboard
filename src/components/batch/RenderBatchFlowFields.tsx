import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import RenderCustomComponent from "payload/dist/admin/components/utilities/RenderCustomComponent";
import useIntersect from "payload/dist/admin/hooks/useIntersect";
import { RenderFieldProps as Props } from "../types";
import {
  fieldAffectsData,
  fieldIsPresentationalOnly,
} from "payload/dist/fields/config/types";
import { useOperation } from "payload/dist/admin/components/utilities/OperationProvider/index";
import { getTranslation } from "payload/dist/utilities/getTranslation";
import { Swiper as SwiperInterface } from 'swiper';
import { useAllFormFields, reduceFieldsToValues, getSiblingData } from 'payload/components/forms';
const baseClass = "render-fields";

const intersectionObserverOptions = {
  rootMargin: "1000px",
};

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

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

type RenderSlideProps = {
  step: number;
  formProps: Props;
};

const RenderSlide: React.FC<RenderSlideProps> = ({ step, formProps }) => {
  const { t, i18n } = useTranslation("general");
  const operation = useOperation();

  console.log("///step", step);
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

const SwiperTest = (props: Props) => {
      // ref storing swiper instance
      const [slidesRef, setSlidesRef] = useState<SwiperInterface>();


  const handleNextStep = (e) => {
    e.preventDefault();
    console.log("///handleNextStep");
    slidesRef?.slideNext();
   
  };

  const handlePrevStep = (e) => {
    e.preventDefault();
    console.log("///handlePrevStep");
    slidesRef?.slidePrev();
  };

  return (
    <>
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        preventInteractionOnTransition={true}
        allowTouchMove={false}
        allowSlideNext={true}
        allowSlidePrev={true}
        effect={"fade"}
        onSlideChange={() => console.log("slide change")}
        onSwiper={swiper => setSlidesRef(swiper)}
      >
        <SwiperSlide>
          <RenderSlide formProps={props} step={2} />
        </SwiperSlide>
        <SwiperSlide>
          <RenderSlide formProps={props} step={1} />
        </SwiperSlide>
        <SwiperSlide>
          <RenderSlide formProps={props} step={3} />
        </SwiperSlide>
        <SwiperSlide>
          <RenderSlide formProps={props} step={4} />
        </SwiperSlide>
        ...
      </Swiper>
      <div>
      <button onClick={handlePrevStep}>Prev Step</button>
        <button onClick={handleNextStep}>Next Step</button>
      </div>
    </>
  );
};

const RenderBatchFlowFields: React.FC<Props> = (props) => {

     // the `fields` const will be equal to all fields' state,
  // and the `dispatchFields` method is usable to send field state up to the form
  const [fields, dispatchFields] = useAllFormFields();

  // Pass in fields, and indicate if you'd like to "unflatten" field data.
  // The result below will reflect the data stored in the form at the given time
  const formData = reduceFieldsToValues(fields, true);

  // Pass in field state and a path,
  // and you will be sent all sibling data of the path that you've specified
  const siblingData = getSiblingData(fields, 'someFieldName');


  console.log('///USEALLFORMFIELDS HOOK fields', fields, 'formData', formData);

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

  console.log("//CustomRenderFields props", props);

  const { t, i18n } = useTranslation("general");
  const [hasRendered, setHasRendered] = useState(Boolean(forceRender));
  const [intersectionRef, entry] = useIntersect(intersectionObserverOptions);
  const operation = useOperation();

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
        {hasRendered && <SwiperTest {...props} />}
      </div>
    );
  }

  return null;
};

export default RenderBatchFlowFields;
