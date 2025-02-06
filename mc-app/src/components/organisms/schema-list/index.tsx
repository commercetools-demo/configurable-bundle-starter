import React from 'react';
import DataTable from '@commercetools-uikit/data-table';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { SchemaResponse } from '../../../hooks/use-schema/types';
import { useHistory } from 'react-router';
import Spacings from '@commercetools-uikit/spacings';

type Props = {
  schemas: SchemaResponse[];
};

const SchemaList: React.FC<Props> = ({ schemas }) => {
  const { push } = useHistory();

  const columns = [
    {
      key: 'key',
      label: 'Key',
      renderItem: (item: SchemaResponse) => item.key,
    },
    {
      key: 'name',
      label: 'Name',
      renderItem: (item: SchemaResponse) => item.value?.name,
    },
  ];

  return (
    <Spacings.Stack scale="m">
      <Spacings.Inline alignItems="center" justifyContent="flex-end">
        <PrimaryButton
          label="Create a new bundle schema"
          onClick={() => push('schema/new')}
          style={{ marginBottom: '16px' }}
        />
      </Spacings.Inline>
      <DataTable
        rows={schemas}
        columns={columns}
        onRowClick={(row) => push(`schema/${row.key}`)}
      />
    </Spacings.Stack>
  );
};

export default SchemaList;
