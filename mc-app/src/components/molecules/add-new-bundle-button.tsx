import React, { useState } from 'react';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { Drawer, useModalState } from '@commercetools-frontend/application-components';
import DrawerContent from '../organisms/new-bundle/drawer-content';
import { FilePlus2 } from 'lucide-react';

const AddNewBundleButton = () => {
  const { isModalOpen, openModal, closeModal } = useModalState();

  return (
    <>
      <PrimaryButton
        onClick={openModal}
        label="Add new bundle"
        data-testid="add-bundle-button"
        iconLeft={<FilePlus2 stroke="white" height={16} width={16} />}
      />

      <Drawer
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Add new bundle"
        size={30}
      >
        <DrawerContent />
      </Drawer>
    </>
  );
};

export default AddNewBundleButton;
