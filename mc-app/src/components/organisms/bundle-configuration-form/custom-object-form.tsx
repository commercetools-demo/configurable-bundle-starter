import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormik } from 'formik';

import messages from './messages';
import {
  AttributeValue,
  SchemaResponse,
} from '../../../hooks/use-schema/types';
import Spacings from '@commercetools-uikit/spacings';
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';
import Card from '@commercetools-uikit/card';
import AttributeField from './attribute-field';
import get from 'lodash/get';
import Constraints from '@commercetools-uikit/constraints';
import ViewSwitcher from '@commercetools-uikit/view-switcher';
import { startCase } from 'lodash';

type Formik = ReturnType<typeof useFormik>;

type Props<T> = {
  schema: SchemaResponse;
  values: T;
  name: string;
  handleChange: Formik['handleChange'];
  touched: Formik['touched'];
  errors: Formik['errors'];
  handleBlur: Formik['handleBlur'];
};

function CustomObjectForm<T>({
  values,
  schema,
  touched,
  errors,
  name: parentName,
  handleChange,
  handleBlur,
}: Props<T>) {
  const intl = useIntl();
  const [activeTab, setActiveTab] = useState<string>('__generic__');

  const attributes: AttributeValue[] = schema.value?.attributes ?? [];
  const tabAttributes = attributes.filter((a) => a.displayTab);
  const hasTabs = tabAttributes.length > 0;
  const genericAttributes = attributes.filter((a) => !a.displayTab);

  const renderAttributeField = (attribute: AttributeValue, index: number) => {
    const name = `${parentName}.${attribute.name}`;
    return (
      <Card key={index} type="flat" insetScale="s">
        <AttributeField
          type={attribute.type}
          attributes={attribute.attributes}
          reference={attribute.reference}
          options={attribute.enum || attribute.lenum}
          name={name}
          title={attribute.name}
          isRequired={attribute.required}
          isSet={attribute.set}
          value={get(values, name)}
          touched={get(touched, name)}
          errors={get(errors, name)}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </Card>
    );
  };

  const renderTabButtons: (tabAttributes: AttributeValue[]) => any = (
    tabAttributes: AttributeValue[]
  ) => {
    return tabAttributes.map((attr) => (
      <ViewSwitcher.Button key={attr.name} value={attr.name}>
        {startCase(attr.name)}
      </ViewSwitcher.Button>
    ));
  };

  return (
    <Spacings.Stack scale="m">
      {attributes.length > 0 && (
        <CollapsiblePanel
          header={
            <CollapsiblePanel.Header>
              <FormattedMessage {...messages.customObjectInformationTitle} />
            </CollapsiblePanel.Header>
          }
        >
          {hasTabs ? (
            <Constraints.Horizontal max="scale">
              <ViewSwitcher.Group
                defaultSelected="button 2"
                onChange={(value) => setActiveTab(value)}
              >
                <ViewSwitcher.Button value="__generic__">
                  {intl.formatMessage(messages.genericAttributesTab)}
                </ViewSwitcher.Button>
                {renderTabButtons(tabAttributes)}
              </ViewSwitcher.Group>
                <Constraints.Horizontal max='scale'>
                  {activeTab === '__generic__' &&
                    genericAttributes.map((attr) =>
                      renderAttributeField(attr, attributes.indexOf(attr))
                    )}
                  {tabAttributes.map(
                    (attr) =>
                      activeTab === attr.name &&
                      renderAttributeField(attr, attributes.indexOf(attr))
                  )}
                </Constraints.Horizontal>
            </Constraints.Horizontal>
          ) : (
            attributes.map((attribute, index) =>
              renderAttributeField(attribute, index)
            )
          )}
        </CollapsiblePanel>
      )}
    </Spacings.Stack>
  );
}
CustomObjectForm.displayName = 'CustomObjectForm';

export default CustomObjectForm;
