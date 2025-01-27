import { ConfirmationDialog, useModalState } from '@commercetools-frontend/application-components';

export const useCloseModalConfirmation = () => {
    const { closeModal, isModalOpen, openModal } = useModalState();

    const handleConfirm = (callback: any) => {
        callback();
        closeModal();
    };

    const handleClose = () => {
        closeModal();
    };

    const showConfirmationModal = (displayModal: boolean, onCloseConfirmation: any) => {
        if (displayModal) {
            openModal();
        } else {
            onCloseConfirmation();
        }
    };

    return {
        showConfirmationModal,
        ConfirmationModal: (props: { onCloseConfirmation: any }) => <ConfirmationDialog
            onCancel={handleClose}
            onClose={handleClose}
            onConfirm={() => handleConfirm(props.onCloseConfirmation)}
            isOpen={isModalOpen}
            title="Discard changes?"
        >
            <p>Your changes will be lost.</p>
        </ConfirmationDialog>,

    };
};
