import React from 'react';

interface Props {
  values: any;
}
const ReviewStep = ({ values }: Props) => {
  return (
    <div>
      <h2>Review Step</h2>
      <p>This is the review step of the new bundle process.</p>
    </div>
  );
};

export default ReviewStep;
