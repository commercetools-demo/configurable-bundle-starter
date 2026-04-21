import {
  ConfirmationDialog,
  useModalState,
} from '@commercetools-frontend/application-components';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import DataTable from '@commercetools-uikit/data-table';
import { BinLinearIcon, ExternalLinkIcon } from '@commercetools-uikit/icons';
import IconButton from '@commercetools-uikit/icon-button';
import { ContentNotification } from '@commercetools-uikit/notifications';
import Text from '@commercetools-uikit/text';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useConfigurableBundles } from '../../../hooks/use-configurable-bundles';
import { BundleResponse } from '../../../hooks/use-configurable-bundles/types';
import ReferenceText from '../reference-input/reference-text';

const shimmer = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

const Skeleton = styled.div`
  height: 14px;
  width: 120px;
  border-radius: 4px;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
`;

const BundlesTable = ({
  parentUrl,
  bundles,
  onDeleted,
}: {
  parentUrl: string;
  bundles: BundleResponse[];
  onDeleted?: () => void;
}) => {
  const { push } = useHistory();
  const context = useApplicationContext();
  const { deleteBundleObject } = useConfigurableBundles();
  const modalState = useModalState();
  const [pendingDeleteKey, setPendingDeleteKey] = useState<string | null>(null);

  const getExternalUrl = (id: string) =>
    `/${context.project?.key}/products/${id}`;

  const handleDeleteClick = (key: string) => {
    setPendingDeleteKey(key);
    modalState.openModal();
  };

  const handleConfirm = async () => {
    if (!pendingDeleteKey) return;
    await deleteBundleObject(pendingDeleteKey);
    modalState.closeModal();
    setPendingDeleteKey(null);
    onDeleted?.();
  };

  const handleClose = () => {
    modalState.closeModal();
    setPendingDeleteKey(null);
  };

  const columns = [
    {
      key: 'product',
      label: 'Product',
      renderItem: (row: BundleResponse) => {
        const id = row.value?.mainProductReference?.id;
        if (!id) return NO_VALUE_FALLBACK;
        return (
          <ReferenceText
            value={{ id, typeId: 'product' }}
            loadingFallback={<Skeleton />}
          />
        );
      },
    },
    {
      key: 'type',
      label: 'Type',
      renderItem: (row: BundleResponse) =>
        row.value?.bundleType?.label || NO_VALUE_FALLBACK,
    },
    {
      key: 'key',
      label: 'key',
      renderItem: (row: BundleResponse) => row.key || NO_VALUE_FALLBACK,
    },
    {
      key: 'mainProduct',
      label: 'Main Product',
      renderItem: (row: BundleResponse) => (
        <Link
          to={getExternalUrl(row.value?.mainProductReference?.id || '')}
          target="_blank"
        >
          <ExternalLinkIcon color="primary" />
        </Link>
      ),
    },
    {
      key: 'delete',
      label: '',
      renderItem: (row: BundleResponse) => (
        <IconButton
          icon={<BinLinearIcon />}
          label="Delete bundle"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteClick(row.key);
          }}
          size="medium"
        />
      ),
    },
  ];

  if (!bundles?.length) {
    return (
      <ContentNotification type="error">
        <Text.Body>No bundles found</Text.Body>
      </ContentNotification>
    );
  }

  return (
    <>
      <DataTable<BundleResponse>
        isCondensed
        columns={columns}
        rows={bundles || []}
        onRowClick={(row) => push(`${parentUrl}/bundle/${row.key}`)}
      />
      <ConfirmationDialog
        title="Delete bundle"
        isOpen={modalState.isModalOpen}
        onClose={handleClose}
        onCancel={handleClose}
        onConfirm={handleConfirm}
      >
        <Text.Body>
          Are you sure you want to delete this bundle? This action cannot be
          undone.
        </Text.Body>
      </ConfirmationDialog>
    </>
  );
};

export default BundlesTable;
