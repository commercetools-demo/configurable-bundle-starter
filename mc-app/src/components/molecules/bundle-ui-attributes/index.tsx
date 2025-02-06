import React, { FC } from 'react';
import Card from '@commercetools-uikit/card';
import TextField from '@commercetools-uikit/text-field';
import { FormattedMessage } from 'react-intl';
import { useFormik } from 'formik';
import { SchemaFormValues } from '../../organisms/schema-details';
import messages from '../../organisms/schema-details/messages';
import styles from '../../organisms/schema-details/form.module.css';
import SelectField from '@commercetools-uikit/select-field';
import {
  BUNDLE_UI_CONFIGURATION_TYPES,
  BUNDLE_UI_DISPLAY_MODES,
} from '../../../utils/contants';
import Constraints from '@commercetools-uikit/constraints';
import Spacings from '@commercetools-uikit/spacings';
import CheckboxInput from '@commercetools-uikit/checkbox-input';
import FieldLabel from '@commercetools-uikit/field-label';
type Formik = ReturnType<typeof useFormik<SchemaFormValues>>;

type Props = {
  values: SchemaFormValues;
  touched: Formik['touched'];
  errors: Formik['errors'];
  handleBlur: Formik['handleBlur'];
  handleChange: Formik['handleChange'];
};

const BundleUIAttributes: FC<Props> = ({
  values,
  touched,
  errors,
  handleBlur,
  handleChange,
}) => {
  return (
    <Card>
      <div css={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Spacings.Inline>
          <SelectField
            name="bundleUISettings.configurationType"
            value={values.bundleUISettings?.configurationType || ''}
            title={
              <FormattedMessage
                {...messages.bundleUISettingsConfigurationTypes}
              />
            }
            options={Object.keys(BUNDLE_UI_CONFIGURATION_TYPES).map((type) => ({
              label: type,
              value: BUNDLE_UI_CONFIGURATION_TYPES[type],
            }))}
            hint={
              <FormattedMessage
                {...messages.bundleUISettingsConfigurationTypesHint}
              />
            }
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <SelectField
            name="bundleUISettings.displayMode"
            value={values.bundleUISettings?.displayMode || ''}
            title={
              <FormattedMessage {...messages.bundleUISettingsDisplayMode} />
            }
            options={Object.keys(BUNDLE_UI_DISPLAY_MODES).map((type) => ({
              label: type,
              value: BUNDLE_UI_DISPLAY_MODES[type],
            }))}
            hint={
              <FormattedMessage {...messages.bundleUISettingsDisplayModeHint} />
            }
            onBlur={handleBlur}
            onChange={handleChange}
          />
        </Spacings.Inline>
        <Spacings.Inline>
          <Spacings.Stack>
            <FieldLabel
              title={
                <FormattedMessage
                  {...messages.bundleUISettingsShowProgressBar}
                />
              }
            />
            <CheckboxInput
              name="bundleUISettings.displayModeProperties.showProgressBar"
              isChecked={
                values.bundleUISettings?.displayModeProperties?.showProgressBar
              }
              onChange={handleChange}
            />
          </Spacings.Stack>
          <Spacings.Stack>
            <FieldLabel
              title={
                <FormattedMessage
                  {...messages.bundleUISettingsAllowSkipSteps}
                />
              }
            />
            <CheckboxInput
              name="bundleUISettings.displayModeProperties.allowSkipSteps"
              isChecked={
                values.bundleUISettings?.displayModeProperties?.allowSkipSteps
              }
              onChange={handleChange}
            />
          </Spacings.Stack>
        </Spacings.Inline>
      </div>
    </Card>
  );
};

BundleUIAttributes.displayName = 'BundleUIAttributes';

export default BundleUIAttributes;
